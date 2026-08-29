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
import { CURRENT_READING_CONTENT_BUNDLE } from "@aura/content";
import { DomainError, type DomainErrorField } from "./errors.js";
import type { SingleCardReadingResult } from "./single-reading.js";
import { assertSingleCardReadingResult } from "./single-reading.js";

export interface LocalHistoryPresentationRefs {
  readonly themeRef?: ThemeManifestRef;
  readonly deckRef?: DeckManifestRef;
}

const MAX_LOCAL_HISTORY_ENTRIES = 10_000;
const MANAGED_ARRAY_PROTOTYPE = Array.prototype;
const MANAGED_ITERATOR_PROPERTY = Symbol.iterator;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const defineProperty = Object.defineProperty;
const deleteProperty = Reflect.deleteProperty;

interface ArrayIntrinsicSnapshot {
  readonly iteratorDescriptor: PropertyDescriptor | undefined;
}

export function replayLocalHistoryEntry(
  entry: LocalHistoryEntry,
): SingleCardReadingResult {
  let externalSession: object;
  try {
    if (
      typeof entry !== "object" ||
      entry === null ||
      Array.isArray(entry) ||
      !Object.hasOwn(entry, "session")
    ) {
      throw new Error("Invalid replay entry shell.");
    }

    const session = (entry as { readonly session: unknown }).session;
    if (
      typeof session !== "object" ||
      session === null ||
      Array.isArray(session)
    ) {
      throw new Error("Invalid replay session shell.");
    }
    externalSession = session;
  } catch {
    throw new DomainError("INVALID_HISTORY_ENTRY", "result");
  }

  let hasAllVersions: boolean;
  try {
    hasAllVersions =
      Object.hasOwn(externalSession, "rulesVersion") &&
      Object.hasOwn(externalSession, "contentVersion") &&
      Object.hasOwn(entry, "textVersion");
  } catch {
    throw new DomainError("INVALID_HISTORY_ENTRY", "result");
  }
  if (!hasAllVersions) {
    throw new DomainError("UNSUPPORTED_REPLAY_VERSION", "version");
  }

  let parsed: LocalHistoryEntry;
  const safeField: DomainErrorField = "result";
  try {
    parsed = LocalHistoryEntrySchema.parse(entry);
  } catch {
    throw new DomainError("INVALID_HISTORY_ENTRY", safeField);
  }

  const storedResult = {
    session: parsed.session,
    narrative: parsed.narrative,
    textVersion: parsed.textVersion,
  };
  const bundle = CURRENT_READING_CONTENT_BUNDLE;
  if (
    storedResult.session.rulesVersion !== bundle.rulesVersion ||
    storedResult.session.contentVersion !== bundle.contentVersion ||
    storedResult.textVersion !== bundle.textVersion
  ) {
    throw new DomainError("UNSUPPORTED_REPLAY_VERSION", "version");
  }

  assertSingleCardReadingResult(storedResult);
  return storedResult;
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
      const externalThemeRef = refs.themeRef;
      if (externalThemeRef !== undefined) {
        themeRef = ThemeManifestRefSchema.parse(externalThemeRef);
      }

      safeField = "deckRef";
      const externalDeckRef = refs.deckRef;
      if (externalDeckRef !== undefined) {
        deckRef = DeckManifestRefSchema.parse(externalDeckRef);
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
  let intrinsicSnapshot: ArrayIntrinsicSnapshot | undefined;
  let historySnapshot: readonly unknown[];
  try {
    intrinsicSnapshot = captureArrayIntrinsics();
    historySnapshot = snapshotDenseStableHistory(
      history,
      getOwnPropertyDescriptor,
    );
    restoreArrayIntrinsics(intrinsicSnapshot);
  } catch {
    try {
      if (intrinsicSnapshot !== undefined) {
        restoreArrayIntrinsics(intrinsicSnapshot);
      }
    } catch {
      // The public error below remains fixed even if the hostile mutation
      // made the captured global intrinsics impossible to restore.
    }
    throw new DomainError("INVALID_HISTORY_ENTRY", "history");
  }

  let parsedHistory: LocalHistoryEntry[];
  try {
    parsedHistory = [];
    const historyLength = historySnapshot.length;
    for (let index = 0; index < historyLength; index += 1) {
      parsedHistory[index] = parseHistoryEntry(historySnapshot[index], {
        safeField: "history",
      });
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

  try {
    const sessionIds = new Set<string>();
    const parsedHistoryLength = parsedHistory.length;
    for (let index = 0; index < parsedHistoryLength; index += 1) {
      const persistedEntry = parsedHistory[index]!;
      if (sessionIds.has(persistedEntry.session.sessionId)) {
        throw new Error("Duplicate persisted session ID.");
      }
      sessionIds.add(persistedEntry.session.sessionId);
    }
  } catch {
    throw new DomainError("INVALID_HISTORY_ENTRY", "history");
  }

  let existing: LocalHistoryEntry | undefined;
  const parsedHistoryLength = parsedHistory.length;
  for (let index = 0; index < parsedHistoryLength; index += 1) {
    const persistedEntry = parsedHistory[index]!;
    if (persistedEntry.session.sessionId === parsedEntry.session.sessionId) {
      existing = persistedEntry;
      break;
    }
  }
  if (existing === undefined) {
    return copyHistoryWithEntry(parsedHistory, parsedEntry);
  }
  if (sameReadingResult(existing, parsedEntry)) {
    return copyHistoryWithEntry(parsedHistory);
  }

  throw new DomainError("HISTORY_SESSION_CONFLICT", "sessionId");
}

function copyHistoryWithEntry(
  history: readonly LocalHistoryEntry[],
  entry?: LocalHistoryEntry,
): readonly LocalHistoryEntry[] {
  const copied: LocalHistoryEntry[] = [];
  const historyLength = history.length;
  for (let index = 0; index < historyLength; index += 1) {
    copied[index] = history[index]!;
  }
  if (entry !== undefined) copied[historyLength] = entry;
  return copied;
}

function captureArrayIntrinsics(): ArrayIntrinsicSnapshot {
  return {
    iteratorDescriptor: getOwnPropertyDescriptor(
      MANAGED_ARRAY_PROTOTYPE,
      MANAGED_ITERATOR_PROPERTY,
    ),
  };
}

function restoreArrayIntrinsics(snapshot: ArrayIntrinsicSnapshot): void {
  restoreProperty(
    MANAGED_ARRAY_PROTOTYPE,
    MANAGED_ITERATOR_PROPERTY,
    snapshot.iteratorDescriptor,
  );
}

function restoreProperty(
  target: object,
  property: PropertyKey,
  initialDescriptor: PropertyDescriptor | undefined,
): void {
  const currentDescriptor = getOwnPropertyDescriptor(target, property);
  if (samePropertyDescriptor(currentDescriptor, initialDescriptor)) return;

  if (initialDescriptor === undefined) {
    if (!deleteProperty(target, property)) {
      throw new Error("Unable to restore intrinsic property.");
    }
    return;
  }
  defineProperty(target, property, initialDescriptor);
}

function snapshotDenseStableHistory(
  value: unknown,
  getOwnPropertyDescriptor: typeof Object.getOwnPropertyDescriptor,
): readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid history collection.");
  }

  const lengthDescriptor = getOwnPropertyDescriptor(value, "length");
  if (
    lengthDescriptor === undefined ||
    lengthDescriptor.configurable !== false ||
    lengthDescriptor.enumerable !== false ||
    !Object.hasOwn(lengthDescriptor, "value") ||
    typeof lengthDescriptor.value !== "number" ||
    !Number.isSafeInteger(lengthDescriptor.value) ||
    lengthDescriptor.value < 0 ||
    lengthDescriptor.value > MAX_LOCAL_HISTORY_ENTRIES
  ) {
    throw new Error("Invalid history length descriptor.");
  }

  const initialLength = lengthDescriptor.value;
  const observedLength = value.length;
  if (
    typeof observedLength !== "number" ||
    !Number.isSafeInteger(observedLength) ||
    observedLength < 0 ||
    observedLength > MAX_LOCAL_HISTORY_ENTRIES ||
    observedLength !== initialLength
  ) {
    throw new Error("Invalid history length.");
  }

  const initialDescriptors: PropertyDescriptor[] = [];
  for (let index = 0; index < initialLength; index += 1) {
    const descriptor = getOwnPropertyDescriptor(value, index);
    if (descriptor === undefined) {
      throw new Error("Sparse history collection.");
    }
    initialDescriptors[index] = descriptor;
  }
  if (
    !hasStableArrayLength(
      value,
      lengthDescriptor,
      initialLength,
      getOwnPropertyDescriptor,
    )
  ) {
    throw new Error("Unstable history collection.");
  }

  const snapshot: unknown[] = [];
  for (let index = 0; index < initialLength; index += 1) {
    if (
      !hasStableArrayLength(
        value,
        lengthDescriptor,
        initialLength,
        getOwnPropertyDescriptor,
      ) ||
      !samePropertyDescriptor(
        getOwnPropertyDescriptor(value, index),
        initialDescriptors[index],
      )
    ) {
      throw new Error("Unstable history collection.");
    }

    snapshot[index] = value[index];

    if (
      !hasStableArrayLength(
        value,
        lengthDescriptor,
        initialLength,
        getOwnPropertyDescriptor,
      ) ||
      !samePropertyDescriptor(
        getOwnPropertyDescriptor(value, index),
        initialDescriptors[index],
      )
    ) {
      throw new Error("Unstable history collection.");
    }
  }

  if (
    !hasStableArrayLength(
      value,
      lengthDescriptor,
      initialLength,
      getOwnPropertyDescriptor,
    )
  ) {
    throw new Error("Unstable history collection.");
  }
  for (let index = 0; index < initialLength; index += 1) {
    if (
      !samePropertyDescriptor(
        getOwnPropertyDescriptor(value, index),
        initialDescriptors[index],
      )
    ) {
      throw new Error("Unstable history collection.");
    }
  }

  return snapshot;
}

function hasStableArrayLength(
  value: readonly unknown[],
  initialDescriptor: PropertyDescriptor,
  initialLength: number,
  getOwnPropertyDescriptor: typeof Object.getOwnPropertyDescriptor,
): boolean {
  const currentDescriptor = getOwnPropertyDescriptor(value, "length");
  const observedLength = value.length;
  return (
    samePropertyDescriptor(currentDescriptor, initialDescriptor) &&
    observedLength === initialLength
  );
}

function samePropertyDescriptor(
  left: PropertyDescriptor | undefined,
  right: PropertyDescriptor | undefined,
): boolean {
  return (
    left !== undefined &&
    right !== undefined &&
    left.configurable === right.configurable &&
    left.enumerable === right.enumerable &&
    left.writable === right.writable &&
    left.value === right.value &&
    left.get === right.get &&
    left.set === right.set
  );
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

  const externalEntry = value as {
    readonly session: unknown;
    readonly narrative: unknown;
    readonly textVersion: unknown;
    readonly savedAt: unknown;
    readonly themeRef?: unknown;
    readonly deckRef?: unknown;
  };

  context.safeField = "savedAt";
  const savedAt = externalEntry.savedAt;
  LocalHistoryEntrySchema.pick({ savedAt: true }).parse({
    savedAt,
  });

  context.safeField = "themeRef";
  const hasThemeRef = Object.hasOwn(value, "themeRef");
  const themeRef = hasThemeRef ? externalEntry.themeRef : undefined;
  const parsedThemeRef =
    themeRef === undefined ? undefined : ThemeManifestRefSchema.parse(themeRef);

  context.safeField = "deckRef";
  const hasDeckRef = Object.hasOwn(value, "deckRef");
  const deckRef = hasDeckRef ? externalEntry.deckRef : undefined;
  const parsedDeckRef =
    deckRef === undefined ? undefined : DeckManifestRefSchema.parse(deckRef);

  context.safeField = "result";
  const keys = Object.keys(value);
  const keyCount = keys.length;
  for (let index = 0; index < keyCount; index += 1) {
    if (!isAllowedHistoryEntryKey(keys[index]!)) {
      throw new Error("Invalid history entry key.");
    }
  }

  const session = externalEntry.session;
  const narrative = externalEntry.narrative;
  const textVersion = externalEntry.textVersion;

  const parsedEntry = LocalHistoryEntrySchema.parse({
    session,
    narrative,
    textVersion,
    savedAt,
    ...(hasThemeRef ? { themeRef: parsedThemeRef } : {}),
    ...(hasDeckRef ? { deckRef: parsedDeckRef } : {}),
  });
  assertEntryReadingResult(parsedEntry);
  return parsedEntry;
}

function isAllowedHistoryEntryKey(key: string): boolean {
  switch (key) {
    case "session":
    case "narrative":
    case "textVersion":
    case "savedAt":
    case "themeRef":
    case "deckRef":
      return true;
    default:
      return false;
  }
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
  const leftLength = left.length;
  if (leftLength !== right.length) return false;
  for (let index = 0; index < leftLength; index += 1) {
    const leftDraw = left[index]!;
    const rightDraw = right[index];
    if (
      rightDraw === undefined ||
      leftDraw.cardId !== rightDraw.cardId ||
      leftDraw.orientation !== rightDraw.orientation ||
      leftDraw.position !== rightDraw.position
    ) {
      return false;
    }
  }
  return true;
}
