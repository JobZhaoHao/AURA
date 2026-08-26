import { z } from "zod";
import { SchemaVersionSchema } from "./version.js";

export const EnvironmentNameSchema = z.enum(["development", "test", "production"]);
export type EnvironmentName = z.infer<typeof EnvironmentNameSchema>;

export const BuildInfoSchema = z.object({
  commit: z.string().min(1),
  builtAt: z.iso.datetime(),
});
export type BuildInfo = z.infer<typeof BuildInfoSchema>;

export const HealthResponseSchema = z.object({
  schemaVersion: SchemaVersionSchema,
  status: z.literal("ok"),
  environment: EnvironmentNameSchema,
  build: BuildInfoSchema,
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
