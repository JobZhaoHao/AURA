# AURA M1 Phase 1 Contracts and Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立可验证的 78 张塔罗逻辑数据、跨层阅读契约和声明式资源描述，为后续纯规则引擎与 Cocos 客户端提供稳定接口。

**Architecture:** `packages/contracts` 使用 Zod 定义跨层稳定 Schema；`packages/content` 只提供版本化逻辑内容和表现描述，不包含抽牌行为；`packages/test-kits` 提供后续阶段复用的固定输入夹具。运行时资源路径和 Cocos 对象不进入契约。

**Tech Stack:** Node.js 22.14.x、pnpm 10.15.0、TypeScript、Zod 4.1.5、Vitest 3.2.4。

**Spec:** `docs/superpowers/specs/2026-08-28-aura-milestone-1-core-gameplay-design.md`

## Global Constraints

- 使用测试先行；每个任务先确认测试因缺少目标能力而失败。
- `CardId` 永久稳定；卡牌正面、卡背、主题和动画不能改变逻辑身份。
- 契约可包含稳定 manifest 引用，不能包含 Cocos 对象、URL、文件路径或动画实例。
- 内容必须覆盖综合、感情与关系、事业与学业、自我成长四类解释。
- 规则版基础解读不得被 VIP 降质；本阶段不实现 VIP 状态。
- 不修改 `apps/game-client`、云函数、经济或运营代码。
- 每个任务结束先运行计划列出的定向测试和类型检查，再提交独立 Git commit；Task 10 的阶段出口统一运行完整 `pnpm quality`。

---

## File Structure

```text
packages/contracts/
  src/
    cards.ts              # 卡牌、模式、类别、位置和方向 Schema
    safety.ts             # 稳定安全分流 Schema
    manifests.ts          # 仅含稳定 ID/version 的表现引用 Schema
    readings.ts           # 会话、结果、历史、图鉴和每日缓存 Schema
    index.ts              # 公共导出
  test/
    cards.test.ts
    safety.test.ts
    manifests.test.ts
    readings.test.ts

packages/content/
  src/
    cards/
      catalog.ts          # 78 张稳定 ID 与元数据
      meanings.major.ts   # 22 张大阿卡纳牌义
      meanings.wands.ts   # 14 张权杖牌义
      meanings.cups.ts    # 14 张圣杯牌义
      meanings.swords.ts  # 14 张宝剑牌义
      meanings.pentacles.ts # 14 张星币牌义
      meanings.ts         # 合并、校验友好查询
    manifests/
      types.ts            # 内容层声明式槽位类型
      default-theme.ts    # 月光疗愈默认描述
      neutral-deck.ts     # 无正式牌面时的中性占位映射
      minimal-alt-theme.ts# 极简替代样例
      animations.ts       # 动画 preset 描述，不含运行时实例
    spreads.ts            # single/daily/past-present-trend 定义
    versions.ts           # 内容和规则版本常量
    index.ts              # 公共导出
  test/
    cards-content.test.ts
    meaning-assertions.ts
    manifests.test.ts
    spreads.test.ts

packages/test-kits/
  src/
    fixtures/readings.ts  # 后续领域测试复用输入
    fixtures/manifests.ts # 合法、缺失与替代清单夹具
    index.ts
  test/
    fixtures.test.ts
```

## Task 1: Gameplay Primitive Schemas

**Files:**

- Create: `packages/contracts/src/cards.ts`
- Create: `packages/contracts/src/safety.ts`
- Modify: `packages/contracts/src/index.ts`
- Test: `packages/contracts/test/cards.test.ts`
- Test: `packages/contracts/test/safety.test.ts`

**Interfaces:**

- Produces: `CardId`, `Arcana`, `Suit`, `Orientation`, `QuestionCategory`, `ReadingMode`, `SpreadPosition`, `SafetyDisposition` and their Zod schemas.
- Consumes: existing `zod` dependency only.

- [ ] **Step 1: Write the failing primitive-schema tests**

```ts
// packages/contracts/test/cards.test.ts
import { describe, expect, it } from "vitest";
import {
  CardIdSchema,
  OrientationSchema,
  QuestionCategorySchema,
  ReadingModeSchema,
  SpreadPositionSchema,
} from "../src/index.js";

describe("gameplay primitive schemas", () => {
  it("accepts canonical card id shapes", () => {
    expect(CardIdSchema.parse("major.fool")).toBe("major.fool");
    expect(CardIdSchema.parse("minor.cups.queen")).toBe("minor.cups.queen");
  });

  it.each(["major", "major.Fool", "minor.cups", "minor.stars.ace"])(
    "rejects malformed card id %s",
    (value) => expect(() => CardIdSchema.parse(value)).toThrow(),
  );

  it("freezes the approved gameplay enums", () => {
    expect(OrientationSchema.options).toEqual(["upright", "reversed"]);
    expect(QuestionCategorySchema.options).toEqual([
      "general",
      "relationships",
      "career-study",
      "self-growth",
    ]);
    expect(ReadingModeSchema.options).toEqual([
      "daily",
      "single",
      "three-card",
    ]);
    expect(SpreadPositionSchema.options).toEqual([
      "daily",
      "single",
      "past",
      "present",
      "trend",
    ]);
  });
});
```

```ts
// packages/contracts/test/safety.test.ts
import { describe, expect, it } from "vitest";
import { SafetyDispositionSchema } from "../src/index.js";

describe("SafetyDispositionSchema", () => {
  it("accepts only stable, persistable dispositions", () => {
    expect(SafetyDispositionSchema.options).toEqual(["standard", "high-risk"]);
    expect(() => SafetyDispositionSchema.parse("medical")).toThrow();
  });
});
```

- [ ] **Step 2: Run the tests and confirm the missing-export failure**

Run:

```powershell
pnpm vitest run packages/contracts/test/cards.test.ts packages/contracts/test/safety.test.ts
```

Expected: FAIL because the new modules/exports do not exist.

- [ ] **Step 3: Implement the minimal primitive schemas**

