import { describe, expect, it } from "vitest";
import {
  AnimationManifestRefSchema,
  DeckManifestRefSchema,
  ThemeManifestRefSchema,
} from "../src/index.js";

describe("manifest references", () => {
  it("accepts stable id and version pairs", () => {
    expect(
      ThemeManifestRefSchema.parse({
        themeId: "moonlight-healing",
        version: "1.0.0",
      }),
    ).toEqual({ themeId: "moonlight-healing", version: "1.0.0" });
  });

  it("rejects resource paths and unknown fields", () => {
    expect(() =>
      DeckManifestRefSchema.parse({
        deckId: "neutral",
        version: "1.0.0",
        path: "resources/cards",
      }),
    ).toThrow();
    expect(() =>
      AnimationManifestRefSchema.parse({ animationId: "flip", version: "" }),
    ).toThrow();
  });
});
