import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const required = [
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "packages/domain/package.json",
  "packages/contracts/package.json",
  "packages/content/package.json",
  "packages/test-kits/package.json",
];

test("repository exposes the approved workspace boundaries", () => {
  required.forEach((path) => assert.equal(existsSync(path), true, path));
  const root = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(root.private, true);
  assert.equal(root.packageManager, "pnpm@10.15.0");
});
