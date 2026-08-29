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
  [
    "Node global fetch escape",
    "global.fetch('https://example.test');",
    "global",
  ],
  ["Node global Math escape", "global.Math.random();", "global"],
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

const randomPropertyAcquisitions = [
  ["direct call", "Math.random();"],
  ["aliased call", "const random = Math.random; random();"],
  ["computed call", 'Math["random"]();'],
  ["destructured call", "const { random } = Math; random();"],
  ["optional call", "Math?.random();"],
  ["optional computed call", 'Math?.["random"]();'],
  ["renamed destructured call", "const { random: rng } = Math; rng();"],
  ["computed destructured call", 'const { ["random"]: rng } = Math; rng();'],
];

for (const [label, source] of randomPropertyAcquisitions) {
  test(`domain ESLint override rejects Math.random ${label}`, async () => {
    const [result] = await eslint.lintText(source, {
      filePath: virtualDomainFile,
    });

    assert.ok(result);
    assert.ok(
      result.messages.some(
        ({ ruleId, message }) =>
          ruleId === "no-restricted-properties" &&
          message.includes("Domain randomness"),
      ),
      JSON.stringify(result.messages),
    );
  });
}

test("domain ESLint override allows safe Math properties", async () => {
  const source = [
    "Math.max(1, 2);",
    "const abs = Math.abs; abs(-1);",
    "const { floor } = Math; floor(1.2);",
  ].join("\n");
  const [result] = await eslint.lintText(source, {
    filePath: virtualDomainFile,
  });

  assert.ok(result);
  assert.equal(
    result.messages.some(({ ruleId }) => ruleId === "no-restricted-properties"),
    false,
    JSON.stringify(result.messages),
  );
});

const inlineEscapeProbes = [
  [
    "restricted global",
    [
      "// eslint-disable-next-line no-restricted-globals",
      "globalThis.fetch('https://example.test');",
    ].join("\n"),
    "no-restricted-globals",
  ],
  [
    "random property",
    [
      "// eslint-disable-next-line no-restricted-properties",
      "Math.random();",
    ].join("\n"),
    "no-restricted-properties",
  ],
];

for (const [label, source, capabilityRuleId] of inlineEscapeProbes) {
  test(`domain ESLint override ignores inline disable for ${label}`, async () => {
    const [result] = await eslint.lintText(source, {
      filePath: virtualDomainFile,
    });

    assert.ok(result);
    assert.ok(
      result.messages.some(({ ruleId }) => ruleId === capabilityRuleId),
      JSON.stringify(result.messages),
    );
  });
}
