import js from "@eslint/js";
import tseslint from "typescript-eslint";

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
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: ["cc", "wechat", "wx-server-sdk", "openai"],
          patterns: ["@cloudbase/*", "@anthropic-ai/*"],
        },
      ],
      "no-restricted-globals": [
        "error",
        "console",
        "process",
        "window",
        "document",
        "fetch",
        "localStorage",
        "globalThis",
        "crypto",
        "performance",
        "XMLHttpRequest",
        "WebSocket",
        "navigator",
        "location",
        "require",
        "Date",
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.object.name='Math'][callee.property.name='random']",
          message:
            "Domain randomness must use the deterministic random module.",
        },
      ],
    },
  },
);
