import type { SingleReadingInput } from "../src/single-reading-input.js";
import { parseSingleReadingInput } from "../src/single-reading-input.js";

declare function acceptParsedInput(input: SingleReadingInput): void;

const raw = {
  seed: "aura-m1-fixed-seed",
  sessionId: "fixture-session-001",
  questionCategory: "general",
  safetyDisposition: "standard",
  reversalsEnabled: true,
  createdAt: "2026-08-28T00:00:00.000Z",
} as const;

// @ts-expect-error A raw object must pass parseSingleReadingInput first.
acceptParsedInput(raw);
acceptParsedInput(parseSingleReadingInput(raw));
