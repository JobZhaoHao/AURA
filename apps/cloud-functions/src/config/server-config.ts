import { z } from "zod";
import {
  BuildInfoSchema,
  EnvironmentNameSchema,
  type BuildInfo,
  type EnvironmentName,
} from "@aura/contracts";

export interface ServerConfig {
  environment: EnvironmentName;
  cloudbaseEnvironmentId: string;
  buildCommit: string;
  buildTime: string;
}

const prefixes: Record<EnvironmentName, string> = {
  development: "aura-dev-",
  test: "aura-test-",
  production: "aura-prod-",
};

const SourceSchema = z.object({
  AURA_ENV: EnvironmentNameSchema,
  AURA_CLOUDBASE_ENV_ID: z.string().min(1),
  AURA_BUILD_COMMIT: z.string().min(1),
  AURA_BUILD_TIME: z.iso.datetime(),
});

export function loadServerConfig(
  source: Record<string, string | undefined>,
): ServerConfig {
  const value = SourceSchema.parse(source);
  if (!value.AURA_CLOUDBASE_ENV_ID.startsWith(prefixes[value.AURA_ENV])) {
    throw new Error(
      `${value.AURA_ENV} CloudBase environment ID has the wrong prefix`,
    );
  }

  return {
    environment: value.AURA_ENV,
    cloudbaseEnvironmentId: value.AURA_CLOUDBASE_ENV_ID,
    buildCommit: value.AURA_BUILD_COMMIT,
    buildTime: value.AURA_BUILD_TIME,
  };
}

export function toPublicBuildInfo(config: ServerConfig): BuildInfo {
  return BuildInfoSchema.parse({
    commit: config.buildCommit,
    builtAt: config.buildTime,
  });
}
