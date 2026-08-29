import {
  CardIdSchema,
  DiscoveryRecordSchema,
  type CardId,
  type DiscoveryRecord,
} from "@aura/contracts";
import { CURRENT_READING_CONTENT_BUNDLE } from "@aura/content";
import { DomainError, type DomainErrorField } from "./errors.js";

const MAX_DISCOVERY_RECORDS = 78;
const isArray = Array.isArray;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const defineProperty = Object.defineProperty;
const objectKeys = Object.keys;
const hasOwn = Object.hasOwn;
const isSafeInteger = Number.isSafeInteger;
const managedArrayPrototype = Array.prototype;
const managedIteratorProperty = Symbol.iterator;

export function recordCardDiscovery(
  records: readonly DiscoveryRecord[],
  cardId: CardId,
  revealedAt: string,
): readonly DiscoveryRecord[] {
  let safeField: DomainErrorField = "discovery";
  let iteratorDescriptor: PropertyDescriptor | undefined;

  try {
    const capturedIteratorDescriptor = getOwnPropertyDescriptor(
      managedArrayPrototype,
      managedIteratorProperty,
    );
    if (capturedIteratorDescriptor === undefined) {
      throw new Error("Missing managed Array iterator.");
    }
    iteratorDescriptor = capturedIteratorDescriptor;
    const recordSnapshot = snapshotDenseStableRecords(records);
    restoreManagedArrayIterator(iteratorDescriptor);
    const parsedRecords: DiscoveryRecord[] = [];
    const recordCount = recordSnapshot.length;
    for (let index = 0; index < recordCount; index += 1) {
      const record = snapshotDiscoveryRecord(recordSnapshot[index]);
      restoreManagedArrayIterator(iteratorDescriptor);
      parsedRecords[index] = DiscoveryRecordSchema.parse(record);
    }

    for (let index = 0; index < recordCount; index += 1) {
      const record = parsedRecords[index]!;
      if (!isCanonicalCardId(record.cardId)) {
        throw new Error("Unknown existing card ID.");
      }
      for (let previous = 0; previous < index; previous += 1) {
        if (parsedRecords[previous]!.cardId === record.cardId) {
          throw new Error("Duplicate existing card ID.");
        }
      }
    }

    if (!CardIdSchema.safeParse(cardId).success) {
      safeField = "cardId";
      throw new Error("Invalid card ID.");
    }

    safeField = "revealedAt";
    const candidate = DiscoveryRecordSchema.parse({
      cardId,
      firstSeenAt: revealedAt,
    });

    safeField = "cardId";
    if (!isCanonicalCardId(candidate.cardId)) {
      throw new Error("Unknown card ID.");
    }

    for (let index = 0; index < recordCount; index += 1) {
      if (parsedRecords[index]!.cardId === candidate.cardId) {
        return copyDiscoveryRecords(parsedRecords);
      }
    }
    if (recordCount >= MAX_DISCOVERY_RECORDS) {
      safeField = "discovery";
      throw new Error("Discovery output exceeds capacity.");
    }
    return copyDiscoveryRecords(parsedRecords, candidate);
  } catch {
    try {
      if (iteratorDescriptor !== undefined) {
        restoreManagedArrayIterator(iteratorDescriptor);
      }
    } catch {
      // A hostile non-configurable mutation still receives the fixed error.
    }
    throw new DomainError("INVALID_DISCOVERY_STATE", safeField);
  }
}

function snapshotDiscoveryRecord(value: unknown): {
  readonly cardId: unknown;
  readonly firstSeenAt: unknown;
} {
  if (typeof value !== "object" || value === null || isArray(value)) {
    throw new Error("Invalid discovery record shell.");
  }

  const externalRecord = value as {
    readonly cardId: unknown;
    readonly firstSeenAt: unknown;
  };
  const cardId = externalRecord.cardId;
  const firstSeenAt = externalRecord.firstSeenAt;
  const keys = objectKeys(value);
  if (
    keys.length !== 2 ||
    !hasOwn(value, "cardId") ||
    !hasOwn(value, "firstSeenAt")
  ) {
    throw new Error("Invalid discovery record keys.");
  }
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (key !== "cardId" && key !== "firstSeenAt") {
      throw new Error("Invalid discovery record key.");
    }
  }
  return { cardId, firstSeenAt };
}

