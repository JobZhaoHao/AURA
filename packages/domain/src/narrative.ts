import type {
  QuestionCategory,
  ReadingNarrative,
  SafetyDisposition,
} from "@aura/contracts";
import { CURRENT_READING_CONTENT_BUNDLE } from "@aura/content";
import { DomainError } from "./errors.js";
import { getCurrentCardMeaningRecord } from "./reading-content.js";
import type { SingleCardDraw } from "./single-card-draw.js";

export type CompleteReadingNarrative = Omit<
  ReadingNarrative,
  "safetyNotice"
> & { readonly safetyNotice: string };

export function composeSingleNarrative(
  draw: SingleCardDraw,
  questionCategory: QuestionCategory,
  safetyDisposition: SafetyDisposition,
): CompleteReadingNarrative {
  try {
    const record = getCurrentCardMeaningRecord(draw.cardId);
    const oriented = record[draw.orientation];
    const category = oriented?.categories[questionCategory];
    if (!oriented || !category) {
      throw new Error("Missing narrative content.");
    }

    return {
      summary: oriented.core,
      interpretation: category.interpretation,
      advice: category.advice,
      safetyNotice:
        safetyDisposition === "high-risk"
          ? `${CURRENT_READING_CONTENT_BUNDLE.highRiskSafetyTemplate}\n\n${record.safetyNote}`
          : record.safetyNote,
    };
  } catch {
    throw new DomainError("UNKNOWN_CARD_CONTENT", "cardId");
  }
}
