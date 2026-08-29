# AURA M1 Phase 2 Single-Card Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在纯 TypeScript 领域层交付可确定性重放的单张问答闭环，包括严格输入、固定种子抽牌、正逆位、规则解读、安全响应、图鉴和手动历史。

**Architecture:** `@aura/content` 提供不可拆分的当前内容 bundle；`@aura/domain` 通过严格解析器接收暂态输入，以独立 card/orientation 随机流生成结果，再由互不隐式调用的图鉴与历史纯函数处理用户动作。公共入口不暴露 RNG、bundle 注入或表现资源，所有错误统一转换为无敏感数据的 `DomainError`。

**Tech Stack:** Node.js 22.14.x、pnpm 10.15.0、TypeScript 5.9.2、Zod 4.1.5（仅通过 contracts Schema 间接使用）、Vitest 3.2.4。

**Spec:** `docs/superpowers/specs/2026-08-29-aura-m1-phase-2-single-card-domain-design.md`

## Global Constraints

- Phase 1 交付基线是 `6c4e0ce31da2fd70b374093b3d1bcdcedd84de04`。
- Phase 2 已确认设计基线是分支 `codex/m1-phase-2-design` 的提交 `78b78c3e3a8c3bd94cb9754c543ba7d0eb58c17f`；不得绕过该规格从 Phase 1 另起。正式实现只能从“已提交本计划”的后继 HEAD 启动，开工记录必须写明该计划提交 SHA。
- 产品所有者确认书面规格不等于授权功能实现。在总控记录产品所有者明确的 Phase 2 实现授权前，只能审查并提交规格/计划文档；不得执行 Task 1–8，不得修改生产、测试、依赖或质量门禁文件。
- 规格确认状态更新与本实施计划必须在同一个文档提交中原子固化；该提交完成且 tracked worktree 恢复干净后，才能形成可供授权的实施起点。
- 开工前 tracked worktree 与暂存区必须为空；唯一允许的未跟踪例外是 `.pnpm-store/`，不得删除、暂存或提交。
- `packages/domain` 只允许依赖 `@aura/contracts`、`@aura/content` 和相对模块；不得导入平台 API、Node API、`zod`、`@aura/test-kits` 运行时代码或其他 bare module。
- Domain 源码不得使用 `Math.random`、系统时间、环境变量、日志、网络、浏览器对象或模块级可变状态。
- 原始问题及其哈希不得进入 seed、sessionId、结果、错误、历史、图鉴、日志或快照。
- `high-risk` 只改变 `safetyNotice`；不得改变 draw、summary、interpretation 或 advice。
- 不实现 Cocos、页面、动画、资源加载、本地存储适配、输入分类器、每日一牌、三牌阵、多张不重复抽取、历史删除/清空、AI、VIP、支付、云端、分享或资源分发。
- 每个任务严格执行：feature-specific RED → 确认真实预期失败 → 最小实现 → 定向回归与类型检查 → 单独提交 → 规格审查 → 代码/安全审查。
- 每个 RED 在运行前必须先创建可编译的最小 API stub 和所需配置；stub 只能返回明显错误值或抛出 `new Error("NOT_IMPLEMENTED")`。缺文件、缺导出、TS5058、模块解析失败、运行器失败或配置收集失败都不算 RED；RED 证据必须命中该任务的行为断言，类型品牌 RED 必须表现为未使用的 `@ts-expect-error`。
- 未获得新授权不得 push、merge、打 tag、启动 Phase 3 或创建 Phase 3/4/M2 实现。

---

## Implementation Authorization Gate

Task 1 开始前，总控必须同时记录：产品所有者明确批准“开始 Phase 2 实现”的原文、包含本计划的起点提交 SHA、当前分支、干净 tracked worktree 证据及 `.pnpm-store/` 唯一例外。缺少任一项时，实施者必须停止，且不得用规格确认、计划确认或审查通过代替实现授权。

---

## File Ownership Map

### Content

- `packages/content/src/safety.ts`：唯一统一 high-risk 文本。
- `packages/content/src/reading-content-bundle.ts`：原子组合三版本、canonical catalog、牌义和 high-risk 模板。
- `packages/content/test/safety-template.test.ts`：固定模板和 bundle 完整性。

### Domain

- `packages/domain/src/errors.ts`：安全错误码、允许字段和序列化。
- `packages/domain/src/single-reading-input.ts`：严格输入解析与 compile-time brand。
- `packages/domain/src/deterministic-random.ts`：FNV-1a、Mulberry32 和 domain-separated sample。
- `packages/domain/src/reading-content.ts`：canonical membership、bundle 读取和版本比较。
- `packages/domain/src/single-card-draw.ts`：单卡及方向映射。
- `packages/domain/src/narrative.ts`：规则解读与安全提示拼装。
- `packages/domain/src/single-reading.ts`：完整单张结果和语义 refinement。
- `packages/domain/src/discovery.ts`：图鉴集合验证与幂等追加。
- `packages/domain/src/history.ts`：手动历史构造、追加、冲突判断和重放。
- `packages/domain/src/index.ts`：只导出稳定公共入口。

### Tests and gates

- `packages/domain/test/helpers.ts`：共享安全错误断言。
- `packages/domain/test/*.test.ts`：各责任单元的运行时测试。
- `packages/domain/test/public-api-types.ts`：compile-time brand 断言，不进入 Vitest。
- `packages/domain/tsconfig.type-tests.json`：domain 类型回归门。
- `tools/quality/check-boundaries.mjs`：domain bare-import allowlist。
- `tools/quality/tests/check-boundaries.test.mjs`：allowlist 回归。

---

### Task 1: Safe Domain Input and Type Gate

**Files:**

