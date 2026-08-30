import { describe, expect, it } from "vitest";
import { ReadingSessionSchema } from "@aura/contracts";
import { ALL_CARD_IDS } from "@aura/content";
import {
  ALTERNATE_MANIFEST_FIXTURE,
  FIXED_DAILY_INPUT,
  FIXED_READING_INPUT,
  VALID_MANIFEST_FIXTURE,
} from "@aura/test-kits";

describe("shared deterministic fixtures", () => {
  it("uses canonical package data and stable inputs", () => {
    expect(ALL_CARD_IDS).toHaveLength(78);
    expect(FIXED_READING_INPUT).toEqual({
      seed: "aura-m1-fixed-seed",
      sessionId: "fixture-session-001",
      questionCategory: "general",
      safetyDisposition: "standard",
      createdAt: "2026-08-28T00:00:00.000Z",
    });
    expect(FIXED_DAILY_INPUT).toEqual({
      installationId: "fixture-installation",
      localDate: "2026-08-28",
      mode: "daily",
      rulesVersion: "m1-rules-v1",
    });
    expect(VALID_MANIFEST_FIXTURE.deck.cardFaceAssetKeys).toHaveProperty(
      "major.fool",
    );
    expect(ALTERNATE_MANIFEST_FIXTURE.deck).toBe(VALID_MANIFEST_FIXTURE.deck);
    expect(ALTERNATE_MANIFEST_FIXTURE.theme).not.toBe(
      VALID_MANIFEST_FIXTURE.theme,
    );
  });

  it("can seed a valid single-card session without duplicating schemas", () => {
    const { seed, ...sessionInput } = FIXED_READING_INPUT;

    expect(seed).toBe("aura-m1-fixed-seed");
    expect(
      ReadingSessionSchema.safeParse({
        ...sessionInput,
        mode: "single",
        rulesVersion: "m1-rules-v1",
        contentVersion: "m1-content-v1",
        draws: [
          { cardId: "major.fool", orientation: "upright", position: "single" },
        ],
      }).success,
    ).toBe(true);
  });
});
