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

export const MINIMAL_ALT_THEME: ThemeDescriptor = {
  ref: { themeId: "minimal-alt", version: "1.0.0" },
  layoutContract: "m1-portrait-v1",
  slots: {
    BG_BASE: slot("theme.minimal.bg-base", "default-theme"),
    BG_PATTERN: slot("theme.minimal.bg-pattern", "hide"),
    BG_ORBIT: slot("theme.minimal.bg-orbit", "hide"),
    STAGE_FRAME: slot("theme.minimal.stage", "default-theme"),
    CARD_CONTAINER_CHROME: slot("theme.minimal.card-chrome", "neutral"),
    PANEL_SURFACE: slot("theme.minimal.panel", "default-theme"),
    BUTTON_SKIN: slot("theme.minimal.button", "default-theme"),
    ICON_ACCENT: slot("theme.minimal.icons", "hide"),
    TRANSITION_FX: slot("theme.minimal.transition", "neutral"),
  },
};