- Create: `packages/domain/src/errors.ts`
- Create: `packages/domain/src/single-reading-input.ts`
- Create: `packages/domain/test/helpers.ts`
- Create: `packages/domain/test/input.test.ts`
- Create: `packages/domain/test/public-api-types.ts`
- Create: `packages/domain/tsconfig.type-tests.json`
- Modify: `packages/domain/package.json`
- Modify: `packages/domain/tsconfig.json`
- Modify: `packages/test-kits/src/fixtures/readings.ts`
- Modify: `packages/test-kits/test/fixtures.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: `QuestionCategorySchema`, `SafetyDispositionSchema`, `ReadingSessionSchema` and `FIXED_READING_INPUT`.
- Produces:

```ts
export type DomainErrorCode =
  | "INVALID_READING_INPUT"
  | "UNKNOWN_CARD_CONTENT"
  | "INVALID_DISCOVERY_STATE"
  | "INVALID_HISTORY_ENTRY"
  | "HISTORY_SESSION_CONFLICT"
  | "UNSUPPORTED_REPLAY_VERSION";

export type DomainErrorField =
  | "input"
  | "seed"
  | "sessionId"
  | "questionCategory"
  | "safetyDisposition"
  | "reversalsEnabled"
  | "createdAt"
  | "cardId"
  | "revealedAt"
  | "discovery"
  | "result"
  | "savedAt"
  | "history"
  | "themeRef"
  | "deckRef"
  | "version";

export interface SerializedDomainError {
  readonly code: DomainErrorCode;
  readonly field?: DomainErrorField;
}

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly field?: DomainErrorField;
  constructor(code: DomainErrorCode, field?: DomainErrorField);
  toJSON(): SerializedDomainError;
}

export type SingleReadingInput = Readonly<{
  seed: string;
  sessionId: string;
  questionCategory: QuestionCategory;
  safetyDisposition: SafetyDisposition;
  reversalsEnabled: boolean;
  createdAt: string;
}> &
  ParsedSingleReadingInputBrand;

export function parseSingleReadingInput(value: unknown): SingleReadingInput;
```

- [ ] **Step 1: Write the fixture, runtime-input, error-redaction and type-brand tests**

Update the expected fixture to include `reversalsEnabled: true`, and destructure both transient fields before `ReadingSessionSchema`:

```ts
const { seed, reversalsEnabled, ...sessionInput } = FIXED_READING_INPUT;
expect(seed).toBe("aura-m1-fixed-seed");
expect(reversalsEnabled).toBe(true);
```

Create `input.test.ts` with the exact valid object and these rejection groups:

```ts
const validInput = {
  seed: "aura-m1-fixed-seed",
  sessionId: "fixture-session-001",
  questionCategory: "general",
  safetyDisposition: "standard",
  reversalsEnabled: true,
  createdAt: "2026-08-28T00:00:00.000Z",
} as const;

it.each([
  { ...validInput, rawQuestion: "PRIVATE_QUESTION_SENTINEL" },
  { ...validInput, questionText: "PRIVATE_QUESTION_SENTINEL" },
  { ...validInput, rulesVersion: "m1-rules-v1" },
  { ...validInput, themeId: "moonlight-healing" },
  { ...validInput, seed: "short" },
  { ...validInput, seed: "含中文的种子不允许000000" },
  { ...validInput, sessionId: "https://example.test/private" },
])("rejects strict or non-opaque input %#", (candidate) => {
  expect(() => parseSingleReadingInput(candidate)).toThrow(DomainError);
});
```

Create `public-api-types.ts`:

```ts
import type { SingleReadingInput } from "../src/single-reading-input.js";
import { parseSingleReadingInput } from "../src/single-reading-input.js";

declare function acceptParsedInput(input: SingleReadingInput): void;

const raw = {
  seed: "aura-m1-fixed-seed",
  sessionId: "fixture-session-001",
  questionCategory: "general",
  safetyDisposition: "standard",
  reversalsEnabled: true,
  createdAt: "2026-08-28T00:00:00.000Z",
} as const;

// @ts-expect-error A raw object must pass parseSingleReadingInput first.
acceptParsedInput(raw);
acceptParsedInput(parseSingleReadingInput(raw));
```

- [ ] **Step 2: Add dependency/configuration scaffolding and compiling RED stubs**

Before collecting RED, set `packages/domain/package.json` runtime dependencies to `@aura/contracts` and `@aura/content`, devDependency to `@aura/test-kits`, and use the same `types/default` export map as other packages. Add contracts/content project references to `packages/domain/tsconfig.json`.

Create the type project before invoking it:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "noEmit": true, "skipLibCheck": true },
  "include": ["test/public-api-types.ts"]
}
```

Append `tsc -p packages/domain/tsconfig.type-tests.json` to the root `typecheck` script and update the lockfile with `pnpm install --lockfile-only`. Run `pnpm install --frozen-lockfile` and `pnpm exec tsc -p packages/domain/tsconfig.json` before the RED commands; both must succeed, proving package links, references and source-module resolution are green. The separate type-test project is then expected to fail only on the deliberately unused `@ts-expect-error`.

Create `errors.ts` and `single-reading-input.ts` with the final public signatures, but initially define `SingleReadingInput` without its brand and make `parseSingleReadingInput` throw `new Error("NOT_IMPLEMENTED")`. The runtime test must include a valid-input success assertion, so the stub cannot pass by throwing. At this point every import/configuration path must compile; only the intended behavior and unused `@ts-expect-error` may remain red.

- [ ] **Step 3: Run the focused tests and type project to verify behavioral RED**

Run:

```powershell
pnpm vitest run packages/test-kits/test/fixtures.test.ts packages/domain/test/input.test.ts
pnpm exec tsc -p packages/domain/tsconfig.type-tests.json
```

