import { describe, expect, it } from "vitest";
import {
  loadServerConfig,
  toPublicBuildInfo,
} from "../src/config/server-config.js";

describe("loadServerConfig", () => {
  it("rejects a production process using a development CloudBase environment", () => {
    expect(() =>
      loadServerConfig({
        AURA_ENV: "production",
        AURA_CLOUDBASE_ENV_ID: "aura-dev-001",
        AURA_BUILD_COMMIT: "abc",
        AURA_BUILD_TIME: "2026-08-26T00:00:00.000Z",
      }),
    ).toThrow(/production.*wrong prefix/i);
  });

  it("requires build identity", () => {
    expect(() =>
      loadServerConfig({
        AURA_ENV: "test",
        AURA_CLOUDBASE_ENV_ID: "aura-test-001",
      }),
    ).toThrow(/AURA_BUILD_COMMIT/);
  });
});

describe("toPublicBuildInfo", () => {
  it("returns only the public commit and build time", () => {
    const config = {
      environment: "production" as const,
      cloudbaseEnvironmentId: "aura-prod-001",
      buildCommit: "abc",
      buildTime: "2026-08-26T00:00:00.000Z",
    };

    expect(toPublicBuildInfo(config)).toEqual({
      commit: "abc",
      builtAt: "2026-08-26T00:00:00.000Z",
    });
    expect(toPublicBuildInfo(config)).not.toHaveProperty(
      "cloudbaseEnvironmentId",
    );
  });
});
