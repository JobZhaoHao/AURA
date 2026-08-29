import type { CardId, ManifestVersion } from "@aura/contracts";
import { CARD_CATALOG, type CardMetadata } from "./cards/catalog.js";
import { CARD_MEANINGS, type CardMeaningRecord } from "./cards/meanings.js";
import { HIGH_RISK_SAFETY_TEMPLATE } from "./safety.js";
import { CONTENT_VERSION, RULES_VERSION, TEXT_VERSION } from "./versions.js";

export interface ReadingContentBundle {
  readonly rulesVersion: ManifestVersion;
  readonly contentVersion: ManifestVersion;
  readonly textVersion: ManifestVersion;
  readonly cardCatalog: readonly CardMetadata[];
  readonly cardMeanings: Readonly<Record<CardId, CardMeaningRecord>>;
  readonly highRiskSafetyTemplate: string;
}

export const CURRENT_READING_CONTENT_BUNDLE = {
  rulesVersion: RULES_VERSION,
  contentVersion: CONTENT_VERSION,
  textVersion: TEXT_VERSION,
  cardCatalog: CARD_CATALOG,
  cardMeanings: CARD_MEANINGS,
  highRiskSafetyTemplate: HIGH_RISK_SAFETY_TEMPLATE,
} as const satisfies ReadingContentBundle;
