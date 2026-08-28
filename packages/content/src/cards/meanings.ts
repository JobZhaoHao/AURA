import type { CardId, QuestionCategory } from "@aura/contracts";

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
