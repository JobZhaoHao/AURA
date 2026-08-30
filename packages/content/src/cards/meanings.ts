import type { CardId, QuestionCategory } from "@aura/contracts";
import { ALL_CARD_IDS } from "./catalog.js";
import { CUPS_MEANINGS } from "./meanings.cups.js";
import { MAJOR_MEANINGS } from "./meanings.major.js";
import { PENTACLES_MEANINGS } from "./meanings.pentacles.js";
import { SWORDS_MEANINGS } from "./meanings.swords.js";
import { WANDS_MEANINGS } from "./meanings.wands.js";

export interface CategoryMeaning {
  readonly interpretation: string;
  readonly advice: string;
}

export interface OrientedMeaning {
  readonly keywords: readonly [string, string, string, ...string[]];
  readonly core: string;
  readonly categories: Readonly<Record<QuestionCategory, CategoryMeaning>>;
}

export interface CardMeaningRecord {
  readonly cardId: CardId;
  readonly upright: OrientedMeaning;
  readonly reversed: OrientedMeaning;
  readonly safetyNote: string;
}

const records = [
  ...MAJOR_MEANINGS,
  ...WANDS_MEANINGS,
  ...CUPS_MEANINGS,
  ...SWORDS_MEANINGS,
  ...PENTACLES_MEANINGS,
] as readonly CardMeaningRecord[];

export const CARD_MEANINGS = Object.fromEntries(
  records.map((record) => [record.cardId, record]),
) as Readonly<Record<CardId, CardMeaningRecord>>;

export function getCardMeaningRecord(cardId: CardId): CardMeaningRecord {
  const record = CARD_MEANINGS[cardId];
  if (!record || !ALL_CARD_IDS.includes(cardId)) {
    throw new RangeError(`Missing meaning for card id: ${cardId}`);
  }
  return record;
}
