import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import { ESLint } from "eslint";

const eslint = new ESLint();
const virtualDomainFile = resolve("packages/domain/src/__lint_probe__.ts");

const restrictedGlobals = [
  ["logging", "console.log('private');", "console"],
  ["Date function time", "Date();", "Date"],
  ["Date.now time", "Date.now();", "Date"],
  ["Date construction time", "new Date();", "Date"],
  [
    "cryptographic randomness",
    "crypto.getRandomValues(new Uint8Array(1));",
    "crypto",
  ],
  ["performance time", "performance.now();", "performance"],
  ["fetch networking", "fetch('https://example.test');", "fetch"],
  ["XHR networking", "new XMLHttpRequest();", "XMLHttpRequest"],
  ["WebSocket networking", "new WebSocket('wss://example.test');", "WebSocket"],
  ["global escape", "globalThis.fetch('https://example.test');", "globalThis"],
];

for (const [label, source, globalName] of restrictedGlobals) {
  test(`domain ESLint override rejects ${label}`, async () => {
    const [result] = await eslint.lintText(source, {
      filePath: virtualDomainFile,
    });

    assert.ok(result);
    assert.ok(
      result.messages.some(
        ({ ruleId, message }) =>
          ruleId === "no-restricted-globals" && message.includes(globalName),
      ),
      JSON.stringify(result.messages),
    );
  });
}

test("domain ESLint override retains the Math.random syntax gate", async () => {
  const [result] = await eslint.lintText("Math.random();", {
    filePath: virtualDomainFile,
  });

  assert.ok(result);
  assert.ok(
    result.messages.some(({ ruleId }) => ruleId === "no-restricted-syntax"),
    JSON.stringify(result.messages),
  );
});
