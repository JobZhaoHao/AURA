import { z } from "zod";
import {
  CardIdSchema,
  OrientationSchema,
  QuestionCategorySchema,
  ReadingModeSchema,
  SpreadPositionSchema,
} from "./cards.js";
import { DeckManifestRefSchema, ThemeManifestRefSchema } from "./manifests.js";
import { SafetyDispositionSchema } from "./safety.js";

const StableVersionSchema = z.string().min(1);

export const ReadingDrawSchema = z.object({
  cardId: CardIdSchema,
  orientation: OrientationSchema,
  position: SpreadPositionSchema,
});
export type ReadingDraw = z.infer<typeof ReadingDrawSchema>;

export const ReadingSessionSchema = z.object({
  sessionId: z.string().min(1),
  mode: ReadingModeSchema,
  questionCategory: QuestionCategorySchema,
  safetyDisposition: SafetyDispositionSchema,
  rulesVersion: StableVersionSchema,
  contentVersion: StableVersionSchema,
  createdAt: z.iso.datetime(),
  draws: z.array(ReadingDrawSchema).min(1).max(3),
});
export type ReadingSession = z.infer<typeof ReadingSessionSchema>;

export const ReadingNarrativeSchema = z.object({
  summary: z.string().min(1),
  interpretation: z.string().min(1),
  advice: z.string().min(1),
  safetyNotice: z.string().min(1).optional(),
});
export type ReadingNarrative = z.infer<typeof ReadingNarrativeSchema>;

export const ReadingResultSchema = z.object({
  session: ReadingSessionSchema,
  narrative: ReadingNarrativeSchema,
  textVersion: StableVersionSchema,
});
export type ReadingResult = z.infer<typeof ReadingResultSchema>;

export const LocalHistoryEntrySchema = ReadingResultSchema.extend({
  savedAt: z.iso.datetime(),
  themeRef: ThemeManifestRefSchema.optional(),
  deckRef: DeckManifestRefSchema.optional(),
});
export type LocalHistoryEntry = z.infer<typeof LocalHistoryEntrySchema>;

export const DiscoveryRecordSchema = z.object({
  cardId: CardIdSchema,
  firstSeenAt: z.iso.datetime(),
});
export type DiscoveryRecord = z.infer<typeof DiscoveryRecordSchema>;

export const DailyReadingCacheEntrySchema = z.object({
  installationId: z.string().min(1),
  localDate: z.iso.date(),
  result: ReadingResultSchema,
});
export type DailyReadingCacheEntry = z.infer<
  typeof DailyReadingCacheEntrySchema
>;
