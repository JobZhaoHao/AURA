# AURA

AURA 是面向微信小游戏的塔罗体验项目。**Milestone 0 工程基础已通过托管验收并封版**；Milestone 1 核心玩法纵切设计已获产品所有者批准，但尚未实现抽牌、牌义、经济、商品或运营后台功能。

## 开始使用

先阅读[本地开发与 Milestone 0 验证手册](docs/runbooks/local-development.md)，然后在仓库根目录运行：

```powershell
pnpm install --frozen-lockfile
pnpm quality
```

## 设计与交付文档

- [批准的产品与系统设计规格](docs/superpowers/specs/2026-08-26-aura-tarot-wechat-game-design.md)
- [Milestone 1 核心玩法纵切设计](docs/superpowers/specs/2026-08-28-aura-milestone-1-core-gameplay-design.md)
- [Milestone 1 分阶段实施总计划](docs/superpowers/plans/2026-08-28-aura-milestone-1-core-gameplay.md)
- [长期视觉合同](DESIGN.md)
- [跨屏交互合同](UX-CONTRACT.md)
- [分阶段交付路线图](docs/superpowers/plans/2026-08-26-aura-delivery-roadmap.md)
- [当前 Milestone 0 实施计划](docs/superpowers/plans/2026-08-26-aura-milestone-0-foundation.md)
- [ADR 0001：架构边界](docs/decisions/0001-architecture-boundaries.md)
- [本地开发与验证手册](docs/runbooks/local-development.md)

后续里程碑只有在当前阶段通过自动化、独立审查和产品所有者验收后才开始规划与实现。
