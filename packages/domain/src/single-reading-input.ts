import {
  QuestionCategorySchema,
  ReadingSessionSchema,
  SafetyDispositionSchema,
  type QuestionCategory,
  type SafetyDisposition,
} from "@aura/contracts";
import { DomainError, type DomainErrorField } from "./errors.js";

const parsedSingleReadingInput: unique symbol = Symbol(
  "ParsedSingleReadingInput",
);
type ParsedSingleReadingInputBrand = {
  readonly [parsedSingleReadingInput]: true;
};

const SINGLE_READING_INPUT_KEYS = [
  "seed",
  "sessionId",
  "questionCategory",
  "safetyDisposition",
  "reversalsEnabled",
  "createdAt",
] as const;
const OPAQUE_INPUT_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

type SingleReadingInputFields = {
  seed: string;
  sessionId: string;
  questionCategory: QuestionCategory;
  safetyDisposition: SafetyDisposition;
  reversalsEnabled: boolean;
  createdAt: string;
};

export type SingleReadingInput = Readonly<{
  seed: string;
  sessionId: string;
  questionCategory: QuestionCategory;
  safetyDisposition: SafetyDisposition;
  reversalsEnabled: boolean;
  createdAt: string;
}> &
  ParsedSingleReadingInputBrand;

export function parseSingleReadingInput(value: unknown): SingleReadingInput {
  let safeField: DomainErrorField = "input";
  try {
    if (!isExactInputObject(value)) {
      throw new Error("Invalid reading input shape.");
    }

    const fields = validateSingleReadingInputFields(value, (field) => {
      safeField = field;
    });
    const parsed = { ...fields } as SingleReadingInput;
    Object.defineProperty(parsed, parsedSingleReadingInput, {
      value: true,
      enumerable: false,
    });
    return Object.freeze(parsed);
  } catch {
    throw new DomainError("INVALID_READING_INPUT", safeField);
  }
}

function assertParsedSingleReadingInput(
  value: unknown,
): asserts value is SingleReadingInput {
  let safeField: DomainErrorField = "input";
  try {
    if (!isExactInputObject(value, true) || !Object.isFrozen(value)) {
      throw new Error("Invalid reading input shape.");
    }

    const symbols = Object.getOwnPropertySymbols(value);
    const brand = Object.getOwnPropertyDescriptor(
      value,
      parsedSingleReadingInput,
    );
    if (
      symbols.length !== 1 ||
      symbols[0] !== parsedSingleReadingInput ||
      brand?.value !== true ||
      brand.enumerable ||
      brand.configurable ||
      brand.writable
    ) {
      throw new Error("Invalid reading input brand.");
    }

    validateSingleReadingInputFields(value, (field) => {
      safeField = field;
    });
  } catch {
    throw new DomainError("INVALID_READING_INPUT", safeField);
  }
}

function isExactInputObject(
  value: unknown,
  allowParsedBrand = false,
): value is Record<(typeof SINGLE_READING_INPUT_KEYS)[number], unknown> {
  if (value === null || typeof value !== "object") return false;
  const symbols = Object.getOwnPropertySymbols(value);
  if (
    symbols.length !== 0 &&
    (!allowParsedBrand ||
      symbols.length !== 1 ||
      symbols[0] !== parsedSingleReadingInput)
  ) {
    return false;
  }

  const keys = Object.getOwnPropertyNames(value);
  return (
    keys.length === SINGLE_READING_INPUT_KEYS.length &&
    keys.every((key) =>
      (SINGLE_READING_INPUT_KEYS as readonly string[]).includes(key),
    )
  );
}

function validateSingleReadingInputFields(
  value: Record<(typeof SINGLE_READING_INPUT_KEYS)[number], unknown>,
  setSafeField: (field: DomainErrorField) => void,
): SingleReadingInputFields {
  setSafeField("input");
  const seedValue = value.seed;
  setSafeField("seed");
  const seed = parseOpaqueField(seedValue);
  setSafeField("input");
  const sessionIdValue = value.sessionId;
  setSafeField("sessionId");
  const sessionId = parseOpaqueField(sessionIdValue);
  ReadingSessionSchema.shape.sessionId.parse(sessionId);
  setSafeField("input");
  const questionCategoryValue = value.questionCategory;
  setSafeField("questionCategory");
  const questionCategory = QuestionCategorySchema.parse(questionCategoryValue);
  setSafeField("input");
  const safetyDispositionValue = value.safetyDisposition;
  setSafeField("safetyDisposition");
  const safetyDisposition = SafetyDispositionSchema.parse(
    safetyDispositionValue,
  );
  setSafeField("input");
  const reversalsEnabled = value.reversalsEnabled;
  setSafeField("reversalsEnabled");
  if (typeof reversalsEnabled !== "boolean") {
    throw new Error("Invalid reversals setting.");
  }
  setSafeField("input");
  const createdAtValue = value.createdAt;
  setSafeField("createdAt");
  const createdAt = ReadingSessionSchema.shape.createdAt.parse(createdAtValue);

  return {
    seed,
    sessionId,
    questionCategory,
    safetyDisposition,
    reversalsEnabled,
    createdAt,
  };
}

function parseOpaqueField(value: unknown): string {
  if (typeof value !== "string" || !OPAQUE_INPUT_PATTERN.test(value)) {
    throw new Error("Invalid opaque input.");
  }
  return value;
}
