import type { BuildInfo } from "@aura/contracts";

export interface PlatformBridge {
  getBuildInfo(): Promise<BuildInfo>;
}
