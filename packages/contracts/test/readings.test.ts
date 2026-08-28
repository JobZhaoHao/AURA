import { describe, expect, it } from "vitest";
import {
  DailyReadingCacheEntrySchema,
  DiscoveryRecordSchema,
  LocalHistoryEntrySchema,
  ReadingDrawSchema,
  ReadingNarrativeSchema,
  ReadingResultSchema,
  ReadingSessionSchema,
} from "../src/index.js";

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

const history = {
  ...result,
  savedAt: "2026-08-28T00:01:00.000Z",
} as const;

const discovery = {
  cardId: "major.fool",
  firstSeenAt: "2026-08-28T00:00:30.000Z",
} as const;

const dailyCache = {
  installationId: "installation-001",
  localDate: "2026-08-28",
  result,
} as const;

describe("reading contracts", () => {
  it("parses a replayable reading result", () => {
    expect(ReadingResultSchema.parse(result)).toEqual(result);
  });

  it("retains every replay version in local history", () => {
    const parsed = LocalHistoryEntrySchema.parse(history);
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

  it.each([
    ["draw", ReadingDrawSchema, result.session.draws[0]],
    ["session", ReadingSessionSchema, result.session],
    ["narrative", ReadingNarrativeSchema, result.narrative],
    ["result", ReadingResultSchema, result],
    ["local history", LocalHistoryEntrySchema, history],
    ["discovery", DiscoveryRecordSchema, discovery],
    ["daily cache", DailyReadingCacheEntrySchema, dailyCache],
  ] as const)(
    "rejects unknown fields at the %s boundary",
    (_name, schema, value) => {
      expect(() =>
        schema.parse({
          ...value,
          unexpectedField: "must-not-be-stripped",
        }),
      ).toThrow();
    },
  );

  it.each([
    [
      "session",
      {
        ...result,
        session: { ...result.session, unexpectedField: true },
      },
    ],
    [
      "draw",
      {
        ...result,
        session: {
          ...result.session,
          draws: [{ ...result.session.draws[0], unexpectedField: true }],
        },
      },
    ],
    [
      "narrative",
      {
        ...result,
        narrative: { ...result.narrative, unexpectedField: true },
      },
    ],
  ] as const)("rejects unknown fields in nested %s objects", (_name, value) => {
    expect(() => ReadingResultSchema.parse(value)).toThrow();
  });

  it.each([
    ["result", ReadingResultSchema, { ...result, rawQuestion: "secret" }],
    [
      "session",
      ReadingSessionSchema,
      { ...result.session, rawQuestion: "secret" },
    ],
    ["history", LocalHistoryEntrySchema, { ...history, rawQuestion: "secret" }],
  ] as const)(
    "rejects rawQuestion at the %s boundary before persistence",
    (_name, schema, value) => {
      expect(() => schema.parse(value)).toThrow();
    },
  );

  it.each(["rulesVersion", "contentVersion", "textVersion"] as const)(
    "rejects blank, path-like, and URL-like %s identifiers",
    (field) => {
      for (const invalidVersion of [
        "",
        "   ",
        "../m1-version",
        "C:\\aura\\m1-version",
        "https://example.com/m1-version",
      ]) {
        const value =
          field === "textVersion"
            ? { ...result, textVersion: invalidVersion }
            : {
                ...result,
                session: { ...result.session, [field]: invalidVersion },
              };

        expect(() => ReadingResultSchema.parse(value)).toThrow();
      }
    },
  );
});
