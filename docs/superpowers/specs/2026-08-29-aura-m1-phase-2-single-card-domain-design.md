# AURA M1 Phase 2 单卡领域闭环设计

- 日期：2026-08-29
- 状态：产品所有者已确认；书面规格已通过领域、安全隐私和项目管控独立审查
- 基线提交：`6c4e0ce31da2fd70b374093b3d1bcdcedd84de04`
- 前置阶段：[M1 Phase 1 已通过产品验收与固定版本托管 CI](../../acceptance/2026-08-29-aura-m1-phase-1-acceptance.md)
- 上位规格：[AURA Milestone 1 核心玩法纵切设计](2026-08-28-aura-milestone-1-core-gameplay-design.md)
- 架构约束：[ADR 0001：保持领域核心的平台无关性](../../decisions/0001-architecture-boundaries.md)

## 1. 目标

Phase 2 在 `packages/domain` 建立可独立测试、可确定性重放的单张问答领域闭环：给定稳定输入后，生成一张牌及其正逆位，拼装规则版解读，追加安全边界，并通过纯函数更新图鉴和手动保存的本地历史。

本阶段证明的是玩法逻辑，而不是客户端体验。完成后，Phase 3 可以只负责输入编排、动画和呈现，不得在表现层重新决定抽牌结果。

## 2. 范围

### 2.1 本阶段实现

- 稳定字符串种子到确定性伪随机序列的转换。
- 单张问答从 78 张 canonical card ID 中抽取一张。
- 默认开启的正逆位判定；关闭逆位后只产生正位。
- 根据牌、正逆位、问题类别、单张位置和内容版本拼装规则版解读。
- `standard` 与 `high-risk` 两种安全分流的确定性响应。
- 揭牌后按稳定 `cardId` 幂等点亮图鉴。
- 用户明确保存时生成历史条目；重复保存同一会话不得产生重复记录。
- 固定夹具、黄金样例、性质测试和隐私回归测试。

### 2.2 明确不实现

- Cocos 场景、页面、动画、触控、资源加载和本地存储适配。
- 每日一牌、三牌阵、组合解读或多张不重复抽取。
- 原始问题文本的分类器、关键词库、诊断或 AI 处理。
- AI 解读、真实 VIP、支付、商品、权益或云端能力。
- 结果卡渲染、真实分享、主题切换、资源下载或热更新。
- 正式卡面、卡背、封套、抽卡背景或效果素材。

## 3. 已批准的产品行为

- 单张问答每次形成独立会话，可以再次发起，但不得静默覆盖旧会话。
- 问题类别固定为综合、感情与关系、事业与学业、自我成长，默认选择由客户端负责；领域输入必须显式给出类别。
- 正逆位默认开启，正位和逆位各占算法空间的一半；关闭后任何输入种子都只能得到正位。
- 安全分流不参与抽牌概率，也不改变牌、正逆位、核心牌义或建议。
- `high-risk` 返回更醒目的安全响应，不给出医疗、法律、投资、伤害或危机结论；Phase 3 必须先展示安全响应，再展示塔罗内容。
- 原始问题属于短暂私密输入，不进入本阶段任何公开领域 API、结果、历史、图鉴、错误消息、日志或快照。
- 揭牌即点亮图鉴，与是否保存历史无关；历史只有用户明确保存时才追加。

## 4. 架构与依赖方向

```text
Phase 3 应用编排（以后实现）
        ↓ 仅传稳定化输入
single-reading orchestration
        ├── deterministic random
        ├── single-card draw
        ├── narrative composition
        ├── safety response
        ├── discovery reducers
        └── history reducers
                  ↓
       contracts + content
```

`packages/domain` 只依赖 `@aura/contracts`、`@aura/content` 和无平台副作用的标准 JavaScript 能力。不得依赖 Cocos、微信、CloudBase、浏览器对象、Node 专属 API、AI SDK、资源路径或表现清单。

