import { describe, expect, it } from "vitest";
import {
  assertSingleCardReadingResult,
  createSingleReading,
  type SingleCardReadingResult,
} from "../src/single-reading.js";
import {
  parseSingleReadingInput,
  type SingleReadingInput,
} from "../src/single-reading-input.js";
import { FIXED_READING_INPUT } from "./fixtures.js";
import { expectSafeDomainError } from "./helpers.js";

const expectedFixedResult: SingleCardReadingResult = {
  session: {
    sessionId: "fixture-session-001",
    mode: "single",
    questionCategory: "general",
    safetyDisposition: "standard",
    rulesVersion: "m1-rules-v1",
    contentVersion: "m1-content-v1",
    createdAt: "2026-08-28T00:00:00.000Z",
    draws: [
      {
        cardId: "major.death",
        orientation: "reversed",
        position: "single",
      },
    ],
  },
  narrative: {
    summary: "你可能紧抓已经失效的安排，因为熟悉感暂时比未知更让人安心。",
    interpretation:
      "迟迟不收尾让资源持续被占用，恐惧值得被照顾但不必替你决定。",
    advice: "选择最小可逆的放下动作，并为过渡准备现实支持。",
    safetyNotice:
      "死神牌象征阶段变化，不预示死亡；医疗、法律、投资或危机问题请寻求专业支持。",
  },
  textVersion: "m1-text-v1",
};

describe("createSingleReading", () => {
  it("creates the approved fixed complete single-card reading", () => {
    const result = createSingleReading(
      parseSingleReadingInput(FIXED_READING_INPUT),
    );

    expect(result).toEqual(expectedFixedResult);
    expect(JSON.stringify(result)).not.toContain(FIXED_READING_INPUT.seed);
    expect(JSON.stringify(result)).not.toContain("reversalsEnabled");
  });

  it("keeps the draw invariant across session and narrative-only input changes", () => {
    const fixedDraw = createSingleReading(
      parseSingleReadingInput(FIXED_READING_INPUT),
    ).session.draws[0];

    for (const candidate of [
      { ...FIXED_READING_INPUT, questionCategory: "relationships" },
      { ...FIXED_READING_INPUT, safetyDisposition: "high-risk" },
      { ...FIXED_READING_INPUT, sessionId: "fixture-session-002" },
      { ...FIXED_READING_INPUT, createdAt: "2026-08-29T00:00:00.000Z" },
    ] as const) {
      expect(
        createSingleReading(parseSingleReadingInput(candidate)).session
          .draws[0],
      ).toEqual(fixedDraw);
    }
  });

  it("preserves the card and forces upright when reversals are disabled", () => {
    const withReversals = createSingleReading(
      parseSingleReadingInput(FIXED_READING_INPUT),
    );
    const withoutReversals = createSingleReading(
      parseSingleReadingInput({
        ...FIXED_READING_INPUT,
        reversalsEnabled: false,
      }),
    );

    expect(withoutReversals.session.draws[0].cardId).toBe(
      withReversals.session.draws[0].cardId,
    );
    expect(withoutReversals.session.draws[0].orientation).toBe("upright");
  });

  it("accepts an input produced by the parser runtime brand", () => {
    expect(() =>
      createSingleReading(parseSingleReadingInput(FIXED_READING_INPUT)),
    ).not.toThrow();
  });

  it("contains a branded proxy that fails on its second seed read", () => {
    const sentinel = "PRIVATE_PROXY_SENTINEL";
    const parsed = parseSingleReadingInput(FIXED_READING_INPUT);
    let seedReads = 0;
    const brandedProxy = new Proxy(parsed, {
      get(target, property, receiver) {
        if (property === "seed" && ++seedReads === 2) {
          throw new Error(sentinel);
        }
        return Reflect.get(target, property, receiver);
      },
    });

    try {
      createSingleReading(brandedProxy);
      throw new Error("Expected branded proxy to throw.");
    } catch (error) {
      expectSafeDomainError(error, "INVALID_READING_INPUT", "input", [
        sentinel,
      ]);
    }
  });

  it.each([
    ["exact-shape cast", FIXED_READING_INPUT as unknown as SingleReadingInput],
    [
      "raw-question cast",
      {
        ...FIXED_READING_INPUT,
        rawQuestion: "PRIVATE_QUESTION_SENTINEL",
      } as unknown as SingleReadingInput,
    ],
  ] as const)("rejects a forged %s input", (_label, forgedInput) => {
    try {
      createSingleReading(forgedInput);
      throw new Error("Expected forged input to throw.");
    } catch (error) {
      expectSafeDomainError(error, "INVALID_READING_INPUT", "input", [
        "PRIVATE_QUESTION_SENTINEL",
      ]);
    }
  });
});

describe("assertSingleCardReadingResult", () => {
  it("accepts a current complete result", () => {
    const result = createSingleReading(
      parseSingleReadingInput(FIXED_READING_INPUT),
    );

    expect(() => assertSingleCardReadingResult(result)).not.toThrow();
  });

  it("redacts semantic narrative mismatches as invalid history entries", () => {
    const sentinel = "PRIVATE_HISTORY_NARRATIVE_SENTINEL";
    const forgedResult = {
      ...expectedFixedResult,
      narrative: { ...expectedFixedResult.narrative, advice: sentinel },
    };

    try {
      assertSingleCardReadingResult(forgedResult);
      throw new Error("Expected forged result to throw.");
    } catch (error) {
      expectSafeDomainError(error, "INVALID_HISTORY_ENTRY", "result", [
        sentinel,
      ]);
    }
  });

  it("redacts unknown current card content", () => {
    const sentinel = "major.private-question-20260829";
    const forgedResult = {
      ...expectedFixedResult,
      session: {
        ...expectedFixedResult.session,
        draws: [{ ...expectedFixedResult.session.draws[0], cardId: sentinel }],
      },
    };

    try {
      assertSingleCardReadingResult(forgedResult);
      throw new Error("Expected unknown content to throw.");
    } catch (error) {
      expectSafeDomainError(error, "UNKNOWN_CARD_CONTENT", "cardId", [
        sentinel,
      ]);
    }
  });
});
