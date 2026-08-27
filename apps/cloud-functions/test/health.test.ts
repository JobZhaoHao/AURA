import { afterEach, describe, expect, it, vi } from "vitest";
import { HealthResponseSchema } from "@aura/contracts";
import { healthHandler } from "../src/health/handler.js";

describe("healthHandler", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the shared versioned contract without the server environment ID", async () => {
    vi.stubEnv("AURA_ENV", "test");
    vi.stubEnv("AURA_CLOUDBASE_ENV_ID", "aura-test-example");
    vi.stubEnv("AURA_BUILD_COMMIT", "abc123");
    vi.stubEnv("AURA_BUILD_TIME", "2026-08-26T00:00:00.000Z");

    const result = await healthHandler();

    expect(HealthResponseSchema.parse(result)).toEqual({
      schemaVersion: 1,
      status: "ok",
      environment: "test",
      build: {
        commit: "abc123",
        builtAt: "2026-08-26T00:00:00.000Z",
      },
    });
    expect(result).not.toHaveProperty("cloudbaseEnvironmentId");
  });
});
