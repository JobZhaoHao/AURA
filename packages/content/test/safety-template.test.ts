import { describe, expect, it } from "vitest";
import {
  CARD_CATALOG,
  CARD_MEANINGS,
  CONTENT_VERSION,
  CURRENT_READING_CONTENT_BUNDLE,
  RULES_VERSION,
  TEXT_VERSION,
} from "../src/index.js";

const EXPECTED_HIGH_RISK_TEMPLATE =
  "塔罗不能评估现实风险，也不能替代医疗、法律、投资或危机专业支持。请勿依据本解读作出不可逆决定。若存在即时危险或自伤、伤人念头，请立即前往安全地点，联系当地紧急或危机服务，并联系可信赖的人或合格专业人员。";

describe("current reading content bundle", () => {
  it("provides the approved high-risk safety template", () => {
    expect(CURRENT_READING_CONTENT_BUNDLE.highRiskSafetyTemplate).toBe(
      EXPECTED_HIGH_RISK_TEMPLATE,
    );
  });

  it("atomically carries the current replay versions", () => {
    expect(CURRENT_READING_CONTENT_BUNDLE.rulesVersion).toBe(RULES_VERSION);
    expect(CURRENT_READING_CONTENT_BUNDLE.contentVersion).toBe(CONTENT_VERSION);
    expect(CURRENT_READING_CONTENT_BUNDLE.textVersion).toBe(TEXT_VERSION);
  });

  it("exposes the canonical 78-card catalog in order", () => {
    expect(CURRENT_READING_CONTENT_BUNDLE.cardCatalog).toHaveLength(78);
    expect(CURRENT_READING_CONTENT_BUNDLE.cardCatalog).toEqual(CARD_CATALOG);
  });

  it("maps every canonical card id to its meaning", () => {
    for (const card of CURRENT_READING_CONTENT_BUNDLE.cardCatalog) {
      expect(CURRENT_READING_CONTENT_BUNDLE.cardMeanings[card.id]).toBe(
        CARD_MEANINGS[card.id],
      );
    }
  });
});
