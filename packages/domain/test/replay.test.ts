import type { LocalHistoryEntry } from "@aura/contracts";
import { describe, expect, it } from "vitest";
import { DomainError } from "../src/errors.js";
import { replayLocalHistoryEntry } from "../src/history.js";
import { expectSafeDomainError } from "./helpers.js";

const STORED_RESULT = {
  session: {
    sessionId: "PRIVATE_REPLAY_SESSION",
    mode: "single",
    questionCategory: "general",
    safetyDisposition: "standard",
    rulesVersion: "m1-rules-v1",
    contentVersion: "m1-content-v1",
    createdAt: "2026-08-27T09:30:00.000Z",
    draws: [
      {
        cardId: "major.fool",
        orientation: "upright",
        position: "single",
      },
    ],
  },
  narrative: {
    summary: "新的可能正在打开，但真正的前进来自清醒地迈出第一步。",
    interpretation:
      "你正站在旧经验与新可能的交界处，答案更接近尝试而不是等待完全确定。",
    advice: "选择一个风险可控的小步骤，并为结果保留调整空间。",
    safetyNotice: "牌义用于自我反思，不替代医疗、法律、投资或危机支持。",
  },
  textVersion: "m1-text-v1",
} as const;

const STORED_ENTRY: LocalHistoryEntry = {
  ...STORED_RESULT,
  savedAt: "2026-08-29T10:00:00.000Z",
  themeRef: { themeId: "aurora", version: "m1-theme-v1" },
  deckRef: { deckId: "classic", version: "m1-deck-v1" },
};

const SENSITIVE_VALUES = [
  STORED_RESULT.session.sessionId,
  STORED_RESULT.session.createdAt,
  STORED_RESULT.narrative.summary,
  STORED_RESULT.narrative.interpretation,
  STORED_RESULT.narrative.advice,
  STORED_RESULT.narrative.safetyNotice,
  STORED_ENTRY.savedAt,
] as const;

function expectReplayError(
  action: () => unknown,
  code: "INVALID_HISTORY_ENTRY" | "UNSUPPORTED_REPLAY_VERSION",
  field: "result" | "version",
  sentinels: readonly string[] = SENSITIVE_VALUES,
): void {
  try {
    action();
    throw new Error("Expected replay to fail.");
  } catch (error) {
    expectSafeDomainError(error, code, field, sentinels);
    const domainError = error as DomainError;
    expect("issues" in domainError).toBe(false);
    expect("input" in domainError).toBe(false);
  }
}

function withOldVersion(
  property: "rulesVersion" | "contentVersion" | "textVersion",
): LocalHistoryEntry {
  const entry = {
    ...STORED_ENTRY,
    narrative: {
      ...STORED_ENTRY.narrative,
      summary: "PRIVATE_OLD_VERSION_NARRATIVE",
    },
    session: { ...STORED_ENTRY.session },
  };
  if (property === "textVersion") {
    entry.textVersion = "m0-text-v1";
  } else {
    entry.session[property] =
      property === "rulesVersion" ? "m0-rules-v1" : "m0-content-v1";
  }
  return entry;
}

function withoutVersion(
  property: "rulesVersion" | "contentVersion" | "textVersion",
  trapSentinel: string,
): LocalHistoryEntry {
  const session = { ...STORED_ENTRY.session } as Partial<
    LocalHistoryEntry["session"]
  >;
  const root = {
    ...STORED_ENTRY,
    session,
  } as Partial<LocalHistoryEntry> & { session: typeof session };

  if (property === "textVersion") {
    delete root.textVersion;
  } else {
    delete session[property];
  }

  root.session = new Proxy(session, {
    get(target, accessedProperty, receiver) {
      if (
        accessedProperty !== "rulesVersion" &&
        accessedProperty !== "contentVersion"
      ) {
        throw new Error(trapSentinel);
      }
      return Reflect.get(target, accessedProperty, receiver);
    },
  });

  return new Proxy(root, {
    get(target, accessedProperty, receiver) {
      if (
        accessedProperty !== "session" &&
        accessedProperty !== "textVersion"
      ) {
        throw new Error(trapSentinel);
      }
      return Reflect.get(target, accessedProperty, receiver);
    },
  }) as LocalHistoryEntry;
}

describe("replayLocalHistoryEntry", () => {
  it("returns exactly the stored Fool draw, narrative and versions without a seed", () => {
    const replayed = replayLocalHistoryEntry(STORED_ENTRY);

    expect(replayed).toEqual(STORED_RESULT);
    expect(Object.keys(replayed)).toEqual([
      "session",
      "narrative",
      "textVersion",
    ]);
    expect(JSON.stringify(replayed)).not.toContain("seed");
    expect(JSON.stringify(replayed)).not.toContain("reversalsEnabled");
    expect(JSON.stringify(replayed)).not.toContain(STORED_ENTRY.savedAt);
  });

  it.each(["rulesVersion", "contentVersion", "textVersion"] as const)(
    "refuses an old stored %s before narrative refinement",
    (property) => {
      expectReplayError(
        () => replayLocalHistoryEntry(withOldVersion(property)),
        "UNSUPPORTED_REPLAY_VERSION",
        "version",
        [...SENSITIVE_VALUES, "PRIVATE_OLD_VERSION_NARRATIVE"],
      );
    },
  );

  it.each(["rulesVersion", "contentVersion", "textVersion"] as const)(
    "refuses a missing stored %s without reading other sensitive fields",
    (property) => {
      const trapSentinel = `PRIVATE_MISSING_${property}_TRAP`;
      expectReplayError(
        () => replayLocalHistoryEntry(withoutVersion(property, trapSentinel)),
        "UNSUPPORTED_REPLAY_VERSION",
        "version",
        [...SENSITIVE_VALUES, trapSentinel],
      );
    },
  );

  it.each(["summary", "advice"] as const)(
    "rejects current-version %s tampering as an invalid history entry",
    (property) => {
      const tamperSentinel = `PRIVATE_TAMPERED_${property}`;
      const entry = {
        ...STORED_ENTRY,
        narrative: {
          ...STORED_ENTRY.narrative,
          [property]: tamperSentinel,
        },
      } as LocalHistoryEntry;

      expectReplayError(
        () => replayLocalHistoryEntry(entry),
        "INVALID_HISTORY_ENTRY",
        "result",
        [...SENSITIVE_VALUES, tamperSentinel],
      );
    },
  );

  it.each([
    ["array entry", []],
    ["array session", { ...STORED_ENTRY, session: [] }],
  ] as const)(
    "rejects an invalid %s shell with a fixed result error",
    (_label, value) => {
      expectReplayError(
        () => replayLocalHistoryEntry(value as unknown as LocalHistoryEntry),
        "INVALID_HISTORY_ENTRY",
        "result",
      );
    },
  );
});
