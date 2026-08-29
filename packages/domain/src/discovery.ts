import {
  CardIdSchema,
  DiscoveryRecordSchema,
  type CardId,
  type DiscoveryRecord,
} from "@aura/contracts";
import { CURRENT_READING_CONTENT_BUNDLE } from "@aura/content";
import { DomainError, type DomainErrorField } from "./errors.js";

export function recordCardDiscovery(
  records: readonly DiscoveryRecord[],
  cardId: CardId,
  revealedAt: string,
): readonly DiscoveryRecord[] {
  let safeField: DomainErrorField = "discovery";

  try {
    const parsedRecords: DiscoveryRecord[] = [];
    for (const record of records) {
      parsedRecords.push(DiscoveryRecordSchema.parse(record));
    }

    const canonicalCardIds = new Set(
      CURRENT_READING_CONTENT_BUNDLE.cardCatalog.map(({ id }) => id),
    );
    const existingCardIds = new Set<CardId>();
    for (const record of parsedRecords) {
      if (!canonicalCardIds.has(record.cardId)) {
        throw new Error("Unknown existing card ID.");
      }
      if (existingCardIds.has(record.cardId)) {
        throw new Error("Duplicate existing card ID.");
      }
      existingCardIds.add(record.cardId);
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
    if (!canonicalCardIds.has(candidate.cardId)) {
      throw new Error("Unknown card ID.");
    }

    return existingCardIds.has(candidate.cardId)
      ? records
      : [...records, candidate];
  } catch {
    throw new DomainError("INVALID_DISCOVERY_STATE", safeField);
  }
}