建议按责任拆分为以下单元，具体文件名由实施计划冻结：

1. 确定性随机：只负责种子规范化、哈希和伪随机序列。
2. 单卡抽取：只负责 canonical card ID 选择和正逆位。
3. 解读拼装：只消费已经确定的抽牌结果和版本化内容。
4. 单张编排：验证输入并构造完整 `ReadingResult`。
5. 图鉴操作：对 `DiscoveryRecord[]` 执行幂等更新。
6. 历史操作：生成并幂等追加 `LocalHistoryEntry[]`。

这些单元不得通过模块级可变状态共享随机数、当前会话、图鉴或历史。

## 5. 单张领域输入与输出

### 5.1 输入

公开 API 分为两层：`parseSingleReadingInput(unknown)` 是唯一入域解析边界，输出不可由普通对象冒充的已解析 `SingleReadingInput`；`createSingleReading(parsedInput)` 只接受该结果。解析器和暂态 Schema 归 `packages/domain` 所有，并复用 `@aura/contracts` 的字段 Schema。Phase 3 不得复制第二套校验规则。

公开单张入口接收一个严格对象，至少包含：

- `seed`：匹配 `^[A-Za-z0-9_-]{16,128}$` 的 opaque ASCII identifier，只用于本次确定性计算，不进入持久化结果。它必须由与问题内容无关的随机源或测试夹具生成，禁止使用原始问题、原始问题的哈希或其他用户文本派生。
- `sessionId`：匹配 `^[A-Za-z0-9_-]{16,128}$` 的 opaque ASCII identifier，必须由会话 ID 工厂生成，不接受表单文本。
- `questionCategory`：Phase 1 冻结的四类之一。
- `safetyDisposition`：边界层已经稳定化的 `standard` 或 `high-risk`。
- `reversalsEnabled`：显式布尔值。
- `createdAt`：ISO 8601 时间字符串，由调用方注入，禁止领域层读取系统时钟。

领域入口拒绝未知字段。特别是 `rawQuestion`、`questionText`、`themeId`、`deckId`、`animationId`、资源路径和平台对象不得进入该对象。字符集和长度校验降低误传文本的风险，但不能证明值的来源；Phase 3 必须测试 seed/sessionId 工厂与问题输入之间不存在数据流。

`rulesVersion`、`contentVersion` 与 `textVersion` 来自可信的当前内容 bundle，不允许调用方伪造。Phase 2 只支持一个由 `@aura/content` 导出的原子 bundle，其中同时包含三条版本、canonical catalog、牌义和高风险模板。未来重放旧版本时只能扩展显式版本注册表，不能接受任意字符串或静默使用当前 bundle。

### 5.2 输出

成功输出必须通过 Phase 1 的 `ReadingResultSchema`，并满足：

- `session.mode === "single"`。
- `session.draws` 恰好一项。
- `draw.position === "single"`。
- `session` 保留类别、安全分流、规则版本、内容版本和创建时间。
- `narrative` 包含一句话核心、类别解释、可执行建议和安全边界。
- `textVersion` 使用当前文本版本。
- 输出中不存在种子、原始问题或表现资源引用。

## 6. 确定性随机规则

### 6.1 算法合同

M1 采用版本化、非加密的纯 JavaScript 伪随机实现。seed 已被限制为 ASCII，不执行 trim、大小写转换、Unicode 规范化或隐式编码转换。选牌和方向使用稳定 domain separator 的独立随机流：

- 选牌流输入：`${seed}:card`
- 方向流输入：`${seed}:orientation`

规范性伪代码如下；实现必须逐步等价，不能替换成其他同名算法变体：

