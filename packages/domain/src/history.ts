import {
  DeckManifestRefSchema,
  LocalHistoryEntrySchema,
  ReadingResultSchema,
  ThemeManifestRefSchema,
} from "@aura/contracts";
import type {
  DeckManifestRef,
  LocalHistoryEntry,
  ReadingDraw,
  ThemeManifestRef,
} from "@aura/contracts";
import { DomainError, type DomainErrorField } from "./errors.js";
import type { SingleCardReadingResult } from "./single-reading.js";
import { assertSingleCardReadingResult } from "./single-reading.js";

export interface LocalHistoryPresentationRefs {
  readonly themeRef?: ThemeManifestRef;
  readonly deckRef?: DeckManifestRef;
}

export function createLocalHistoryEntry(
  result: SingleCardReadingResult,
  savedAt: string,
  refs?: LocalHistoryPresentationRefs,
): LocalHistoryEntry {
  let safeField: DomainErrorField = "result";

  try {
    const parsedResult = ReadingResultSchema.parse(result);
    assertSingleCardReadingResult(parsedResult);

    safeField = "savedAt";
    const parsedSavedAt = LocalHistoryEntrySchema.pick({ savedAt: true }).parse(
      {
        savedAt,
      },
    ).savedAt;

    let themeRef: ThemeManifestRef | undefined;
    let deckRef: DeckManifestRef | undefined;
    if (refs !== undefined) {
      if (typeof refs !== "object" || refs === null || Array.isArray(refs)) {
        safeField = "themeRef";
        throw new Error("Invalid presentation references.");
      }

      safeField = "themeRef";
      if (refs.themeRef !== undefined) {
        themeRef = ThemeManifestRefSchema.parse(refs.themeRef);
      }

      safeField = "deckRef";
      if (refs.deckRef !== undefined) {
        deckRef = DeckManifestRefSchema.parse(refs.deckRef);
      }
    }

    const entry = LocalHistoryEntrySchema.parse({
      ...parsedResult,
      savedAt: parsedSavedAt,
      ...(themeRef === undefined ? {} : { themeRef }),
      ...(deckRef === undefined ? {} : { deckRef }),
    });
    assertEntryReadingResult(entry);
    return entry;
  } catch {
    throw new DomainError("INVALID_HISTORY_ENTRY", safeField);
  }
}

export function appendLocalHistoryEntry(
  history: readonly LocalHistoryEntry[],
  entry: LocalHistoryEntry,
): readonly LocalHistoryEntry[] {
  let parsedHistory: LocalHistoryEntry[];
  try {
    parsedHistory = [];
    for (const persistedEntry of history) {
      parsedHistory.push(
        parseHistoryEntry(persistedEntry, { safeField: "history" }),
      );
    }

    const sessionIds = new Set<string>();
    for (const persistedEntry of parsedHistory) {
      if (sessionIds.has(persistedEntry.session.sessionId)) {
        throw new Error("Duplicate persisted session ID.");
      }
      sessionIds.add(persistedEntry.session.sessionId);
    }
  } catch {
    throw new DomainError("INVALID_HISTORY_ENTRY", "history");
  }

  const incomingContext: { safeField: DomainErrorField } = {
    safeField: "result",
  };
  let parsedEntry: LocalHistoryEntry;
  try {
    parsedEntry = parseHistoryEntry(entry, incomingContext);
  } catch {
    throw new DomainError("INVALID_HISTORY_ENTRY", incomingContext.safeField);
  }

  const existing = parsedHistory.find(
    (persistedEntry) =>
      persistedEntry.session.sessionId === parsedEntry.session.sessionId,
  );
  if (existing === undefined) return [...parsedHistory, parsedEntry];
  if (sameReadingResult(existing, parsedEntry)) return [...parsedHistory];

  throw new DomainError("HISTORY_SESSION_CONFLICT", "sessionId");
}

function parseHistoryEntry(
  value: unknown,
  context: { safeField: DomainErrorField },
): LocalHistoryEntry {
  context.safeField = "result";
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    !Object.hasOwn(value, "session") ||
    !Object.hasOwn(value, "narrative") ||
    !Object.hasOwn(value, "textVersion")
  ) {
    throw new Error("Invalid history entry shell.");
  }

  const candidate = value as {
    readonly savedAt: unknown;
    readonly themeRef?: unknown;
    readonly deckRef?: unknown;
  };
  context.safeField = "savedAt";
  LocalHistoryEntrySchema.pick({ savedAt: true }).parse({
    savedAt: candidate.savedAt,
  });

  context.safeField = "themeRef";
  if (candidate.themeRef !== undefined) {
    ThemeManifestRefSchema.parse(candidate.themeRef);
  }

  context.safeField = "deckRef";
  if (candidate.deckRef !== undefined) {
    DeckManifestRefSchema.parse(candidate.deckRef);
  }

  context.safeField = "result";
  const parsedEntry = LocalHistoryEntrySchema.parse(value);
  assertEntryReadingResult(parsedEntry);
  return parsedEntry;
}

function assertEntryReadingResult(entry: LocalHistoryEntry): void {
  assertSingleCardReadingResult({
    session: entry.session,
    narrative: entry.narrative,
    textVersion: entry.textVersion,
  });
}

function sameReadingResult(
  left: LocalHistoryEntry,
  right: LocalHistoryEntry,
): boolean {
  return (
    left.session.sessionId === right.session.sessionId &&
    left.session.mode === right.session.mode &&
    left.session.questionCategory === right.session.questionCategory &&
    left.session.safetyDisposition === right.session.safetyDisposition &&
    left.session.rulesVersion === right.session.rulesVersion &&
    left.session.contentVersion === right.session.contentVersion &&
    left.session.createdAt === right.session.createdAt &&
    left.textVersion === right.textVersion &&
    sameDraws(left.session.draws, right.session.draws) &&
    left.narrative.summary === right.narrative.summary &&
    left.narrative.interpretation === right.narrative.interpretation &&
    left.narrative.advice === right.narrative.advice &&
    left.narrative.safetyNotice === right.narrative.safetyNotice
  );
}

function sameDraws(
  left: readonly ReadingDraw[],
  right: readonly ReadingDraw[],
): boolean {
  return (
    left.length === right.length &&
    left.every(
      (draw, index) =>
        draw.cardId === right[index]?.cardId &&
        draw.orientation === right[index]?.orientation &&
        draw.position === right[index]?.position,
    )
  );
}
