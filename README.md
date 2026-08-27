# AURA

AURA 是面向微信小游戏的塔罗体验项目。当前仓库处于 **Milestone 0 工程基础候选**：包含可重复的 TypeScript 工作区、质量门禁、环境隔离、Cocos Creator 3.8.8 启动壳和云函数健康契约；尚未实现抽牌、牌义、经济、商品或运营后台功能。

## 开始使用

先阅读[本地开发与 Milestone 0 验证手册](docs/runbooks/local-development.md)，然后在仓库根目录运行：

```powershell
pnpm install --frozen-lockfile
pnpm quality
```

## 设计与交付文档

- [批准的产品与系统设计规格](docs/superpowers/specs/2026-08-26-aura-tarot-wechat-game-design.md)
- [分阶段交付路线图](docs/superpowers/plans/2026-08-26-aura-delivery-roadmap.md)
- [当前 Milestone 0 实施计划](docs/superpowers/plans/2026-08-26-aura-milestone-0-foundation.md)
- [ADR 0001：架构边界](docs/decisions/0001-architecture-boundaries.md)
- [本地开发与验证手册](docs/runbooks/local-development.md)

后续里程碑只有在当前阶段通过自动化、独立审查和产品所有者验收后才开始规划与实现。
