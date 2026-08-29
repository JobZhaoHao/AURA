import js from "@eslint/js";
import tseslint from "typescript-eslint";

const restrictedDomainGlobals = [
  "console",
  "process",
  "window",
  "document",
  "fetch",
  "localStorage",
  "globalThis",
  "global",
  "crypto",
  "performance",
  "XMLHttpRequest",
  "WebSocket",
  "navigator",
  "location",
  "require",
  "Date",
];

const safeMathMembers = new Set([
  "E",
  "LN10",
  "LN2",
  "LOG10E",
  "LOG2E",
  "PI",
  "SQRT1_2",
  "SQRT2",
  "abs",
  "acos",
  "acosh",
  "asin",
  "asinh",
  "atan",
  "atan2",
  "atanh",
  "cbrt",
  "ceil",
  "clz32",
  "cos",
  "cosh",
  "exp",
  "expm1",
  "floor",
  "fround",
  "hypot",
  "imul",
  "log",
  "log10",
  "log1p",
  "log2",
  "max",
  "min",
  "pow",
  "round",
  "sign",
  "sin",
  "sinh",
  "sqrt",
  "tan",
  "tanh",
  "trunc",
]);

const domainCapabilityPlugin = {
  meta: {
    name: "aura-domain-capabilities",
  },
  rules: {
    "safe-math-member": {
      meta: {
        type: "problem",
        schema: [],
        messages: {
          unsafeMember:
            "Domain code may access only safe numeric Math members; '{{member}}' is not allowed.",
        },
      },
      create(context) {
        return {
          MemberExpression(node) {
            if (
              node.object.type !== "Identifier" ||
              node.object.name !== "Math"
            ) {
              return;
            }

            const memberName = node.computed
              ? node.property.type === "Literal" &&
                typeof node.property.value === "string"
                ? node.property.value
                : undefined
              : node.property.type === "Identifier"
                ? node.property.name
                : undefined;

            if (memberName !== undefined && safeMathMembers.has(memberName)) {
              return;
            }

            context.report({
              node,
              messageId: "unsafeMember",
              data: {
                member: memberName ?? "non-literal computed member",
              },
            });
          },
        };
      },
    },
  },
};

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/temp/**",
      ".superpowers/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["packages/domain/**/*.{ts,tsx,cts,mts}"],
    linterOptions: {
      noInlineConfig: true,
    },
    plugins: {
      "aura-domain": domainCapabilityPlugin,
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: ["cc", "wechat", "wx-server-sdk", "openai"],
          patterns: ["@cloudbase/*", "@anthropic-ai/*"],
        },
      ],
      "no-restricted-globals": ["error", ...restrictedDomainGlobals],
      "aura-domain/safe-math-member": "error",
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message:
            "Domain randomness must use the deterministic random module.",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Identifier[name='Math']:not(MemberExpression[object.name='Math'] > Identifier[name='Math'])",
          message:
            "Domain code must access Math through a direct property; the Math object must not be aliased or passed.",
        },
      ],
    },
  },
  {
    files: ["packages/domain/test/history.test.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        ...restrictedDomainGlobals.filter((name) => name !== "global"),
      ],
    },
  },
);
