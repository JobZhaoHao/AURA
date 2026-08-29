import type { LocalHistoryEntry } from "@aura/contracts";
import { describe, expect, it } from "vitest";
import * as domain from "../src/index.js";
import {
  appendLocalHistoryEntry,
  assertSingleCardReadingResult,
  createLocalHistoryEntry,
  createSingleReading,
  parseSingleReadingInput,
  recordCardDiscovery,
  replayLocalHistoryEntry,
} from "../src/index.js";
import { expectSafeDomainError } from "./helpers.js";

const publicDomain = {
  appendLocalHistoryEntry,
  assertSingleCardReadingResult,
  createLocalHistoryEntry,
  createSingleReading,
  parseSingleReadingInput,
  recordCardDiscovery,
  replayLocalHistoryEntry,
};

const REQUIRED_RUNTIME_KEYS = [
  "DomainError",
  "appendLocalHistoryEntry",
  "assertSingleCardReadingResult",
  "createLocalHistoryEntry",
  "createSingleReading",
  "parseSingleReadingInput",
  "recordCardDiscovery",
  "replayLocalHistoryEntry",
] as const;

const FIXED_CONTROLLER_INPUT = {
  seed: "aura-m1-fixed-seed",
  sessionId: "fixture-session-001",
  questionCategory: "general",
  safetyDisposition: "standard",
  reversalsEnabled: true,
  createdAt: "2026-08-28T00:00:00.000Z",
  rawQuestion: "PRIVATE_RAW_QUESTION_SENTINEL",
  presentationThemeChoice: "PRIVATE_THEME_CHOICE",
  presentationDeckChoice: "PRIVATE_DECK_CHOICE",
} as const;

function createFixedResult() {
  const rawInput = {
    seed: FIXED_CONTROLLER_INPUT.seed,
    sessionId: FIXED_CONTROLLER_INPUT.sessionId,
    questionCategory: FIXED_CONTROLLER_INPUT.questionCategory,
    safetyDisposition: FIXED_CONTROLLER_INPUT.safetyDisposition,
    reversalsEnabled: FIXED_CONTROLLER_INPUT.reversalsEnabled,
    createdAt: FIXED_CONTROLLER_INPUT.createdAt,
  };
  return createSingleReading(parseSingleReadingInput(rawInput));
}

function expectPublicFailure(
  action: () => unknown,
  code: Parameters<typeof expectSafeDomainError>[1],
  field: Parameters<typeof expectSafeDomainError>[2],
  sentinels: readonly string[] = [],
): void {
  try {
    action();
    throw new Error("Expected public domain call to fail.");
  } catch (error) {
    expectSafeDomainError(error, code, field, sentinels);
    expect(Object.keys(error as object)).not.toContain("stack");
    expect("issues" in (error as object)).toBe(false);
  }
}