```ts
// packages/contracts/src/cards.ts
import { z } from "zod";

const MINOR_RANK =
  "ace|two|three|four|five|six|seven|eight|nine|ten|page|knight|queen|king";

export const CardIdSchema = z
  .string()
  .regex(
    new RegExp(
      `^(major\\.[a-z][a-z0-9-]*|minor\\.(wands|cups|swords|pentacles)\\.(${MINOR_RANK}))$`,
    ),
  );
export type CardId = z.infer<typeof CardIdSchema>;

export const ArcanaSchema = z.enum(["major", "minor"]);
export type Arcana = z.infer<typeof ArcanaSchema>;

export const SuitSchema = z.enum(["wands", "cups", "swords", "pentacles"]);
export type Suit = z.infer<typeof SuitSchema>;

export const OrientationSchema = z.enum(["upright", "reversed"]);
export type Orientation = z.infer<typeof OrientationSchema>;

export const QuestionCategorySchema = z.enum([
  "general",
  "relationships",
  "career-study",
  "self-growth",
]);
export type QuestionCategory = z.infer<typeof QuestionCategorySchema>;

export const ReadingModeSchema = z.enum(["daily", "single", "three-card"]);
export type ReadingMode = z.infer<typeof ReadingModeSchema>;

export const SpreadPositionSchema = z.enum([
  "daily",
  "single",
  "past",
  "present",
  "trend",
]);
export type SpreadPosition = z.infer<typeof SpreadPositionSchema>;
```

```ts
// packages/contracts/src/safety.ts
import { z } from "zod";

export const SafetyDispositionSchema = z.enum(["standard", "high-risk"]);
export type SafetyDisposition = z.infer<typeof SafetyDispositionSchema>;
```

Update `packages/contracts/src/index.ts` with explicit value and type exports from both modules; keep existing health/version exports unchanged.

- [ ] **Step 4: Run the primitive-schema tests**

Run:

```powershell
pnpm vitest run packages/contracts/test/cards.test.ts packages/contracts/test/safety.test.ts
```

Expected: both test files PASS.

- [ ] **Step 5: Run the package regression and commit**

Run:

```powershell
pnpm vitest run packages/contracts/test
pnpm typecheck
```

Expected: all contract tests and TypeScript build PASS.

Commit:

```powershell
git add packages/contracts/src/cards.ts packages/contracts/src/safety.ts packages/contracts/src/index.ts packages/contracts/test/cards.test.ts packages/contracts/test/safety.test.ts
git commit -m "feat: define tarot gameplay primitives"
```

## Task 2: Reading, Persistence, and Manifest Reference Schemas

**Files:**

- Create: `packages/contracts/src/manifests.ts`
- Create: `packages/contracts/src/readings.ts`
- Modify: `packages/contracts/src/index.ts`
- Test: `packages/contracts/test/manifests.test.ts`
- Test: `packages/contracts/test/readings.test.ts`

**Interfaces:**

- Consumes: primitives from Task 1.
- Produces: `ManifestVersion`, three manifest reference types, `ReadingDraw`, `ReadingSession`, `ReadingNarrative`, `ReadingResult`, `LocalHistoryEntry`, `DiscoveryRecord`, `DailyReadingCacheEntry`.

- [ ] **Step 1: Write failing manifest reference tests**

```ts
// packages/contracts/test/manifests.test.ts
import { describe, expect, it } from "vitest";
import {
  AnimationManifestRefSchema,
  DeckManifestRefSchema,
  ThemeManifestRefSchema,
} from "../src/index.js";

describe("manifest references", () => {
  it("accepts stable id and version pairs", () => {
    expect(
      ThemeManifestRefSchema.parse({
        themeId: "moonlight-healing",
        version: "1.0.0",
      }),
    ).toEqual({ themeId: "moonlight-healing", version: "1.0.0" });
  });

  it("rejects resource paths and unknown fields", () => {
    expect(() =>
      DeckManifestRefSchema.parse({
        deckId: "neutral",
        version: "1.0.0",
        path: "resources/cards",
      }),
    ).toThrow();
    expect(() =>
      AnimationManifestRefSchema.parse({ animationId: "flip", version: "" }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Write failing reading/persistence tests**

```ts
// packages/contracts/test/readings.test.ts
import { describe, expect, it } from "vitest";
import { LocalHistoryEntrySchema, ReadingResultSchema } from "../src/index.js";

const result = {
  session: {
    sessionId: "session-001",
    mode: "single",
    questionCategory: "general",
    safetyDisposition: "standard",
    rulesVersion: "m1-rules-v1",
    contentVersion: "m1-content-v1",
    createdAt: "2026-08-28T00:00:00.000Z",
    draws: [
      { cardId: "major.fool", orientation: "upright", position: "single" },
    ],
  },
  narrative: {
    summary: "新的可能正在打开。",
    interpretation: "愚人正位强调开放与尝试。",
    advice: "先完成一个低风险的小步骤。",
  },
  textVersion: "m1-text-v1",
} as const;

describe("reading contracts", () => {
  it("parses a replayable reading result", () => {
    expect(ReadingResultSchema.parse(result)).toEqual(result);
  });

  it("retains every replay version in local history", () => {
    const parsed = LocalHistoryEntrySchema.parse({
      ...result,
      savedAt: "2026-08-28T00:01:00.000Z",
    });
    expect(parsed.session.rulesVersion).toBe("m1-rules-v1");
    expect(parsed.session.contentVersion).toBe("m1-content-v1");
    expect(parsed.textVersion).toBe("m1-text-v1");
  });

  it.each([
    "questionCategory",
    "safetyDisposition",
    "rulesVersion",
    "contentVersion",
  ])("rejects history missing %s", (field) => {
    const history = {
      ...result,
      savedAt: "2026-08-28T00:01:00.000Z",
    } as Record<string, unknown>;
    const session = { ...result.session } as Record<string, unknown>;
    delete session[field];
    history.session = session;
    expect(() => LocalHistoryEntrySchema.parse(history)).toThrow();
  });
});
```

- [ ] **Step 3: Run both tests and confirm missing-schema failures**

Run:

```powershell
pnpm vitest run packages/contracts/test/manifests.test.ts packages/contracts/test/readings.test.ts
```

Expected: FAIL because manifest and reading schemas are not exported.

- [ ] **Step 4: Implement strict manifest references**

```ts
// packages/contracts/src/manifests.ts
import { z } from "zod";

export const ManifestVersionSchema = z.string().regex(/^[a-z0-9][a-z0-9._-]*$/);
export type ManifestVersion = z.infer<typeof ManifestVersionSchema>;

const StableIdSchema = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);

export const DeckManifestRefSchema = z
  .object({ deckId: StableIdSchema, version: ManifestVersionSchema })
  .strict();
export type DeckManifestRef = z.infer<typeof DeckManifestRefSchema>;

export const ThemeManifestRefSchema = z
  .object({ themeId: StableIdSchema, version: ManifestVersionSchema })
  .strict();
export type ThemeManifestRef = z.infer<typeof ThemeManifestRefSchema>;

export const AnimationManifestRefSchema = z
  .object({ animationId: StableIdSchema, version: ManifestVersionSchema })
  .strict();
