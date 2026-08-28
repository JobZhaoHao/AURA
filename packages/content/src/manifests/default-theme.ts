import type {
  SlotFallback,
  ThemeDescriptor,
  ThemeSlotDescriptor,
} from "./types.js";

const slot = (
  assetKey: string,
  fallback: SlotFallback,
): ThemeSlotDescriptor => ({
  assetKey,
  fallback,
});

export const DEFAULT_THEME: ThemeDescriptor = {
  ref: { themeId: "moonlight-healing", version: "1.0.0" },
  layoutContract: "m1-portrait-v1",
  slots: {
    BG_BASE: slot("theme.moonlight.bg-base", "default-theme"),
    BG_PATTERN: slot("theme.moonlight.bg-pattern", "hide"),
    BG_ORBIT: slot("theme.moonlight.bg-orbit", "hide"),
    STAGE_FRAME: slot("theme.moonlight.stage", "default-theme"),
    CARD_CONTAINER_CHROME: slot("theme.moonlight.card-chrome", "neutral"),
    PANEL_SURFACE: slot("theme.moonlight.panel", "default-theme"),
    BUTTON_SKIN: slot("theme.moonlight.button", "default-theme"),
    ICON_ACCENT: slot("theme.moonlight.icons", "hide"),
    TRANSITION_FX: slot("theme.moonlight.transition", "neutral"),
  },
};
