import { expect } from "vitest";
import type { CardId } from "@aura/contracts";
import type { CardMeaningRecord } from "../src/cards/meanings.js";

export function expectCompleteMeaningRecords(
  records: readonly CardMeaningRecord[],
  expectedIds: readonly CardId[],
): void {
  expect(records).toHaveLength(expectedIds.length);
  expect(records.map(({ cardId }) => cardId)).toEqual(expectedIds);
  expect(new Set(records.map(({ cardId }) => cardId)).size).toBe(
    records.length,
  );
  for (const record of records) {
    for (const orientation of ["upright", "reversed"] as const) {
      const meaning = record[orientation];
      expect(meaning.keywords.length).toBeGreaterThanOrEqual(3);
      expect(meaning.core.trim().length).toBeGreaterThanOrEqual(12);
      expect(Object.keys(meaning.categories).sort()).toEqual(
        ["career-study", "general", "relationships", "self-growth"].sort(),
      );
      for (const category of Object.values(meaning.categories)) {
        expect(category.interpretation.trim().length).toBeGreaterThanOrEqual(
          20,
        );
        expect(category.advice.trim().length).toBeGreaterThanOrEqual(10);
      }
    }
    expect(record.safetyNote.trim().length).toBeGreaterThanOrEqual(12);
  }
}
