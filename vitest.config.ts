import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@aura/contracts": fileURLToPath(
        new URL("./packages/contracts/src/index.ts", import.meta.url),
      ),
      "@aura/content": fileURLToPath(
        new URL("./packages/content/src/index.ts", import.meta.url),
      ),
      "@aura/test-kits": fileURLToPath(
        new URL("./packages/test-kits/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    include: ["apps/**/*.test.ts", "packages/**/*.test.ts"],
  },
});
