import { BuildInfoSchema, type BuildInfo } from "@aura/contracts";
import type { PlatformBridge } from "./PlatformBridge";

export class DevelopmentPlatformBridge implements PlatformBridge {
  public constructor(private readonly buildInfo: BuildInfo) {}

  public async getBuildInfo(): Promise<BuildInfo> {
    return BuildInfoSchema.parse(this.buildInfo);
  }
}
