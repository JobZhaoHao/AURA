import { describe, expect, it } from "vitest";
import {
  CardIdSchema,
  OrientationSchema,
  QuestionCategorySchema,
  ReadingModeSchema,
  SpreadPositionSchema,
} from "../src/index.js";

describe("gameplay primitive schemas", () => {
  it("accepts canonical card id shapes", () => {
    expect(CardIdSchema.parse("major.fool")).toBe("major.fool");
    expect(CardIdSchema.parse("minor.cups.queen")).toBe("minor.cups.queen");
  });

  it.each(["major", "major.Fool", "minor.cups", "minor.stars.ace"])(
    "rejects malformed card id %s",
    (value) => expect(() => CardIdSchema.parse(value)).toThrow(),
  );

  it("freezes the approved gameplay enums", () => {
    expect(OrientationSchema.options).toEqual(["upright", "reversed"]);
    expect(QuestionCategorySchema.options).toEqual([
      "general",
      "relationships",
      "career-study",
      "self-growth",
    ]);
    expect(ReadingModeSchema.options).toEqual([
      "daily",
      "single",
      "three-card",
    ]);
    expect(SpreadPositionSchema.options).toEqual([
      "daily",
      "single",
      "past",
      "present",
      "trend",
    ]);
  });
});
