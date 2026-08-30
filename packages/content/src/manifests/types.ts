import type {
  AnimationManifestRef,
  CardId,
  DeckManifestRef,
  ThemeManifestRef,
} from "@aura/contracts";

export const THEME_SLOT_KEYS = [
  "BG_BASE",
  "BG_PATTERN",
  "BG_ORBIT",
  "STAGE_FRAME",
  "CARD_CONTAINER_CHROME",
  "PANEL_SURFACE",
  "BUTTON_SKIN",
  "ICON_ACCENT",
  "TRANSITION_FX",
] as const;
export type ThemeSlotKey = (typeof THEME_SLOT_KEYS)[number];
export type SlotFallback = "hide" | "default-theme" | "neutral";

export interface ThemeSlotDescriptor {
  readonly assetKey: string;
  readonly fallback: SlotFallback;
}

export interface ThemeDescriptor {
  readonly ref: ThemeManifestRef;
  readonly layoutContract: "m1-portrait-v1";
  readonly slots: Readonly<Record<ThemeSlotKey, ThemeSlotDescriptor>>;
}

export interface DeckDescriptor {
  readonly ref: DeckManifestRef;
  readonly cardFaceAssetKeys: Readonly<Record<CardId, string>>;
  readonly cardBackAssetKey: string;
  readonly sleeveAssetKey: string;
}

export interface AnimationDescriptor {
  readonly ref: AnimationManifestRef;
  readonly kind: "shuffle" | "flip" | "background" | "transition";
  readonly durationMs: number;
  readonly fallbackPresetKey: "fade" | "none";
}