export type AnimationManifestRef = z.infer<typeof AnimationManifestRefSchema>;
```

- [ ] **Step 5: Implement replayable reading and persistence schemas**

```ts
// packages/contracts/src/readings.ts
import { z } from "zod";
import {
  CardIdSchema,
  OrientationSchema,
  QuestionCategorySchema,
  ReadingModeSchema,
  SpreadPositionSchema,
} from "./cards.js";
import { DeckManifestRefSchema, ThemeManifestRefSchema } from "./manifests.js";
import { SafetyDispositionSchema } from "./safety.js";

const StableVersionSchema = z.string().min(1);

export const ReadingDrawSchema = z.object({
  cardId: CardIdSchema,
  orientation: OrientationSchema,
  position: SpreadPositionSchema,
});
export type ReadingDraw = z.infer<typeof ReadingDrawSchema>;

export const ReadingSessionSchema = z.object({
  sessionId: z.string().min(1),
  mode: ReadingModeSchema,
  questionCategory: QuestionCategorySchema,
  safetyDisposition: SafetyDispositionSchema,
  rulesVersion: StableVersionSchema,
  contentVersion: StableVersionSchema,
  createdAt: z.iso.datetime(),
  draws: z.array(ReadingDrawSchema).min(1).max(3),
});
export type ReadingSession = z.infer<typeof ReadingSessionSchema>;

export const ReadingNarrativeSchema = z.object({
  summary: z.string().min(1),
  interpretation: z.string().min(1),
  advice: z.string().min(1),
  safetyNotice: z.string().min(1).optional(),
});
export type ReadingNarrative = z.infer<typeof ReadingNarrativeSchema>;

export const ReadingResultSchema = z.object({
  session: ReadingSessionSchema,
  narrative: ReadingNarrativeSchema,
  textVersion: StableVersionSchema,
});
export type ReadingResult = z.infer<typeof ReadingResultSchema>;

export const LocalHistoryEntrySchema = ReadingResultSchema.extend({
  savedAt: z.iso.datetime(),
  themeRef: ThemeManifestRefSchema.optional(),
  deckRef: DeckManifestRefSchema.optional(),
});
export type LocalHistoryEntry = z.infer<typeof LocalHistoryEntrySchema>;

export const DiscoveryRecordSchema = z.object({
  cardId: CardIdSchema,
  firstSeenAt: z.iso.datetime(),
});
export type DiscoveryRecord = z.infer<typeof DiscoveryRecordSchema>;

export const DailyReadingCacheEntrySchema = z.object({
  installationId: z.string().min(1),
  localDate: z.iso.date(),
  result: ReadingResultSchema,
});
export type DailyReadingCacheEntry = z.infer<
  typeof DailyReadingCacheEntrySchema
>;
```

Export every new schema and inferred type from `packages/contracts/src/index.ts`.

- [ ] **Step 6: Run contract tests and typecheck**

Run:

```powershell
pnpm vitest run packages/contracts/test
pnpm typecheck
```

Expected: all contract tests PASS; TypeScript build PASS.

- [ ] **Step 7: Commit the stable reading contracts**

```powershell
git add packages/contracts/src/manifests.ts packages/contracts/src/readings.ts packages/contracts/src/index.ts packages/contracts/test/manifests.test.ts packages/contracts/test/readings.test.ts
git commit -m "feat: define replayable reading contracts"
```

## Task 3: Canonical 78-Card Catalog

**Files:**

- Modify: `packages/content/package.json`
- Modify: `packages/content/tsconfig.json`
- Create: `packages/content/src/cards/catalog.ts`
- Modify: `packages/content/src/index.ts`
- Modify: `vitest.config.ts`
- Test: `packages/content/test/cards-content.test.ts`

**Interfaces:**

- Consumes: `CardId`, `Arcana`, `Suit` from `@aura/contracts`.
- Produces: `CardMetadata`, `ALL_CARD_IDS`, `CARD_CATALOG`, `getCardMetadata(cardId)`.

- [ ] **Step 1: Wire the content package to contracts**

Replace `packages/content/package.json` with:

```json
{
  "name": "@aura/content",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./dist/index.js"
    }
  },
  "dependencies": {
    "@aura/contracts": "workspace:*"
  }
}
```

Replace `packages/content/tsconfig.json` with:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "references": [{ "path": "../contracts" }]
}
```

Replace the `resolve.alias` object in `vitest.config.ts` with:

```ts
alias: {
  "@aura/contracts": fileURLToPath(
    new URL("./packages/contracts/src/index.ts", import.meta.url),
  ),
  "@aura/content": fileURLToPath(
    new URL("./packages/content/src/index.ts", import.meta.url),
  ),
},
```

Run `pnpm install --lockfile-only` so `pnpm-lock.yaml` records the new workspace dependency before the failing test is executed.

- [ ] **Step 2: Write the failing 78-card completeness test**

```ts
// packages/content/test/cards-content.test.ts
import { describe, expect, it } from "vitest";
import { CardIdSchema } from "@aura/contracts";
import { ALL_CARD_IDS, CARD_CATALOG } from "../src/index.js";

describe("canonical tarot catalog", () => {
  it("contains exactly 78 unique stable ids", () => {
    expect(ALL_CARD_IDS).toHaveLength(78);
    expect(new Set(ALL_CARD_IDS).size).toBe(78);
    expect(ALL_CARD_IDS.every((id) => CardIdSchema.safeParse(id).success)).toBe(
      true,
    );
  });

  it("contains 22 major and 56 minor arcana", () => {
    expect(CARD_CATALOG.filter((card) => card.arcana === "major")).toHaveLength(
      22,
    );
    expect(CARD_CATALOG.filter((card) => card.arcana === "minor")).toHaveLength(
      56,
    );
  });

  it.each(["wands", "cups", "swords", "pentacles"] as const)(
    "contains 14 %s cards",
    (suit) =>
      expect(CARD_CATALOG.filter((card) => card.suit === suit)).toHaveLength(
        14,
      ),
  );
});
```

- [ ] **Step 3: Run the test and confirm missing catalog failure**

Run:

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
```

Expected: FAIL because catalog exports do not exist.

- [ ] **Step 4: Implement the canonical catalog from explicit source lists**

Use explicit ordered source lists so IDs never depend on translated labels:

```ts
// packages/content/src/cards/catalog.ts
import type { Arcana, CardId, Suit } from "@aura/contracts";

const MAJORS = [
  ["fool", "愚人"],
  ["magician", "魔术师"],
  ["high-priestess", "女祭司"],
  ["empress", "皇后"],
  ["emperor", "皇帝"],
  ["hierophant", "教皇"],
  ["lovers", "恋人"],
  ["chariot", "战车"],
  ["strength", "力量"],
  ["hermit", "隐士"],
  ["wheel-of-fortune", "命运之轮"],
  ["justice", "正义"],
  ["hanged-man", "倒吊人"],
  ["death", "死神"],
  ["temperance", "节制"],
  ["devil", "恶魔"],
  ["tower", "高塔"],
  ["star", "星星"],
  ["moon", "月亮"],
  ["sun", "太阳"],
  ["judgement", "审判"],
  ["world", "世界"],
] as const;

