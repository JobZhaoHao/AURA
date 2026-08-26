import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { scanFiles, scanText } from "../check-secrets.mjs";

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

test("scanner recognizes generic PEM and OpenSSH private-key headers", () => {
  const input = [
    "-----BEGIN " + "PRIVATE KEY-----",
    "-----BEGIN " + "OPENSSH PRIVATE KEY-----",
  ].join("\n");
  assert.deepEqual(
    scanText(input, "keys.txt").map((finding) => finding.rule),
    ["private-key", "private-key"],
  );
});

test("scanner reads eligible text files regardless of filename and skips binary buffers", () => {
  const directory = mkdtempSync(join(tmpdir(), "aura-secrets-"));
  const files = [
    join(directory, "certificate.pem"),
    join(directory, "service.key"),
    join(directory, ".env.local"),
    join(directory, "credential"),
  ];
  const value = "SECRET" + "_KEY=" + "abc12345678901234567890";

  try {
    files.forEach((path) => writeFileSync(path, value));
    const binary = join(directory, "binary");
    writeFileSync(binary, Buffer.from([0, 1, 2, 3]));

    assert.equal(scanFiles([...files, binary]).length, 4);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("scanner ignores ordinary configuration values", () => {
  assert.deepEqual(scanText("PORT=3000\nTITLE=AURA", ".env.example"), []);
});