Expected: runtime RED names the valid parse/error-envelope assertion; type RED is an unused `@ts-expect-error` because the initial input type is still structurally forgeable. A runner/bootstrap/configuration failure is not acceptable evidence.

- [ ] **Step 4: Implement the safe error envelope**

Use fixed messages and no `cause`:

```ts
const ERROR_MESSAGES: Record<DomainErrorCode, string> = {
  INVALID_READING_INPUT: "The reading input is invalid.",
  UNKNOWN_CARD_CONTENT: "The card content is unavailable.",
  INVALID_DISCOVERY_STATE: "The discovery state is invalid.",
  INVALID_HISTORY_ENTRY: "The history entry is invalid.",
  HISTORY_SESSION_CONFLICT: "The history session conflicts.",
  UNSUPPORTED_REPLAY_VERSION: "The replay version is unsupported.",
};

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly field?: DomainErrorField;

  constructor(code: DomainErrorCode, field?: DomainErrorField) {
    super(ERROR_MESSAGES[code]);
    Object.defineProperty(this, "name", {
      configurable: true,
      value: "DomainError",
    });
    this.code = code;
    if (field !== undefined) this.field = field;
  }

  toJSON(): SerializedDomainError {
    return this.field === undefined
      ? { code: this.code }
      : { code: this.code, field: this.field };
  }
}
```

`expectSafeDomainError` must check `String(error)`, `Object.keys(error)`, `JSON.stringify(error)`, absence of public `cause`, and absence of every supplied sentinel.

- [ ] **Step 5: Implement strict parsing and compile-time/runtime branding**

Declare the non-exported runtime brand exactly as:

```ts
const parsedSingleReadingInput: unique symbol = Symbol(
  "ParsedSingleReadingInput",
);
type ParsedSingleReadingInputBrand = {
  readonly [parsedSingleReadingInput]: true;
};
```

Perform exact string-key comparison before field parsing and reject every caller-supplied symbol. Use the opaque regex `^[A-Za-z0-9_-]{16,128}$`, `QuestionCategorySchema`, `SafetyDispositionSchema`, plus `ReadingSessionSchema.shape.sessionId` and `ReadingSessionSchema.shape.createdAt`; validate `reversalsEnabled` with `typeof value === "boolean"`. Build a new owned object, add the private symbol with `Object.defineProperty(..., { value: true, enumerable: false })`, then freeze it. Catch all parser/schema errors and throw `new DomainError("INVALID_READING_INPUT", safeField)` without attaching the original error.

Extract a private field validator used by both entry paths. Add an internal `assertParsedSingleReadingInput` that requires the private symbol, exact six public keys, no foreign symbols, frozen state, and then revalidates all public fields through that shared validator; it must not call the public parser, because the parser is the operation that grants the brand. `createSingleReading` must use this assertion before any computation. Runtime tests must prove that an exact-shape plain object forced through `as unknown as SingleReadingInput` is rejected, while the actual parser result is accepted and its brand is absent from `Object.keys` and JSON.

The parser must reject missing keys and every unknown key rather than stripping them. Boundary-length tests must cover 15, 16, 128 and 129 ASCII characters.

- [ ] **Step 6: Run GREEN verification**

Run:

```powershell
pnpm vitest run packages/test-kits/test/fixtures.test.ts packages/domain/test/input.test.ts
pnpm exec tsc -p packages/domain/tsconfig.type-tests.json
pnpm typecheck
```

Expected: all pass. Temporarily remove the brand from `SingleReadingInput`; standard `pnpm typecheck` must fail with unused `@ts-expect-error`. Restore the brand and rerun GREEN before committing.

- [ ] **Step 7: Commit and request independent safety review**

```powershell
git add package.json pnpm-lock.yaml packages/domain/package.json packages/domain/tsconfig.json packages/domain/tsconfig.type-tests.json packages/domain/src/errors.ts packages/domain/src/single-reading-input.ts packages/domain/test/helpers.ts packages/domain/test/input.test.ts packages/domain/test/public-api-types.ts packages/test-kits/src/fixtures/readings.ts packages/test-kits/test/fixtures.test.ts
git commit -m "feat(domain): validate single reading inputs"
```

Review gate: strict unknown fields, brand gate, fixture migration, no sensitive error data, no `.pnpm-store/` in commit.

---

### Task 2: Atomic Reading Content Bundle

**Files:**

- Create: `packages/content/src/safety.ts`
- Create: `packages/content/src/reading-content-bundle.ts`
- Create: `packages/content/test/safety-template.test.ts`
- Modify: `packages/content/src/index.ts`

**Interfaces:**

```ts
export interface ReadingContentBundle {
  readonly rulesVersion: ManifestVersion;
  readonly contentVersion: ManifestVersion;
  readonly textVersion: ManifestVersion;
  readonly cardCatalog: readonly CardMetadata[];
  readonly cardMeanings: Readonly<Record<CardId, CardMeaningRecord>>;
  readonly highRiskSafetyTemplate: string;
}

export const CURRENT_READING_CONTENT_BUNDLE: ReadingContentBundle;
```

- [ ] **Step 1: Write the failing content tests**

Freeze this exact template in the test:

```ts
const EXPECTED_HIGH_RISK_TEMPLATE =
  "塔罗不能评估现实风险，也不能替代医疗、法律、投资或危机专业支持。请勿依据本解读作出不可逆决定。若存在即时危险或自伤、伤人念头，请立即前往安全地点，联系当地紧急或危机服务，并联系可信赖的人或合格专业人员。";
```

Assert the bundle equals the three current version constants, exposes 78 catalog entries in canonical order, maps every ID to a meaning, and contains the exact template.

Create compiling exports with an empty template and empty/wrong bundle fields before RED; do not leave the modules or exports missing.

- [ ] **Step 2: Run the content test to verify RED**

Run:

