import { describe, expect, it } from "vitest";
import { AnimationManifestRefSchema } from "@aura/contracts";
import {
  ALL_CARD_IDS,
  ANIMATIONS,
  DEFAULT_THEME,
  MINIMAL_ALT_THEME,
  NEUTRAL_DECK,
  THEME_SLOT_KEYS,
} from "../src/index.js";

describe("M1 visual descriptors", () => {
  it("maps every logical card to its canonical neutral asset key", () => {
    expect(Object.keys(NEUTRAL_DECK.cardFaceAssetKeys).sort()).toEqual(
      [...ALL_CARD_IDS].sort(),
    );
    expect(ALL_CARD_IDS).toHaveLength(78);

    for (const cardId of ALL_CARD_IDS) {
      expect(NEUTRAL_DECK.cardFaceAssetKeys[cardId]).toBe(
        `deck.neutral.face.${cardId}`,
      );
    }

    expect(NEUTRAL_DECK.cardBackAssetKey).toBe("deck.neutral.back");
    expect(NEUTRAL_DECK.sleeveAssetKey).toBe("deck.neutral.sleeve");
  });

  it("declares the exact default theme slots, assets, and fallbacks", () => {
    expect(THEME_SLOT_KEYS).toEqual([
      "BG_BASE",
      "BG_PATTERN",
      "BG_ORBIT",
      "STAGE_FRAME",
      "CARD_CONTAINER_CHROME",
      "PANEL_SURFACE",
      "BUTTON_SKIN",
      "ICON_ACCENT",
      "TRANSITION_FX",
    ]);
    expect(Object.keys(DEFAULT_THEME.slots).sort()).toEqual(
      [...THEME_SLOT_KEYS].sort(),
    );
    expect(DEFAULT_THEME).toEqual({
      ref: { themeId: "moonlight-healing", version: "1.0.0" },
      layoutContract: "m1-portrait-v1",
      slots: {
        BG_BASE: {
          assetKey: "theme.moonlight.bg-base",
          fallback: "default-theme",
        },
        BG_PATTERN: {
          assetKey: "theme.moonlight.bg-pattern",
          fallback: "hide",
        },
        BG_ORBIT: {
          assetKey: "theme.moonlight.bg-orbit",
          fallback: "hide",
        },
        STAGE_FRAME: {
          assetKey: "theme.moonlight.stage",
          fallback: "default-theme",
        },
        CARD_CONTAINER_CHROME: {
          assetKey: "theme.moonlight.card-chrome",
          fallback: "neutral",
        },
        PANEL_SURFACE: {
          assetKey: "theme.moonlight.panel",
          fallback: "default-theme",
        },
        BUTTON_SKIN: {
          assetKey: "theme.moonlight.button",
          fallback: "default-theme",
        },
        ICON_ACCENT: {
          assetKey: "theme.moonlight.icons",
          fallback: "hide",
        },
        TRANSITION_FX: {
          assetKey: "theme.moonlight.transition",
          fallback: "neutral",
        },
      },
    });
  });

  it("keeps the alternate sample layout-compatible with independent assets", () => {
    expect(MINIMAL_ALT_THEME.layoutContract).toBe(DEFAULT_THEME.layoutContract);
    expect(Object.keys(MINIMAL_ALT_THEME.slots).sort()).toEqual(
      [...THEME_SLOT_KEYS].sort(),
    );

    for (const slotKey of THEME_SLOT_KEYS) {
      expect(MINIMAL_ALT_THEME.slots[slotKey].fallback).toBe(
        DEFAULT_THEME.slots[slotKey].fallback,
      );
      expect(MINIMAL_ALT_THEME.slots[slotKey].assetKey).not.toBe(
        DEFAULT_THEME.slots[slotKey].assetKey,
      );
    }
  });

  it("publishes only bounded animation descriptors and fallback presets", () => {
    expect(ANIMATIONS.length).toBeGreaterThan(0);

    for (const animation of ANIMATIONS) {
      expect(["shuffle", "flip", "background", "transition"]).toContain(
        animation.kind,
      );
      expect(animation.durationMs).toBeGreaterThan(0);
      expect(animation.durationMs).toBeLessThanOrEqual(5_000);
      expect(Number.isFinite(animation.durationMs)).toBe(true);
      expect(["fade", "none"]).toContain(animation.fallbackPresetKey);
      expect(Object.keys(animation).sort()).toEqual([
        "durationMs",
        "fallbackPresetKey",
        "kind",
        "ref",
      ]);
    }
  });

  it("publishes unique versioned animation references", () => {
    const refs = ANIMATIONS.map((animation) =>
      AnimationManifestRefSchema.parse(animation.ref),
    );
    const identityPairs = refs.map(
      ({ animationId, version }) => `${animationId}@${version}`,
    );

    expect(new Set(identityPairs).size).toBe(identityPairs.length);
  });
});
