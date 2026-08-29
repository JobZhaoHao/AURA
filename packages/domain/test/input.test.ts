import { describe, expect, it } from "vitest";
import { DomainError } from "../src/errors.js";
import { parseSingleReadingInput } from "../src/single-reading-input.js";
import { expectSafeDomainError } from "./helpers.js";

const validInput = {
  seed: "aura-m1-fixed-seed",
  sessionId: "fixture-session-001",
  questionCategory: "general",
  safetyDisposition: "standard",
  reversalsEnabled: true,
  createdAt: "2026-08-28T00:00:00.000Z",
} as const;

describe("parseSingleReadingInput", () => {
  it("returns a frozen owned input with only public fields", () => {
    const parsed = parseSingleReadingInput(validInput);

    expect(parsed).toEqual(validInput);
    expect(parsed).not.toBe(validInput);
    expect(Object.isFrozen(parsed)).toBe(true);
    expect(Object.keys(parsed)).toEqual([
      "seed",
      "sessionId",
      "questionCategory",
      "safetyDisposition",
      "reversalsEnabled",
      "createdAt",
    ]);
    expect(JSON.stringify(parsed)).toBe(JSON.stringify(validInput));
  });

  it.each([
    { ...validInput, rawQuestion: "PRIVATE_QUESTION_SENTINEL" },
    { ...validInput, questionText: "PRIVATE_QUESTION_SENTINEL" },
    { ...validInput, rulesVersion: "m1-rules-v1" },
    { ...validInput, themeId: "moonlight-healing" },
    { ...validInput, seed: "short" },
    { ...validInput, seed: "含中文的种子不允许000000" },
    { ...validInput, sessionId: "https://example.test/private" },
  ])("rejects strict or non-opaque input %#", (candidate) => {
    expect(() => parseSingleReadingInput(candidate)).toThrow(DomainError);
  });

  it.each([
    "seed",
    "sessionId",
    "questionCategory",
    "safetyDisposition",
    "reversalsEnabled",
    "createdAt",
  ])("rejects a missing %s field", (field) => {
    const candidate = Object.fromEntries(
      Object.entries(validInput).filter(([key]) => key !== field),
    );

    expect(() => parseSingleReadingInput(candidate)).toThrow(DomainError);
  });

  it.each([
    [15, false],
    [16, true],
    [128, true],
    [129, false],
  ])("enforces the opaque seed length boundary at %i", (length, accepts) => {
    const candidate = { ...validInput, seed: "a".repeat(length) };

    if (accepts) {
      expect(() => parseSingleReadingInput(candidate)).not.toThrow();
    } else {
      expect(() => parseSingleReadingInput(candidate)).toThrow(DomainError);
    }
  });

  it("rejects caller-supplied symbols", () => {
    const candidate = {
      ...validInput,
      [Symbol("PRIVATE_SYMBOL_SENTINEL")]: "PRIVATE_SYMBOL_SENTINEL",
    };

    expect(() => parseSingleReadingInput(candidate)).toThrow(DomainError);
  });

  it("sanitizes DomainError instances thrown by hostile input accessors", () => {
    const sentinel = "PRIVATE_ACCESSOR_SENTINEL";
    const hostile = new Proxy(
      { ...validInput },
      {
        get(target, property, receiver) {
          if (property === "seed") {
            const error = new DomainError("UNKNOWN_CARD_CONTENT", "cardId");
            error.message = sentinel;
            Object.assign(error, { cause: sentinel });
            throw error;
          }
          return Reflect.get(target, property, receiver);
        },
      },
    );

    try {
      parseSingleReadingInput(hostile);
      throw new Error("Expected hostile input to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect(String(error)).toBe("DomainError: The reading input is invalid.");
      expect(Object.keys(error)).toEqual(["code", "field"]);
      expect(JSON.stringify(error)).toBe(
        JSON.stringify({ code: "INVALID_READING_INPUT", field: "input" }),
      );
      expect("cause" in (error as DomainError)).toBe(false);
      expect(JSON.stringify(error)).not.toContain(sentinel);
      expect(String(error)).not.toContain(sentinel);
    }
  });

  it("rejects non-enumerable unknown input keys", () => {
    const candidate = { ...validInput };
    Object.defineProperty(candidate, "rawQuestion", {
      value: "PRIVATE_QUESTION_SENTINEL",
      enumerable: false,
    });

    expect(() => parseSingleReadingInput(candidate)).toThrow(DomainError);
  });

  it("rejects required values inherited from a prototype", () => {
    const candidate = Object.create(validInput) as Record<string, unknown>;

    expect(() => parseSingleReadingInput(candidate)).toThrow(DomainError);
  });

  it("redacts invalid input details from its error envelope", () => {
    const sentinel = "PRIVATE_QUESTION_SENTINEL";

    try {
      parseSingleReadingInput({ ...validInput, rawQuestion: sentinel });
      throw new Error("Expected invalid input to throw.");
    } catch (error) {
      expectSafeDomainError(error, "INVALID_READING_INPUT", "input", [
        sentinel,
      ]);
    }
  });
});