```powershell
pnpm vitest run packages/content/test/safety-template.test.ts packages/content/test/spreads.test.ts
```

Expected: behavioral RED names the exact template, version or 78-card bundle assertion; missing modules/exports do not count.

- [ ] **Step 3: Implement the content-owned template and bundle**

`safety.ts` exports only the exact constant. `reading-content-bundle.ts` uses:

```ts
export const CURRENT_READING_CONTENT_BUNDLE = {
  rulesVersion: RULES_VERSION,
  contentVersion: CONTENT_VERSION,
  textVersion: TEXT_VERSION,
  cardCatalog: CARD_CATALOG,
  cardMeanings: CARD_MEANINGS,
  highRiskSafetyTemplate: HIGH_RISK_SAFETY_TEMPLATE,
} as const satisfies ReadingContentBundle;
```

Export `CURRENT_READING_CONTENT_BUNDLE` and `ReadingContentBundle` from `packages/content/src/index.ts`; do not expose a caller-selectable bundle registry or change existing version strings.

- [ ] **Step 4: Run GREEN and commit**

```powershell
pnpm vitest run packages/content/test/safety-template.test.ts packages/content/test/cards-content.test.ts packages/content/test/spreads.test.ts
pnpm typecheck
git add packages/content/src/safety.ts packages/content/src/reading-content-bundle.ts packages/content/src/index.ts packages/content/test/safety-template.test.ts
git commit -m "feat(content): define current reading content bundle"
```

Review gate: exact approved Chinese text, three versions are atomic, all 78 meanings covered, no domain dependency.

---

### Task 3: Deterministic Random and Single-Card Draw

**Files:**

- Create: `packages/domain/src/deterministic-random.ts`
- Create: `packages/domain/src/single-card-draw.ts`
- Create: `packages/domain/test/random.test.ts`

**Interfaces:**

```ts
export type RandomDomain = "card" | "orientation";
export interface DeterministicRandomStep {
  readonly state: number;
  readonly uint32: number;
  readonly value: number;
}
export function fnv1a32Ascii(text: string): number;
export function mulberry32Step(state: number): DeterministicRandomStep;
export function sampleRandomDomain(
  seed: string,
  domain: RandomDomain,
): DeterministicRandomStep;

export type SingleCardDraw = Omit<ReadingDraw, "position"> & {
  readonly position: "single";
};
export function drawSingleCard(
  seed: string,
  reversalsEnabled: boolean,
  bundle: ReadingContentBundle,
): SingleCardDraw;
```

These are internal module exports for tests; they are not exported from `@aura/domain` root.

- [ ] **Step 1: Write literal golden-vector and property tests**

Copy all six approved rows from the spec as numeric literals. Assert final mappings:

```ts
expect(drawSingleCard("aura-m1-fixed-seed", true, bundle)).toEqual({
  cardId: "major.death",
  orientation: "reversed",
  position: "single",
});
expect(drawSingleCard("fixture-seed-0001", true, bundle)).toEqual({
  cardId: "minor.wands.ten",
  orientation: "upright",
  position: "single",
});
expect(drawSingleCard("AURA_seed_123456", true, bundle)).toEqual({
  cardId: "major.wheel-of-fortune",
  orientation: "reversed",
  position: "single",
});
```

Generate 2,048 deterministic valid seeds with `phase2-seed-${index.toString().padStart(8, "0")}`; every result must be canonical, and disabling reversals must preserve card ID while forcing `upright`. Do not test random frequency distribution.

Create compiling function stubs with the final signatures and fixed wrong return values before RED.

- [ ] **Step 2: Run the random test to verify RED**

```powershell
pnpm vitest run packages/domain/test/random.test.ts
```

Expected: behavioral RED names a literal golden vector, canonical mapping or reversal-invariance mismatch.

- [ ] **Step 3: Implement the normative algorithm exactly**

Copy the FNV-1a and Mulberry32 pseudocode from spec §6.1 verbatim. `sampleRandomDomain` hashes `${seed}:${domain}` and returns the first Mulberry32 step. `drawSingleCard` calculates the card index from the card stream and direction from the orientation stream. If the index has no catalog entry, throw `DomainError("UNKNOWN_CARD_CONTENT", "cardId")` without including the seed or index.

- [ ] **Step 4: Run GREEN, mutation proof and commit**

```powershell
pnpm vitest run packages/domain/test/random.test.ts
pnpm typecheck
```

Temporarily change `:orientation` or `0x6d2b79f5`; at least one literal vector must fail. Restore the normative value and rerun GREEN.

```powershell
git add packages/domain/src/deterministic-random.ts packages/domain/src/single-card-draw.ts packages/domain/test/random.test.ts
git commit -m "feat(domain): add deterministic single card draw"
```

Review gate: exact integers, independent streams, reversal setting cannot move card selection, no `Math.random` or stateful generator.

---

### Task 4: Narrative and Complete Single Reading

**Files:**

- Create: `packages/domain/src/reading-content.ts`
- Create: `packages/domain/src/narrative.ts`
- Create: `packages/domain/src/single-reading.ts`
- Create: `packages/domain/test/fixtures.ts`
- Create: `packages/domain/test/narrative.test.ts`
- Create: `packages/domain/test/single-reading.test.ts`

**Interfaces:**

```ts
export type CompleteReadingNarrative = Omit<
  ReadingNarrative,
  "safetyNotice"
> & { readonly safetyNotice: string };

export type SingleCardReadingResult = Omit<
  ReadingResult,
  "session" | "narrative"
> & {
  readonly session: Omit<ReadingSession, "mode" | "draws"> & {
    readonly mode: "single";
    readonly draws: readonly [SingleCardDraw];
  };
  readonly narrative: CompleteReadingNarrative;
};

export function createSingleReading(
  input: SingleReadingInput,
): SingleCardReadingResult;
export function assertSingleCardReadingResult(
  value: unknown,
): asserts value is SingleCardReadingResult;
```

