import { z } from "zod";

const MINOR_RANK =
  "ace|two|three|four|five|six|seven|eight|nine|ten|page|knight|queen|king";

export const CardIdSchema = z
  .string()
  .regex(
    new RegExp(
      `^(major\\.[a-z][a-z0-9-]*|minor\\.(wands|cups|swords|pentacles)\\.(${MINOR_RANK}))$`,
    ),
  );
export type CardId = z.infer<typeof CardIdSchema>;

export const ArcanaSchema = z.enum(["major", "minor"]);
export type Arcana = z.infer<typeof ArcanaSchema>;

export const SuitSchema = z.enum(["wands", "cups", "swords", "pentacles"]);
export type Suit = z.infer<typeof SuitSchema>;

export const OrientationSchema = z.enum(["upright", "reversed"]);
export type Orientation = z.infer<typeof OrientationSchema>;

export const QuestionCategorySchema = z.enum([
  "general",
  "relationships",
  "career-study",
  "self-growth",
]);
export type QuestionCategory = z.infer<typeof QuestionCategorySchema>;

export const ReadingModeSchema = z.enum(["daily", "single", "three-card"]);
export type ReadingMode = z.infer<typeof ReadingModeSchema>;

export const SpreadPositionSchema = z.enum([
  "daily",
  "single",
  "past",
  "present",
  "trend",
]);
export type SpreadPosition = z.infer<typeof SpreadPositionSchema>;
