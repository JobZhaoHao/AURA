# AURA Milestone 0 Engineering Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立可重复安装、可自动验证、可扩展到 Cocos 客户端与 CloudBase 的 AURA 工程底座，不实现任何塔罗业务功能。

**Architecture:** 使用 pnpm workspace 管理四个纯 TypeScript 共享包和两个首期应用壳。领域包保持平台无关；环境配置、Cocos 与 CloudBase 通过明确适配边界接入，所有检查由单一 `pnpm quality` 入口运行。

**Tech Stack:** Node.js 22.14.x、pnpm 10.15.0、TypeScript 5.9.2、Vitest 3.2.4、Zod 4.1.5、ESLint 9.33.0、Prettier 3.6.2、Cocos Creator 3.8.8 稳定版、CloudBase。

**Spec:** `docs/superpowers/specs/2026-08-26-aura-tarot-wechat-game-design.md`

## Global Constraints

- 本阶段只建立工程基础，不实现抽牌、牌义、经济、AI、商品或运营后台功能。
- 首发平台为微信小游戏，客户端采用竖屏单手操作。
- `packages/domain` 不得导入 Cocos、微信、CloudBase、Web 或 AI SDK。
- TypeScript 必须开启 `strict`；跨边界数据必须通过版本化 Schema 校验。
- 开发、测试和生产配置、数据库、密钥与资源桶必须隔离。
- 所有依赖使用精确版本并提交 `pnpm-lock.yaml`。
- 每个任务遵循失败测试、最小实现、验证、提交的顺序。

---

## File Map

```text
package.json                         根脚本和精确工具版本
pnpm-workspace.yaml                  workspace 范围
tsconfig.base.json                   共享严格 TypeScript 规则
tsconfig.json                        项目引用入口
eslint.config.mjs                    静态规则与领域边界
.prettierrc.json                     格式规则
.editorconfig                        编辑器一致性
.nvmrc                               Node 版本
tools/quality/tests/workspace.test.mjs  仓库结构契约
tools/quality/check-secrets.mjs      提交内容敏感信息扫描
tools/quality/tests/check-secrets.test.mjs 扫描器回归测试
packages/contracts/                  跨应用版本化数据契约
packages/domain/                     纯业务核心边界
packages/content/                    版本化内容入口
packages/test-kits/                  固定夹具和测试辅助边界
apps/game-client/                    Cocos Creator 3.8.8 空壳及平台桥接
apps/cloud-functions/                CloudBase 函数与服务端配置
.github/workflows/ci.yml             可移植 CI 门禁
docs/decisions/0001-architecture-boundaries.md  架构边界记录
docs/runbooks/local-development.md    本地开发与验证手册
```

### Task 1: Bootstrap the Reproducible Workspace

**Files:**

- Create: `tools/quality/tests/workspace.test.mjs`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `tsconfig.json`
- Create: `.editorconfig`
- Create: `.prettierrc.json`
- Create: `.nvmrc`
- Create: `packages/domain/package.json`
- Create: `packages/contracts/package.json`
- Create: `packages/content/package.json`
- Create: `packages/test-kits/package.json`

**Interfaces:**

- Consumes: approved design spec and repository root.
- Produces: `pnpm quality`, strict TypeScript defaults, and workspace package names `@aura/domain`, `@aura/contracts`, `@aura/content`, `@aura/test-kits`.

- [ ] **Step 1: Write the failing workspace topology test**

```js
// tools/quality/tests/workspace.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const required = [
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "packages/domain/package.json",
  "packages/contracts/package.json",
  "packages/content/package.json",
  "packages/test-kits/package.json",
];

test("repository exposes the approved workspace boundaries", () => {
  required.forEach((path) => assert.equal(existsSync(path), true, path));
  const root = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(root.private, true);
  assert.equal(root.packageManager, "pnpm@10.15.0");
});
```

- [ ] **Step 2: Run the topology test and confirm the intended failure**

Run: `node --test tools/quality/tests/workspace.test.mjs`

Expected: FAIL because `package.json` and workspace manifests do not exist.