describe("domain public boundary", () => {
  it("publishes exactly the approved runtime entrypoints", () => {
    expect(Object.keys(domain).sort()).toEqual([...REQUIRED_RUNTIME_KEYS]);
  });

  it("completes the single-card controller flow without private input leakage", () => {
    const api = publicDomain;
    const result = createFixedResult();
    api.assertSingleCardReadingResult(result);

    const discoveries = api.recordCardDiscovery(
      [],
      result.session.draws[0].cardId,
      "2026-08-29T09:00:00.000Z",
    );
    const entry = api.createLocalHistoryEntry(
      result,
      "2026-08-29T10:00:00.000Z",
      {
        themeRef: { themeId: "aurora", version: "m1-theme-v1" },
        deckRef: { deckId: "classic", version: "m1-deck-v1" },
      },
    );
    const history = api.appendLocalHistoryEntry([], entry);
    const replayed = api.replayLocalHistoryEntry(history[0]!);

    expect(discoveries).toEqual([
      {
        cardId: result.session.draws[0].cardId,
        firstSeenAt: "2026-08-29T09:00:00.000Z",
      },
    ]);
    expect(replayed).toEqual(result);
    expect(replayed).not.toBe(result);

    const serializedResultAndHistory = JSON.stringify({
      result,
      history,
      replayed,
    });
    for (const sentinel of [
      FIXED_CONTROLLER_INPUT.seed,
      "reversalsEnabled",
      FIXED_CONTROLLER_INPUT.rawQuestion,
      "rawQuestion",
      FIXED_CONTROLLER_INPUT.presentationThemeChoice,
      "presentationThemeChoice",
      FIXED_CONTROLLER_INPUT.presentationDeckChoice,
      "presentationDeckChoice",
    ]) {
      expect(serializedResultAndHistory).not.toContain(sentinel);
    }
    expect(JSON.stringify(result)).not.toContain("themeRef");
    expect(JSON.stringify(result)).not.toContain("deckRef");
    expect(JSON.stringify(replayed)).not.toContain("themeRef");
    expect(JSON.stringify(replayed)).not.toContain("deckRef");
  });

  it("redacts invalid reading input failures", () => {
    const api = publicDomain;
    expectPublicFailure(
      () => api.parseSingleReadingInput(FIXED_CONTROLLER_INPUT),
      "INVALID_READING_INPUT",
      "input",
      [FIXED_CONTROLLER_INPUT.rawQuestion],
    );
  });

  it("redacts unknown card content failures", () => {
    const api = publicDomain;
    const result = createFixedResult();
    const unknownCard = "major.private-card-sentinel";
    const forged = {
      ...result,
      session: {
        ...result.session,
        draws: [{ ...result.session.draws[0], cardId: unknownCard }],
      },
    };

    expectPublicFailure(
      () => api.assertSingleCardReadingResult(forged),
      "UNKNOWN_CARD_CONTENT",
      "cardId",
      [unknownCard],
    );
  });

  it("redacts invalid discovery state failures", () => {
    const api = publicDomain;
    const unknownCard = "major.private-discovery-sentinel";
    expectPublicFailure(
      () =>
        api.recordCardDiscovery(
          [],
          unknownCard as Parameters<typeof api.recordCardDiscovery>[1],
          "2026-08-29T09:00:00.000Z",
        ),
      "INVALID_DISCOVERY_STATE",
      "cardId",
      [unknownCard],
    );
  });

  it("redacts invalid history entry failures", () => {
    const api = publicDomain;
    const invalidSavedAt = "PRIVATE_INVALID_SAVED_AT";
    expectPublicFailure(
      () => api.createLocalHistoryEntry(createFixedResult(), invalidSavedAt),
      "INVALID_HISTORY_ENTRY",
      "savedAt",
      [invalidSavedAt],
    );
  });

  it("redacts history session conflicts", () => {
    const api = publicDomain;
    const first = api.createLocalHistoryEntry(
      createFixedResult(),
      "2026-08-29T10:00:00.000Z",
    );
    const conflictingResult = api.createSingleReading(
      api.parseSingleReadingInput({
        seed: FIXED_CONTROLLER_INPUT.seed,
        sessionId: FIXED_CONTROLLER_INPUT.sessionId,
        questionCategory: "relationships",
        safetyDisposition: FIXED_CONTROLLER_INPUT.safetyDisposition,
        reversalsEnabled: FIXED_CONTROLLER_INPUT.reversalsEnabled,
        createdAt: FIXED_CONTROLLER_INPUT.createdAt,
      }),
    );
    const conflicting = api.createLocalHistoryEntry(
      conflictingResult,
      "2026-08-29T11:00:00.000Z",
    );

    expectPublicFailure(
      () => api.appendLocalHistoryEntry([first], conflicting),
      "HISTORY_SESSION_CONFLICT",
      "sessionId",
      [FIXED_CONTROLLER_INPUT.sessionId],
    );
  });

  it("redacts unsupported replay version failures", () => {
    const api = publicDomain;
    const oldVersion = "m0-text-v1";
    const entry = api.createLocalHistoryEntry(
      createFixedResult(),
      "2026-08-29T10:00:00.000Z",
    );
    const oldEntry = { ...entry, textVersion: oldVersion } as LocalHistoryEntry;

    expectPublicFailure(
      () => api.replayLocalHistoryEntry(oldEntry),
      "UNSUPPORTED_REPLAY_VERSION",
      "version",
      [oldVersion],
    );
  });
});
