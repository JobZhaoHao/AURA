import { z } from "zod";

export const SafetyDispositionSchema = z.enum(["standard", "high-risk"]);
export type SafetyDisposition = z.infer<typeof SafetyDispositionSchema>;
