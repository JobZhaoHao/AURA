import { z } from "zod";

export const ManifestVersionSchema = z.string().regex(/^[a-z0-9][a-z0-9._-]*$/);
export type ManifestVersion = z.infer<typeof ManifestVersionSchema>;

const StableIdSchema = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);

export const DeckManifestRefSchema = z
  .object({ deckId: StableIdSchema, version: ManifestVersionSchema })
  .strict();
export type DeckManifestRef = z.infer<typeof DeckManifestRefSchema>;

export const ThemeManifestRefSchema = z
  .object({ themeId: StableIdSchema, version: ManifestVersionSchema })
  .strict();
export type ThemeManifestRef = z.infer<typeof ThemeManifestRefSchema>;

export const AnimationManifestRefSchema = z
  .object({ animationId: StableIdSchema, version: ManifestVersionSchema })
  .strict();
export type AnimationManifestRef = z.infer<typeof AnimationManifestRefSchema>;