```ts
function fnv1a32Ascii(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    const byte = text.charCodeAt(index);
    // 前置输入校验保证 byte <= 0x7f。
    hash = Math.imul((hash ^ byte) >>> 0, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function mulberry32Step(state: number): {
  state: number;
  uint32: number;
  value: number;
} {
  const nextState = (state + 0x6d2b79f5) >>> 0;
  let mixed = nextState;
  mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1) >>> 0;
  mixed =
    (mixed ^ ((mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)) >>> 0)) >>>
    0;
  const uint32 = (mixed ^ (mixed >>> 14)) >>> 0;
  return { state: nextState, uint32, value: uint32 / 0x100000000 };
}
```

卡牌索引使用选牌流的第一个 `value`：`Math.floor(value * ALL_CARD_IDS.length)`。方向使用方向流的第一个 `value`：开启逆位时 `< 0.5` 为正位，否则为逆位；关闭逆位时忽略方向值并返回正位。独立流保证逆位开关不会改变 card ID。

以下黄金向量属于规范的一部分；所有整数均为十进制无符号 32 位值：

| seed                 | 流          |       hash | next state |     uint32 |              value | 结果                                |
| -------------------- | ----------- | ---------: | ---------: | ---------: | -----------------: | ----------------------------------- |
| `aura-m1-fixed-seed` | card        | 1022744150 | 2854309963 |  732049900 | 0.1704436494037509 | index 13 → `major.death`            |
| `aura-m1-fixed-seed` | orientation |  574696082 | 2406261895 | 2614748697 | 0.6087936221156269 | `reversed`                          |
| `fixture-seed-0001`  | card        | 3076897556 |  613496073 | 1747956162 | 0.4069777582772076 | index 31 → `minor.wands.ten`        |
| `fixture-seed-0001`  | orientation |   94061976 | 1925627789 |  336827867 |   0.07842384907417 | `upright`                           |
| `AURA_seed_123456`   | card        | 2671759024 |  208357541 |  555743750 | 0.1293941750191152 | index 10 → `major.wheel-of-fortune` |
| `AURA_seed_123456`   | orientation |  330621932 | 2162187745 | 3916623550 | 0.9119099820964038 | `reversed`                          |

表中的 hash 输入分别为 `${seed}:card` 与 `${seed}:orientation`。含空格、中文、emoji、孤立 surrogate、少于 16 字符或超过 128 字符的 seed 在哈希前拒绝，因此不存在 Unicode 规范化等价规则。

算法不是安全随机源，也不宣称不可预测；它只用于 M1 离线玩法的可复现性。算法、消费顺序或 canonical card ID 顺序的任何变化都必须提升 `RULES_VERSION` 并更新黄金样例，禁止在同一规则版本下静默改变结果。

### 6.2 确定性边界

- 同一完整已解析输入与同一当前 bundle 必须得到逐字段相同的 `ReadingResult`。
- 同一 `seed + reversalsEnabled + rulesVersion + canonical card order` 必须得到相同的 card ID 与方向。
- 同一 draw、问题类别、安全分流和三条版本必须得到相同的 narrative。
- `sessionId`、`createdAt`、问题类别和安全分流不参与随机数计算。
- 问题类别和安全分流只影响结果文本，不影响牌和方向。
- 主题、牌组、动画和任何资源状态没有进入领域输入的入口，因此不能改变结果。
- 不符合 opaque ASCII 格式的种子、非字符串种子和未知字段必须在计算前失败。
- Phase 4 不得通过循环调用单卡入口实现三牌阵；它必须新增不放回选择并保留已经冻结的 single domain separator 与黄金结果。

### 6.3 版本所有权

| 变化                                                                                          | 必须提升的版本                                                                                           |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| seed 格式、FNV/Mulberry 常量或步骤、domain separator、随机消费顺序、card index 映射、方向阈值 | `RULES_VERSION`                                                                                          |
| canonical card ID 集合或顺序                                                                  | `CONTENT_VERSION` 与 `RULES_VERSION`                                                                     |
| 牌名、正逆位 core、类别 interpretation/advice、逐牌 safetyNote                                | `CONTENT_VERSION`                                                                                        |
| narrative 字段拼装规则或统一 high-risk 模板                                                   | `TEXT_VERSION`                                                                                           |
| 新增 daily/three-card 规则                                                                    | 提升 `RULES_VERSION`；除非另行批准 single 规则迁移，既有 single domain separator、算法和黄金映射必须保持 |

