# AURA Milestone 1 Core Gameplay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 分四个可回滚阶段交付 AURA 离线核心玩法，并在固定种子、可替换表现、真机体验和独立审查全部通过后封版 Milestone 1。

**Architecture:** 先冻结 `contracts/content` 的平台无关数据面，再实现纯 TypeScript 单卡规则闭环；Cocos 客户端只消费已确定的结果并通过统一主题槽位呈现；最后复用同一核心增加每日一牌和固定三牌阵。每个阶段有独立规格、测试门、审查角色和提交边界。

**Tech Stack:** Node.js 22.14.x、pnpm 10.15.0、TypeScript、Zod 4.1.5、Vitest 3.2.4、Cocos Creator 3.8.8、微信小游戏。

**Spec:** `docs/superpowers/specs/2026-08-28-aura-milestone-1-core-gameplay-design.md`

## Global Constraints

- 所有实现先写失败测试，再写最小实现；每个任务单独提交并接受独立审查。
- `packages/domain` 不得依赖 Cocos、微信、CloudBase、浏览器或 AI SDK。
- 卡牌逻辑 ID、抽牌、正逆位、牌义、历史和图鉴不得依赖主题、牌面、卡背、封套或动画。
- M1 不实现云端、AI、真实 VIP/支付、商城、资源下载、热更新或真实分享。
- 卡牌正面和卡背美术由产品所有者后续提供；M1 使用中性占位和稳定适配接口。
- 原始问题不得进入普通日志、分析事件或默认结果卡。
- Creator 本地文件 `apps/game-client/settings/v2/packages/cocos-service.json` 不得提交。
- 每阶段状态固定汇报：已完成、正在做、阻塞、下一验收点。

---

## Plan Decomposition

| 阶段                | 唯一目标                                    | 实施计划                                          | 依赖     | 退出门                                   |
| ------------------- | ------------------------------------------- | ------------------------------------------------- | -------- | ---------------------------------------- |
| 1 规则与契约底座    | 冻结稳定逻辑数据、内容与资源描述            | `2026-08-28-aura-m1-phase-1-contracts-content.md` | M0       | 以该阶段详细计划的完整 Exit Gate 为准    |
| 2 单卡规则闭环      | 证明单卡抽取、解读、安全、历史和图鉴可重放  | 在阶段 1 批准后按冻结接口生成                     | 阶段 1   | 纯 TypeScript 单卡闭环与固定种子证据通过 |
| 3 可换皮客户端流程  | 证明 Cocos 单卡流程、主题回退和结果阅读成立 | 在阶段 2 批准后按冻结接口生成                     | 阶段 1–2 | 默认/替代/低特效单卡真机流程通过         |
| 4 每日/三牌阵与封版 | 复用核心完成剩余模式并满足唯一退出门        | 在阶段 3 批准后按真机证据生成                     | 阶段 1–3 | M1 规格 §12 全部条件通过                 |

后续阶段计划刻意在前一阶段验收后生成，以免接口和真机证据尚未稳定时提前写出失效步骤。该策略是范围控制，不代表后续范围可选；Milestone 1 仍必须完成四个阶段才能封版。

## File Ownership Map

- `packages/contracts`: 跨层稳定 Schema；阶段 1 单一负责人。
- `packages/content`: 78 张逻辑内容、牌阵与声明式表现描述；阶段 1 内容负责人，领域审查复核。
- `packages/domain`: 固定种子、抽牌、解读、每日缓存、历史和图鉴；阶段 2/4 单一负责人。
- `packages/test-kits`: 固定夹具与断言；随拥有对应测试的阶段维护。
- `apps/game-client/assets/scripts/app`: Cocos 无关的客户端状态编排；阶段 3 单一负责人。
- `apps/game-client/assets/scripts/theme`: 主题解析、槽位回退和低特效策略；阶段 3 视觉实现负责人。
- `apps/game-client/assets/scripts/ui`: Cocos 视图组件；阶段 3 视觉实现负责人。
- `apps/game-client/assets/scenes/Bootstrap.scene`: 唯一 M1 根场景；只在客户端阶段由一个负责人修改。
- `DESIGN.md`: 已批准的视觉身份源。
- `UX-CONTRACT.md`: 已批准的跨屏行为源。

## Review and Commit Gates

每个任务执行：失败测试 → 确认预期失败 → 最小实现 → 定向测试与类型检查 → 实现者提交 → 规格审查 → 代码质量审查。每阶段最后由总控运行完整 `pnpm quality` 和该阶段详细计划规定的全部回归；详细计划可以为高风险任务增加更严格的任务级质量门，但不能削弱阶段出口。

- 阶段 1：领域审查主责，项目管控检查范围。
- 阶段 2：领域审查主责，安全与隐私作为独立检查项。
- 阶段 3：视觉总监主责视觉验收，领域审查确认动画不决定结果。
- 阶段 4：项目管控统筹唯一退出门，三角色复核，产品所有者真机批准。

任何任务失败只修当前任务；不借机引入后续里程碑能力。未获得产品所有者授权，不推送标签、不开始 Milestone 2。
