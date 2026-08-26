import { z } from "zod";

export const SchemaVersionSchema = z.literal(1);
export type SchemaVersion = z.infer<typeof SchemaVersionSchema>;
