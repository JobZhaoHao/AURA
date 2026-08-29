import type {
  DeckManifestRef,
  LocalHistoryEntry,
  ThemeManifestRef,
} from "@aura/contracts";
import { describe, expect, it } from "vitest";
import { DomainError } from "../src/errors.js";
import {
  appendLocalHistoryEntry,
  createLocalHistoryEntry,
} from "../src/history.js";
import {
  createSingleReading,
  type SingleCardReadingResult,
} from "../src/single-reading.js";
import { parseSingleReadingInput } from "../src/single-reading-input.js";
import { expectSafeDomainError } from "./helpers.js";

const SESSION_ID = "history-session-001";
const CREATED_AT = "2026-08-28T00:00:00.000Z";
const SAVED_AT = "2026-08-29T00:00:00.000Z";
const THEME_REF: ThemeManifestRef = {
  themeId: "aurora",
  version: "m1-theme-v1",
};
const DECK_REF: DeckManifestRef = { deckId: "classic", version: "m1-deck-v1" };

type ReadingOverrides = Partial<{
  seed: string;
  sessionId: string;
  questionCategory:
    | "general"
    | "relationships"
    | "career-study"
    | "self-growth";
  safetyDisposition: "standard" | "high-risk";
  createdAt: string;
}>;

function reading(overrides: ReadingOverrides = {}): SingleCardReadingResult {
  return createSingleReading(
    parseSingleReadingInput({
      seed: "aura-m1-history-seed",
      sessionId: SESSION_ID,
      questionCategory: "general",
      safetyDisposition: "standard",
      reversalsEnabled: true,
      createdAt: CREATED_AT,
      ...overrides,
    }),
  );
}

function saved(
  result = reading(),
  savedAt = SAVED_AT,
  refs = { themeRef: THEME_REF, deckRef: DECK_REF },
): LocalHistoryEntry {
  return createLocalHistoryEntry(result, savedAt, refs);
}

function expectHistoryError(
  action: () => unknown,
  code: "INVALID_HISTORY_ENTRY" | "HISTORY_SESSION_CONFLICT",
  field:
    | "result"
    | "savedAt"
    | "history"
    | "themeRef"
    | "deckRef"
    | "sessionId",
  sentinels: readonly string[] = [],
): void {
  try {
    action();
    throw new Error("Expected a history error.");
  } catch (error) {
    expectSafeDomainError(error, code, field, sentinels);
    const domainError = error as DomainError;
    expect("issues" in domainError).toBe(false);
    expect("input" in domainError).toBe(false);
  }
}