- [ ] **Step 1: Write failing narrative tests**

Use hand-authored literals for Death reversed/general:

```ts
expect(narrative).toEqual({
  summary: "你可能紧抓已经失效的安排，因为熟悉感暂时比未知更让人安心。",
  interpretation: "迟迟不收尾让资源持续被占用，恐惧值得被照顾但不必替你决定。",
  advice: "选择最小可逆的放下动作，并为过渡准备现实支持。",
  safetyNotice:
    "死神牌象征阶段变化，不预示死亡；医疗、法律、投资或危机问题请寻求专业支持。",
});
```

For high risk, assert `safetyNotice === bundle.highRiskSafetyTemplate + "\n\n" + cardSafetyNote`, while the other three fields equal standard. Add a hand-authored four-category table for one fixed card/orientation with exact `interpretation` and `advice`. Across the full 78 × 2 × 4 matrix, compare `summary`, `interpretation`, `advice` and `safetyNotice` exactly with the selected bundle record path rather than only checking structure/non-empty values. Keep separate literal tests for at least one upright and one reversed card. A schema-valid but noncanonical `major.private-question-20260829` must produce a redacted `UNKNOWN_CARD_CONTENT` error.

Create compiling content-lookup and narrative stubs with the final signatures that throw `new Error("NOT_IMPLEMENTED")` before RED.

- [ ] **Step 2: Run narrative tests to verify RED**

```powershell
pnpm vitest run packages/domain/test/narrative.test.ts
```

Expected: behavioral RED names a literal or full-matrix content mismatch; missing modules/exports do not count.

- [ ] **Step 3: Implement safe bundle lookup and narrative composition**

`reading-content.ts` checks catalog membership before indexing `cardMeanings`; it catches no external error with user data and returns only `DomainError`. `narrative.ts` selects orientation/category fields and builds:

```ts
return {
  summary: oriented.core,
  interpretation: category.interpretation,
  advice: category.advice,
  safetyNotice:
    safetyDisposition === "high-risk"
      ? `${bundle.highRiskSafetyTemplate}\n\n${record.safetyNote}`
      : record.safetyNote,
};
```

- [ ] **Step 4: Write the failing complete-reading tests**

The fixed result must contain `major.death / reversed / single`, the literal narrative above, current three versions, fixed session/category/safety/time, and no seed or `reversalsEnabled`. Also assert category, safety, session ID and time changes do not change draw; switching reversals off preserves card and forces upright.

Cast both an exact-shape raw object and a raw object with added `rawQuestion` to `SingleReadingInput` and call `createSingleReading`; the private runtime-brand gate must return `INVALID_READING_INPUT` for both rather than accepting either cast.

Create compiling orchestration/refinement stubs with the final signatures that throw `new Error("NOT_IMPLEMENTED")` before RED.

- [ ] **Step 5: Run the complete-reading test to verify RED**

```powershell
pnpm vitest run packages/domain/test/single-reading.test.ts
```

Expected: behavioral RED names the fixed-result or runtime-brand assertion; missing modules/exports do not count.

- [ ] **Step 6: Implement orchestration and single semantic refinement**

`createSingleReading` must first call the internal runtime-brand assertion, defensively revalidate its fields, use only `CURRENT_READING_CONTENT_BUNDLE`, call `drawSingleCard` and `composeSingleNarrative`, construct `mode: "single"`, and validate the result with `ReadingResultSchema` before returning. It must not call the public parser in a way that upgrades a forged raw object into a trusted input.

`assertSingleCardReadingResult` must check: structural Schema; current three versions; exactly one draw; `single` mode/position; canonical ID; complete safety notice; and exact narrative recomposition. Any structural/semantic mismatch becomes `DomainError("INVALID_HISTORY_ENTRY", "result")`; unknown current content remains `UNKNOWN_CARD_CONTENT`.

- [ ] **Step 7: Run GREEN and commit**

```powershell
pnpm vitest run packages/domain/test/narrative.test.ts packages/domain/test/single-reading.test.ts
pnpm typecheck
git add packages/domain/src/reading-content.ts packages/domain/src/narrative.ts packages/domain/src/single-reading.ts packages/domain/test/fixtures.ts packages/domain/test/narrative.test.ts packages/domain/test/single-reading.test.ts
git commit -m "feat(domain): compose single reading results"
```

Review gate: literal content, high-risk only changes safety notice, versions cannot be caller-injected, forged raw input rejected, no seed in output.

---

### Task 5: Discovery Reducer

**Files:**

- Create: `packages/domain/src/discovery.ts`
- Create: `packages/domain/test/discovery.test.ts`

**Interface:**

```ts
export function recordCardDiscovery(
  records: readonly DiscoveryRecord[],
  cardId: CardId,
  revealedAt: string,
): readonly DiscoveryRecord[];
```

- [ ] **Step 1: Write failing discovery and sentinel tests**

Test first append, duplicate reveal preserving the original time, immutable input, invalid ISO time, unknown fields, duplicate existing card IDs, and schema-valid noncanonical `major.not-in-catalog`. The error helper must prove no card ID, time or record data appears in string/JSON/enumerable fields.

Create a compiling `recordCardDiscovery` stub with the final signature that throws `new Error("NOT_IMPLEMENTED")` before RED.

- [ ] **Step 2: Run RED**

```powershell
pnpm vitest run packages/domain/test/discovery.test.ts
```

Expected: behavioral RED names append/idempotency/validation behavior; missing modules/exports do not count.

- [ ] **Step 3: Implement canonical, idempotent immutable update**