当前 bundle 原子携带三条版本及其数据，任何一条不匹配都不能部分拼装。

## 7. 规则解读与安全响应

### 7.1 解读拼装

解读按以下稳定映射生成：

- `summary`：所抽牌对应方向的 `core`。
- `interpretation`：对应方向和 `questionCategory` 的 `interpretation`。
- `advice`：对应方向和 `questionCategory` 的 `advice`。
- `safetyNotice`：由安全策略拼装，不能覆盖前三项。

`spreadPosition` 固定为 `single`，本阶段不添加三牌位置修饰或组合推理。找不到 card ID、方向内容、类别内容或版本时必须失败，不得回退到错误牌或空字符串。

### 7.2 安全策略

- `standard`：使用该牌已批准的 `safetyNote` 作为克制的专业边界。
- `high-risk`：保留完全相同的 summary、interpretation 和 advice，返回由 `@aura/content` 持有并纳入 `TEXT_VERSION` 的统一全风险模板与逐牌 `safetyNote`。模板不依赖牌、类别或风险子型，并同时明确：塔罗不能评估现实风险；不得据此作医疗、法律、投资或不可逆决定；若存在即时危险或自伤/伤人念头，应立即前往安全地点、联系当地紧急或危机服务，并联系可信赖的人或合格专业人员。
- 高风险响应不得根据具体原始问题生成个性化诊断、处方、法律意见、投资建议或确定性预测。
- 本阶段只证明“给定 disposition 后生成正确响应”，不证明风险识别。原始问题识别属于后续应用边界设计，不得通过临时关键词分类器夹带进入 Phase 2；分类失败不得静默降为 `standard`。
- Phase 3 对 `high-risk` 必须在 summary、interpretation 和 advice 之前展示 `safetyNotice`。Phase 2 的数据结构保持字段分离，不通过改写核心牌义模拟优先级。

## 8. 图鉴规则

图鉴更新是纯函数：输入已有 `DiscoveryRecord[]`、本次揭示的 `cardId` 和调用方注入的 `revealedAt`，输出新的只读数组。

- 首次揭示追加 `{ cardId, firstSeenAt: revealedAt }`。
- 已存在同一 `cardId` 时返回语义不变的集合，不更新首次时间、不重复累计。
- 记录唯一性只基于逻辑 `cardId`，不认识 deck、theme 或卡图资源。
- `CardIdSchema` 通过不等于 canonical。新 card ID 及已有每条记录都必须属于 `ALL_CARD_IDS`，已有数组还必须按 card ID 唯一；非法 card ID、非法时间或已有重复记录应返回安全的领域错误，不静默修复输入。
- 领域函数不自行写本地存储；持久化和损坏记录隔离由 Phase 3 适配器负责。

## 9. 历史规则

### 9.1 单卡语义验证与手动保存

`ReadingResultSchema` 只提供结构验证，不能作为保存授权。历史入口必须重新执行 `assertSingleCardReadingResult` 语义检查：

- mode 为 `single`，恰好一张牌且 position 为 `single`。
- card ID 属于 canonical 78 张。
- 三条版本全部属于受支持的当前 bundle。
- narrative 与该 bundle、类别、方向和安全分流重新拼装的结果逐字段一致。
- `high-risk` 必须包含批准的统一安全模板。

历史保存随后分两步：

1. 根据已经生成并校验通过的 `ReadingResult`、调用方注入的 `savedAt` 和可选表现引用构造 `LocalHistoryEntry`。
2. 将条目追加到已有历史集合。

没有显式保存调用就没有历史写入。抽牌入口不得接收历史集合，也不得隐式保存。

### 9.2 幂等与冲突