function restoreManagedArrayIterator(
  initialDescriptor: PropertyDescriptor,
): void {
  const currentDescriptor = getOwnPropertyDescriptor(
    managedArrayPrototype,
    managedIteratorProperty,
  );
  if (samePropertyDescriptor(currentDescriptor, initialDescriptor)) return;
  defineProperty(
    managedArrayPrototype,
    managedIteratorProperty,
    initialDescriptor,
  );
}

function snapshotDenseStableRecords(value: unknown): readonly unknown[] {
  if (!isArray(value)) {
    throw new Error("Invalid discovery collection.");
  }

  const lengthDescriptor = getOwnPropertyDescriptor(value, "length");
  if (
    lengthDescriptor === undefined ||
    lengthDescriptor.configurable !== false ||
    lengthDescriptor.enumerable !== false ||
    !hasOwn(lengthDescriptor, "value") ||
    typeof lengthDescriptor.value !== "number" ||
    !isSafeInteger(lengthDescriptor.value) ||
    lengthDescriptor.value < 0 ||
    lengthDescriptor.value > MAX_DISCOVERY_RECORDS
  ) {
    throw new Error("Invalid discovery length descriptor.");
  }

  const initialLength = lengthDescriptor.value;
  const observedLength = value.length;
  if (
    typeof observedLength !== "number" ||
    !isSafeInteger(observedLength) ||
    observedLength < 0 ||
    observedLength > MAX_DISCOVERY_RECORDS ||
    observedLength !== initialLength
  ) {
    throw new Error("Invalid discovery length.");
  }

  const initialDescriptors: PropertyDescriptor[] = [];
  for (let index = 0; index < initialLength; index += 1) {
    const descriptor = getOwnPropertyDescriptor(value, index);
    if (descriptor === undefined) {
      throw new Error("Sparse discovery collection.");
    }
    initialDescriptors[index] = descriptor;
  }
  if (!hasStableArrayLength(value, lengthDescriptor, initialLength)) {
    throw new Error("Unstable discovery collection.");
  }

  const snapshot: unknown[] = [];
  for (let index = 0; index < initialLength; index += 1) {
    if (
      !hasStableArrayLength(value, lengthDescriptor, initialLength) ||
      !samePropertyDescriptor(
        getOwnPropertyDescriptor(value, index),
        initialDescriptors[index],
      )
    ) {
      throw new Error("Unstable discovery collection.");
    }

    snapshot[index] = value[index];

    if (
      !hasStableArrayLength(value, lengthDescriptor, initialLength) ||
      !samePropertyDescriptor(
        getOwnPropertyDescriptor(value, index),
        initialDescriptors[index],
      )
    ) {
      throw new Error("Unstable discovery collection.");
    }
  }

  if (!hasStableArrayLength(value, lengthDescriptor, initialLength)) {
    throw new Error("Unstable discovery collection.");
  }
  for (let index = 0; index < initialLength; index += 1) {
    if (
      !samePropertyDescriptor(
        getOwnPropertyDescriptor(value, index),
        initialDescriptors[index],
      )
    ) {
      throw new Error("Unstable discovery collection.");
    }
  }

  return snapshot;
}

function hasStableArrayLength(
  value: readonly unknown[],
  initialDescriptor: PropertyDescriptor,
  initialLength: number,
): boolean {
  return (
    samePropertyDescriptor(
      getOwnPropertyDescriptor(value, "length"),
      initialDescriptor,
    ) && value.length === initialLength
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

function isCanonicalCardId(cardId: CardId): boolean {
  const catalog = CURRENT_READING_CONTENT_BUNDLE.cardCatalog;
  const catalogLength = catalog.length;
  for (let index = 0; index < catalogLength; index += 1) {
    if (catalog[index]!.id === cardId) return true;
  }
  return false;
}

function copyDiscoveryRecords(
  records: readonly DiscoveryRecord[],
  candidate?: DiscoveryRecord,
): readonly DiscoveryRecord[] {
  const copied: DiscoveryRecord[] = [];
  const recordCount = records.length;
  for (let index = 0; index < recordCount; index += 1) {
    copied[index] = records[index]!;
  }
  if (candidate !== undefined) copied[recordCount] = candidate;
  return copied;
}
