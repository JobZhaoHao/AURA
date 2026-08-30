import type { CardId } from "@aura/contracts";
import {
  CURRENT_READING_CONTENT_BUNDLE,
  type CardMeaningRecord,
} from "@aura/content";
import { DomainError } from "./errors.js";

export function getCurrentCardMeaningRecord(cardId: CardId): CardMeaningRecord {
  try {
    const bundle = CURRENT_READING_CONTENT_BUNDLE;
    if (!bundle.cardCatalog.some((card) => card.id === cardId)) {
      throw new Error("Unknown card content.");
    }

    const record = bundle.cardMeanings[cardId];
    if (!record || record.cardId !== cardId) {
      throw new Error("Missing card content.");
    }
    return record;
  } catch {
    throw new DomainError("UNKNOWN_CARD_CONTENT", "cardId");
  }
}
