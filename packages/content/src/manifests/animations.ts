import type { AnimationDescriptor } from "./types.js";

export const ANIMATIONS = [
  {
    animationId: "gentle-shuffle",
    kind: "shuffle",
    durationMs: 1_200,
    fallbackPresetKey: "none",
  },
  {
    animationId: "card-flip",
    kind: "flip",
    durationMs: 650,
    fallbackPresetKey: "fade",
  },
  {
    animationId: "moonlight-background",
    kind: "background",
    durationMs: 4_000,
    fallbackPresetKey: "none",
  },
  {
    animationId: "soft-transition",
    kind: "transition",
    durationMs: 300,
    fallbackPresetKey: "fade",
  },
] as const satisfies readonly AnimationDescriptor[];