- [ ] **Step 3: Create the root configuration and package manifests**

Use this root manifest; package manifests use their matching `@aura/*` name, `private: true`, `type: module`, and `src/index.ts` as the export.

```json
{
  "name": "aura",
  "private": true,
  "packageManager": "pnpm@10.15.0",
  "engines": { "node": "22.14.x" },
  "scripts": {
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "typecheck": "tsc -b",
    "test": "vitest run",
    "test:node": "node --test tools/quality/tests/*.test.mjs",
    "quality": "pnpm format:check && pnpm lint && pnpm typecheck && pnpm test:node && pnpm test"
  },
  "devDependencies": {
    "@eslint/js": "9.33.0",
    "@types/node": "22.15.30",
    "@vitest/coverage-v8": "3.2.4",
    "eslint": "9.33.0",
    "prettier": "3.6.2",
    "typescript": "5.9.2",
    "typescript-eslint": "8.39.1",
    "vitest": "3.2.4"
  }
}
```

`pnpm-workspace.yaml` includes `apps/*` and `packages/*`. `tsconfig.base.json` sets `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `useUnknownInCatchVariables`, `moduleResolution: Bundler`, and `target: ES2022`. Root `tsconfig.json` references the four package projects.

- [ ] **Step 4: Install and verify the workspace**

Run: `corepack enable`

Run: `pnpm install --frozen-lockfile=false`

Run: `node --test tools/quality/tests/workspace.test.mjs`

Expected: install succeeds, `pnpm-lock.yaml` is created, and the topology test passes.

- [ ] **Step 5: Commit the workspace contract**

```bash
git add package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json .editorconfig .prettierrc.json .nvmrc packages tools/quality/tests/workspace.test.mjs
git commit -m "build: bootstrap AURA workspace"
```

### Task 2: Establish Versioned Contracts and Pure Domain Boundaries

**Files:**

- Create: `packages/contracts/tsconfig.json`
- Create: `packages/contracts/src/version.ts`
- Create: `packages/contracts/src/health.ts`
- Create: `packages/contracts/src/index.ts`
- Create: `packages/contracts/test/health.test.ts`
- Create: `packages/domain/tsconfig.json`
- Create: `packages/domain/src/index.ts`
- Create: `packages/content/tsconfig.json`
- Create: `packages/content/src/index.ts`
- Create: `packages/test-kits/tsconfig.json`
- Create: `packages/test-kits/src/index.ts`
- Modify: `packages/contracts/package.json`

**Interfaces:**

- Consumes: TypeScript project settings from Task 1.
- Produces: `EnvironmentName`, `SchemaVersion`, `BuildInfo`, `HealthResponseSchema`, and platform-free package entry points.

- [ ] **Step 1: Write failing contract tests**

```ts
// packages/contracts/test/health.test.ts
import { describe, expect, it } from "vitest";
import { HealthResponseSchema } from "../src/index.js";