const SUITS = [
  ["wands", "权杖"],
  ["cups", "圣杯"],
  ["swords", "宝剑"],
  ["pentacles", "星币"],
] as const;

const RANKS = [
  ["ace", "王牌"],
  ["two", "二"],
  ["three", "三"],
  ["four", "四"],
  ["five", "五"],
  ["six", "六"],
  ["seven", "七"],
  ["eight", "八"],
  ["nine", "九"],
  ["ten", "十"],
  ["page", "侍从"],
  ["knight", "骑士"],
  ["queen", "王后"],
  ["king", "国王"],
] as const;

export interface CardMetadata {
  readonly id: CardId;
  readonly arcana: Arcana;
  readonly nameZh: string;
  readonly suit?: Suit;
  readonly rank?: string;
}

const toCardId = (value: string): CardId => value as CardId;

const majorCards: CardMetadata[] = MAJORS.map(([slug, nameZh]) => ({
  id: toCardId(`major.${slug}`),
  arcana: "major",
  nameZh,
}));

const minorCards: CardMetadata[] = SUITS.flatMap(([suit, suitZh]) =>
  RANKS.map(([rank, rankZh]) => ({
    id: toCardId(`minor.${suit}.${rank}`),
    arcana: "minor" as const,
    suit,
    rank,
    nameZh: `${suitZh}${rankZh}`,
  })),
);

export const CARD_CATALOG = [
  ...majorCards,
  ...minorCards,
] as readonly CardMetadata[];
export const ALL_CARD_IDS = CARD_CATALOG.map(
  ({ id }) => id,
) as readonly CardId[];

export function getCardMetadata(cardId: CardId): CardMetadata {
  const card = CARD_CATALOG.find(({ id }) => id === cardId);
  if (!card) throw new RangeError(`Unknown card id: ${cardId}`);
  return card;
}
```

Export the four public symbols from `packages/content/src/index.ts`.

- [ ] **Step 5: Run catalog tests and typecheck**

Run:

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
pnpm typecheck
```

Expected: catalog tests PASS and TypeScript build PASS.

- [ ] **Step 6: Commit the stable catalog**

```powershell
git add packages/content/package.json packages/content/tsconfig.json packages/content/src/cards/catalog.ts packages/content/src/index.ts packages/content/test/cards-content.test.ts vitest.config.ts pnpm-lock.yaml
git commit -m "feat: add canonical tarot card catalog"
```

## Task 4: Meaning Contract and 22 Major Arcana Records

**Files:**

- Create: `packages/content/src/cards/meanings.major.ts`
- Create: `packages/content/src/cards/meanings.ts`
- Modify: `packages/content/src/index.ts`
- Test: `packages/content/test/cards-content.test.ts`
- Test: `packages/content/test/meaning-assertions.ts`

**Interfaces:**

- Consumes: `CardId`, `QuestionCategory`, and the canonical catalog.
- Produces: `CategoryMeaning`, `OrientedMeaning`, `CardMeaningRecord`, and `MAJOR_MEANINGS`.

- [ ] **Step 1: Add one reusable meaning assertion and the failing major test**

```ts
// packages/content/test/meaning-assertions.ts
import { expect } from "vitest";
import type { CardId } from "@aura/contracts";
import type { CardMeaningRecord } from "../src/cards/meanings.js";

export function expectCompleteMeaningRecords(
  records: readonly CardMeaningRecord[],
  expectedIds: readonly CardId[],
): void {
  expect(records).toHaveLength(expectedIds.length);
  expect(records.map(({ cardId }) => cardId).sort()).toEqual(
    [...expectedIds].sort(),
  );
  expect(new Set(records.map(({ cardId }) => cardId)).size).toBe(
    records.length,
  );
  for (const record of records) {
    for (const orientation of ["upright", "reversed"] as const) {
      const meaning = record[orientation];
      expect(meaning.keywords.length).toBeGreaterThanOrEqual(3);
      expect(meaning.core.trim().length).toBeGreaterThanOrEqual(12);
      expect(Object.keys(meaning.categories).sort()).toEqual(
        ["career-study", "general", "relationships", "self-growth"].sort(),
      );
      for (const category of Object.values(meaning.categories)) {
        expect(category.interpretation.trim().length).toBeGreaterThanOrEqual(
          20,
        );
        expect(category.advice.trim().length).toBeGreaterThanOrEqual(10);
      }
    }
    expect(record.safetyNote.trim().length).toBeGreaterThanOrEqual(12);
  }
}
```

```ts
// addition to packages/content/test/cards-content.test.ts
import { describe, expect, it } from "vitest";
import { CARD_CATALOG, MAJOR_MEANINGS } from "../src/index.js";
import { expectCompleteMeaningRecords } from "./meaning-assertions.js";

describe("major arcana meanings", () => {
  it("provides complete literal records for all 22 major arcana", () => {
    const expectedIds = CARD_CATALOG.filter(
      ({ arcana }) => arcana === "major",
    ).map(({ id }) => id);
    expectCompleteMeaningRecords(MAJOR_MEANINGS, expectedIds);
  });
});
```

- [ ] **Step 2: Run the test and confirm the missing-meaning failure**

Run:

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
```

Expected: FAIL because the meaning types and `MAJOR_MEANINGS` do not exist.

- [ ] **Step 3: Define the exact meaning data shape**

```ts
// packages/content/src/cards/meanings.ts
import type { CardId, QuestionCategory } from "@aura/contracts";

export interface CategoryMeaning {
  readonly interpretation: string;
  readonly advice: string;
}

export interface OrientedMeaning {
  readonly keywords: readonly [string, string, string, ...string[]];
  readonly core: string;
  readonly categories: Readonly<Record<QuestionCategory, CategoryMeaning>>;
}

export interface CardMeaningRecord {
  readonly cardId: CardId;
  readonly upright: OrientedMeaning;
  readonly reversed: OrientedMeaning;
  readonly safetyNote: string;
}
```

- [ ] **Step 4: Author all 22 Major Arcana records as reviewable literals**

Use one explicit record per card. Every record must follow the approved tone: non-deterministic, reflective, actionable, no medical/legal/investment diagnosis. The following record establishes the exact style and field density:

```ts
// excerpt from packages/content/src/cards/meanings.major.ts
import type { CardMeaningRecord } from "./meanings.js";

