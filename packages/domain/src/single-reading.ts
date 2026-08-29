import type { ReadingResult, ReadingSession } from "@aura/contracts";
import { ReadingResultSchema } from "@aura/contracts";
import { CURRENT_READING_CONTENT_BUNDLE } from "@aura/content";
import { DomainError } from "./errors.js";
import { composeSingleNarrative } from "./narrative.js";
import { drawSingleCard, type SingleCardDraw } from "./single-card-draw.js";
import {
  assertParsedSingleReadingInput,
  type SingleReadingInput,
} from "./single-reading-input.js";
import type { CompleteReadingNarrative } from "./narrative.js";

export type SingleCardReadingResult = Omit<
  ReadingResult,
  "session" | "narrative"
> & {
  readonly session: Omit<ReadingSession, "mode" | "draws"> & {
    readonly mode: "single";
    readonly draws: readonly [SingleCardDraw];
  };
  readonly narrative: CompleteReadingNarrative;
};

export function createSingleReading(
  input: SingleReadingInput,
): SingleCardReadingResult {
  const parsedInput = assertParsedSingleReadingInput(input);

  const bundle = CURRENT_READING_CONTENT_BUNDLE;
  const draw = drawSingleCard(
    parsedInput.seed,
    parsedInput.reversalsEnabled,
    bundle,
  );
  const result: SingleCardReadingResult = {
    session: {
      sessionId: parsedInput.sessionId,
      mode: "single",
      questionCategory: parsedInput.questionCategory,
      safetyDisposition: parsedInput.safetyDisposition,
      rulesVersion: bundle.rulesVersion,
      contentVersion: bundle.contentVersion,
      createdAt: parsedInput.createdAt,
      draws: [draw],
    },
    narrative: composeSingleNarrative(
      draw,
      parsedInput.questionCategory,
      parsedInput.safetyDisposition,
    ),
    textVersion: bundle.textVersion,
  };

  try {
    ReadingResultSchema.parse(result);
  } catch {
    throw new DomainError("INVALID_READING_INPUT", "input");
  }
  return result;
}

export function assertSingleCardReadingResult(
  value: unknown,
): asserts value is SingleCardReadingResult {
  let resolvingCardContent = false;
  try {
    const result = ReadingResultSchema.parse(value);
    const bundle = CURRENT_READING_CONTENT_BUNDLE;
    const draw = result.session.draws[0];

    if (
      result.session.rulesVersion !== bundle.rulesVersion ||
      result.session.contentVersion !== bundle.contentVersion ||
      result.textVersion !== bundle.textVersion ||
      result.session.mode !== "single" ||
      result.session.draws.length !== 1 ||
      !draw ||
      draw.position !== "single"
    ) {
      throw new Error("Invalid single reading result.");
    }

    const singleDraw: SingleCardDraw = {
      cardId: draw.cardId,
      orientation: draw.orientation,
      position: "single",
    };
    resolvingCardContent = true;
    const expectedNarrative = composeSingleNarrative(
      singleDraw,
      result.session.questionCategory,
      result.session.safetyDisposition,
    );
    resolvingCardContent = false;
    if (
      result.narrative.summary !== expectedNarrative.summary ||
      result.narrative.interpretation !== expectedNarrative.interpretation ||
      result.narrative.advice !== expectedNarrative.advice ||
      result.narrative.safetyNotice !== expectedNarrative.safetyNotice
    ) {
      throw new Error("Invalid single reading narrative.");
    }
  } catch {
    if (resolvingCardContent) {
      throw new DomainError("UNKNOWN_CARD_CONTENT", "cardId");
    }
    throw new DomainError("INVALID_HISTORY_ENTRY", "result");
  }
}
