# AURA UX Contract

## Product context

- Audience: 塔罗新手与爱好者。
- Primary jobs: 提问或跳过问题、抽牌、理解规则解读、反思、手动保存和查看本地结果。
- Target market(s): 中国大陆微信小游戏。
- Active locales: 简体中文；英文仅为辅助展示。
- Language/content register and native-review policy: 平静、通俗、非宿命；产品所有者复核关键中文文案。
- Timezone/calendar policy: Milestone 1 每日一牌使用设备本地自然日；服务端权威日历延后到 Milestone 2。
- Accessibility target: WCAG 2.2 AA 原则与微信触屏可达性，最终以 Cocos/真机证据验收。

## Business-context sources

| Domain / scope           | Authoritative source                                                         | Source type      | Reviewed date |
| ------------------------ | ---------------------------------------------------------------------------- | ---------------- | ------------- |
| 产品、隐私与付费边界     | `docs/superpowers/specs/2026-08-26-aura-tarot-wechat-game-design.md`         | Product spec     | 2026-08-28    |
| Milestone 1 行为与退出门 | `docs/superpowers/specs/2026-08-28-aura-milestone-1-core-gameplay-design.md` | Milestone spec   | 2026-08-28    |
| 依赖与平台边界           | `docs/decisions/0001-architecture-boundaries.md`                             | ADR              | 2026-08-28    |
| 阶段顺序                 | `docs/superpowers/plans/2026-08-26-aura-delivery-roadmap.md`                 | Delivery roadmap | 2026-08-28    |

## Visual contract

- Project `DESIGN.md`: `DESIGN.md`
- Token ownership model: `DESIGN.md` 是批准的视觉身份；运行时主题 Token 实现并映射它。
- Runtime design-system/token source: Milestone 1 计划在 `apps/game-client/assets/scripts/theme/` 建立唯一主题解析器。
- Mapping/export/adapters: 实现时建立主题 manifest 到 Cocos 组件属性的显式映射。
- Token drift gate: 文档 Token 变化必须与运行时映射、视觉证据和审查在同一变更中完成。
- Supported themes: Milestone 1 默认月光主题与极简替代样例；低特效是表现降级，不是新主题。
- Design-context owner/review policy: 视觉总监只读独立审查，产品所有者批准；UI 实现者不能自批。

## Canonical UI Map

| Capability                 | Canonical owner                   | Source of truth             | Allowed variants                | Verification               |
| -------------------------- | --------------------------------- | --------------------------- | ------------------------------- | -------------------------- |
| Question category selector | Shared authored category selector | M1 spec + this contract     | four fixed categories           | component + full flow      |
| Optional question form     | Shared authored question panel    | M1 spec + this contract     | empty / entered / high-risk     | validation + privacy test  |
| Primary/secondary actions  | Shared tap-target button          | `DESIGN.md` + this contract | primary / secondary / back      | state + touch target test  |
| Result scrolling           | Shared result layout              | M1 spec + this contract     | hero / expanded                 | layout + device scroll     |
| Toast                      | Shared in-game feedback primitive | this contract               | success / warning / error       | state + visible message    |
| Result preview overlay     | Shared authored overlay           | M1 spec + this contract     | open / closed / field selection | focus/close + privacy test |

## Component behavior

| Component         | Default             | Focus                              | Active                                  | Disabled                  | Busy                 | Error                        |
| ----------------- | ------------------- | ---------------------------------- | --------------------------------------- | ------------------------- | -------------------- | ---------------------------- |
| Primary button    | moon-white emphasis | visible outline in desktop preview | pressed feedback without geometry shift | readable reason           | stable spinner/label | recoverable message          |
| Secondary button  | lower contrast      | visible outline                    | pressed feedback                        | readable reason           | stable geometry      | recoverable message          |
| Category selector | 综合 selected       | visible outline                    | selected state + text                   | n/a                       | n/a                  | n/a                          |
| Question input    | empty allowed       | visible outline                    | editing                                 | only during transition    | stable geometry      | inline safe-language message |
| Result scroller   | hero at top         | programmatic target after reveal   | touch scroll                            | locked during reveal      | n/a                  | preserves logical result     |
| Preview overlay   | closed              | close control first                | field selection                         | unavailable before result | stable placeholder   | can close and retry          |

## Flow ledger

