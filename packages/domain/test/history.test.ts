import type {
  CardId,
  DeckManifestRef,
  DiscoveryRecord,
  LocalHistoryEntry,
  ThemeManifestRef,
} from "@aura/contracts";
import { describe, expect, it } from "vitest";
import { DomainError } from "../src/errors.js";
import { recordCardDiscovery } from "../src/discovery.js";
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

function historyWithUniqueSessions(length: number): LocalHistoryEntry[] {
  const template = saved();
  return Array.from({ length }, (_unused, index) => ({
    ...template,
    session: {
      ...template.session,
      sessionId: `history-cap-${index.toString().padStart(5, "0")}`,
    },
  }));
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

  it.each([
    ["themeRef", THEME_REF],
    ["deckRef", DECK_REF],
  ] as const)(
    "snapshots a stateful root refs %s before schema parsing",
    (property, validRef) => {
      const sentinel = `PRIVATE_CREATE_SECOND_${property}_READ`;
      let metadataReads = 0;
      const refs = new Proxy(
        property === "themeRef"
          ? { themeRef: validRef }
          : { deckRef: validRef },
        {
          get(target, accessedProperty, receiver) {
            if (accessedProperty === property && ++metadataReads > 1) {
              throw new Error(sentinel);
            }
            return Reflect.get(target, accessedProperty, receiver);
          },
        },
      ) as {
        readonly themeRef?: ThemeManifestRef;
        readonly deckRef?: DeckManifestRef;
      };

      expect(createLocalHistoryEntry(reading(), SAVED_AT, refs)).toEqual({
        ...reading(),
        savedAt: SAVED_AT,
        [property]: validRef,
      });
      expect(metadataReads).toBe(1);
    },
  );
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

  it("does not let a getter-rebound global Set hide duplicate sessions", () => {
    const originalSetDescriptor = Object.getOwnPropertyDescriptor(
      global,
      "Set",
    )!;
    const OriginalSet = global.Set;
    class DuplicateHidingSet<T> extends OriginalSet<T> {
      override has(value: T): boolean {
        if (typeof value === "string" && value.startsWith("history-session-")) {
          return false;
        }
        return super.has(value);
      }
    }
    const first = saved();
    const rebound = {
      ...first,
      get savedAt(): string {
        Object.defineProperty(global, "Set", {
          ...originalSetDescriptor,
          value: DuplicateHidingSet,
        });
        return SAVED_AT;
      },
    } as LocalHistoryEntry;
    const duplicate = saved(reading(), "2026-08-30T00:00:00.000Z");
    let thrown: unknown;
    try {
      try {
        appendLocalHistoryEntry(
          [rebound, duplicate],
          saved(reading({ sessionId: "history-session-003" })),
        );
      } catch (error) {
        thrown = error;
      }
    } finally {
      Object.defineProperty(global, "Set", originalSetDescriptor);
    }

    expectHistoryError(
      () => {
        if (thrown !== undefined) throw thrown;
      },
      "INVALID_HISTORY_ENTRY",
      "history",
      [SESSION_ID],
    );
  });

  it("allows 9,999 entries to grow to the 10,000 output ceiling", () => {
    const history = historyWithUniqueSessions(9_999);
    const incoming = saved(reading({ sessionId: "history-cap-final" }));

    const appended = appendLocalHistoryEntry(history, incoming);

    expect(appended).toHaveLength(10_000);
    expect(appended[9_999]).toEqual(incoming);
  });

  it("rejects a genuinely new entry when history is already at 10,000", () => {
    const history = historyWithUniqueSessions(10_000);

    expectHistoryError(
      () =>
        appendLocalHistoryEntry(
          history,
          saved(reading({ sessionId: "history-cap-new-00000" })),
        ),
      "INVALID_HISTORY_ENTRY",
      "history",
    );
  });

  it("keeps identical replay idempotent at the 10,000 ceiling", () => {
    const history = historyWithUniqueSessions(10_000);
    const existing = history[9_999]!;

    const replayed = appendLocalHistoryEntry(history, existing);

    expect(replayed).toHaveLength(10_000);
    expect(replayed).toEqual(history);
  });

  it("keeps same-session conflict behavior at the 10,000 ceiling", () => {
    const history = historyWithUniqueSessions(10_000);
    const existing = history[9_999]!;
    const conflicting = saved(
      reading({
        sessionId: existing.session.sessionId,
        questionCategory: "relationships",
      }),
    );

    expectHistoryError(
      () => appendLocalHistoryEntry(history, conflicting),
      "HISTORY_SESSION_CONFLICT",
      "sessionId",
      [existing.session.sessionId],
    );
  });

  it("validates a forged incoming entry before duplicate persisted session lookup", () => {
    const duplicatedSession = [
      saved(),
      saved(reading(), "2026-08-30T00:00:00.000Z"),
    ];
    const sentinel = "PRIVATE_COMBINED_FORGED_ENTRY";
    const forgedIncoming = {
      privateEntryData: sentinel,
    } as unknown as LocalHistoryEntry;

    expectHistoryError(
      () => appendLocalHistoryEntry(duplicatedSession, forgedIncoming),
      "INVALID_HISTORY_ENTRY",
      "result",
      [sentinel, SESSION_ID],
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

  it("ignores an empty overridden array iterator and preserves every entry", () => {
    const first = saved();
    const second = saved(reading({ sessionId: "history-session-002" }));
    const incoming = saved(reading({ sessionId: "history-session-003" }));
    const history = [first, second];
    let iteratorCalls = 0;
    Object.defineProperty(history, Symbol.iterator, {
      configurable: true,
      value(): Iterator<LocalHistoryEntry> {
        iteratorCalls += 1;
        return [][Symbol.iterator]();
      },
    });

    const appended = appendLocalHistoryEntry(history, incoming);

    expect(appended).toEqual([first, second, incoming]);
    expect(iteratorCalls).toBe(0);
  });

  it("does not let a partial overridden iterator hide corrupt or duplicate entries", () => {
    const first = saved();
    const corruptSentinel = "PRIVATE_HIDDEN_CORRUPT_HISTORY";
    const corrupt = {
      ...saved(reading({ sessionId: "history-session-002" })),
      savedAt: corruptSentinel,
    } as LocalHistoryEntry;
    const histories = [
      [first, corrupt],
      [first, saved(reading(), "2026-08-30T00:00:00.000Z")],
    ];
    for (const history of histories) {
      Object.defineProperty(history, Symbol.iterator, {
        configurable: true,
        value(): Iterator<LocalHistoryEntry> {
          return [first][Symbol.iterator]();
        },
      });
    }

    for (const history of histories) {
      expectHistoryError(
        () =>
          appendLocalHistoryEntry(
            history,
            saved(reading({ sessionId: "history-session-003" })),
          ),
        "INVALID_HISTORY_ENTRY",
        "history",
        [corruptSentinel, SESSION_ID],
      );
    }
  });

  it("rejects sparse persisted arrays with a fixed history error", () => {
    const sparse = new Array<LocalHistoryEntry>(2);
    sparse[0] = saved();

    expectHistoryError(
      () =>
        appendLocalHistoryEntry(
          sparse,
          saved(reading({ sessionId: "history-session-003" })),
        ),
      "INVALID_HISTORY_ENTRY",
      "history",
    );
  });

  it("rejects an indexed getter that shortens persisted history", () => {
    const hiddenSentinel = "PRIVATE_SHORTENED_HISTORY";
    const history = [
      saved(),
      {
        ...saved(reading({ sessionId: "history-session-002" })),
        savedAt: hiddenSentinel,
      } as LocalHistoryEntry,
    ];
    const first = history[0]!;
    Object.defineProperty(history, 0, {
      configurable: true,
      enumerable: true,
      get() {
        history.length = 1;
        return first;
      },
    });

    expectHistoryError(
      () =>
        appendLocalHistoryEntry(
          history,
          saved(reading({ sessionId: "history-session-003" })),
        ),
      "INVALID_HISTORY_ENTRY",
      "history",
      [hiddenSentinel],
    );
  });

  it("rejects indexed shape changes during the persisted snapshot", () => {
    const originalSecond = saved(reading({ sessionId: "history-session-002" }));
    const replacementSentinel = "PRIVATE_REPLACED_HISTORY_SESSION";
    const replacement = saved(reading({ sessionId: replacementSentinel }));
    const history = [saved(), originalSecond];
    const first = history[0]!;
    Object.defineProperty(history, 0, {
      configurable: true,
      enumerable: true,
      get() {
        delete history[1];
        history[1] = replacement;
        return first;
      },
    });

    expectHistoryError(
      () =>
        appendLocalHistoryEntry(
          history,
          saved(reading({ sessionId: "history-session-003" })),
        ),
      "INVALID_HISTORY_ENTRY",
      "history",
      [replacementSentinel],
    );
  });

  it("fails closed after restoring the managed iterator when a getter rebinds Array", () => {
    const safeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    const safeDefineProperty = Object.defineProperty;
    const originalGlobalTarget = global;
    const originalIteratorKey = Symbol.iterator;
    const originalArrayConstructor = originalGlobalTarget.Array;
    const originalArrayPrototype = originalArrayConstructor.prototype;
    const originalGlobalArrayDescriptor = safeGetOwnPropertyDescriptor(
      originalGlobalTarget,
      "Array",
    )!;
    const originalIteratorDescriptor = safeGetOwnPropertyDescriptor(
      originalArrayPrototype,
      originalIteratorKey,
    )!;
    function ReplacementArray(): void {}
    const mutationSentinel = "PRIVATE_REBOUND_ARRAY_INTRINSIC";
    const first = saved();
    const incoming = saved(reading({ sessionId: "history-session-003" }));
    const history = [first];
    let iteratorCalls = 0;
    safeDefineProperty(history, 0, {
      configurable: true,
      enumerable: true,
      get() {
        safeDefineProperty(originalArrayPrototype, originalIteratorKey, {
          ...originalIteratorDescriptor,
          value(): Iterator<unknown> {
            iteratorCalls += 1;
            throw new Error(mutationSentinel);
          },
        });
        safeDefineProperty(originalGlobalTarget, "Array", {
          ...originalGlobalArrayDescriptor,
          value: ReplacementArray,
        });
        return first;
      },
    });

    let appendError: unknown;
    let productionState:
      | {
          globalArrayDescriptor: PropertyDescriptor | undefined;
          iteratorDescriptor: PropertyDescriptor | undefined;
        }
      | undefined;
    try {
      try {
        appendLocalHistoryEntry(history, incoming);
      } catch (error) {
        appendError = error;
      }
      productionState = {
        globalArrayDescriptor: safeGetOwnPropertyDescriptor(
          originalGlobalTarget,
          "Array",
        ),
        iteratorDescriptor: safeGetOwnPropertyDescriptor(
          originalArrayPrototype,
          originalIteratorKey,
        ),
      };
    } finally {
      safeDefineProperty(
        originalArrayPrototype,
        originalIteratorKey,
        originalIteratorDescriptor,
      );
      safeDefineProperty(
        originalGlobalTarget,
        "Array",
        originalGlobalArrayDescriptor,
      );
    }

    expectSafeDomainError(appendError, "INVALID_HISTORY_ENTRY", "history", [
      mutationSentinel,
    ]);
    expect(iteratorCalls).toBe(0);
    expect(productionState?.globalArrayDescriptor?.value).toBe(
      ReplacementArray,
    );
    expect(productionState?.iteratorDescriptor).toEqual(
      originalIteratorDescriptor,
    );
  });

  it.each([
    ["corrupt record", "corrupt"],
    ["duplicate session", "duplicate"],
  ] as const)(
    "rejects a trapped short length that hides a %s",
    (_label, hiddenKind) => {
      const hiddenSentinel = "PRIVATE_LENGTH_HIDDEN_HISTORY";
      const first = saved();
      const hidden =
        hiddenKind === "corrupt"
          ? ({
              ...saved(reading({ sessionId: "history-session-002" })),
              savedAt: hiddenSentinel,
            } as LocalHistoryEntry)
          : saved(reading(), "2026-08-30T00:00:00.000Z");
      const history = new Proxy([first, hidden], {
        get(target, property, receiver) {
          if (property === "length") return 1;
          return Reflect.get(target, property, receiver);
        },
      });

      expectHistoryError(
        () =>
          appendLocalHistoryEntry(
            history,
            saved(reading({ sessionId: "history-session-003" })),
          ),
        "INVALID_HISTORY_ENTRY",
        "history",
        [hiddenSentinel, SESSION_ID],
      );
    },
  );

  it("rejects a trapped zero length instead of silently deleting history", () => {
    const hiddenSession = "PRIVATE_ZERO_LENGTH_SESSION";
    const history = new Proxy([saved(reading({ sessionId: hiddenSession }))], {
      get(target, property, receiver) {
        if (property === "length") return 0;
        return Reflect.get(target, property, receiver);
      },
    });

    expectHistoryError(
      () =>
        appendLocalHistoryEntry(
          history,
          saved(reading({ sessionId: "history-session-003" })),
        ),
      "INVALID_HISTORY_ENTRY",
      "history",
      [hiddenSession],
    );
  });

  it.each([
    ["negative", -1],
    ["non-integer", 1.5],
    ["infinite", Number.POSITIVE_INFINITY],
    ["oversized", Number.MAX_SAFE_INTEGER],
  ] as const)(
    "rejects a %s trapped length before indexed work",
    (_label, trappedLength) => {
      const trapSentinel = `PRIVATE_${_label.toUpperCase()}_LENGTH_TRAP`;
      let indexedDescriptorReads = 0;
      const history = new Proxy([] as LocalHistoryEntry[], {
        get(target, property, receiver) {
          if (property === "length") return trappedLength;
          return Reflect.get(target, property, receiver);
        },
        getOwnPropertyDescriptor(target, property) {
          if (property === "length") {
            return Reflect.getOwnPropertyDescriptor(target, property);
          }
          indexedDescriptorReads += 1;
          if (indexedDescriptorReads > 2) throw new Error(trapSentinel);
          return {
            configurable: true,
            enumerable: true,
            value: saved(),
            writable: true,
          };
        },
      });

      expectHistoryError(
        () =>
          appendLocalHistoryEntry(
            history,
            saved(reading({ sessionId: "history-session-003" })),
          ),
        "INVALID_HISTORY_ENTRY",
        "history",
        [trapSentinel],
      );
      expect(indexedDescriptorReads).toBe(0);
    },
  );

  it("rejects 10,001 entries before any indexed descriptor or value scan", () => {
    const capSentinel = "PRIVATE_HISTORY_CAP_SCAN";
    let indexedDescriptorReads = 0;
    let indexedValueReads = 0;
    const history = new Proxy(new Array<LocalHistoryEntry>(10_001), {
      get(target, property) {
        if (property === "length") return 10_001;
        indexedValueReads += 1;
        throw new Error(capSentinel);
      },
      getOwnPropertyDescriptor(target, property) {
        if (property === "length") {
          return Reflect.getOwnPropertyDescriptor(target, property);
        }
        indexedDescriptorReads += 1;
        throw new Error(capSentinel);
      },
    });

    expectHistoryError(
      () =>
        appendLocalHistoryEntry(
          history,
          saved(reading({ sessionId: "history-session-003" })),
        ),
      "INVALID_HISTORY_ENTRY",
      "history",
      [capSentinel],
    );
    expect(indexedDescriptorReads).toBe(0);
    expect(indexedValueReads).toBe(0);
  });

  it("never enumerates unbounded non-index history keys", () => {
    const ownKeysSentinel = "PRIVATE_HISTORY_OWN_KEYS";
    const first = saved();
    const incoming = saved(reading({ sessionId: "history-session-003" }));
    let ownKeysCalls = 0;
    const history = new Proxy([first], {
      ownKeys() {
        ownKeysCalls += 1;
        throw new Error(ownKeysSentinel);
      },
    });

    expect(appendLocalHistoryEntry(history, incoming)).toEqual([
      first,
      incoming,
    ]);
    expect(ownKeysCalls).toBe(0);
  });

  it("snapshots a stateful incoming saved time before schema validation", () => {
    const sentinel = "PRIVATE_INCOMING_SECOND_SAVED_AT_READ";
    let savedAtReads = 0;
    const statefulIncoming = new Proxy(saved(), {
      get(target, property, receiver) {
        if (property === "savedAt" && ++savedAtReads > 1) {
          throw new Error(sentinel);
        }
        return Reflect.get(target, property, receiver);
      },
    }) as LocalHistoryEntry;

    expect(appendLocalHistoryEntry([], statefulIncoming)).toEqual([saved()]);
    expect(savedAtReads).toBe(1);
  });

  it("snapshots a stateful persisted saved time before schema validation", () => {
    const sentinel = "PRIVATE_HISTORY_SECOND_SAVED_AT_READ";
    let savedAtReads = 0;
    const statefulPersisted = new Proxy(saved(), {
      get(target, property, receiver) {
        if (property === "savedAt" && ++savedAtReads > 1) {
          throw new Error(sentinel);
        }
        return Reflect.get(target, property, receiver);
      },
    }) as LocalHistoryEntry;

    expect(
      appendLocalHistoryEntry(
        [statefulPersisted],
        saved(reading({ sessionId: "history-session-002" })),
      ),
    ).toHaveLength(2);
    expect(savedAtReads).toBe(1);
  });

  it.each(["themeRef", "deckRef"] as const)(
    "reads optional %s only once before schema validation",
    (property) => {
      const sentinel = `PRIVATE_SECOND_${property}_READ`;
      let metadataReads = 0;
      const statefulIncoming = new Proxy(saved(), {
        get(target, accessedProperty, receiver) {
          if (accessedProperty === property && ++metadataReads > 1) {
            throw new Error(sentinel);
          }
          return Reflect.get(target, accessedProperty, receiver);
        },
      }) as LocalHistoryEntry;

      expect(appendLocalHistoryEntry([], statefulIncoming)).toHaveLength(1);
      expect(metadataReads).toBe(1);
    },
  );

  it.each(["themeRef", "deckRef"] as const)(
    "reuses a parsed nested %s instead of rereading its Proxy",
    (property) => {
      const sentinel = `PRIVATE_NESTED_${property}_SECOND_READ`;
      const reads = new Map<PropertyKey, number>();
      const nestedRef = new Proxy(
        property === "themeRef" ? THEME_REF : DECK_REF,
        {
          get(target, accessedProperty, receiver) {
            if (
              accessedProperty === "themeId" ||
              accessedProperty === "deckId" ||
              accessedProperty === "version"
            ) {
              const count = (reads.get(accessedProperty) ?? 0) + 1;
              reads.set(accessedProperty, count);
              if (count > 1) throw new Error(sentinel);
            }
            return Reflect.get(target, accessedProperty, receiver);
          },
        },
      );
      const entry = {
        ...saved(),
        [property]: nestedRef,
      } as LocalHistoryEntry;

      expect(appendLocalHistoryEntry([], entry)).toHaveLength(1);
    },
  );

  it.each(["themeRef", "deckRef"] as const)(
    "preserves an explicit undefined own %s key",
    (property) => {
      const entry = { ...saved(), [property]: undefined } as LocalHistoryEntry;

      const appended = appendLocalHistoryEntry([], entry);

      expect(Object.hasOwn(appended[0]!, property)).toBe(true);
      expect(appended[0]).toHaveProperty(property, undefined);
    },
  );

  it("prioritizes invalid metadata over an unknown entry key", () => {
    const invalidSavedAt = "PRIVATE_PRIORITY_SAVED_AT";
    const unknownKey = "PRIVATE_UNKNOWN_HISTORY_KEY";
    const entry = {
      ...saved(),
      savedAt: invalidSavedAt,
      [unknownKey]: true,
    } as LocalHistoryEntry;

    expectHistoryError(
      () => appendLocalHistoryEntry([], entry),
      "INVALID_HISTORY_ENTRY",
      "savedAt",
      [invalidSavedAt, unknownKey],
    );
  });

  it("prioritizes invalid metadata over a hostile result getter", () => {
    const invalidThemeId = "PRIVATE_PRIORITY_THEME";
    const resultSentinel = "PRIVATE_PRIORITY_RESULT";
    const hostileEntry = new Proxy(
      {
        ...saved(),
        themeRef: { themeId: invalidThemeId, version: "m1-theme-v1" },
      },
      {
        get(target, property, receiver) {
          if (property === "session") throw new Error(resultSentinel);
          return Reflect.get(target, property, receiver);
        },
      },
    ) as LocalHistoryEntry;

    expectHistoryError(
      () => appendLocalHistoryEntry([], hostileEntry),
      "INVALID_HISTORY_ENTRY",
      "themeRef",
      [invalidThemeId, resultSentinel],
    );
  });
});

describe("recordCardDiscovery intrinsic safety", () => {
  it("does not let a getter-rebound global Set hide invalid discovery state", () => {
    const originalSetDescriptor = Object.getOwnPropertyDescriptor(
      global,
      "Set",
    )!;
    const OriginalSet = global.Set;
    class DiscoveryBypassingSet<T> extends OriginalSet<T> {
      override has(value: T): boolean {
        if (typeof value === "string" && value.startsWith("major.")) {
          return this.size > 10;
        }
        return super.has(value);
      }
    }
    const cardId = "major.fool" as CardId;
    const rebound = {
      get cardId(): CardId {
        Object.defineProperty(global, "Set", {
          ...originalSetDescriptor,
          value: DiscoveryBypassingSet,
        });
        return cardId;
      },
      firstSeenAt: CREATED_AT,
    } as DiscoveryRecord;
    const duplicate = {
      cardId,
      firstSeenAt: "2026-08-30T00:00:00.000Z",
    } as DiscoveryRecord;
    let thrown: unknown;
    try {
      try {
        recordCardDiscovery(
          [rebound, duplicate],
          "major.magician" as CardId,
          SAVED_AT,
        );
      } catch (error) {
        thrown = error;
      }
    } finally {
      Object.defineProperty(global, "Set", originalSetDescriptor);
    }

    expectSafeDomainError(thrown, "INVALID_DISCOVERY_STATE", "discovery", [
      cardId,
    ]);
  });
});
