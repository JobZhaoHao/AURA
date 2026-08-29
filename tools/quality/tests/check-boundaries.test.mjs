import test from "node:test";
import assert from "node:assert/strict";
import { findBoundaryViolations } from "../check-boundaries.mjs";

test("domain allows only exact approved packages and contained relative modules", () => {
  const source = [
    'import type { ReadingResult } from "@aura/contracts";',
    'export { CURRENT_READING_CONTENT_BUNDLE } from "@aura/content";',
    'import "./local.js";',
    'export * from "../src/nested.js";',
    'const local = import("./dynamic-local.js");',
    'const required = require("../src/required-local.js");',
  ].join("\n");

  assert.deepEqual(
    findBoundaryViolations(source, "packages/domain/src/x.ts"),
    [],
  );
});

test("domain rejects every unapproved package and approved-package subpath", () => {
  const source = [
    'import sdk = require("wechat");',
    'const engine = require("cc");',
    'import /* platform bridge */ cloud from "@cloudbase/functions";',
    'export { client } from "openai";',
    'export * from "@anthropic-ai/sdk";',
    'import "@aura/contracts/internal";',
    'import "@aura/content/cards";',
    'import "@aura/test-kits";',
    'import "zod";',
    'import "node:crypto";',
    'import "wx-server-sdk";',
  ].join("\n");

  assert.deepEqual(findBoundaryViolations(source, "packages/domain/src/x.ts"), [
    "wechat",
    "cc",
    "@cloudbase/functions",
    "openai",
    "@anthropic-ai/sdk",
    "@aura/contracts/internal",
    "@aura/content/cards",
    "@aura/test-kits",
    "zod",
    "node:crypto",
    "wx-server-sdk",
  ]);
});

test("domain rejects relative traversal, absolute and backslash-relative specifiers", () => {
  const source = [
    'import "../test/helpers.js";',
    'export * from "../../test-kits/src/fixtures.js";',
    'const app = import("../../../apps/game-client/src/x.js");',
    'const repository = require("../../../package.json");',
    'import "/absolute.js";',
    'import ".\\\\backslash-relative.js";',
  ].join("\n");

  assert.deepEqual(findBoundaryViolations(source, "packages/domain/src/x.ts"), [
    "../test/helpers.js",
    "../../test-kits/src/fixtures.js",
    "../../../apps/game-client/src/x.js",
    "../../../package.json",
    "/absolute.js",
    ".\\backslash-relative.js",
  ]);
});

test("domain reports every non-literal dynamic import and require", () => {
  const source = [
    'const packageName = "@aura/contracts";',
    "const dynamicImport = import(packageName);",
    "const templateImport = import(`./${packageName}.js`);",
    "const dynamicRequire = require(packageName);",
    "const missingRequireArgument = require();",
  ].join("\n");

  assert.deepEqual(findBoundaryViolations(source, "packages/domain/src/x.ts"), [
    "<non-literal import>",
    "<non-literal require>",
  ]);
});

test("non-domain code remains outside the domain allowlist", () => {
  assert.deepEqual(
    findBoundaryViolations(
      "import api from 'openai';",
      "packages/content/src/x.ts",
    ),
    [],
  );
});

test("game client rejects contract validation libraries at runtime", () => {
  const source = [
    'import { BuildInfoSchema } from "@aura/contracts";',
    'import { z } from "zod";',
  ].join("\n");

  assert.deepEqual(
    findBoundaryViolations(
      source,
      "apps/game-client/assets/scripts/platform/bridge.ts",
    ),
    ["@aura/contracts", "zod"],
  );
});

test("game client allows contract type-only imports", () => {
  assert.deepEqual(
    findBoundaryViolations(
      'import type { BuildInfo } from "@aura/contracts";',
      "apps/game-client/assets/scripts/platform/bridge.ts",
    ),
    [],
  );
});
