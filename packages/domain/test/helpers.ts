import { expect } from "vitest";
import {
  DomainError,
  type DomainErrorCode,
  type DomainErrorField,
} from "../src/errors.js";

export function expectSafeDomainError(
  error: unknown,
  code: DomainErrorCode,
  field: DomainErrorField | undefined,
  sentinels: readonly string[] = [],
): void {
  expect(error).toBeInstanceOf(DomainError);

  const domainError = error as DomainError;
  expect(String(domainError)).toBe(`DomainError: ${domainError.message}`);
  expect(Object.keys(domainError)).toEqual(
    field === undefined ? ["code"] : ["code", "field"],
  );
  expect(JSON.stringify(domainError)).toBe(
    JSON.stringify(field === undefined ? { code } : { code, field }),
  );
  expect("cause" in domainError).toBe(false);

  const publicEnvelope = JSON.stringify({
    text: String(domainError),
    keys: Object.keys(domainError),
    json: JSON.stringify(domainError),
  });
  for (const sentinel of sentinels) {
    expect(publicEnvelope).not.toContain(sentinel);
  }
}