| Operation                 | Trigger                   | Pending                                 | Success destination   | Success feedback             | Failure recovery                        | Focus outcome                | Source ref       |
| ------------------------- | ------------------------- | --------------------------------------- | --------------------- | ---------------------------- | --------------------------------------- | ---------------------------- | ---------------- |
| Start single-card reading | confirm category/question | one stable transition                   | contemplation         | stage becomes ready          | return to input with values preserved   | contemplation primary action | M1 spec §6.1     |
| Draw/reveal               | draw action               | input locked; result already determined | result hero           | one reveal climax then quiet | neutral placeholder/fade if assets fail | result hero                  | M1 spec §6.2–6.3 |
| Expand reading            | scroll past peek          | none                                    | result details        | content naturally continues  | hero remains usable                     | first details heading        | M1 spec §6.3     |
| Save history              | explicit save             | duplicate submit blocked                | remain on result      | lightweight saved feedback   | retry without losing result             | save action/status           | M1 spec §3.3     |
| Open result preview       | preview action            | local composition only                  | preview overlay       | selected fields shown        | close and retry                         | overlay close control        | M1 spec §3.3     |
| Restart                   | explicit restart          | none                                    | question input        | fresh unsaved session        | remain on result if transition fails    | category selector            | M1 spec §6.4     |
| Back                      | back action               | none                                    | previous stable state | none                         | current state preserved                 | prior primary control        | M1 spec §6       |

## Navigation and responsive behavior

- Route document title policy: 单场景小游戏不使用浏览器路由标题；页面状态提供可见中文标题。
- Route error / 403 page behavior: M1 无权限页；VIP 仅静态锁定模块。
- Breadcrumb/tab/route-state policy: 不使用面包屑；状态机是唯一流程来源。
- Sidebar/drawer/bottom-sheet transformation: 不使用侧栏；结果预览使用覆盖层。
- Responsive strategy: 以 `750 × 1334` 为基准适配上下安全区，保持卡牌比例与正文起点。
- Truncation/full-value access: 核心结论不截断；次级标签可缩短但必须保留完整可访问文本。
- Focus restoration and sticky-obstruction policy: 覆盖层关闭后回到触发控件；底部操作不能遮挡正文末尾。

## Overlays and feedback

- Dialog primitive: 产品自有结果预览覆盖层；M1 不使用通用确认弹窗。
- Destructive confirmation levels: M1 不实现删除；重新开始需明确动作，不自动覆盖已保存历史。
- Toast placement/duration/deduplication: 下半屏操作区上方，短时、可读、同类合并；不能遮挡卡牌和核心结论。
- Alert/banner scope and persistence: 资源降级和本地数据异常使用当前会话提示；安全响应保留在解读内容中。
- Tooltip delay/dismissal: 触屏不依赖 tooltip；禁用原因用可见短文案。
- Unsaved-changes behavior: 未保存结果离开时不写历史；M1 不额外引入阻塞确认。
- Layer contract: result preview > transient feedback > page content > background effects.

## Async and resilience

- Mutation default: 本地写入采用悲观完成反馈；写入成功后才显示已保存。
- Idempotency and duplicate-submit policy: 保存过程中禁用重复提交；历史按会话 ID 防重复。
- Auto-save/draft recovery: 不自动保存问题或测算历史。
- Offline behavior: M1 全流程离线可用；不尝试云端写入。
- Retry/timeout behavior: 本地资源失败立即按 manifest 回退；不等待网络。
- Version conflict: 本地 Schema 校验失败时隔离异常记录并继续启动。
- Stale-request policy: 新会话开始后，旧动效和旧结果展示回调不得覆盖当前状态。
- Dialog/form preservation: 结果预览失败时保留结果页和已选字段，可关闭重试。

## Validation

- Schema/validation layer: 跨层数据使用 `packages/contracts`；Cocos 适配器在进入领域前校验输入。
- Trigger timing: 类别始终有效；可选问题只在提交时做安全分流。
- Error summary/inline policy: 输入相关提示贴近输入区；资源与存储提示使用页面级反馈。
- Sensitive-value handling: 原始问题默认只用于当次测算，不进入普通历史、结果卡、日志或分析事件。
- Duplicate-submit prevention: 抽取、保存和预览生成期间分别由单一状态所有者阻止重复动作。

## Verification

- Required static commands: `pnpm install --frozen-lockfile`, `pnpm quality`。
- Browser/device/locale/theme matrix: Cocos 3.8.8 预览、微信开发者工具、常见真机；默认主题、极简替代样例、低特效、缺失资源回退；简体中文。
- Accessibility checks: `88 × 88` 触控区、正文对比、文字与方向双表达、字体回退、减少动画。
- Native-language/domain review: 产品所有者审核关键中文；领域审查者审核塔罗规则与安全分流。
- Component-state/visual regression coverage: 输入、静心、抽卡、揭示、结果首屏、展开态、保存反馈、预览、字体回退和资源回退。
- Canonical sibling flow: 单卡问答是每日一牌和三牌阵客户端流程的基线。
- Project audit command/result: 实现共享 UI 后运行 premium UI 静态审计；当前文档阶段不把静态审计当作运行时证据。
- Failure-path evidence: 缺背景纹样、按钮皮肤、卡牌容器装饰和正式牌面时各保留截图或录屏。