export const MAJOR_MEANINGS = [
  {
    cardId: "major.fool",
    upright: {
      keywords: ["开始", "开放", "尝试"],
      core: "新的可能正在打开，但真正的前进来自清醒地迈出第一步。",
      categories: {
        general: {
          interpretation:
            "你正站在旧经验与新可能的交界处，答案更接近尝试而不是等待完全确定。",
          advice: "选择一个风险可控的小步骤，并为结果保留调整空间。",
        },
        relationships: {
          interpretation:
            "关系中需要更多真诚探索，但开放不等于忽略边界或承诺。",
          advice: "表达好奇与期待，同时确认彼此能够接受的节奏。",
        },
        "career-study": {
          interpretation:
            "新方向值得测试，当前更适合小规模验证而不是一次性押上全部资源。",
          advice: "用一个短周期原型验证兴趣、能力和现实条件。",
        },
        "self-growth": {
          interpretation:
            "成长来自允许自己暂时不知道答案，并在行动中修正认识。",
          advice: "记录这次尝试真正带来的感受和证据，而不是只评价成败。",
        },
      },
    },
    reversed: {
      keywords: ["冲动", "逃避", "准备不足"],
      core: "你可能把自由误当成无需承担后果，也可能因害怕出错而迟迟不开始。",
      categories: {
        general: {
          interpretation:
            "当前需要区分健康的冒险与没有准备的冲动，停顿是为了看清而不是放弃。",
          advice: "先补上一个最关键的安全条件，再决定是否继续。",
        },
        relationships: {
          interpretation: "关系中的轻率承诺或回避责任正在削弱安全感。",
          advice: "把真实意图和能够承担的范围说清楚。",
        },
        "career-study": {
          interpretation:
            "计划可能缺少基础信息，或你正用频繁换方向逃避必要练习。",
          advice: "补齐成本、时间和能力差距后再做下一步。",
        },
        "self-growth": {
          interpretation:
            "害怕显得不成熟可能让你压抑探索，也可能让你用冲动证明自己。",
          advice: "允许试错，但提前写下不可越过的底线。",
        },
      },
    },
    safetyNote: "牌义用于自我反思，不替代医疗、法律、投资或危机支持。",
  },
] as const satisfies readonly CardMeaningRecord[];
```

Author exactly one literal record for each ID in `MAJORS`, in catalog order. Every record must meet the test thresholds, contain all four category keys, use distinct upright/reversed guidance, and follow the approved reflective, non-deterministic tone. Do not generate text from templates at runtime. Export the meaning types and `MAJOR_MEANINGS` from `packages/content/src/index.ts`.

- [ ] **Step 5: Run tests, perform the content review, and commit**

Run:

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
pnpm typecheck
pnpm format:check
```

Expected: tests and typecheck PASS. A domain reviewer inspects all 22 IDs for coverage and at least 5 records across both orientations for distinct wording, reflective tone, actionable advice, and no medical/legal/investment diagnosis.

Commit:

```powershell
git add packages/content/src/cards/meanings.ts packages/content/src/cards/meanings.major.ts packages/content/src/index.ts packages/content/test/cards-content.test.ts packages/content/test/meaning-assertions.ts
git commit -m "feat: add major arcana meanings"
```

## Task 5: Fourteen Wands Meaning Records

**Files:**

- Create: `packages/content/src/cards/meanings.wands.ts`
- Modify: `packages/content/src/index.ts`
- Test: `packages/content/test/cards-content.test.ts`

**Interfaces:**

- Consumes: `CardMeaningRecord` and the canonical catalog.
- Produces: `WANDS_MEANINGS` with exactly 14 literal records.

- [ ] **Step 1: Add the failing Wands batch test**

```ts
import { CARD_CATALOG, WANDS_MEANINGS } from "../src/index.js";
import { expectCompleteMeaningRecords } from "./meaning-assertions.js";

it("provides complete literal records for all 14 Wands cards", () => {
  const expectedIds = CARD_CATALOG.filter(({ suit }) => suit === "wands").map(
    ({ id }) => id,
  );
  expectCompleteMeaningRecords(WANDS_MEANINGS, expectedIds);
});
```

- [ ] **Step 2: Run the test and confirm the missing-export failure**

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
```

Expected: FAIL because `WANDS_MEANINGS` is not exported.

- [ ] **Step 3: Author the complete Wands batch**

Create `meanings.wands.ts`, import `CardMeaningRecord` as a type, and declare `WANDS_MEANINGS` with `as const satisfies readonly CardMeaningRecord[]`. The array contains exactly 14 literal records for `minor.wands.ace`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`, `ten`, `page`, `knight`, `queen`, and `king`. Each record follows the exact Task 4 shape and field-density thresholds; no runtime rank/suit text generator is permitted. Export `WANDS_MEANINGS` from the package index.

- [ ] **Step 4: Verify, review, and commit the Wands batch**

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
pnpm typecheck
```

Expected: PASS. The domain reviewer inspects at least four ranks, both orientations, and every category key for non-duplicated, actionable text.

```powershell
git add packages/content/src/cards/meanings.wands.ts packages/content/src/index.ts packages/content/test/cards-content.test.ts
git commit -m "feat: add wands tarot meanings"
```

## Task 6: Fourteen Cups Meaning Records

**Files:**

- Create: `packages/content/src/cards/meanings.cups.ts`
- Modify: `packages/content/src/index.ts`
- Test: `packages/content/test/cards-content.test.ts`

**Interfaces:**

- Consumes: `CardMeaningRecord` and the canonical catalog.
- Produces: `CUPS_MEANINGS` with exactly 14 literal records.

- [ ] **Step 1: Add the failing Cups batch test**

```ts
import { CARD_CATALOG, CUPS_MEANINGS } from "../src/index.js";
import { expectCompleteMeaningRecords } from "./meaning-assertions.js";

it("provides complete literal records for all 14 Cups cards", () => {
  const expectedIds = CARD_CATALOG.filter(({ suit }) => suit === "cups").map(
    ({ id }) => id,
  );
  expectCompleteMeaningRecords(CUPS_MEANINGS, expectedIds);
});
```

- [ ] **Step 2: Run the test and confirm the missing-export failure**

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
```

Expected: FAIL because `CUPS_MEANINGS` is not exported.

- [ ] **Step 3: Author the complete Cups batch**

Create `meanings.cups.ts` using the same typed literal-array declaration as Task 5, with exactly 14 records for `minor.cups.ace` through `minor.cups.king`, in catalog rank order. Every record contains both orientations, three or more keywords, all four categories, advice, and the safety note. Export `CUPS_MEANINGS` from the package index.