describe("createLocalHistoryEntry", () => {
  it("constructs an entry only through the explicit save operation", () => {
    const result = reading();

    expect(saved(result)).toEqual({
      ...result,
      savedAt: SAVED_AT,
      themeRef: THEME_REF,
      deckRef: DECK_REF,
    });
    expect(result).not.toHaveProperty("savedAt");
  });

  it("omits presentation references that were not explicitly supplied", () => {
    const entry = createLocalHistoryEntry(reading(), SAVED_AT);

    expect(entry).toEqual({ ...reading(), savedAt: SAVED_AT });
    expect(entry).not.toHaveProperty("themeRef");
    expect(entry).not.toHaveProperty("deckRef");
  });

  it.each([
    ["saved time", "savedAt", "PRIVATE_BAD_SAVED_AT"],
    ["theme reference", "themeRef", "PRIVATE_BAD_THEME_REF"],
    ["deck reference", "deckRef", "PRIVATE_BAD_DECK_REF"],
  ] as const)(
    "rejects an invalid %s without leaking it",
    (_label, field, sentinel) => {
      const result = reading();
      const action =
        field === "savedAt"
          ? () => createLocalHistoryEntry(result, sentinel)
          : field === "themeRef"
            ? () =>
                createLocalHistoryEntry(result, SAVED_AT, {
                  themeRef: { themeId: sentinel, version: "m1-theme-v1" },
                } as unknown as { themeRef: ThemeManifestRef })
            : () =>
                createLocalHistoryEntry(result, SAVED_AT, {
                  deckRef: { deckId: sentinel, version: "m1-deck-v1" },
                } as unknown as { deckRef: DeckManifestRef });

      expectHistoryError(action, "INVALID_HISTORY_ENTRY", field, [sentinel]);
    },
  );

  it("rejects non-single result shapes and a noncanonical card", () => {
    const multiDraw = {
      ...reading(),
      session: {
        ...reading().session,
        mode: "single",
        draws: [reading().session.draws[0], reading().session.draws[0]],
      },
    } as unknown as SingleCardReadingResult;
    const noncanonicalCard = {
      ...reading(),
      session: {
        ...reading().session,
        draws: [
          { ...reading().session.draws[0], cardId: "major.private-card" },
        ],
      },
    } as unknown as SingleCardReadingResult;

    expectHistoryError(
      () => createLocalHistoryEntry(multiDraw, SAVED_AT),
      "INVALID_HISTORY_ENTRY",
      "result",
    );
    expectHistoryError(
      () => createLocalHistoryEntry(noncanonicalCard, SAVED_AT),
      "INVALID_HISTORY_ENTRY",
      "result",
      ["major.private-card"],
    );
  });

  it("rejects a missing high-risk template and inconsistent narrative", () => {
    const highRisk = reading({ safetyDisposition: "high-risk" });
    const missingTemplate = {
      ...highRisk,
      narrative: {
        ...highRisk.narrative,
        safetyNotice: "PRIVATE_MISSING_TEMPLATE",
      },
    } as SingleCardReadingResult;
    const inconsistentNarrative = {
      ...reading(),
      narrative: { ...reading().narrative, advice: "PRIVATE_BAD_ADVICE" },
    } as SingleCardReadingResult;

    expectHistoryError(
      () => createLocalHistoryEntry(missingTemplate, SAVED_AT),
      "INVALID_HISTORY_ENTRY",
      "result",
      ["PRIVATE_MISSING_TEMPLATE"],
    );
    expectHistoryError(
      () => createLocalHistoryEntry(inconsistentNarrative, SAVED_AT),
      "INVALID_HISTORY_ENTRY",
      "result",
      ["PRIVATE_BAD_ADVICE"],
    );
  });

  it("contains hostile result getters", () => {
    const sentinel = "PRIVATE_HISTORY_RESULT_GETTER";
    const hostile = new Proxy(reading(), {
      get(target, property, receiver) {
        if (property === "session") throw new Error(sentinel);
        return Reflect.get(target, property, receiver);
      },
    }) as SingleCardReadingResult;

    expectHistoryError(
      () => createLocalHistoryEntry(hostile, SAVED_AT),
      "INVALID_HISTORY_ENTRY",
      "result",
      [sentinel],
    );
  });
});

