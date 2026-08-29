import type { CardId, ManifestVersion } from "@aura/contracts";
import { CARD_CATALOG, type CardMetadata } from "./cards/catalog.js";
import {
  CARD_MEANINGS,
  type CardMeaningRecord,
  type CategoryMeaning,
  type OrientedMeaning,
} from "./cards/meanings.js";
import { HIGH_RISK_SAFETY_TEMPLATE } from "./safety.js";
import { CONTENT_VERSION, RULES_VERSION, TEXT_VERSION } from "./versions.js";

export interface ReadingContentBundle {
  readonly rulesVersion: ManifestVersion;
  readonly contentVersion: ManifestVersion;
  readonly textVersion: ManifestVersion;
  readonly cardCatalog: readonly CardMetadata[];
  readonly cardMeanings: Readonly<Record<CardId, CardMeaningRecord>>;
  readonly highRiskSafetyTemplate: string;
}

function copyCardMetadata(card: CardMetadata): CardMetadata {
  return card.arcana === "major"
    ? Object.freeze({
        id: card.id,
        arcana: card.arcana,
        nameZh: card.nameZh,
        ordinal: card.ordinal,
      })
    : Object.freeze({
        id: card.id,
        arcana: card.arcana,
        nameZh: card.nameZh,
        suit: card.suit,
        rank: card.rank,
      });
}

function copyCategoryMeaning(value: CategoryMeaning): CategoryMeaning {
  return Object.freeze({
    interpretation: value.interpretation,
    advice: value.advice,
  });
}

function copyOrientedMeaning(value: OrientedMeaning): OrientedMeaning {
  const keywords = Object.freeze([
    value.keywords[0],
    value.keywords[1],
    value.keywords[2],
    ...value.keywords.slice(3),
  ]) as OrientedMeaning["keywords"];
  const categories = Object.freeze({
    general: copyCategoryMeaning(value.categories.general),
    relationships: copyCategoryMeaning(value.categories.relationships),
    "career-study": copyCategoryMeaning(value.categories["career-study"]),
    "self-growth": copyCategoryMeaning(value.categories["self-growth"]),
  });
  return Object.freeze({
    keywords,
    core: value.core,
    categories,
  });
}

function copyCardMeaningRecord(value: CardMeaningRecord): CardMeaningRecord {
  return Object.freeze({
    cardId: value.cardId,
    upright: copyOrientedMeaning(value.upright),
    reversed: copyOrientedMeaning(value.reversed),
    safetyNote: value.safetyNote,
  });
}

const cardCatalogCopies: CardMetadata[] = [];
for (let index = 0; index < CARD_CATALOG.length; index += 1) {
  cardCatalogCopies[index] = copyCardMetadata(CARD_CATALOG[index]!);
}
const frozenCardCatalog = Object.freeze(cardCatalogCopies);

const cardMeaningCopies = {} as Record<CardId, CardMeaningRecord>;
for (let index = 0; index < frozenCardCatalog.length; index += 1) {
  const cardId = frozenCardCatalog[index]!.id;
  cardMeaningCopies[cardId] = copyCardMeaningRecord(CARD_MEANINGS[cardId]!);
}
const frozenCardMeanings = Object.freeze(cardMeaningCopies);

export const CURRENT_READING_CONTENT_BUNDLE = Object.freeze({
  rulesVersion: RULES_VERSION,
  contentVersion: CONTENT_VERSION,
  textVersion: TEXT_VERSION,
  cardCatalog: frozenCardCatalog,
  cardMeanings: frozenCardMeanings,
  highRiskSafetyTemplate: HIGH_RISK_SAFETY_TEMPLATE,
}) satisfies ReadingContentBundle;