- [ ] **Step 4: Verify, review, and commit the Cups batch**

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
pnpm typecheck
```

Expected: PASS. The domain reviewer inspects at least four ranks, both orientations, and relationship/self-growth wording for emotional safety and non-determinism.

```powershell
git add packages/content/src/cards/meanings.cups.ts packages/content/src/index.ts packages/content/test/cards-content.test.ts
git commit -m "feat: add cups tarot meanings"
```

## Task 7: Fourteen Swords Meaning Records

**Files:**

- Create: `packages/content/src/cards/meanings.swords.ts`
- Modify: `packages/content/src/index.ts`
- Test: `packages/content/test/cards-content.test.ts`

**Interfaces:**

- Consumes: `CardMeaningRecord` and the canonical catalog.
- Produces: `SWORDS_MEANINGS` with exactly 14 literal records.

- [ ] **Step 1: Add the failing Swords batch test**

```ts
import { CARD_CATALOG, SWORDS_MEANINGS } from "../src/index.js";
import { expectCompleteMeaningRecords } from "./meaning-assertions.js";

it("provides complete literal records for all 14 Swords cards", () => {
  const expectedIds = CARD_CATALOG.filter(({ suit }) => suit === "swords").map(
    ({ id }) => id,
  );
  expectCompleteMeaningRecords(SWORDS_MEANINGS, expectedIds);
});
```

- [ ] **Step 2: Run the test and confirm the missing-export failure**

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
```

Expected: FAIL because `SWORDS_MEANINGS` is not exported.

- [ ] **Step 3: Author the complete Swords batch**

Create `meanings.swords.ts` using the same typed literal-array declaration as Task 5, with exactly 14 records for `minor.swords.ace` through `minor.swords.king`, in catalog rank order. Every record contains both orientations, three or more keywords, all four categories, advice, and the safety note. Export `SWORDS_MEANINGS` from the package index.

- [ ] **Step 4: Verify, safety-review, and commit the Swords batch**

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
pnpm typecheck
```

Expected: PASS. The domain reviewer inspects at least four ranks and every high-distress phrase to ensure the copy is reflective, never diagnostic, never fatalistic, and routes urgent risk to the later safety layer rather than pretending Tarot is support.

```powershell
git add packages/content/src/cards/meanings.swords.ts packages/content/src/index.ts packages/content/test/cards-content.test.ts
git commit -m "feat: add swords tarot meanings"
```

## Task 8: Fourteen Pentacles Records and the Complete Meaning Map

**Files:**

- Create: `packages/content/src/cards/meanings.pentacles.ts`
- Modify: `packages/content/src/cards/meanings.ts`
- Modify: `packages/content/src/index.ts`
- Test: `packages/content/test/cards-content.test.ts`

**Interfaces:**

- Consumes: all five reviewed meaning arrays and `ALL_CARD_IDS`.
- Produces: `PENTACLES_MEANINGS`, `CARD_MEANINGS`, and `getCardMeaningRecord(cardId)`.

- [ ] **Step 1: Add failing Pentacles and aggregate tests**

```ts
import {
  ALL_CARD_IDS,
  CARD_CATALOG,
  CARD_MEANINGS,
  PENTACLES_MEANINGS,
  getCardMeaningRecord,
} from "../src/index.js";
import { expectCompleteMeaningRecords } from "./meaning-assertions.js";

it("provides complete literal records for all 14 Pentacles cards", () => {
  const expectedIds = CARD_CATALOG.filter(
    ({ suit }) => suit === "pentacles",
  ).map(({ id }) => id);
  expectCompleteMeaningRecords(PENTACLES_MEANINGS, expectedIds);
});

it("indexes exactly one complete meaning record for every canonical card", () => {
  expect(Object.keys(CARD_MEANINGS).sort()).toEqual([...ALL_CARD_IDS].sort());
  expectCompleteMeaningRecords(
    ALL_CARD_IDS.map((cardId) => getCardMeaningRecord(cardId)),
    ALL_CARD_IDS,
  );
});
```

- [ ] **Step 2: Run the test and confirm both missing-export failures**

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
```

Expected: FAIL because Pentacles and the aggregate map do not exist.

- [ ] **Step 3: Author the complete Pentacles batch**

Create `meanings.pentacles.ts` using the same typed literal-array declaration as Task 5, with exactly 14 records for `minor.pentacles.ace` through `minor.pentacles.king`, in catalog rank order. Every record contains both orientations, three or more keywords, all four categories, advice, and the safety note. Export `PENTACLES_MEANINGS` from the package index.

- [ ] **Step 4: Build the checked aggregate map**

Add these imports directly below the existing `@aura/contracts` import:

```ts
import { ALL_CARD_IDS } from "./catalog.js";
import { CUPS_MEANINGS } from "./meanings.cups.js";
import { MAJOR_MEANINGS } from "./meanings.major.js";
import { PENTACLES_MEANINGS } from "./meanings.pentacles.js";
import { SWORDS_MEANINGS } from "./meanings.swords.js";
import { WANDS_MEANINGS } from "./meanings.wands.js";
```

Append this aggregate implementation after the interfaces:

```ts
const records = [
  ...MAJOR_MEANINGS,
  ...WANDS_MEANINGS,
  ...CUPS_MEANINGS,
  ...SWORDS_MEANINGS,
  ...PENTACLES_MEANINGS,
] as readonly CardMeaningRecord[];

export const CARD_MEANINGS = Object.fromEntries(
  records.map((record) => [record.cardId, record]),
) as Readonly<Record<CardId, CardMeaningRecord>>;

export function getCardMeaningRecord(cardId: CardId): CardMeaningRecord {
  const record = CARD_MEANINGS[cardId];
  if (!record || !ALL_CARD_IDS.includes(cardId)) {
    throw new RangeError(`Missing meaning for card id: ${cardId}`);
  }
  return record;
}
```

Export the aggregate symbols from the package index.

- [ ] **Step 5: Verify all 78 records, review, and commit**

```powershell
pnpm vitest run packages/content/test/cards-content.test.ts
pnpm typecheck
pnpm format:check
```

Expected: PASS. The domain reviewer inspects at least four Pentacles ranks and compares at least one same-rank record across all four suits for actual semantic differentiation.

```powershell
git add packages/content/src/cards/meanings.pentacles.ts packages/content/src/cards/meanings.ts packages/content/src/index.ts packages/content/test/cards-content.test.ts
git commit -m "feat: complete tarot meaning catalog"
```

## Task 9: Fixed Spread Definitions and Replay Versions

**Files:**

- Create: `packages/content/src/spreads.ts`
- Create: `packages/content/src/versions.ts`
- Modify: `packages/content/src/index.ts`
- Test: `packages/content/test/spreads.test.ts`

**Interfaces:**

- Consumes: `SpreadPosition`.
- Produces: `SpreadDefinition`, `SPREAD_DEFINITIONS`, `RULES_VERSION`, `CONTENT_VERSION`, and `TEXT_VERSION`.

