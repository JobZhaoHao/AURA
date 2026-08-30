import type { ReadingDraw } from "@aura/contracts";
import type { ReadingContentBundle } from "@aura/content";
import { sampleRandomDomain } from "./deterministic-random.js";
import { DomainError } from "./errors.js";

export type SingleCardDraw = Omit<ReadingDraw, "position"> & {
  readonly position: "single";
};

export function drawSingleCard(
  seed: string,
  reversalsEnabled: boolean,
  bundle: ReadingContentBundle,
): SingleCardDraw {
  const cardStep = sampleRandomDomain(seed, "card");
  const cardIndex = Math.floor(cardStep.value * bundle.cardCatalog.length);
  const card = bundle.cardCatalog[cardIndex];
  if (!card) throw new DomainError("UNKNOWN_CARD_CONTENT", "cardId");

  const orientation =
    reversalsEnabled && sampleRandomDomain(seed, "orientation").value >= 0.5
      ? "reversed"
      : "upright";

  return {
    cardId: card.id,
    orientation,
    position: "single",
  };
}