describe("appendLocalHistoryEntry", () => {
  it("appends a sanitized snapshot without mutating frozen inputs", () => {
    const first = saved();
    const second = saved(reading({ sessionId: "history-session-002" }));
    const history = Object.freeze([Object.freeze(first)]);

    const appended = appendLocalHistoryEntry(history, second);

    expect(appended).toEqual([first, second]);
    expect(appended).not.toBe(history);
    expect(appended[0]).not.toBe(first);
    expect(history).toEqual([first]);
  });

  it("deduplicates an equal result despite different property insertion order and preserves first metadata", () => {
    const first = saved(reading(), SAVED_AT, { themeRef: THEME_REF });
    const source = reading();
    const reordered = {
      textVersion: source.textVersion,
      narrative: {
        safetyNotice: source.narrative.safetyNotice,
        advice: source.narrative.advice,
        interpretation: source.narrative.interpretation,
        summary: source.narrative.summary,
      },
      session: {
        draws: source.session.draws.map((draw) => ({
          position: draw.position,
          orientation: draw.orientation,
          cardId: draw.cardId,
        })),
        createdAt: source.session.createdAt,
        contentVersion: source.session.contentVersion,
        rulesVersion: source.session.rulesVersion,
        safetyDisposition: source.session.safetyDisposition,
        questionCategory: source.session.questionCategory,
        mode: source.session.mode,
        sessionId: source.session.sessionId,
      },
      deckRef: DECK_REF,
      savedAt: "2026-08-30T00:00:00.000Z",
    } as LocalHistoryEntry;

    const deduplicated = appendLocalHistoryEntry([first], reordered);

    expect(deduplicated).toEqual([first]);
    expect(deduplicated[0]).not.toBe(first);
    expect(deduplicated[0]).not.toHaveProperty("deckRef");
  });

  it.each([
    ["category and its narrative", { questionCategory: "relationships" }],
    ["safety disposition and its notice", { safetyDisposition: "high-risk" }],
    ["created time", { createdAt: "2026-08-29T12:00:00.000Z" }],
    ["draw and its narrative", { seed: "aura-m1-history-draw-conflict" }],
  ] as const)(
    "reports a conflict for a separately generated valid %s",
    (_label, overrides) => {
      const existing = saved(reading());
      const conflictingResult = reading(overrides);
      const incoming = saved(conflictingResult, "2026-08-30T00:00:00.000Z");

      if (_label === "draw and its narrative") {
        expect(conflictingResult.session.draws).not.toEqual(
          existing.session.draws,
        );
      }
      expectHistoryError(
        () => appendLocalHistoryEntry([existing], incoming),
        "HISTORY_SESSION_CONFLICT",
        "sessionId",
        [SESSION_ID, incoming.savedAt],
      );
    },
  );

  it("rejects isolated version or narrative tampering as invalid rather than a conflict", () => {
    const existing = saved();
    const badVersion = {
      ...saved(),
      session: { ...saved().session, rulesVersion: "m1-rules-v9" },
    } as LocalHistoryEntry;
    const badNarrative = {
      ...saved(),
      narrative: {
        ...saved().narrative,
        summary: "PRIVATE_TAMPERED_SUMMARY",
      },
    } as LocalHistoryEntry;

    expectHistoryError(
      () => appendLocalHistoryEntry([existing], badVersion),
      "INVALID_HISTORY_ENTRY",
      "result",
      ["m1-rules-v9"],
    );
    expectHistoryError(
      () => appendLocalHistoryEntry([existing], badNarrative),
      "INVALID_HISTORY_ENTRY",
      "result",
      ["PRIVATE_TAMPERED_SUMMARY"],
    );
  });

  it("rejects corrupt or duplicate persisted sessions before checking an incoming conflict", () => {
    const corrupt = {
      ...saved(),
      savedAt: "PRIVATE_CORRUPT_HISTORY_TIME",
    } as LocalHistoryEntry;
    const duplicate = [saved(), saved(reading(), "2026-08-30T00:00:00.000Z")];
    const conflicting = saved(reading({ questionCategory: "relationships" }));

    expectHistoryError(
      () => appendLocalHistoryEntry([corrupt], conflicting),
      "INVALID_HISTORY_ENTRY",
      "history",
      ["PRIVATE_CORRUPT_HISTORY_TIME", SESSION_ID],
    );
    expectHistoryError(
      () => appendLocalHistoryEntry(duplicate, conflicting),
      "INVALID_HISTORY_ENTRY",
      "history",
      [SESSION_ID],
    );
  });

  it.each([
    ["forged entry", "result", "PRIVATE_FORGED_ENTRY"],
    ["saved time", "savedAt", "PRIVATE_INCOMING_SAVED_AT"],
    ["theme reference", "themeRef", "PRIVATE_THEME"],
    ["deck reference", "deckRef", "PRIVATE_DECK"],
  ] as const)(
    "rejects an invalid incoming %s without leaking it",
    (_label, field, sentinel) => {
      const incoming =
        field === "result"
          ? { privateEntryData: sentinel }
          : field === "savedAt"
            ? { ...saved(), savedAt: sentinel }
            : field === "themeRef"
              ? {
                  ...saved(),
                  themeRef: { themeId: sentinel, version: "m1-theme-v1" },
                }
              : {
                  ...saved(),
                  deckRef: { deckId: sentinel, version: "m1-deck-v1" },
                };
      expectHistoryError(
        () => appendLocalHistoryEntry([], incoming as LocalHistoryEntry),
        "INVALID_HISTORY_ENTRY",
        field,
        [sentinel],
      );
    },
  );

  it("contains hostile persisted iterators and forged incoming proxy access", () => {
    const iteratorSentinel = "PRIVATE_HISTORY_ITERATOR";
    const hostileHistory = {
      [Symbol.iterator](): Iterator<LocalHistoryEntry> {
        throw new Error(iteratorSentinel);
      },
    } as unknown as readonly LocalHistoryEntry[];
    const proxySentinel = "PRIVATE_HISTORY_ENTRY_PROXY";
    const hostileEntry = new Proxy(saved(), {
      get(target, property, receiver) {
        if (property === "savedAt") throw new Error(proxySentinel);
        return Reflect.get(target, property, receiver);
      },
    }) as LocalHistoryEntry;

    expectHistoryError(
      () => appendLocalHistoryEntry(hostileHistory, saved()),
      "INVALID_HISTORY_ENTRY",
      "history",
      [iteratorSentinel],
    );
    expectHistoryError(
      () => appendLocalHistoryEntry([], hostileEntry),
      "INVALID_HISTORY_ENTRY",
      "savedAt",
      [proxySentinel],
    );
  });
});
