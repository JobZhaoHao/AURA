import { describe, expect, it } from "vitest";
import { CardIdSchema, type CardId } from "@aura/contracts";
import {
  ALL_CARD_IDS,
  CARD_CATALOG,
  CARD_MEANINGS,
  CUPS_MEANINGS,
  CURRENT_READING_CONTENT_BUNDLE,
  getCardMeaningRecord,
  getCardMetadata,
  MAJOR_MEANINGS,
  PENTACLES_MEANINGS,
  SWORDS_MEANINGS,
  type CardMetadata,
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

  it("assigns canonical ordinals only to major arcana", () => {
    const majorCards = CARD_CATALOG.filter((card) => card.arcana === "major");
    const minorCards = CARD_CATALOG.filter((card) => card.arcana === "minor");

    expect(majorCards.map((card) => card.ordinal)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21,
    ]);

    for (const card of majorCards) {
      expect(card).not.toHaveProperty("suit");
      expect(card).not.toHaveProperty("rank");
    }

    for (const card of minorCards) {
      expect(card).toHaveProperty("suit");
      expect(card).toHaveProperty("rank");
      expect(card).not.toHaveProperty("ordinal");
    }
  });

  it("exposes arcana-discriminated metadata types", () => {
    const acceptsMetadata = (card: CardMetadata): CardMetadata => card;
    const validMajor = {
      id: "major.fool" as CardId,
      arcana: "major" as const,
      nameZh: "愚人",
      ordinal: 0,
    };
    const validMinor = {
      id: "minor.cups.ace" as CardId,
      arcana: "minor" as const,
      nameZh: "圣杯王牌",
      suit: "cups" as const,
      rank: "ace" as const,
    };
    const majorWithMinorFields = {
      ...validMajor,
      suit: "cups" as const,
      rank: "ace" as const,
    };
    const minorWithoutRank = {
      id: "minor.cups.ace" as CardId,
      arcana: "minor" as const,
      nameZh: "圣杯王牌",
      suit: "cups" as const,
    };
    const minorWithInvalidRank = { ...validMinor, rank: "princess" as const };
    const minorWithOrdinal = { ...validMinor, ordinal: 0 };

    acceptsMetadata(validMajor);
    acceptsMetadata(validMinor);
    // @ts-expect-error Major metadata cannot accept Minor suit/rank fields.
    acceptsMetadata(majorWithMinorFields);
    // @ts-expect-error Minor metadata requires a canonical rank.
    acceptsMetadata(minorWithoutRank);
    // @ts-expect-error Minor rank is restricted to the canonical rank union.
    acceptsMetadata(minorWithInvalidRank);
    // @ts-expect-error Minor metadata cannot accept a Major ordinal.
    acceptsMetadata(minorWithOrdinal);
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
      ordinal: 0,
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

  it("provides complete literal records for all 14 Pentacles cards", () => {
    const expectedIds = CARD_CATALOG.filter(
      ({ suit }) => suit === "pentacles",
    ).map(({ id }) => id);
    expectCompleteMeaningRecords(PENTACLES_MEANINGS, expectedIds);
  });
});

