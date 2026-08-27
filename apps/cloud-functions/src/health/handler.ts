import { HealthResponseSchema, type HealthResponse } from "@aura/contracts";
import {
  loadServerConfig,
  toPublicBuildInfo,
} from "../config/server-config.js";

export async function healthHandler(): Promise<HealthResponse> {
  const config = loadServerConfig(process.env);

  return HealthResponseSchema.parse({
    schemaVersion: 1,
    status: "ok",
    environment: config.environment,
    build: toPublicBuildInfo(config),
  });
}
