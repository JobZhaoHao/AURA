import { describe, expect, it } from "vitest";
import { DevelopmentPlatformBridge } from "../assets/scripts/platform/DevelopmentPlatformBridge.js";

describe("DevelopmentPlatformBridge", () => {
  it("returns schema-valid local build information", async () => {
    const info = await new DevelopmentPlatformBridge({
      commit: "local",
      builtAt: "2026-08-26T00:00:00.000Z",
    }).getBuildInfo();

    expect(info).toEqual({
      commit: "local",
      builtAt: "2026-08-26T00:00:00.000Z",
    });
  });

  it("rejects invalid BuildInfo before returning it to the client", async () => {
    const bridge = new DevelopmentPlatformBridge({
      commit: "",
      builtAt: "not-a-build-time",
    });

    await expect(bridge.getBuildInfo()).rejects.toThrow();
  });
});
