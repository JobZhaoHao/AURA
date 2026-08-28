import type { CardId } from "@aura/contracts";
import { ALL_CARD_IDS } from "../cards/catalog.js";
import type { DeckDescriptor } from "./types.js";

const cardFaceAssetKeys = Object.fromEntries(
  ALL_CARD_IDS.map((cardId) => [cardId, `deck.neutral.face.${cardId}`]),
) as Readonly<Record<CardId, string>>;

export const NEUTRAL_DECK: DeckDescriptor = {
  ref: { deckId: "neutral", version: "1.0.0" },
  cardFaceAssetKeys,
  cardBackAssetKey: "deck.neutral.back",
  sleeveAssetKey: "deck.neutral.sleeve",
};
