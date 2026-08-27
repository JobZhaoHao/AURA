# AURA 本地开发与 Milestone 0 验证手册

本手册只覆盖工程底座。当前仓库没有塔罗抽牌、牌义、经济、商品或运营后台功能。

## 1. 前置条件

- Git。
- Node.js `22.14.0`（仓库的 `.nvmrc` 与 `package.json#engines` 均固定此版本）。
- pnpm `10.15.0`（仓库的 `package.json#packageManager` 固定此版本）。
- Cocos Creator `3.8.8`，用于打开和验证 `apps/game-client`。
- 构建微信小游戏时，需要可用的微信小游戏 AppID；需要在微信开发者工具中预览时，还需安装对应工具并使用有权限的账号。

Node 22 自带的 Corepack 默认需要启用。在仓库根目录运行：

```powershell
corepack enable
corepack install
node --version
pnpm --version
```

版本输出应分别为 `v22.14.0` 和 `10.15.0`。`corepack install` 会读取仓库已提交的 `packageManager` 字段，不要使用 `corepack use` 或其他会修改 `package.json` 的命令。

## 2. 安装与自动验证

所有命令都从仓库根目录运行：

```powershell
pnpm install --frozen-lockfile
pnpm quality
```

`pnpm quality` 是本地和 CI 的唯一完整门禁，依次执行格式、ESLint、架构边界、敏感信息、TypeScript、Node 测试和 Vitest 测试。不要用单个子检查替代提交前的完整门禁。

CI 在 Ubuntu 上使用 Node `22.14.0` 和 pnpm `10.15.0` 重复上述安装与质量命令。本机 Codex 工具链当前使用 Node `24.19.0` 与 pnpm `11.19.0`；它可提供额外兼容性信号，但不能替代 CI 对仓库固定版本的验证。出现只在其中一个版本发生的问题时，先以 Node `22.14.0` / pnpm `10.15.0` 复现，再决定是否修改版本基线。

## 3. 环境配置隔离

仓库只提交字段示例：

- `.env.example`
- `config/environments/development.example.json`
- `config/environments/test.example.json`
- `config/environments/production.example.json`

本地云函数调试时，将 `.env.example` 复制为仓库根目录的 `.env`，只填当前开发或测试环境需要的值。`.env` 和 `.env.*` 默认被忽略；不要把真实密钥放入任何 `*.example.*` 文件。

```powershell
Copy-Item .env.example .env
```

必须保持以下隔离：

- 开发、测试和生产使用不同的 CloudBase 环境、数据库、密钥和资源桶。
- `AURA_ENV` 与 `AURA_CLOUDBASE_ENV_ID` 的前缀必须匹配：`development` / `aura-dev-`、`test` / `aura-test-`、`production` / `aura-prod-`。
- `AURA_BUILD_COMMIT` 和 `AURA_BUILD_TIME` 是公开构建身份；健康响应不得包含 CloudBase 环境标识或密钥。
- 生产值通过部署平台的受控配置与密钥管理注入，不从开发者的 `.env` 发布，也不复制到客户端或构建产物。

## 4. 敏感信息事件处理

如果密钥、令牌、私钥或生产配置出现在工作区、日志或提交中：

1. 立即停止继续使用和传播该值，不要在聊天、Issue 或日志中再次粘贴。
2. 在所属服务撤销并轮换凭据；仅从当前工作文件删除并不能恢复安全。
3. 通知产品所有者，记录暴露范围、时间、受影响环境和轮换结果。
4. 将本地值移入被忽略的 `.env` 或受控密钥管理；确认客户端、构建目录和日志没有副本。
5. 运行 `pnpm check:secrets` 和 `pnpm quality`。
6. 如果敏感值已进入 Git 历史，由总控制定并批准历史清理与协作者重新同步方案；不要个人直接重写共享历史。

## 5. Cocos Creator 3.8.8 竖屏预览

1. 关闭可能占用同一项目的其他 Creator 实例。
2. 在 Cocos Creator `3.8.8` 中打开仓库的 `apps/game-client` 目录。
3. 打开 `assets/scenes/Bootstrap.scene`，确认 Canvas 上存在 `GameBootstrap` 组件。
4. 在项目设置中确认设计分辨率为 `750 × 1334`，Fit Width 开启，Fit Height 关闭。
5. 启动浏览器预览，确认画面为竖屏、控制台无错误，并显示 `AURA / development / local`。

该场景只用于启动诊断；出现塔罗玩法 UI、生产标识或凭据都属于异常。

## 6. 微信小游戏开发构建

首次构建优先使用 Creator 的构建面板：

1. 平台选择 **WeChat Mini Game**，开启 Debug。
2. Included Scenes 只包含 `Bootstrap.scene`，并将它设为首场景。
3. 填入开发或测试 AppID；不要使用生产密钥或把本机登录信息提交到仓库。
4. 输出目录使用 `build/wechatgame-dev`，执行 Build。
5. 检查输出 `game.json` 的 `deviceOrientation` 为 `portrait`，`project.config.json` 的 `compileType` 为 `game`。

需要命令行复现时，先从构建面板导出配置到被忽略的 `local/wechatgame-development-build.json`，再在 PowerShell 中运行：

```powershell
$creator = 'C:\path\to\CocosCreator.exe'
$project = (Resolve-Path 'apps/game-client').Path
$config = (Resolve-Path 'local/wechatgame-development-build.json').Path
& $creator --project $project --build "configPath=$config"
$creatorExitCode = $LASTEXITCODE
if ($creatorExitCode -ne 36) {
  throw "Cocos build failed with exit code $creatorExitCode"
}
```

Cocos Creator 3.8 的官方命令行约定不是常规的成功码 `0`：`32` 表示构建参数无效，`34` 表示构建过程中出现异常，`36` 才表示构建成功。即使返回 `36`，仍需检查输出目录和构建日志；命令行 Creator 也需要可用的图形桌面会话。

## 7. Milestone 0 验收记录

截至 2026-08-27，进入产品所有者最终审批前的证据如下：

- 已提交精确依赖与 lockfile；候选提交前的 `pnpm install --frozen-lockfile` 与 `pnpm quality` 已在本机 Codex 工具链通过，包含 13 个 Node 测试和 9 个 Vitest 测试；本机只出现预期的 Node 版本警告，仓库固定版本将在 CI 运行时验证。
- 开发、测试和生产示例相互隔离，敏感信息扫描纳入质量门禁。
- 产品所有者已在 Cocos Creator 3.8.8 中确认竖屏预览显示 `AURA / development / local`，且此前的 `normalizeParams` 错误已消失。
- 自动微信小游戏开发构建由 Creator 返回成功码 `36`；输出共 33 个文件，`game.json` 为竖屏，`project.config.json` 为小游戏，生成代码包含启动诊断且不含 Zod 或 `normalizeParams` 运行时标记。
- 云健康响应通过共享 `HealthResponseSchema` 验证，自动测试明确证明响应不包含 `cloudbaseEnvironmentId`。
- 当前阶段仍不包含塔罗玩法。里程碑标签必须等待独立审查和产品所有者明确批准，不能由本手册或 CI 自动创建。

完整验收条件见[当前实施计划](../superpowers/plans/2026-08-26-aura-milestone-0-foundation.md)。