- 逻辑相等定义为经过语义验证的整个 `ReadingResult` 逐字段结构相等，包括类别、安全分流、三条版本、创建时间、draws 和 narrative；禁止把未定义的裸 `JSON.stringify` 顺序当作公共比较合同。
- 同一 `sessionId` 与逻辑相等的结果重复保存时保持幂等，不产生第二条，并完整保留第一次保存的 `savedAt`、`themeRef` 和 `deckRef`。
- 同一 `sessionId` 对应不同逻辑结果时返回冲突错误，禁止覆盖旧条目。
- 不同 `sessionId` 即使牌和文本相同，也视为两个独立会话。
- 如果输入历史集合本身含重复 `sessionId`、非法 single 语义或不受支持版本，先返回状态错误，不对损坏集合追加。
- 排序语义保持调用方传入顺序；本阶段不隐式按时间重排。

历史条目必须继续通过 `LocalHistoryEntrySchema`，不得包含种子或原始问题。可选主题/牌组引用只用于未来还原表现，不参与逻辑冲突判断。本阶段不实现删除或清空；相关破坏性能力按 `UX-CONTRACT.md` 留待后续里程碑。

### 9.3 重放语义

- 历史重放从已保存的 `draws` 开始，绝不重新运行 PRNG，也不需要保存 seed。
- M1 以历史中已保存的 narrative 作为精确展示事实。
- 只有三条版本精确命中受支持 bundle 时，才允许重新拼装并核对 narrative。
- 任一版本缺失时返回 `UNSUPPORTED_REPLAY_VERSION`，禁止回退到当前内容、猜测旧牌义或重新抽牌。

## 10. 错误与隐私

领域边界使用稳定、可测试且不含用户数据的错误码，至少区分：

- `INVALID_READING_INPUT`
- `UNKNOWN_CARD_CONTENT`
- `INVALID_DISCOVERY_STATE`
- `INVALID_HISTORY_ENTRY`
- `HISTORY_SESSION_CONFLICT`
- `UNSUPPORTED_REPLAY_VERSION`

公开 `DomainError` 的可枚举字段只能是稳定 `code` 与硬编码 allowlist 中的可选 `field`；消息为固定文案，不拼接输入。不得公开 `cause`、Zod issues、content helper 异常、历史对象或解析值。所有下层错误必须在入域边界转换为安全错误，UI 只能按 code 映射文案且不得显示 stack。

敏感 sentinel 测试必须检查 `String(error)`、错误的可枚举自有属性和公开序列化结果，证明不会泄漏 seed、sessionId、非法 cardId、原始问题或损坏历史内容。领域包不记录日志、不读取环境变量、不访问网络、不读取系统时间，也不捕获后继续返回部分结果。

问题类别、`high-risk` disposition、精确 created/saved time 与 `firstSeenAt` 属于派生私密数据。它们只允许存在于当前内存结果、用户主动保存的本地历史和本地图鉴；不得进入分析、普通日志、错误或调试快照。日期与问题类别以后只有在用户明确选择时才能进入本地结果卡预览；`safetyDisposition` 和精确时间不得进入结果卡。

## 11. 测试策略

所有实现遵循失败测试 → 最小实现 → 定向回归 → 独立审查。

### 11.1 确定性与抽牌

- 固定黄金种子得到固定 card ID 与方向。
- 相同输入跨重复调用得到深度相等的结果。
- 78 张列表边界不会产生越界或未知 ID。
- 关闭逆位后对一组覆盖性种子始终为正位。
- 开启逆位后黄金样例同时覆盖正位与逆位。
- 类别、安全分流、会话 ID 和时间变化不改变同一种子的牌与方向。
- 算法黄金向量固定两个 domain-separated 输入、hash uint32、首个 PRNG state/uint32/value 及最终 card/orientation，阻止实现漂移。
- 同一 seed 切换 `reversalsEnabled` 时 card ID 不变。

### 11.2 解读与安全