Parse every existing record with `DiscoveryRecordSchema`, require membership in the current bundle and uniqueness by `cardId`, validate `revealedAt` by parsing a candidate record, and return either a new appended array or a semantically unchanged array. Never mutate `records`; map every failure to `DomainError("INVALID_DISCOVERY_STATE", safeField)`.

- [ ] **Step 4: Run GREEN and commit**

```powershell
pnpm vitest run packages/domain/test/discovery.test.ts
pnpm typecheck
git add packages/domain/src/discovery.ts packages/domain/test/discovery.test.ts
git commit -m "feat(domain): record card discoveries"
```

Review gate: canonical membership beyond `CardIdSchema`, earliest time retained, invalid existing state rejected rather than repaired.

---

### Task 6: Manual History and Conflict Semantics

**Files:**

- Create: `packages/domain/src/history.ts`
- Create: `packages/domain/test/history.test.ts`

**Interfaces:**

```ts
export interface LocalHistoryPresentationRefs {
  readonly themeRef?: ThemeManifestRef;
  readonly deckRef?: DeckManifestRef;
}

export function createLocalHistoryEntry(
  result: SingleCardReadingResult,
  savedAt: string,
  refs?: LocalHistoryPresentationRefs,
): LocalHistoryEntry;

export function appendLocalHistoryEntry(
  history: readonly LocalHistoryEntry[],
  entry: LocalHistoryEntry,
): readonly LocalHistoryEntry[];
```

- [ ] **Step 1: Write failing history tests**

Cover explicit construction only, strict `savedAt/themeRef/deckRef`, invalid single shapes, noncanonical cards, missing high-risk template, inconsistent narrative, corrupt existing entries, duplicate existing session IDs, and immutability. Add sentinel cases for a forged incoming `entry`, invalid incoming `savedAt/themeRef/deckRef`, corrupt existing history and a conflict; every path must yield a fixed safe `DomainError` with no cause, Zod issues or input content.

Freeze public conflict semantics with separately generated, semantically valid results sharing one `sessionId`: regenerate category plus its narrative, safety disposition plus its safety notice, `createdAt`, and draw plus its narrative. Each complete logical difference must throw `HISTORY_SESSION_CONFLICT`. Test isolated version or narrative tampering separately as `INVALID_HISTORY_ENTRY`; unsupported-version behavior belongs to replay. The same valid result with different property insertion order must deduplicate and preserve the first `savedAt/themeRef/deckRef`.

Create compiling history stubs with the final signatures that throw `new Error("NOT_IMPLEMENTED")` before RED.

- [ ] **Step 2: Run RED**

```powershell
pnpm vitest run packages/domain/test/history.test.ts
```

Expected: behavioral RED names construction, validation, deduplication or conflict behavior; missing modules/exports do not count.

- [ ] **Step 3: Implement entry construction and explicit structural equality**

`createLocalHistoryEntry` calls `assertSingleCardReadingResult`, constructs optional refs only when present, and validates the final object with `LocalHistoryEntrySchema`. Catch and translate every Schema/helper failure to a safe `DomainError` without retaining issues or input values.

Implement `sameReadingResult` by explicit scalar comparison and ordered draw comparison:

```ts
return (
  left.session.sessionId === right.session.sessionId &&
  left.session.mode === right.session.mode &&
  left.session.questionCategory === right.session.questionCategory &&
  left.session.safetyDisposition === right.session.safetyDisposition &&
  left.session.rulesVersion === right.session.rulesVersion &&
  left.session.contentVersion === right.session.contentVersion &&
  left.session.createdAt === right.session.createdAt &&
  left.textVersion === right.textVersion &&
  sameDraws(left.session.draws, right.session.draws) &&
  left.narrative.summary === right.narrative.summary &&
  left.narrative.interpretation === right.narrative.interpretation &&
  left.narrative.advice === right.narrative.advice &&
  left.narrative.safetyNotice === right.narrative.safetyNotice
);
```

Do not use `JSON.stringify` for equality. `appendLocalHistoryEntry` must validate the entire existing collection and independently validate the incoming entry with Schema plus `assertSingleCardReadingResult` before any `sessionId` lookup. Equal duplicate returns the original logical collection without replacing the first metadata; conflicting duplicate throws the safe conflict code. Every validation/helper exception is translated to the fixed history error envelope.

- [ ] **Step 4: Run GREEN, mutation proof and commit**

```powershell
pnpm vitest run packages/domain/test/history.test.ts
pnpm typecheck
```

Perform two reversible mutations: remove `createdAt` comparison; then remove the complete safety dimension (`safetyDisposition` and `safetyNotice`) from equality. The corresponding semantically valid conflict tests must fail. Restore after each mutation and rerun GREEN.

```powershell
git add packages/domain/src/history.ts packages/domain/test/history.test.ts
git commit -m "feat(domain): save single reading history"
```

Review gate: no implicit save, no delete/clear, complete equality projection, corrupt collections rejected, first metadata preserved.

---

### Task 7: Seedless Replay and Version Refusal

**Files:**

- Modify: `packages/domain/src/history.ts`
- Create: `packages/domain/test/replay.test.ts`

**Interface:**

```ts
export function replayLocalHistoryEntry(
  entry: LocalHistoryEntry,
): SingleCardReadingResult;
```

- [ ] **Step 1: Write failing replay tests**

Use a hand-authored Fool/upright/current-version entry that has no relationship to the Death seed. Assert replay returns exactly `{ session, narrative, textVersion }` from the saved entry and never asks for or creates a seed.

Change `rulesVersion`, `contentVersion` and `textVersion` separately to valid-format old values; each must throw `UNSUPPORTED_REPLAY_VERSION`. Delete each of those three fields separately; each missing-version case must also throw `UNSUPPORTED_REPLAY_VERSION` rather than a generic Schema error. A current-version entry with a changed summary or advice must throw `INVALID_HISTORY_ENTRY`. All errors must redact session ID, narrative and timestamps.

