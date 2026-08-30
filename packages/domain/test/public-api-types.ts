import * as domain from "../src/index.js";

const raw = {
  seed: "aura-m1-fixed-seed",
  sessionId: "fixture-session-001",
  questionCategory: "general",
  safetyDisposition: "standard",
  reversalsEnabled: true,
  createdAt: "2026-08-28T00:00:00.000Z",
} as const;

// @ts-expect-error A raw object must pass parseSingleReadingInput first.
domain.createSingleReading(raw);
domain.createSingleReading(domain.parseSingleReadingInput(raw));

// @ts-expect-error FNV hashing is an internal deterministic-random helper.
void domain.fnv1a32Ascii;
// @ts-expect-error Mulberry32 stepping is an internal deterministic-random helper.
void domain.mulberry32Step;
// @ts-expect-error Random-domain sampling is an internal deterministic-random helper.
void domain.sampleRandomDomain;
// @ts-expect-error RandomDomain is an internal type.
type InternalRandomDomain = domain.RandomDomain;
declare const internalRandomDomain: InternalRandomDomain;
void internalRandomDomain;
// @ts-expect-error DeterministicRandomStep is an internal type.
type InternalRandomStep = domain.DeterministicRandomStep;
declare const internalRandomStep: InternalRandomStep;
void internalRandomStep;
// @ts-expect-error Caller bundle injection and the draw helper are internal.
void domain.drawSingleCard;
// @ts-expect-error Narrative composition is an internal helper.
void domain.composeSingleNarrative;
// @ts-expect-error Card-content lookup is an internal helper.
void domain.getCurrentCardMeaningRecord;
// @ts-expect-error Parsed-input brand assertion is an internal orchestration helper.
void domain.assertParsedSingleReadingInput;
// @ts-expect-error Reading-result equality is an internal history helper.
void domain.sameReadingResult;
// @ts-expect-error Draw equality is an internal history helper.
void domain.sameDraws;
