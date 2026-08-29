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
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: ["cc", "wechat", "wx-server-sdk", "openai"],
          patterns: ["@cloudbase/*", "@anthropic-ai/*"],
        },
      ],
      "no-restricted-globals": ["error", ...restrictedDomainGlobals],
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
