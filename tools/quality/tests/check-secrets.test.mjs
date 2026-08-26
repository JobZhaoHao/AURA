import test from "node:test";
import assert from "node:assert/strict";
import { scanText } from "../check-secrets.mjs";

test("scanner redacts and reports credential-like values", () => {
  const input = "SECRET" + "_KEY=" + "abc12345678901234567890";
  const findings = scanText(input, ".env.bad");
  assert.equal(findings.length, 1);
  assert.equal(findings[0].sample.includes("abc123"), false);
});

test("scanner reports PEM private keys without exposing their contents", () => {
  const findings = scanText("-----BEGIN " + "RSA PRIVATE KEY-----", "keys.txt");
  assert.deepEqual(findings, [
    { path: "keys.txt", rule: "private-key", sample: "[REDACTED]" },
  ]);
});

test("scanner ignores ordinary configuration values", () => {
  assert.deepEqual(scanText("PORT=3000\nTITLE=AURA", ".env.example"), []);
});