describe("HealthResponseSchema", () => {
  it("accepts a versioned healthy response", () => {
    expect(
      HealthResponseSchema.parse({
        schemaVersion: 1,
        status: "ok",
        environment: "test",
        build: { commit: "fdaf646", builtAt: "2026-08-26T00:00:00.000Z" },
      }).status,
    ).toBe("ok");
  });

  it("rejects unknown environments", () => {
    expect(() =>
      HealthResponseSchema.parse({
        schemaVersion: 1,
        status: "ok",
        environment: "local-production",
        build: { commit: "x", builtAt: "2026-08-26T00:00:00.000Z" },
      }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run the contract test and confirm failure**

Run: `pnpm vitest run packages/contracts/test/health.test.ts`

Expected: FAIL because `HealthResponseSchema` is not exported.

- [ ] **Step 3: Implement the minimal shared contracts**

```ts
// packages/contracts/src/version.ts
import { z } from "zod";

export const SchemaVersionSchema = z.literal(1);
export type SchemaVersion = z.infer<typeof SchemaVersionSchema>;
```

```ts
// packages/contracts/src/health.ts
import { z } from "zod";
import { SchemaVersionSchema } from "./version.js";

export const EnvironmentNameSchema = z.enum([
  "development",
  "test",
  "production",
]);
export type EnvironmentName = z.infer<typeof EnvironmentNameSchema>;

export const BuildInfoSchema = z.object({
  commit: z.string().min(1),
  builtAt: z.iso.datetime(),
});
export type BuildInfo = z.infer<typeof BuildInfoSchema>;

export const HealthResponseSchema = z.object({
  schemaVersion: SchemaVersionSchema,
  status: z.literal("ok"),
  environment: EnvironmentNameSchema,
  build: BuildInfoSchema,
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
```

`packages/contracts` adds exact dependency `zod: 4.1.5`. Each package `tsconfig.json` extends the root config with `composite: true`, `rootDir: src`, and `outDir: dist`. Entry files export only owned public types; domain exports no platform symbol.

- [ ] **Step 4: Run focused and workspace checks**

Run: `pnpm vitest run packages/contracts/test/health.test.ts`

Run: `pnpm typecheck`

Expected: both pass; generated declarations contain only package-owned imports.

- [ ] **Step 5: Commit the boundary skeleton**

```bash
git add packages
git commit -m "build: define shared package boundaries"
```

### Task 3: Add Automated Maintainability and Secret Gates

**Files:**

- Create: `eslint.config.mjs`
- Create: `tools/quality/check-secrets.mjs`
- Create: `tools/quality/tests/check-secrets.test.mjs`
- Create: `tools/quality/check-boundaries.mjs`
- Create: `tools/quality/tests/check-boundaries.test.mjs`
- Modify: `package.json`

**Interfaces:**

- Consumes: workspace paths and package names from Tasks 1–2.
- Produces: `pnpm check:secrets`, `pnpm check:boundaries`, and lint rules that reject platform imports from `packages/domain`.

- [ ] **Step 1: Write failing gate tests**

```js
// tools/quality/tests/check-boundaries.test.mjs
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
```

```js
// tools/quality/tests/check-secrets.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { scanText } from "../check-secrets.mjs";

test("scanner redacts and reports credential-like values", () => {
  const input = "SECRET" + "_KEY=" + "abc12345678901234567890";
  const findings = scanText(input, ".env.bad");
  assert.equal(findings.length, 1);
  assert.equal(findings[0].sample.includes("abc123"), false);
});
```

- [ ] **Step 2: Confirm both tests fail for missing exports**

Run: `node --test tools/quality/tests/check-boundaries.test.mjs tools/quality/tests/check-secrets.test.mjs`

Expected: FAIL because both checker modules are absent.

- [ ] **Step 3: Implement narrow deterministic gates**

```js
// tools/quality/check-boundaries.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";

const forbidden = [
  "cc",
  "wechat",
  "wx-server-sdk",
  "@cloudbase/",
  "openai",
  "@anthropic-ai/",
];

export function findBoundaryViolations(source, path) {
  if (!path.replaceAll("\\", "/").startsWith("packages/domain/")) return [];
  const modules = [
    ...source.matchAll(/(?:from\s+|import\s*\()\s*["']([^"']+)["']/g),
  ].map((m) => m[1]);
  return [
    ...new Set(
      modules.filter((name) =>
        forbidden.some((item) => name === item || name.startsWith(item)),
      ),
    ),
  ];
}

function sourceFiles(path) {
  return statSync(path).isDirectory()
    ? readdirSync(path).flatMap((name) => sourceFiles(`${path}/${name}`))
    : /\.[cm]?tsx?$/.test(path)
      ? [path]
      : [];
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const failures = sourceFiles(process.argv[2]).flatMap((path) =>
    findBoundaryViolations(readFileSync(path, "utf8"), path).map(
      (module) => `${path}: ${module}`,
    ),
  );
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  }
}
```

```js
// tools/quality/check-secrets.mjs
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const rules = [
  ["private-key", /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g],
  [
    "credential-assignment",
    /(?:SECRET|TOKEN|API_KEY|PRIVATE_KEY)[A-Z0-9_]*\s*[:=]\s*["']?([A-Za-z0-9_+\/=.-]{16,})/gi,
  ],
];

export function scanText(text, path) {
  return rules.flatMap(([rule, pattern]) =>
    [...text.matchAll(pattern)].map(() => ({
      path,
      rule,
      sample: "[REDACTED]",
    })),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], {
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .filter(
      (path) =>
        path && /\.(?:[cm]?[jt]sx?|json|ya?ml|toml|env|md)$/i.test(path),
    );
  const findings = files.flatMap((path) =>
    scanText(readFileSync(path, "utf8"), path),
  );
  findings.forEach(({ path, rule, sample }) =>
    console.error(`${path}: ${rule}: ${sample}`),
  );
  if (findings.length) process.exitCode = 1;
}
```

Add root scripts:

```json
{
  "check:boundaries": "node tools/quality/check-boundaries.mjs packages/domain/src",
  "check:secrets": "node tools/quality/check-secrets.mjs .",
  "quality": "pnpm format:check && pnpm lint && pnpm check:boundaries && pnpm check:secrets && pnpm typecheck && pnpm test:node && pnpm test"
}
```

- [ ] **Step 4: Run all maintainability gates**

Run: `node --test tools/quality/tests/*.test.mjs`

Run: `pnpm lint`

Run: `pnpm check:boundaries`

Run: `pnpm check:secrets`

Expected: all commands exit 0; a temporary domain import of `cc` makes the boundary check fail and is removed before commit.

- [ ] **Step 5: Commit the quality gates**

```bash
git add package.json eslint.config.mjs tools/quality
git commit -m "build: enforce maintainability and secret gates"
```

### Task 4: Implement Environment Isolation Contracts

**Files:**

- Create: `apps/cloud-functions/package.json`
- Create: `apps/cloud-functions/tsconfig.json`
- Create: `apps/cloud-functions/src/config/server-config.ts`
- Create: `apps/cloud-functions/test/server-config.test.ts`
- Create: `.env.example`
- Create: `config/environments/development.example.json`
- Create: `config/environments/test.example.json`
- Create: `config/environments/production.example.json`

**Interfaces:**

- Consumes: `EnvironmentNameSchema` from `@aura/contracts`.
- Produces: `loadServerConfig(source: Record<string, string | undefined>): ServerConfig` and `toPublicBuildInfo(config): BuildInfo`.

- [ ] **Step 1: Write failing isolation tests**

```ts
// apps/cloud-functions/test/server-config.test.ts
import { describe, expect, it } from "vitest";
import { loadServerConfig } from "../src/config/server-config.js";

describe("loadServerConfig", () => {
  it("rejects a production process using a development CloudBase environment", () => {
    expect(() =>
      loadServerConfig({
        AURA_ENV: "production",
        AURA_CLOUDBASE_ENV_ID: "aura-dev-001",
        AURA_BUILD_COMMIT: "abc",
        AURA_BUILD_TIME: "2026-08-26T00:00:00.000Z",
      }),
    ).toThrow(/production.*dev/i);
  });

  it("requires build identity", () => {
    expect(() =>
      loadServerConfig({
        AURA_ENV: "test",
        AURA_CLOUDBASE_ENV_ID: "aura-test-001",
      }),
    ).toThrow(/AURA_BUILD_COMMIT/);
  });
});
```

- [ ] **Step 2: Confirm the configuration tests fail**

Run: `pnpm vitest run apps/cloud-functions/test/server-config.test.ts`

Expected: FAIL because `loadServerConfig` does not exist.

- [ ] **Step 3: Implement strict parsing and public projection**

```ts
// apps/cloud-functions/src/config/server-config.ts
import { z } from "zod";
import {
  BuildInfoSchema,
  EnvironmentNameSchema,
  type BuildInfo,
  type EnvironmentName,
} from "@aura/contracts";

export interface ServerConfig {
  environment: EnvironmentName;
  cloudbaseEnvironmentId: string;
  buildCommit: string;
  buildTime: string;
}

const prefixes: Record<EnvironmentName, string> = {
  development: "aura-dev-",
  test: "aura-test-",
  production: "aura-prod-",
};

const SourceSchema = z.object({
  AURA_ENV: EnvironmentNameSchema,
  AURA_CLOUDBASE_ENV_ID: z.string().min(1),
  AURA_BUILD_COMMIT: z.string().min(1),
  AURA_BUILD_TIME: z.iso.datetime(),
});

export function loadServerConfig(
  source: Record<string, string | undefined>,
): ServerConfig {
  const value = SourceSchema.parse(source);
  if (!value.AURA_CLOUDBASE_ENV_ID.startsWith(prefixes[value.AURA_ENV])) {
    throw new Error(
      `${value.AURA_ENV} CloudBase environment ID has the wrong prefix`,
    );
  }
  return {
    environment: value.AURA_ENV,
    cloudbaseEnvironmentId: value.AURA_CLOUDBASE_ENV_ID,
    buildCommit: value.AURA_BUILD_COMMIT,
    buildTime: value.AURA_BUILD_TIME,
  };
}

export function toPublicBuildInfo(config: ServerConfig): BuildInfo {
  return BuildInfoSchema.parse({
    commit: config.buildCommit,
    builtAt: config.buildTime,
  });
}
```

The three example JSON files contain distinct non-secret IDs: `aura-dev-example`, `aura-test-example`, and `aura-prod-example`. `.env.example` documents variable names with safe example values and is allowed by `.gitignore`.

- [ ] **Step 4: Verify isolation and redaction**

Run: `pnpm vitest run apps/cloud-functions/test/server-config.test.ts`

Run: `pnpm check:secrets`

Run: `pnpm typecheck`

Expected: all pass and no output contains environment credentials.

- [ ] **Step 5: Commit environment isolation**

```bash
git add apps/cloud-functions config .env.example
git commit -m "build: isolate runtime environments"
```

### Task 5: Create the Cocos Client Shell Without Gameplay

**Files:**

- Create via Cocos Creator 3.8.8: `apps/game-client/assets/scenes/Bootstrap.scene`
- Create/update via Cocos: `apps/game-client/package.json`
- Create: `apps/game-client/assets/scripts/bootstrap/GameBootstrap.ts`
- Create: `apps/game-client/assets/scripts/platform/PlatformBridge.ts`
- Create: `apps/game-client/assets/scripts/platform/DevelopmentPlatformBridge.ts`
- Create: `apps/game-client/test/platform-bridge.test.ts`
- Create/update via Cocos: `apps/game-client/project.json`
- Create/update via Cocos: `apps/game-client/settings/v2/packages/project.json`
- Create/update via Cocos: `apps/game-client/tsconfig.json`

**Interfaces:**

- Consumes: `BuildInfo` from `@aura/contracts`.
- Produces: `PlatformBridge.getBuildInfo(): Promise<BuildInfo>` and a portrait bootstrap scene that displays a non-production diagnostic label.

- [ ] **Step 1: Write the failing platform bridge test**

```ts
// apps/game-client/test/platform-bridge.test.ts
import { describe, expect, it } from "vitest";
import { DevelopmentPlatformBridge } from "../assets/scripts/platform/DevelopmentPlatformBridge.js";

describe("DevelopmentPlatformBridge", () => {
  it("returns schema-valid local build information", async () => {
    const info = await new DevelopmentPlatformBridge({
      commit: "local",
      builtAt: "2026-08-26T00:00:00.000Z",
    }).getBuildInfo();
    expect(info.commit).toBe("local");
  });
});
```

- [ ] **Step 2: Confirm the bridge test fails**

Run: `pnpm vitest run apps/game-client/test/platform-bridge.test.ts`

Expected: FAIL because the bridge implementation is absent.

- [ ] **Step 3: Create the editor project and minimal bridge**

Create the project with Cocos Creator 3.8.8, set design resolution to `750 × 1334`, portrait orientation, Fit Width enabled, and the bootstrap scene as the first scene. Use these platform files:

```ts
// apps/game-client/assets/scripts/platform/PlatformBridge.ts
import type { BuildInfo } from "@aura/contracts";

export interface PlatformBridge {
  getBuildInfo(): Promise<BuildInfo>;
}
```

```ts
// apps/game-client/assets/scripts/platform/DevelopmentPlatformBridge.ts
import { BuildInfoSchema, type BuildInfo } from "@aura/contracts";
import type { PlatformBridge } from "./PlatformBridge.js";

export class DevelopmentPlatformBridge implements PlatformBridge {
  public constructor(private readonly buildInfo: BuildInfo) {}
  public async getBuildInfo(): Promise<BuildInfo> {
    return BuildInfoSchema.parse(this.buildInfo);
  }
}
```

```ts
// apps/game-client/assets/scripts/bootstrap/GameBootstrap.ts
import { _decorator, Component, Label } from "cc";
import { DevelopmentPlatformBridge } from "../platform/DevelopmentPlatformBridge.js";
const { ccclass, property } = _decorator;

@ccclass("GameBootstrap")
export class GameBootstrap extends Component {
  @property(Label) public diagnosticLabel: Label | null = null;

  public async start(): Promise<void> {
    const bridge = new DevelopmentPlatformBridge({
      commit: "local",
      builtAt: "1970-01-01T00:00:00.000Z",
    });
    const build = await bridge.getBuildInfo();
    if (this.diagnosticLabel)
      this.diagnosticLabel.string = `AURA / development / ${build.commit}`;
  }
}
```

The scene contains one Canvas, one Camera, and one Label wired to `GameBootstrap.diagnosticLabel`; it contains no tarot rules or production credentials.

- [ ] **Step 4: Verify editor and automated behavior**

Run: `pnpm vitest run apps/game-client/test/platform-bridge.test.ts`

Run: `pnpm typecheck`

In Cocos Creator 3.8.8: open `apps/game-client`, run `Bootstrap.scene`, then build a WeChat Mini Game development package.

Expected: tests and typecheck pass; preview is portrait, has no console error, and shows only the diagnostics label.

- [ ] **Step 5: Commit the client shell**

```bash
git add apps/game-client
git commit -m "build: add Cocos client shell"
```

### Task 6: Add a Contract-Tested Cloud Health Slice

**Files:**

- Create: `apps/cloud-functions/src/health/handler.ts`
- Create: `apps/cloud-functions/test/health.test.ts`
- Modify: `apps/cloud-functions/src/index.ts`

**Interfaces:**

- Consumes: `loadServerConfig` from Task 4 and `HealthResponse` from `@aura/contracts`.
- Produces: `healthHandler(): Promise<HealthResponse>`; no database, player data or external network access.

- [ ] **Step 1: Write the failing health handler test**

```ts
// apps/cloud-functions/test/health.test.ts
import { describe, expect, it, vi } from "vitest";
import { HealthResponseSchema } from "@aura/contracts";
import { healthHandler } from "../src/health/handler.js";

describe("healthHandler", () => {
  it("returns the shared versioned contract", async () => {
    vi.stubEnv("AURA_ENV", "test");
    vi.stubEnv("AURA_CLOUDBASE_ENV_ID", "aura-test-example");
    vi.stubEnv("AURA_BUILD_COMMIT", "abc123");
    vi.stubEnv("AURA_BUILD_TIME", "2026-08-26T00:00:00.000Z");
    expect(HealthResponseSchema.parse(await healthHandler()).status).toBe("ok");
    vi.unstubAllEnvs();
  });
});
```

- [ ] **Step 2: Confirm the health test fails**

Run: `pnpm vitest run apps/cloud-functions/test/health.test.ts`

Expected: FAIL because `healthHandler` does not exist.

- [ ] **Step 3: Implement the minimum handler**

```ts
// apps/cloud-functions/src/health/handler.ts
import { HealthResponseSchema, type HealthResponse } from "@aura/contracts";
import {
  loadServerConfig,
  toPublicBuildInfo,
} from "../config/server-config.js";

export async function healthHandler(): Promise<HealthResponse> {
  const config = loadServerConfig(process.env);
  return HealthResponseSchema.parse({
    schemaVersion: 1,
    status: "ok",
    environment: config.environment,
    build: toPublicBuildInfo(config),
  });
}
```

- [ ] **Step 4: Run contract and full workspace verification**

Run: `pnpm vitest run apps/cloud-functions/test/health.test.ts packages/contracts/test/health.test.ts`

Run: `pnpm quality`

Expected: all checks pass and health output exposes no CloudBase environment ID or secret.

- [ ] **Step 5: Commit the health slice**

```bash
git add apps/cloud-functions
git commit -m "feat: add versioned cloud health check"
```

### Task 7: Make Quality Reproducible in CI and Document the Boundary

**Files:**

- Create: `.github/workflows/ci.yml`
- Create: `docs/decisions/0001-architecture-boundaries.md`
- Create: `docs/runbooks/local-development.md`
- Create: `tools/quality/tests/documentation.test.mjs`
- Modify: `README.md`

**Interfaces:**

- Consumes: `pnpm quality`, the Cocos manual check, and all package/application boundaries.
- Produces: one CI gate, one local setup path, and an auditable Milestone 0 acceptance checklist.

- [ ] **Step 1: Write a failing documentation contract test**

```js
// tools/quality/tests/documentation.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("runbook names every required verification command", () => {
  const text = readFileSync("docs/runbooks/local-development.md", "utf8");
  [
    "pnpm install --frozen-lockfile",
    "pnpm quality",
    "Cocos Creator 3.8.8",
    "WeChat Mini Game",
  ].forEach((item) => {
    assert.equal(text.includes(item), true, item);
  });
});
```

- [ ] **Step 2: Confirm the documentation test fails**

Run: `node --test tools/quality/tests/documentation.test.mjs`

Expected: FAIL because the runbook is absent.

- [ ] **Step 3: Add CI, decision record, runbook, and concise README**

```yaml
# .github/workflows/ci.yml
name: quality
on:
  pull_request:
  push:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22.14.0
          cache: pnpm
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm quality
```

`0001-architecture-boundaries.md` records status `Accepted`, context, the inward-only dependency decision, forbidden imports, consequences, and reversal criteria. `local-development.md` contains prerequisites, `pnpm install --frozen-lockfile`, `pnpm quality`, Cocos Creator 3.8.8 preview, WeChat Mini Game development build, environment-file placement, and secret incident steps. README links to the approved spec, roadmap, current plan, decision record and runbook.

- [ ] **Step 4: Perform the Milestone 0 acceptance run**

Run: `pnpm install --frozen-lockfile`

Run: `pnpm quality`

Run: `git status --short`

In Cocos Creator: preview `Bootstrap.scene` and build the WeChat Mini Game development package.

Expected: all automated checks pass; Cocos preview/build succeeds; Git shows only the planned documentation/CI changes before commit; no tarot gameplay is present.

- [ ] **Step 5: Commit the foundation candidate**

```bash
git add .github README.md docs/decisions docs/runbooks tools/quality/tests/documentation.test.mjs
git commit -m "ci: enforce milestone zero quality gate"
```

- [ ] **Step 6: Obtain owner approval and tag the accepted foundation**

Present the automated results and Cocos/WeChat preview evidence in the main Codex task. After the product owner explicitly approves, run:

```bash
git tag -a milestone-0-foundation -m "AURA engineering foundation accepted"
git show --stat milestone-0-foundation
```

Expected: the tag points to the reviewed foundation commit and no later gameplay commit.

## Milestone 0 Exit Gate

Milestone 0 is complete only when all conditions are true:

- Fresh checkout installs with the committed lockfile.
- `pnpm quality` exits 0.
- Domain boundary and secret scanner negative tests prove the gates can fail.
- Development, test and production configuration examples are distinct and contain no credentials.
- Cocos Creator 3.8.8 opens the project, previews the portrait bootstrap scene and builds a WeChat Mini Game development package.
- Cloud health response validates against `HealthResponseSchema` and leaks no server identifier or secret.
- Decision record and local runbook are accurate.
- Product owner approves the foundation from the main Codex task before Milestone 1 planning begins.
