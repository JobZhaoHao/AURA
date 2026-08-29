import { CURRENT_READING_CONTENT_BUNDLE } from "@aura/content";
import { describe, expect, it } from "vitest";
import {
  fnv1a32Ascii,
  mulberry32Step,
  sampleRandomDomain,
  type RandomDomain,
} from "../src/deterministic-random.js";
import { drawSingleCard } from "../src/single-card-draw.js";
import { expectSafeDomainError } from "./helpers.js";

const bundle = CURRENT_READING_CONTENT_BUNDLE;

const approvedVectors = [
  {
    seed: "aura-m1-fixed-seed",
    domain: "card",
    hash: 1022744150,
    state: 2854309963,
    uint32: 732049900,
    value: 0.1704436494037509,
  },
  {
    seed: "aura-m1-fixed-seed",
    domain: "orientation",
    hash: 574696082,
    state: 2406261895,
    uint32: 2614748697,
    value: 0.6087936221156269,
  },
  {
    seed: "fixture-seed-0001",
    domain: "card",
    hash: 3076897556,
    state: 613496073,
    uint32: 1747956162,
    value: 0.4069777582772076,
  },
  {
    seed: "fixture-seed-0001",
    domain: "orientation",
    hash: 94061976,
    state: 1925627789,
    uint32: 336827867,
    value: 0.07842384907417,
  },
  {
    seed: "AURA_seed_123456",
    domain: "card",
    hash: 2671759024,
    state: 208357541,
    uint32: 555743750,
    value: 0.1293941750191152,
  },
  {
    seed: "AURA_seed_123456",
    domain: "orientation",
    hash: 330621932,
    state: 2162187745,
    uint32: 3916623550,
    value: 0.9119099820964038,
  },
] as const satisfies readonly {
  readonly seed: string;
  readonly domain: RandomDomain;
  readonly hash: number;
  readonly state: number;
  readonly uint32: number;
  readonly value: number;
}[];

describe("deterministic random", () => {
  it.each(approvedVectors)(
    "matches the approved $seed:$domain vector",
    ({ seed, domain, hash, state, uint32, value }) => {
      expect(fnv1a32Ascii(`${seed}:${domain}`)).toBe(hash);
      expect(mulberry32Step(hash)).toEqual({ state, uint32, value });
      expect(sampleRandomDomain(seed, domain)).toEqual({
        state,
        uint32,
        value,
      });
    },
  );
});

describe("drawSingleCard", () => {
  it("redacts the seed and sampled index when the catalog is empty", () => {
    const privateSeed = "private-seed-0001";
    const emptyBundle = { ...bundle, cardCatalog: [] };

    try {
      drawSingleCard(privateSeed, true, emptyBundle);
      throw new Error("Expected empty card content to fail.");
    } catch (error) {
      expectSafeDomainError(error, "UNKNOWN_CARD_CONTENT", "cardId", [
        privateSeed,
      ]);
      expect(JSON.stringify(error)).not.toContain("sampledIndex");
      expect(error).not.toHaveProperty("sampledIndex");
    }
  });

  it.each([
    ["aura-m1-fixed-seed", "major.death", "reversed"],
    ["fixture-seed-0001", "minor.wands.ten", "upright"],
    ["AURA_seed_123456", "major.wheel-of-fortune", "reversed"],
  ] as const)(
    "maps the approved $0 golden draw",
    (seed, cardId, orientation) => {
      expect(drawSingleCard(seed, true, bundle)).toEqual({
        cardId,
        orientation,
        position: "single",
      });
    },
  );

  it("maps 2,048 deterministic seeds to canonical cards without reversal coupling", () => {
    const canonicalCardIds = new Set(bundle.cardCatalog.map(({ id }) => id));

    for (let index = 0; index < 2048; index += 1) {
      const seed = `phase2-seed-${index.toString().padStart(8, "0")}`;
      const withReversals = drawSingleCard(seed, true, bundle);
      const withoutReversals = drawSingleCard(seed, false, bundle);

      expect(canonicalCardIds.has(withReversals.cardId)).toBe(true);
      expect(canonicalCardIds.has(withoutReversals.cardId)).toBe(true);
      expect(withoutReversals.cardId).toBe(withReversals.cardId);
      expect(withoutReversals.orientation).toBe("upright");
    }
  });
});
