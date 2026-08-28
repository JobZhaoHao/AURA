import type { SpreadPosition } from "@aura/contracts";

export interface SpreadDefinition {
  readonly key: "single" | "daily" | "past-present-trend";
  readonly positions: readonly SpreadPosition[];
}

export const SPREAD_DEFINITIONS = {
  single: { key: "single", positions: ["single"] },
  daily: { key: "daily", positions: ["daily"] },
  "past-present-trend": {
    key: "past-present-trend",
    positions: ["past", "present", "trend"],
  },
} as const satisfies Record<string, SpreadDefinition>;
