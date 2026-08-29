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
    const canonicalCardIds = new Set(
      CURRENT_READING_CONTENT_BUNDLE.cardCatalog.map(({ id }) => id),
    );
    if (!canonicalCardIds.has(candidate.cardId)) {
      throw new Error("Unknown card ID.");
    }

    safeField = "discovery";
    let alreadyDiscovered = false;
    const existingCardIds = new Set<CardId>();
    for (const record of records) {
      const parsed = DiscoveryRecordSchema.parse(record);
      if (!canonicalCardIds.has(parsed.cardId)) {
        throw new Error("Unknown existing card ID.");
      }
      if (existingCardIds.has(parsed.cardId)) {
        throw new Error("Duplicate existing card ID.");
      }
      existingCardIds.add(parsed.cardId);
      if (parsed.cardId === candidate.cardId) alreadyDiscovered = true;
    }

    return alreadyDiscovered ? records : [...records, candidate];
  } catch {
    throw new DomainError("INVALID_DISCOVERY_STATE", safeField);
  }
}
