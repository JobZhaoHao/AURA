import { describe, expect, it } from "vitest";
import { LocalHistoryEntrySchema, ReadingResultSchema } from "../src/index.js";

const result = {
  session: {
    sessionId: "session-001",
    mode: "single",
    questionCategory: "general",
    safetyDisposition: "standard",
    rulesVersion: "m1-rules-v1",
    contentVersion: "m1-content-v1",
    createdAt: "2026-08-28T00:00:00.000Z",
    draws: [
      { cardId: "major.fool", orientation: "upright", position: "single" },
    ],
  },
  narrative: {
    summary: "新的可能正在打开。",
    interpretation: "愚人正位强调开放与尝试。",
    advice: "先完成一个低风险的小步骤。",
  },
  textVersion: "m1-text-v1",
} as const;

describe("reading contracts", () => {
  it("parses a replayable reading result", () => {
    expect(ReadingResultSchema.parse(result)).toEqual(result);
  });

  it("retains every replay version in local history", () => {
    const parsed = LocalHistoryEntrySchema.parse({
      ...result,
      savedAt: "2026-08-28T00:01:00.000Z",
    });
    expect(parsed.session.rulesVersion).toBe("m1-rules-v1");
    expect(parsed.session.contentVersion).toBe("m1-content-v1");
    expect(parsed.textVersion).toBe("m1-text-v1");
  });

  it.each([
    "questionCategory",
    "safetyDisposition",
    "rulesVersion",
    "contentVersion",
  ])("rejects history missing %s", (field) => {
    const history = {
      ...result,
      savedAt: "2026-08-28T00:01:00.000Z",
    } as Record<string, unknown>;
    const session = { ...result.session } as Record<string, unknown>;
    delete session[field];
    history.session = session;
    expect(() => LocalHistoryEntrySchema.parse(history)).toThrow();
  });
});