describe("complete tarot meaning lookup", () => {
  it("indexes exactly one complete meaning record for every canonical card", () => {
    const literalRecords = [
      ...MAJOR_MEANINGS,
      ...WANDS_MEANINGS,
      ...CUPS_MEANINGS,
      ...SWORDS_MEANINGS,
      ...PENTACLES_MEANINGS,
    ];
    const literalRecordIds = literalRecords.map(({ cardId }) => cardId);

    expect(literalRecords).toHaveLength(78);
    expect(literalRecordIds).toEqual(ALL_CARD_IDS);
    expect(new Set(literalRecordIds).size).toBe(78);
    expect(Object.keys(CARD_MEANINGS)).toEqual(ALL_CARD_IDS);
    expectCompleteMeaningRecords(
      ALL_CARD_IDS.map((cardId) => getCardMeaningRecord(cardId)),
      ALL_CARD_IDS,
    );
  });

  it("rejects an unknown runtime card id through the public lookup", () => {
    const unknownCardId = "major.not-in-catalog" as CardId;

    expect(() => getCardMeaningRecord(unknownCardId)).toThrow(RangeError);
  });

  it("deep-freezes catalog and meaning records in the trusted bundle", () => {
    const bundledCard = CURRENT_READING_CONTENT_BUNDLE.cardCatalog[0]!;
    const bundledMeaning =
      CURRENT_READING_CONTENT_BUNDLE.cardMeanings[bundledCard.id]!;
    const originalCardDescriptor = Object.getOwnPropertyDescriptor(
      bundledCard,
      "nameZh",
    )!;
    const originalAdviceDescriptor = Object.getOwnPropertyDescriptor(
      bundledMeaning.upright.categories.general,
      "advice",
    )!;

    try {
      expect(() => {
        (bundledCard as unknown as { nameZh: string }).nameZh =
          "PRIVATE_MUTATED_CARD_NAME";
      }).toThrow(TypeError);
      expect(() => {
        (
          bundledMeaning.upright.categories.general as unknown as {
            advice: string;
          }
        ).advice = "PRIVATE_MUTATED_MEANING";
      }).toThrow(TypeError);
    } finally {
      Reflect.defineProperty(bundledCard, "nameZh", originalCardDescriptor);
      Reflect.defineProperty(
        bundledMeaning.upright.categories.general,
        "advice",
        originalAdviceDescriptor,
      );
    }

    expect(Object.isFrozen(CURRENT_READING_CONTENT_BUNDLE.cardCatalog)).toBe(
      true,
    );
    expect(Object.isFrozen(bundledCard)).toBe(true);
    expect(Object.isFrozen(CURRENT_READING_CONTENT_BUNDLE.cardMeanings)).toBe(
      true,
    );
    expect(Object.isFrozen(bundledMeaning)).toBe(true);
    expect(Object.isFrozen(bundledMeaning.upright)).toBe(true);
    expect(Object.isFrozen(bundledMeaning.upright.keywords)).toBe(true);
    expect(Object.isFrozen(bundledMeaning.upright.categories)).toBe(true);
    expect(Object.isFrozen(bundledMeaning.upright.categories.general)).toBe(
      true,
    );
  });

  it("defensively copies mutable catalog and meaning exports", () => {
    const sourceCard = CARD_CATALOG[0]!;
    const bundledCard = CURRENT_READING_CONTENT_BUNDLE.cardCatalog[0]!;
    const sourceMeaning = CARD_MEANINGS[sourceCard.id]!;
    const bundledMeaning =
      CURRENT_READING_CONTENT_BUNDLE.cardMeanings[sourceCard.id]!;
    const originalCardDescriptor = Object.getOwnPropertyDescriptor(
      sourceCard,
      "nameZh",
    )!;
    const originalAdviceDescriptor = Object.getOwnPropertyDescriptor(
      sourceMeaning.upright.categories.general,
      "advice",
    )!;

    try {
      Object.defineProperty(sourceCard, "nameZh", {
        ...originalCardDescriptor,
        value: "PRIVATE_SOURCE_CARD_NAME",
      });
      Object.defineProperty(
        sourceMeaning.upright.categories.general,
        "advice",
        {
          ...originalAdviceDescriptor,
          value: "PRIVATE_SOURCE_MEANING",
        },
      );

      expect(bundledCard.nameZh).toBe(originalCardDescriptor.value);
      expect(bundledMeaning.upright.categories.general.advice).toBe(
        originalAdviceDescriptor.value,
      );
    } finally {
      Object.defineProperty(sourceCard, "nameZh", originalCardDescriptor);
      Object.defineProperty(
        sourceMeaning.upright.categories.general,
        "advice",
        originalAdviceDescriptor,
      );
    }
  });
});

describe("urgent-risk safety routing", () => {
  it.each([
    "minor.cups.two",
    "minor.cups.five",
    "minor.cups.ten",
    "minor.cups.queen",
    "minor.cups.king",
    "minor.wands.five",
    "minor.wands.seven",
    "minor.wands.nine",
  ] as const)("routes urgent risk actionably for %s", (cardId) => {
    const safetyNote = getCardMeaningRecord(cardId).safetyNote;

    expect(safetyNote).toMatch(/牌义.*不能评估/);
    expect(safetyNote).toMatch(/不替代|不能替代/);
    expect(safetyNote).toContain("立即");
    expect(safetyNote).toContain("安全");
    expect(safetyNote).toContain("当地紧急或危机服务");
    expect(safetyNote).toMatch(/可信赖的人|合格专业人员/);
  });
});
