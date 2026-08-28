import { RULES_VERSION } from "@aura/content";

export const FIXED_READING_INPUT = {
  seed: "aura-m1-fixed-seed",
  sessionId: "fixture-session-001",
  questionCategory: "general",
  safetyDisposition: "standard",
  createdAt: "2026-08-28T00:00:00.000Z",
} as const;

export const FIXED_DAILY_INPUT = {
  installationId: "fixture-installation",
  localDate: "2026-08-28",
  mode: "daily",
  rulesVersion: RULES_VERSION,
} as const;
