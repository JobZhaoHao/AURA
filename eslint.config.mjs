import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
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
    },
  },
);
