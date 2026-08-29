import { CURRENT_READING_CONTENT_BUNDLE } from "@aura/content";
import { describe, expect, it } from "vitest";
import { type CardId, type QuestionCategory } from "@aura/contracts";
import { DomainError } from "../src/errors.js";
import { composeSingleNarrative } from "../src/narrative.js";
import { getCurrentCardMeaningRecord } from "../src/reading-content.js";
import type { SingleCardDraw } from "../src/single-card-draw.js";
import { expectSafeDomainError } from "./helpers.js";

const deathReversed: SingleCardDraw = {
  cardId: "major.death",
  orientation: "reversed",
  position: "single",
};

const deathUpright: SingleCardDraw = {
  cardId: "major.death",
  orientation: "upright",
  position: "single",
};

describe("composeSingleNarrative", () => {
  it("composes the approved Death reversed general literal", () => {
    expect(
      composeSingleNarrative(deathReversed, "general", "standard"),
    ).toEqual({
      summary: "你可能紧抓已经失效的安排，因为熟悉感暂时比未知更让人安心。",
      interpretation:
        "迟迟不收尾让资源持续被占用，恐惧值得被照顾但不必替你决定。",
      advice: "选择最小可逆的放下动作，并为过渡准备现实支持。",
      safetyNotice:
        "死神牌象征阶段变化，不预示死亡；医疗、法律、投资或危机问题请寻求专业支持。",
    });
  });

  it("composes the approved Death upright general literal", () => {
    expect(composeSingleNarrative(deathUpright, "general", "standard")).toEqual(
      {
        summary:
          "一个阶段正在结束，为新生活腾出空间需要承认失去并逐步完成告别。",
        interpretation:
          "旧结构已难以继续承担当前需要，结束是转化过程而非灾难预告。",
        advice: "明确一件已经完成使命的事，为它安排具体收尾。",
        safetyNotice:
          "死神牌象征阶段变化，不预示死亡；医疗、法律、投资或危机问题请寻求专业支持。",
      },
    );
  });

  it.each([
    [
      "general",
      "迟迟不收尾让资源持续被占用，恐惧值得被照顾但不必替你决定。",
      "选择最小可逆的放下动作，并为过渡准备现实支持。",
    ],
    [
      "relationships",
      "旧承诺或旧伤被反复维持，双方需要分清修复意愿与害怕改变。",
      "谈清哪些模式必须停止，以及双方愿意尝试的改变期限。",
    ],
    [
      "career-study",
      "继续投入熟悉方向可能出于沉没成本，而非它仍符合当前目标。",
      "用近期证据重新评估投入，停止一项只因不舍而保留的任务。",
    ],
    [
      "self-growth",
      "对改变身份的担忧让你停在旧叙事里，过渡不要求立刻成为全新的自己。",
      "为旧阶段写一段告别，再尝试一个符合当下的小选择。",
    ],
  ] as const)(
    "uses the approved Death reversed %s category content",
    (questionCategory, interpretation, advice) => {
      const narrative = composeSingleNarrative(
        deathReversed,
        questionCategory,
        "standard",
      );

      expect(narrative.interpretation).toBe(interpretation);
      expect(narrative.advice).toBe(advice);
    },
  );

  it("changes only safety notice for high-risk readings", () => {
    const standard = composeSingleNarrative(
      deathReversed,
      "general",
      "standard",
    );
    const highRisk = composeSingleNarrative(
      deathReversed,
      "general",
      "high-risk",
    );
    const record = CURRENT_READING_CONTENT_BUNDLE.cardMeanings["major.death"];

    expect(highRisk).toEqual({
      ...standard,
      safetyNotice: `${CURRENT_READING_CONTENT_BUNDLE.highRiskSafetyTemplate}\n\n${record.safetyNote}`,
    });
  });

  it("maps every canonical card, orientation, and category to its exact standard content", () => {
    const categories: readonly QuestionCategory[] = [
      "general",
      "relationships",
      "career-study",
      "self-growth",
    ];

    for (const { id: cardId } of CURRENT_READING_CONTENT_BUNDLE.cardCatalog) {
      const record = CURRENT_READING_CONTENT_BUNDLE.cardMeanings[cardId];
      for (const orientation of ["upright", "reversed"] as const) {
        for (const questionCategory of categories) {
          const category = record[orientation].categories[questionCategory];
          expect(
            composeSingleNarrative(
              { cardId, orientation, position: "single" },
              questionCategory,
              "standard",
            ),
          ).toEqual({
            summary: record[orientation].core,
            interpretation: category.interpretation,
            advice: category.advice,
            safetyNotice: record.safetyNote,
          });
        }
      }
    }
  });

  it("redacts schema-valid noncanonical card content failures", () => {
    const sentinel = "major.private-question-20260829";

    try {
      getCurrentCardMeaningRecord(sentinel as CardId);
      throw new Error("Expected unknown content to throw.");
    } catch (error) {
      expectSafeDomainError(error, "UNKNOWN_CARD_CONTENT", "cardId", [
        sentinel,
      ]);
    }
  });
});
