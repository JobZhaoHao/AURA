import type { AnimationDescriptor } from "./types.js";

export const ANIMATIONS = [
  {
    ref: { animationId: "gentle-shuffle", version: "1.0.0" },
    kind: "shuffle",
    durationMs: 1_200,
    fallbackPresetKey: "none",
  },
  {
    ref: { animationId: "card-flip", version: "1.0.0" },
    kind: "flip",
    durationMs: 650,
    fallbackPresetKey: "fade",
  },
  {
    ref: { animationId: "moonlight-background", version: "1.0.0" },
    kind: "background",
    durationMs: 4_000,
    fallbackPresetKey: "none",
  },
  {
    ref: { animationId: "soft-transition", version: "1.0.0" },
    kind: "transition",
    durationMs: 300,
    fallbackPresetKey: "fade",
  },
] as const satisfies readonly AnimationDescriptor[];
