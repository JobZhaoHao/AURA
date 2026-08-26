import { describe, expect, it } from "vitest";
import { HealthResponseSchema } from "../src/index.js";

describe("HealthResponseSchema", () => {
  it("accepts a versioned healthy response", () => {
    expect(
      HealthResponseSchema.parse({
        schemaVersion: 1,
        status: "ok",
        environment: "test",
        build: { commit: "fdaf646", builtAt: "2026-08-26T00:00:00.000Z" },
      }).status,
    ).toBe("ok");
  });

  it("rejects unknown environments", () => {
    expect(() =>
      HealthResponseSchema.parse({
        schemaVersion: 1,
        status: "ok",
        environment: "local-production",
        build: { commit: "x", builtAt: "2026-08-26T00:00:00.000Z" },
      }),
    ).toThrow();
  });
});