Create a compiling `replayLocalHistoryEntry` stub with the final signature that throws `new Error("NOT_IMPLEMENTED")` before RED.

- [ ] **Step 2: Run RED**

```powershell
pnpm vitest run packages/domain/test/replay.test.ts
```

Expected: behavioral RED names exact replay, missing/old version refusal or semantic-tamper behavior; missing modules/exports do not count.

- [ ] **Step 3: Implement draw-authoritative replay**

Before full Schema parsing, safely require a non-array object and a non-array object-valued `session`; failure of that outer shape is `DomainError("INVALID_HISTORY_ENTRY", "result")`. Once those shells exist, require own properties for `session.rulesVersion`, `session.contentVersion` and root `textVersion`; a missing version throws `DomainError("UNSUPPORTED_REPLAY_VERSION", "version")` without reading or serializing other values. Then parse `LocalHistoryEntrySchema`; catch every remaining Schema failure and map it to `DomainError("INVALID_HISTORY_ENTRY", safeField)` without attaching the original error. Construct `storedResult` from exactly `session`, `narrative` and `textVersion`. Before narrative refinement, compare all three stored versions to `CURRENT_READING_CONTENT_BUNDLE`; any mismatch throws `DomainError("UNSUPPORTED_REPLAY_VERSION", "version")`. Then run `assertSingleCardReadingResult(storedResult)` and return `storedResult`:

```ts
const storedResult = {
  session: parsed.session,
  narrative: parsed.narrative,
  textVersion: parsed.textVersion,
};
assertSingleCardReadingResult(storedResult);
return storedResult;
```

Do not invoke RNG, infer a seed, replace narrative or fall back to current content for unknown versions.

- [ ] **Step 4: Run GREEN, mutation proof and commit**

```powershell
pnpm vitest run packages/domain/test/replay.test.ts packages/domain/test/history.test.ts
pnpm typecheck
```

Temporarily remove one version comparison; its old-version test must fail. Restore and rerun GREEN.

```powershell
git add packages/domain/src/history.ts packages/domain/test/replay.test.ts
git commit -m "feat(domain): replay saved single readings"
```

Review gate: replay starts from persisted draw/narrative, no seed, unknown versions never use current content.

---

### Task 8: Public API, Privacy Integration and Architecture Gate

**Files:**

- Modify: `packages/domain/src/index.ts`
- Create: `packages/domain/test/public-boundary.test.ts`
- Modify: `packages/domain/test/public-api-types.ts`
- Modify: `tools/quality/check-boundaries.mjs`
- Modify: `tools/quality/tests/check-boundaries.test.mjs`
- Create: `tools/quality/tests/eslint-domain.test.mjs`
- Modify: `eslint.config.mjs`

**Public exports:**

- `DomainError` and its public types.
- `parseSingleReadingInput` and `SingleReadingInput`.
- `createSingleReading`, `assertSingleCardReadingResult`, `SingleCardReadingResult`, `SingleCardDraw`, `CompleteReadingNarrative`.
- `recordCardDiscovery`.
- `createLocalHistoryEntry`, `appendLocalHistoryEntry`, `replayLocalHistoryEntry`, `LocalHistoryPresentationRefs`.

Do not root-export FNV, Mulberry32, random domains, bundle injection, draw helper, narrative helper, content lookup or equality helpers.

- [ ] **Step 1: Write failing public-boundary and allowlist tests**

Import `../src/index.js` as a namespace so the RED file compiles before root wiring. First assert the required public keys exist, then perform the full flow through runtime-checked properties: parse fixed input → create result → record discovery → create/append history → replay. Assert serialized results/history omit seed, `reversalsEnabled`, raw-question sentinel and presentation-only input fields.

For each public failure class, use `expectSafeDomainError` to assert only `code` and optional allowlisted `field` serialize, with no `cause`, Zod issues, stack exposure to the UI payload or sensitive sentinel.

Extend `public-api-types.ts` with namespace-property `@ts-expect-error` assertions for every internal helper family: FNV/Mulberry/random domain, caller bundle injection, draw helper, narrative helper, content lookup and equality. A temporary root export of any tested helper must make typecheck fail because its directive becomes unused.

Update the Node boundary test so domain permits only the two exact package names `@aura/contracts` and `@aura/content`, plus `./` or `../` specifiers whose normalized resolved target remains inside `packages/domain/src`. It must reject relative traversal into `packages/domain/test`, another package, app or repository file, as well as `/absolute`, backslash-relative, package subpaths, `zod`, `node:crypto`, `@aura/test-kits`, `cc`, `wechat`, CloudBase and AI SDKs. Literal `import()`/`require()` follow the same allowlist and containment check; every non-literal dynamic import or require is an unconditional violation.

Create `eslint-domain.test.mjs` using the installed ESLint API and in-memory source text passed with a virtual `filePath` under `packages/domain/src/__lint_probe__.ts`, so the real domain override is selected without writing a probe file. It must prove retained failures for logging, system time, global randomness, network and global escape forms, including `console.log`, `Date()`/`Date.now()`/`new Date()`, `crypto.getRandomValues`, `performance.now`, `fetch`, `XMLHttpRequest`, `WebSocket` and `globalThis.fetch`.

- [ ] **Step 2: Run RED**

```powershell
pnpm vitest run packages/domain/test/public-boundary.test.ts
pnpm test:node
pnpm typecheck
```

Expected: behavioral RED names missing required public keys and the newly added scanner/lint fixture cases. A missing export compilation error, missing runtime executable or test-configuration failure is not valid RED.

- [ ] **Step 3: Publish only stable domain entrypoints**

