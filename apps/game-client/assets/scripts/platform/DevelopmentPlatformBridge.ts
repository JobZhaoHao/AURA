import type { BuildInfo } from "@aura/contracts";
import type { PlatformBridge } from "./PlatformBridge";

function assertBuildInfo(value: BuildInfo): void {
  if (!value.commit.trim() || Number.isNaN(Date.parse(value.builtAt))) {
    throw new TypeError("Invalid build information");
  }
}

export class DevelopmentPlatformBridge implements PlatformBridge {
  public constructor(private readonly buildInfo: BuildInfo) {}

  public async getBuildInfo(): Promise<BuildInfo> {
    assertBuildInfo(this.buildInfo);
    return this.buildInfo;
  }
}
