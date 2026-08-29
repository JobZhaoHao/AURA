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
  try {
    if (!isExactInputObject(value)) {
      throw new DomainError("INVALID_READING_INPUT", "input");
    }

    const fields = validateSingleReadingInputFields(value);
    const parsed = { ...fields } as SingleReadingInput;
    Object.defineProperty(parsed, parsedSingleReadingInput, {
      value: true,
      enumerable: false,
    });
    return Object.freeze(parsed);
  } catch (error) {
    if (error instanceof DomainError) throw error;
    throw new DomainError("INVALID_READING_INPUT", "input");
  }
}

function assertParsedSingleReadingInput(
  value: unknown,
): asserts value is SingleReadingInput {
  if (!isExactInputObject(value, true) || !Object.isFrozen(value)) {
    throw new DomainError("INVALID_READING_INPUT", "input");
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
    throw new DomainError("INVALID_READING_INPUT", "input");
  }

  validateSingleReadingInputFields(value);
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

  const keys = Object.keys(value);
  return (
    keys.length === SINGLE_READING_INPUT_KEYS.length &&
    keys.every((key) =>
      (SINGLE_READING_INPUT_KEYS as readonly string[]).includes(key),
    )
  );
}

function validateSingleReadingInputFields(
  value: Record<(typeof SINGLE_READING_INPUT_KEYS)[number], unknown>,
): SingleReadingInputFields {
  const seed = parseOpaqueField(value.seed, "seed");
  const sessionId = parseOpaqueField(value.sessionId, "sessionId");
  parseSchemaField(
    sessionId,
    ReadingSessionSchema.shape.sessionId,
    "sessionId",
  );
  const questionCategory = parseSchemaField(
    value.questionCategory,
    QuestionCategorySchema,
    "questionCategory",
  );
  const safetyDisposition = parseSchemaField(
    value.safetyDisposition,
    SafetyDispositionSchema,
    "safetyDisposition",
  );
  if (typeof value.reversalsEnabled !== "boolean") {
    throw new DomainError("INVALID_READING_INPUT", "reversalsEnabled");
  }
  const createdAt = parseSchemaField(
    value.createdAt,
    ReadingSessionSchema.shape.createdAt,
    "createdAt",
  );

  return {
    seed,
    sessionId,
    questionCategory,
    safetyDisposition,
    reversalsEnabled: value.reversalsEnabled,
    createdAt,
  };
}

function parseOpaqueField(value: unknown, field: DomainErrorField): string {
  if (typeof value !== "string" || !OPAQUE_INPUT_PATTERN.test(value)) {
    throw new DomainError("INVALID_READING_INPUT", field);
  }
  return value;
}

function parseSchemaField<T>(
  value: unknown,
  schema: { parse(value: unknown): T },
  field: DomainErrorField,
): T {
  try {
    return schema.parse(value);
  } catch {
    throw new DomainError("INVALID_READING_INPUT", field);
  }
}