Add explicit named exports to `packages/domain/src/index.ts`. Convert the runtime test to direct typed use after the required-key RED has been captured. Extend `public-api-types.ts` so a plain raw object cannot call `createSingleReading`, while `createSingleReading(parseSingleReadingInput(raw))` compiles; retain all internal-helper negative assertions.

- [ ] **Step 4: Harden static architecture checks**

In `check-boundaries.mjs`, allow a domain specifier only when it equals exactly `@aura/contracts` or `@aura/content`, or when it starts with `./` or `../` and `path.resolve(path.dirname(importer), specifier)` remains under the normalized `packages/domain/src` root using a separator-aware containment check. Reject every other form, including relative escapes, `/absolute` and approved-package subpaths. Cover static import/export-from plus literal `import()`/`require()`, and report every non-literal dynamic load. Preserve the existing game-client type-only behavior.

In the domain ESLint override, forbid globals `console`, `process`, `window`, `document`, `fetch`, `localStorage`, `globalThis`, `crypto`, `performance`, `XMLHttpRequest`, `WebSocket`, `navigator`, `location`, `require` and `Date`; retain a syntax selector for `Math.random()`. The Node ESLint fixture test is the durable proof that the configured restrictions execute.

- [ ] **Step 5: Run full local GREEN**

```powershell
pnpm install --frozen-lockfile
pnpm vitest run packages/domain/test packages/contracts/test/readings.test.ts packages/content/test/cards-content.test.ts packages/content/test/safety-template.test.ts packages/content/test/spreads.test.ts packages/test-kits/test/fixtures.test.ts
pnpm typecheck
pnpm check:boundaries
pnpm quality
```

Expected: frozen install succeeds; Node tests remain 13/13 or increase only by the explicit boundary tests; all Vitest files pass; typecheck, formatting, lint, boundary and secret scans pass.

- [ ] **Step 6: Prove the type and boundary gates are active**

Perform two reversible mutations separately:

1. Widen `createSingleReading` to accept the raw object; `pnpm typecheck` must fail because an `@ts-expect-error` becomes unused.
2. Temporarily root-export one tested internal helper; `pnpm typecheck` must fail because its negative export directive becomes unused.
3. Add a temporary `import "node:crypto"` to a domain source; `pnpm check:boundaries` must fail naming `node:crypto`.
4. Add a temporary relative import that traverses from `packages/domain/src` into `packages/test-kits`; `pnpm check:boundaries` must fail naming the escaped target.
5. Add temporary `console.log`, `Date.now()`, `crypto.getRandomValues()`, `fetch()` and `globalThis.fetch()` statements one class at a time; `pnpm lint` must fail for each class.

Restore each mutation immediately and rerun the full local GREEN commands.

- [ ] **Step 7: Commit and request final three-role review**

```powershell
git add packages/domain/src/index.ts packages/domain/test/public-boundary.test.ts packages/domain/test/public-api-types.ts tools/quality/check-boundaries.mjs tools/quality/tests/check-boundaries.test.mjs tools/quality/tests/eslint-domain.test.mjs eslint.config.mjs
git commit -m "test(domain): harden phase two public boundaries"
```

Review gate: domain public surface cannot bypass orchestration, all sensitive sentinels are absent, static gates reject undeclared runtime capabilities, no later-phase files changed.

---

## Per-Task Review Protocol

For each Task 1–8:

1. Implementer records start commit, authorized paths, RED command/output, GREEN command/output and final changed paths.
2. A fresh specification reviewer checks only compliance with the approved spec and task scope.
3. After specification approval, a different code/safety reviewer checks correctness, maintainability, privacy and tests.
4. Critical or Important findings block the next task. Fixes use a separate `fix(domain): ...` commit and receive focused re-review.
5. Task report records commit IDs and confirms `.pnpm-store/` was not staged.

## Phase 2 Local Acceptance Run

After Task 8 and all task reviews:

```powershell
git status --short
git diff --check 78b78c3..HEAD
pnpm install --frozen-lockfile
pnpm vitest run packages/domain/test packages/contracts/test/readings.test.ts packages/content/test/cards-content.test.ts packages/content/test/safety-template.test.ts packages/content/test/spreads.test.ts packages/test-kits/test/fixtures.test.ts
pnpm typecheck
pnpm quality
```

The total controller must verify:

- tracked worktree and index are clean; only `.pnpm-store/` may remain untracked.
- Task 1–8 each have a reversible commit and two-stage review evidence.
- No Cocos/client/storage/daily/three-card/AI/VIP/cloud/share/resource-distribution/history-delete capability entered the diff.
- DomainError and serialized public artifacts contain no sensitive sentinel.
- Domain source has no platform, time, randomness, environment, log or network capability outside the approved pure modules.

Then run three independent final reviews:

1. Domain: deterministic vectors, version ownership, single semantics, idempotency and replay.
2. Safety/privacy: high-risk response, error redaction and private local metadata handling.
3. PMO: scope, evidence, commit boundary and authorization.

## Hosted Exit Gate

Local approval creates only a Phase 2 implementation candidate. Before formal Phase 2 exit:

1. Ask the product owner for separate authorization to push the Phase 2 branch and create/update its PR.
2. GitHub Actions must run frozen install and full `pnpm quality` on Node 22.14.x / pnpm 10.15.0.
3. The total controller verifies the exact HEAD SHA and hosted job conclusion.
4. The total controller writes a tracked Phase 2 acceptance record and decides pass/return from evidence.
5. Do not merge, tag or start Phase 3 without separate authorization.

## Status Reporting

Keep chat updates compact:

- 已完成：task/commit/test/review result.
- 正在做：one active task only.
- 阻塞：only evidence-backed blockers.
- 下一验收点：the next task or hosted gate.

Repository reports are the detailed source of truth; chat does not repeat full logs.
