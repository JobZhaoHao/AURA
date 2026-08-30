import { DEFAULT_THEME, MINIMAL_ALT_THEME, NEUTRAL_DECK } from "@aura/content";

export const VALID_MANIFEST_FIXTURE = {
  theme: DEFAULT_THEME,
  deck: NEUTRAL_DECK,
} as const;

export const ALTERNATE_MANIFEST_FIXTURE = {
  theme: MINIMAL_ALT_THEME,
  deck: NEUTRAL_DECK,
} as const;
