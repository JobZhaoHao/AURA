import { describe, expect, it } from "vitest";
import { SafetyDispositionSchema } from "../src/index.js";

describe("SafetyDispositionSchema", () => {
  it("accepts only stable, persistable dispositions", () => {
    expect(SafetyDispositionSchema.options).toEqual(["standard", "high-risk"]);
    expect(() => SafetyDispositionSchema.parse("medical")).toThrow();
  });
});
