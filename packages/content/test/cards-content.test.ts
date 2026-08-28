import { describe, expect, it } from "vitest";
import { CardIdSchema, type CardId } from "@aura/contracts";
import {
  ALL_CARD_IDS,
  CARD_CATALOG,
  CUPS_MEANINGS,
  getCardMetadata,
  MAJOR_MEANINGS,
  SWORDS_MEANINGS,
  WANDS_MEANINGS,
} from "../src/index.js";
import { expectCompleteMeaningRecords } from "./meaning-assertions.js";

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

describe("major arcana meanings", () => {
  it("provides complete literal records for all 22 major arcana", () => {
    const expectedIds = CARD_CATALOG.filter(
      ({ arcana }) => arcana === "major",
    ).map(({ id }) => id);
    expectCompleteMeaningRecords(MAJOR_MEANINGS, expectedIds);
  });
});

describe("minor arcana meanings", () => {
  it("provides complete literal records for all 14 Wands cards", () => {
    const expectedIds = CARD_CATALOG.filter(({ suit }) => suit === "wands").map(
      ({ id }) => id,
    );
    expectCompleteMeaningRecords(WANDS_MEANINGS, expectedIds);
  });

  it("provides complete literal records for all 14 Cups cards", () => {
    const expectedIds = CARD_CATALOG.filter(({ suit }) => suit === "cups").map(
      ({ id }) => id,
    );
    expectCompleteMeaningRecords(CUPS_MEANINGS, expectedIds);
  });

  it("provides complete literal records for all 14 Swords cards", () => {
    const expectedIds = CARD_CATALOG.filter(
      ({ suit }) => suit === "swords",
    ).map(({ id }) => id);
    expectCompleteMeaningRecords(SWORDS_MEANINGS, expectedIds);
  });
});