- 四类问题分别读取正确类别内容。
- 正逆位分别读取正确方向内容。
- `standard` 和 `high-risk` 的抽牌与核心文本一致，仅安全响应不同。
- `high-risk` 响应包含现实安全优先和专业支持边界，不包含确定性结论，并由 Phase 3 合同要求优先展示。
- 缺少内容映射时明确失败。

### 11.3 隐私、图鉴与历史

- 公开输入严格拒绝 `rawQuestion`、`questionText` 和表现字段，并拒绝不符合 opaque ASCII 格式的 seed/sessionId。
- Phase 3 必须以数据流测试证明 seed/sessionId 不从问题文本或其哈希派生；敏感 sentinel 不出现在任何输出。
- 结果、错误、历史和序列化快照均不出现原始问题字段。
- 图鉴首次追加、重复幂等并保留最早时间。
- 未调用保存函数时不会生成历史条目。
- 同会话相同结果重复保存幂等；同会话不同结果产生冲突。
- 历史正向样例从已保存 draws 重放，不需要 seed；未知版本明确拒绝且不回退。
- `FIXED_READING_INPUT` 增加必填 `reversalsEnabled`；构造持久化 session 时必须同时析出 seed 与该暂态设置。

### 11.4 仓库门禁

- Phase 2 定向 Vitest 全部通过。
- `pnpm typecheck` 通过。
- `pnpm quality` 通过。
- GitHub Actions 使用 Node 22.14.x / pnpm 10.15.0 通过。Phase 2 的运行时证据范围仅为该 Node 版本；同一黄金向量在 Cocos Creator 3.8.8 与微信小游戏开发运行时复跑属于 Phase 3 退出门。
- 边界扫描继续证明 `packages/domain` 无平台依赖。

## 12. 审查职责

- 实现者：每个任务只修改当前责任单元，不能批准自己的代码。
- 领域审查：检查确定性、随机消费顺序、版本边界、幂等和不变量。
- 安全与隐私审查：检查高风险响应不改变抽牌、不作专业结论且无原始问题泄漏。
- 项目管控审查：检查没有夹带 Phase 3/4、Milestone 2 或资源分发能力，并核对测试和提交证据。
- 总控：复跑阶段门禁、汇总独立审查并作出 Phase 2 通过或退回决定。

## 13. Phase 2 唯一退出门

只有以下条件全部满足，Phase 2 才能由总控验收通过并进入 Phase 3 规划：

1. 固定种子算法、规范性伪代码和黄金向量在 Node 22.14.x 托管 CI 中一致；Cocos/微信复跑已明确进入 Phase 3 门禁。
2. 单张抽取只返回 canonical 78 张中的一张，正逆位行为符合设置。
3. 四类问题、正逆位、版本和安全分流均生成完整且可重放的规则解读。
4. `high-risk` 不改变抽牌或核心解读，并追加批准的安全响应。
5. 原始问题、种子和表现资源不能进入结果、历史、图鉴、错误或日志。
6. 图鉴按 canonical card ID 幂等；历史只手动保存、重复保存幂等、冲突不覆盖，旧版本缺失不静默回退。
7. 定向测试、完整 `pnpm quality` 和固定版本托管 CI 全部通过。
8. 领域、安全隐私和项目管控审查无阻断问题。
9. 形成独立、可回滚的提交边界；未经另行授权不得合并、打标签或开始 Phase 3。

## 14. 交付与会话控制

- Phase 2 设计、实施计划、任务报告和最终验收报告均写入仓库，聊天摘要不是唯一事实来源。
- 状态汇报继续使用“已完成、正在做、阻塞、下一验收点”，避免重复粘贴完整证据。
- 总控在规格批准并准备正式实现时评估是否新建精简总控任务；如新建，必须携带基线提交、分支、范围、冻结决策、未决风险和禁止事项。
- 产品所有者只需参与重大产品方向或范围变化；技术测试、独立审查和阶段验收由总控负责。
