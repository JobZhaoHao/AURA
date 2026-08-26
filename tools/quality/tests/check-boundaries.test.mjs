import test from "node:test";
import assert from "node:assert/strict";
import { findBoundaryViolations } from "../check-boundaries.mjs";

test("domain rejects platform imports", () => {
  const violations = findBoundaryViolations(
    "import wx from 'wechat';",
    "packages/domain/src/x.ts",
  );
  assert.deepEqual(violations, ["wechat"]);
});

test("domain rejects side-effect and dynamic platform imports", () => {
  const source = "import 'cc';\nconst sdk = import('wx-server-sdk');";
  const violations = findBoundaryViolations(source, "packages/domain/src/x.ts");
  assert.deepEqual(violations, ["cc", "wx-server-sdk"]);
});

test("domain rejects require, import-equals, comment-separated, and export platform references", () => {
  const source = [
    'import sdk = require("wechat");',
    'const engine = require("cc");',
    'import /* platform bridge */ cloud from "@cloudbase/functions";',
    'export { client } from "openai";',
    'export * from "@anthropic-ai/sdk";',
  ].join("\n");

  assert.deepEqual(findBoundaryViolations(source, "packages/domain/src/x.ts"), [
    "wechat",
    "cc",
    "@cloudbase/functions",
    "openai",
    "@anthropic-ai/sdk",
  ]);
});

test("non-domain code and safe domain imports remain allowed", () => {
  assert.deepEqual(
    findBoundaryViolations(
      "import api from 'openai';",
      "packages/content/src/x.ts",
    ),
    [],
  );
  assert.deepEqual(
    findBoundaryViolations(
      "import { z } from 'zod';",
      "packages/domain/src/x.ts",
    ),
    [],
  );
});
