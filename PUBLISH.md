# 发布指南：纯 GitHub 路径发布股票概率图插件（无需 npm 账号）

插件包已构建并校验完毕，放在 `dsh-stock-probability-chart/`。
你没有 npm 账号——没关系，DSH 插件市场支持 **source-only 收录**：
**公开 GitHub 仓库 + `dsh-plugin` topic + 合法 manifest** 即可被收录，不强制 npm。

发布链：**建公开仓库（打 topic）→ 建 Release 传 tgz → 市场自动收录 → 认领编辑信息**。

---

## 0. 发布前必做：替换占位符用户名

`package.json`、`README.md` 里有 `YOUR_USERNAME` 占位符，全部换成你的真实 GitHub 用户名：

```sh
cd dsh-stock-probability-chart
# 把 YOUR_USERNAME 替换为你的 GitHub 用户名（设成你自己的）
sed -i 's/YOUR_USERNAME/你的GitHub用户名/g' package.json README.md
grep -c YOUR_USERNAME package.json README.md   # 应输出 0 0
```

版本号在三个地方保持一致（当前都是 `0.1.0`）：`package.json` 的 `version`、`CHANGELOG.md` 顶部、git tag `v0.1.0`。

---

## 1. 发布前自检（已通过，可复核）

```sh
node --check src/index.js

# 打包内容确认（必须含 src/、cordis.patch.yml、icon.svg、README.md、locale/）
npm pack --dry-run

# 确认无占位符残留
grep -r YOUR_USERNAME . --exclude-dir=node_modules
```

> 入口 `main` 指向 `src/index.js`，而源码是纯 JS、无编译步骤——所以 commit 上去即可加载，用户装时不需要 `allowBuilds` 授权。这是比 TypeScript 插件省事的地方。

---

## 2. 推送到 GitHub（需要 token 或本地 git 凭据）

```sh
cd dsh-stock-probability-chart
git init
git config user.name  "你的GitHub用户名"
git config user.email "你的GitHub邮箱"
git add .
git commit -m "feat: initial release of dsh-stock-probability-chart"
git branch -M main
git remote add origin https://github.com/你的GitHub用户名/dsh-stock-probability-chart.git
git push -u origin main
```

> 仓库名必须叫 `dsh-stock-probability-chart`，与 `package.json` 的 `repository` 一致。如果 GitHub 上还没建仓库，先在 github.com 新建一个空仓库（不要勾选 README/license，避免冲突）。

---

## 3. 设置 topic 和仓库信息（市场发现的关键）

在 GitHub 仓库页面操作：

- **Settings → General → Topics**：加 `dsh-plugin`、`deepseek-harness`、`dsh`
- **About 描述**（会变成市场卡片摘要）：`股票概率图 —— 为 DeepSeek Harness 增加短周期股价情景概率估计与红涨绿跌概率图`
- **Website**：`https://github.com/你的GitHub用户名/dsh-stock-probability-chart`
- 确认仓库是 **Public**（私有/归档一律不收录）

也可以命令行打 topic（需 gh CLI 或 token）：
```sh
# 用 token 调 API 打 topic
curl -X PUT -H "Authorization: Bearer <TOKEN>" -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{"names":["dsh-plugin","deepseek-harness","dsh","skill","stock"]}' \
  https://api.github.com/repos/你的GitHub用户名/dsh-stock-probability-chart/topics
```

---

## 4. 建 Release 并上传 tgz（让用户免 Git 安装）

市场收录更认 Release tag，且用户可下载 tgz 走本地安装（不需要装 Git）。

```sh
# 先打 tag
git tag v0.1.0
git push --tags
```

然后用 GitHub API 建 Release + 上传资产（把 `<TOKEN>`、`<用户名>` 替换）：

```sh
# 4a. 建 Release
curl -sS -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d '{"tag_name":"v0.1.0","name":"v0.1.0","body":"首个版本：股票概率图技能。主观估计，非统计回测。"}' \
  https://api.github.com/repos/<用户名>/dsh-stock-probability-chart/releases

# 4b. 从返回的 JSON 里取 "id"，上传 tgz（Content-Type 必须是 application/gzip）
curl -sS -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/gzip" \
  --data-binary "@dsh-stock-probability-chart-0.1.0.tgz" \
  "https://uploads.github.com/repos/<用户名>/dsh-stock-probability-chart/releases/<RELEASE_ID>/assets?name=dsh-stock-probability-chart-0.1.0.tgz"
```

> tgz 文件已经在插件目录和工作目录顶层各放了一份（12 个文件齐全）。上传前确认它是你替换完用户名后重新 `npm pack` 生成的版本。

---

## 5. 等市场收录

- dshpluginhub.ai 每 **6 小时**自动同步一轮；带 `dsh-plugin` topic 的公开仓库会成为 **source-only 条目**（能看到、需手动填地址安装）
- 想加速：在 dshpluginhub.ai 插件页手动提交仓库地址，或登录后 Dashboard 点 Sync Now
- 收录后状态初始 `unconfirmed`，社区核实后变 `verified`
- 想让卡片可编辑（截图、中文描述）：登录 Hub → 装其 GitHub App 到仓库 → 验证后 Dashboard 编辑

> dshpluginhub.ai 是**非官方社区市场**。同类目录 dsh-plugin.org、dshhub.dev 也扫 `dsh-plugin` topic，打一次 topic 多家可见。

---

## 6. 验收：在别的电脑安装

两种方式任选（README 里已写给用户）：

```sh
# 方式 A：不需要 Git——下载 Release 里的 tgz 后本地安装
dsh plugin --profile web add ./dsh-stock-probability-chart-0.1.0.tgz

# 方式 B：需要 Git——从 GitHub 源码装（钉 tag）
dsh plugin --profile web add github:你的用户名/dsh-stock-probability-chart#v0.1.0
```

重开会话后说「用股票概率图评估 TCL 科技下周」或 `/stock-scenario-probability` 验证。

---

## common pitfalls（发布前对照）

- 仓库私有 / 归档 → 不收录
- 缺 `dsh-plugin` topic → 扫不到
- `package.json` 的 `repository` 与实际仓库地址不符 → src-only 条目不关联
- `cordis.patch.yml` 没进 `files` → 装上但 patch 404（当前已包含，自检可确认）
- 忘了替换 `YOUR_USERNAME` → 链接 404
- Release 没传 tgz → 用户只能走 Git 装法，Windows 没 Git 就装不上

---

## 本机状态说明

本机 DSH 为桌面版 0.2.2-rc.3，profile 由 Electron 独占管理、命令行 `dsh` 不在 PATH，**无法做真实隔离安装验证**。已完成静态校验：JS 语法、JSON 解析、semver 范围（按宿主 `includePrerelease: true` 规则本机 0.2.2-rc.3 为 true）、`npm pack` 12 文件齐全。发布后请按第 6 节在目标电脑验收。
