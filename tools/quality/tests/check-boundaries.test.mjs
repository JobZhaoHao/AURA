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
