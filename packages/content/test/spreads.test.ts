import { describe, expect, it } from "vitest";
import {
  CONTENT_VERSION,
  RULES_VERSION,
  SPREAD_DEFINITIONS,
  TEXT_VERSION,
} from "../src/index.js";

describe("M1 content constants", () => {
  it("exports exactly the approved fixed spread definitions", () => {
    expect(SPREAD_DEFINITIONS).toEqual({
      single: { key: "single", positions: ["single"] },
      daily: { key: "daily", positions: ["daily"] },
      "past-present-trend": {
        key: "past-present-trend",
        positions: ["past", "present", "trend"],
      },
    });
  });

  it("publishes non-empty independent replay versions", () => {
    expect(RULES_VERSION).toBe("m1-rules-v1");
    expect(CONTENT_VERSION).toBe("m1-content-v1");
    expect(TEXT_VERSION).toBe("m1-text-v1");
    expect(new Set([RULES_VERSION, CONTENT_VERSION, TEXT_VERSION]).size).toBe(
      3,
    );
  });
});