- [ ] **Step 1: Write the failing spread and version tests**

```ts
// packages/content/test/spreads.test.ts
import { describe, expect, it } from "vitest";
import {
  CONTENT_VERSION,
  RULES_VERSION,
  SPREAD_DEFINITIONS,
  TEXT_VERSION,
} from "../src/index.js";

describe("M1 content constants", () => {
  it("freezes the approved spread positions", () => {
    expect(SPREAD_DEFINITIONS.single.positions).toEqual(["single"]);
    expect(SPREAD_DEFINITIONS.daily.positions).toEqual(["daily"]);
    expect(SPREAD_DEFINITIONS["past-present-trend"].positions).toEqual([
      "past",
      "present",
      "trend",
    ]);
  });

  it("publishes non-empty independent replay versions", () => {
    expect(RULES_VERSION).toBe("m1-rules-v1");
    expect(CONTENT_VERSION).toBe("m1-content-v1");
    expect(TEXT_VERSION).toBe("m1-text-v1");
    expect(new Set([RULES_VERSION, CONTENT_VERSION, TEXT_VERSION]).size).toBe(
      3,
    );
  });
});
```

- [ ] **Step 2: Run the test and confirm missing-export failures**

```powershell
pnpm vitest run packages/content/test/spreads.test.ts
```

Expected: FAIL because the spread and version exports do not exist.

- [ ] **Step 3: Implement the fixed definitions**

```ts
// packages/content/src/spreads.ts
import type { SpreadPosition } from "@aura/contracts";

export interface SpreadDefinition {
  readonly key: "single" | "daily" | "past-present-trend";
  readonly positions: readonly SpreadPosition[];
}

export const SPREAD_DEFINITIONS = {
  single: { key: "single", positions: ["single"] },
  daily: { key: "daily", positions: ["daily"] },
  "past-present-trend": {
    key: "past-present-trend",
    positions: ["past", "present", "trend"],
  },
} as const satisfies Record<string, SpreadDefinition>;
```

```ts
// packages/content/src/versions.ts
export const RULES_VERSION = "m1-rules-v1";
export const CONTENT_VERSION = "m1-content-v1";
export const TEXT_VERSION = "m1-text-v1";
```

Export every public type and constant from `packages/content/src/index.ts`.

- [ ] **Step 4: Verify and commit**

```powershell
pnpm vitest run packages/content/test
pnpm typecheck
```

Expected: PASS.

```powershell
git add packages/content/src/spreads.ts packages/content/src/versions.ts packages/content/src/index.ts packages/content/test/spreads.test.ts
git commit -m "feat: define milestone one spreads and versions"
```

## Task 10: Declarative Theme, Deck, Animation, and Test Fixtures

**Files:**

- Create: `packages/content/src/manifests/types.ts`
- Create: `packages/content/src/manifests/default-theme.ts`
- Create: `packages/content/src/manifests/neutral-deck.ts`
- Create: `packages/content/src/manifests/minimal-alt-theme.ts`
- Create: `packages/content/src/manifests/animations.ts`
- Modify: `packages/content/src/index.ts`
- Test: `packages/content/test/manifests.test.ts`
- Create: `packages/test-kits/src/fixtures/readings.ts`
- Create: `packages/test-kits/src/fixtures/manifests.ts`
- Modify: `packages/test-kits/src/index.ts`
- Modify: `packages/test-kits/package.json`
- Modify: `packages/test-kits/tsconfig.json`
- Test: `packages/test-kits/test/fixtures.test.ts`
- Modify: `vitest.config.ts`

**Interfaces:**

- Consumes: all card IDs and stable manifest refs.
- Produces: `ThemeDescriptor`, `DeckDescriptor`, `AnimationDescriptor`, `DEFAULT_THEME`, `MINIMAL_ALT_THEME`, `NEUTRAL_DECK`, `ANIMATIONS`, and fixed test fixtures.

- [ ] **Step 1: Write failing manifest coverage and fallback tests**

```ts
// packages/content/test/manifests.test.ts
import { describe, expect, it } from "vitest";
import {
  ALL_CARD_IDS,
  DEFAULT_THEME,
  MINIMAL_ALT_THEME,
  NEUTRAL_DECK,
  THEME_SLOT_KEYS,
} from "../src/index.js";

describe("M1 visual descriptors", () => {
  it("maps every logical card to a neutral asset key", () => {
    expect(Object.keys(NEUTRAL_DECK.cardFaceAssetKeys).sort()).toEqual(
      [...ALL_CARD_IDS].sort(),
    );
  });

  it("declares every fixed theme slot and its fallback", () => {
    expect(Object.keys(DEFAULT_THEME.slots).sort()).toEqual(
      [...THEME_SLOT_KEYS].sort(),
    );
    expect(DEFAULT_THEME.slots.BG_PATTERN.fallback).toBe("hide");
    expect(DEFAULT_THEME.slots.BG_BASE.fallback).toBe("default-theme");
    expect(DEFAULT_THEME.slots.TRANSITION_FX.fallback).toBe("neutral");
  });

  it("keeps the alternate sample layout-compatible", () => {
    expect(MINIMAL_ALT_THEME.layoutContract).toBe(DEFAULT_THEME.layoutContract);
  });
});
```

- [ ] **Step 2: Run the manifest test and confirm missing-descriptor failure**

Run:

```powershell
pnpm vitest run packages/content/test/manifests.test.ts
```

Expected: FAIL because visual descriptors do not exist.

- [ ] **Step 3: Define exact content-layer descriptor types**

```ts
// packages/content/src/manifests/types.ts
import type {
  CardId,
  DeckManifestRef,
  ThemeManifestRef,
} from "@aura/contracts";

export const THEME_SLOT_KEYS = [
  "BG_BASE",
  "BG_PATTERN",
  "BG_ORBIT",
  "STAGE_FRAME",
  "CARD_CONTAINER_CHROME",
  "PANEL_SURFACE",
  "BUTTON_SKIN",
  "ICON_ACCENT",
  "TRANSITION_FX",
] as const;
export type ThemeSlotKey = (typeof THEME_SLOT_KEYS)[number];
export type SlotFallback = "hide" | "default-theme" | "neutral";

export interface ThemeSlotDescriptor {
  readonly assetKey: string;
  readonly fallback: SlotFallback;
}

export interface ThemeDescriptor {
  readonly ref: ThemeManifestRef;
  readonly layoutContract: "m1-portrait-v1";
  readonly slots: Readonly<Record<ThemeSlotKey, ThemeSlotDescriptor>>;
}

export interface DeckDescriptor {
  readonly ref: DeckManifestRef;
  readonly cardFaceAssetKeys: Readonly<Record<CardId, string>>;
  readonly cardBackAssetKey: string;
  readonly sleeveAssetKey: string;
}

export interface AnimationDescriptor {
  readonly animationId: string;
  readonly kind: "shuffle" | "flip" | "background" | "transition";
  readonly durationMs: number;
  readonly fallbackPresetKey: "fade" | "none";
}
```

