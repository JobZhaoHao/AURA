import { describe, expect, it } from "vitest";
import { CardIdSchema, type CardId } from "@aura/contracts";
import { ALL_CARD_IDS, CARD_CATALOG, getCardMetadata } from "../src/index.js";

describe("canonical tarot catalog", () => {
  it("contains exactly 78 unique stable ids", () => {
    expect(ALL_CARD_IDS).toHaveLength(78);
    expect(new Set(ALL_CARD_IDS).size).toBe(78);
    expect(ALL_CARD_IDS.every((id) => CardIdSchema.safeParse(id).success)).toBe(
      true,
    );
  });

  it("contains 22 major and 56 minor arcana", () => {
    expect(CARD_CATALOG.filter((card) => card.arcana === "major")).toHaveLength(
      22,
    );
    expect(CARD_CATALOG.filter((card) => card.arcana === "minor")).toHaveLength(
      56,
    );
  });

  it.each(["wands", "cups", "swords", "pentacles"] as const)(
    "contains 14 %s cards",
    (suit) =>
      expect(CARD_CATALOG.filter((card) => card.suit === suit)).toHaveLength(
        14,
      ),
  );

  it("returns accurate metadata for major and minor cards", () => {
    expect(getCardMetadata("major.fool" as CardId)).toEqual({
      id: "major.fool",
      arcana: "major",
      nameZh: "愚人",
    });
    expect(getCardMetadata("minor.wands.ace" as CardId)).toEqual({
      id: "minor.wands.ace",
      arcana: "minor",
      nameZh: "权杖王牌",
      suit: "wands",
      rank: "ace",
    });
  });

  it("rejects a schema-valid card id that is not cataloged", () => {
    const unknownCardId = "major.not-in-catalog" as CardId;

    expect(() => getCardMetadata(unknownCardId)).toThrow(RangeError);
  });
});