- [ ] **Step 4: Implement default, alternate, neutral, and animation descriptors**

Use the exact fallback classification from the spec:

```ts
const slot = (
  assetKey: string,
  fallback: SlotFallback,
): ThemeSlotDescriptor => ({
  assetKey,
  fallback,
});

export const DEFAULT_THEME: ThemeDescriptor = {
  ref: { themeId: "moonlight-healing", version: "1.0.0" },
  layoutContract: "m1-portrait-v1",
  slots: {
    BG_BASE: slot("theme.moonlight.bg-base", "default-theme"),
    BG_PATTERN: slot("theme.moonlight.bg-pattern", "hide"),
    BG_ORBIT: slot("theme.moonlight.bg-orbit", "hide"),
    STAGE_FRAME: slot("theme.moonlight.stage", "default-theme"),
    CARD_CONTAINER_CHROME: slot("theme.moonlight.card-chrome", "neutral"),
    PANEL_SURFACE: slot("theme.moonlight.panel", "default-theme"),
    BUTTON_SKIN: slot("theme.moonlight.button", "default-theme"),
    ICON_ACCENT: slot("theme.moonlight.icons", "hide"),
    TRANSITION_FX: slot("theme.moonlight.transition", "neutral"),
  },
};
```

`MINIMAL_ALT_THEME` must use different `assetKey` values but the same `layoutContract` and fallback classes. `NEUTRAL_DECK.cardFaceAssetKeys` must be built from `ALL_CARD_IDS` with keys `deck.neutral.face.<cardId>`; its back and sleeve keys are `deck.neutral.back` and `deck.neutral.sleeve`. Animation descriptors use bounded durations and only reference preset keys.

- [ ] **Step 5: Add deterministic fixtures without duplicating canonical data**

Replace `packages/test-kits/package.json` with:

```json
{
  "name": "@aura/test-kits",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./dist/index.js"
    }
  },
  "dependencies": {
    "@aura/contracts": "workspace:*",
    "@aura/content": "workspace:*"
  }
}
```

Replace `packages/test-kits/tsconfig.json` with:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"],
  "references": [{ "path": "../contracts" }, { "path": "../content" }]
}
```

Run `pnpm install --lockfile-only` so `pnpm-lock.yaml` records both workspace dependencies. Then replace the `resolve.alias` object in `vitest.config.ts` with these exact entries:

```ts
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
```

```ts
// packages/test-kits/src/fixtures/readings.ts
export const FIXED_READING_INPUT = {
  seed: "aura-m1-fixed-seed",
  sessionId: "fixture-session-001",
  questionCategory: "general",
  safetyDisposition: "standard",
  createdAt: "2026-08-28T00:00:00.000Z",
} as const;

export const FIXED_DAILY_INPUT = {
  installationId: "fixture-installation",
  localDate: "2026-08-28",
  mode: "daily",
  rulesVersion: "m1-rules-v1",
} as const;
```

```ts
// packages/test-kits/src/fixtures/manifests.ts
import { DEFAULT_THEME, MINIMAL_ALT_THEME, NEUTRAL_DECK } from "@aura/content";

export const VALID_MANIFEST_FIXTURE = {
  theme: DEFAULT_THEME,
  deck: NEUTRAL_DECK,
} as const;

export const ALTERNATE_MANIFEST_FIXTURE = {
  theme: MINIMAL_ALT_THEME,
  deck: NEUTRAL_DECK,
} as const;
```

Export fixtures from `packages/test-kits/src/index.ts`.

Validate the fixtures through public package imports:

```ts
// packages/test-kits/test/fixtures.test.ts
import { describe, expect, it } from "vitest";
import { ReadingSessionSchema } from "@aura/contracts";
import { ALL_CARD_IDS } from "@aura/content";
import {
  FIXED_DAILY_INPUT,
  FIXED_READING_INPUT,
  VALID_MANIFEST_FIXTURE,
} from "@aura/test-kits";

describe("shared deterministic fixtures", () => {
  it("uses canonical package data and stable inputs", () => {
    expect(ALL_CARD_IDS).toHaveLength(78);
    expect(FIXED_DAILY_INPUT.rulesVersion).toBe("m1-rules-v1");
    expect(VALID_MANIFEST_FIXTURE.deck.cardFaceAssetKeys).toHaveProperty(
      "major.fool",
    );
  });

  it("can seed a valid single-card session without duplicating schemas", () => {
    expect(
      ReadingSessionSchema.safeParse({
        ...FIXED_READING_INPUT,
        mode: "single",
        rulesVersion: "m1-rules-v1",
        contentVersion: "m1-content-v1",
        draws: [
          { cardId: "major.fool", orientation: "upright", position: "single" },
        ],
      }).success,
    ).toBe(true);
  });
});
```

- [ ] **Step 6: Run all Phase 1 verification**

Run:

```powershell
pnpm vitest run packages/contracts/test packages/content/test packages/test-kits/test
pnpm typecheck
pnpm quality
```

Expected: all tests PASS; `pnpm quality` exits 0.

- [ ] **Step 7: Commit declarative descriptors and fixtures**

```powershell
git add packages/content/src/manifests packages/content/src/index.ts packages/content/test/manifests.test.ts packages/test-kits vitest.config.ts pnpm-lock.yaml
git commit -m "feat: define replaceable visual descriptors"
```

## Phase 1 Exit Gate

- [ ] 78 unique card IDs, 22/56 arcana counts, and 14 cards per suit pass.
- [ ] Every card has complete upright/reversed content and all four category explanations.
- [ ] Reading/history schemas reject missing `questionCategory`, `safetyDisposition`, `rulesVersion`, or `contentVersion`, and a positive local-history parse retains all replay versions.
- [ ] Contracts contain no Cocos type, asset path, URL, animation instance, cloud identifier, or AI SDK type.
- [ ] Neutral deck maps exactly 78 IDs; default and alternate themes share one layout contract.
- [ ] Manifest fallback categories match the approved M1 specification.
- [ ] `pnpm quality` passes on Node 22.14.x / pnpm 10.15.0.
- [ ] Domain reviewer approves schema/invariant coverage.
- [ ] Project control reviewer confirms no M2/M3 resource-distribution capability entered the phase.

Only after every box is evidenced and the product owner accepts the Phase 1 report may the total controller write the Phase 2 single-card domain plan.
