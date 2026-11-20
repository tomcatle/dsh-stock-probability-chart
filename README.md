# 股票概率图（dsh-stock-probability-chart）

[English](#english) | 中文

为 DeepSeek Harness 增加「股票概率图」技能：评估单只股票未来短周期（1 周至 1 个月）的上涨/下跌情景概率，输出红涨绿跌的四情景概率分布图。

> 产出是**结构化主观概率估计**，不是统计回测、不是量化信号、没有历史胜率支撑。仅供研究参考，不构成投资建议。

## 功能

- 固定六步法：锁口径 → 取六类信号 → 信号定级 → 多空加权 → 贝叶斯校准 → 四情景映射
- 四档互斥完备情景（强势上涨 / 温和收阳 / 收阴整理 / 破位下跌），概率之和严格 100%
- 概率用 5% 步长整数，不制造虚假精度；数据缺失标注「数据未覆盖」，不编造
- 图内标注「主观估计，非统计回测」，遵守 A 股红涨绿跌惯例
- 零依赖、零构建脚本——安装时无需任何授权

## 安装

本插件通过 **GitHub 分发**，无 npm 包。按你的环境选一种：

### 方式 A：不需要本机装 Git（推荐）

从 GitHub Release 下载打包好的 `.tgz`，本地安装：

```sh
dsh plugin --profile web add ./dsh-stock-probability-chart-0.1.0.tgz
```

> 国内网络若 GitHub Release 直链被重置，可先把 `.tgz` 下载到本地再用上面的本地路径命令——零网络依赖，最可靠。

### 方式 B：需要本机装过 Git

```sh
dsh plugin --profile web add github:tomcatle/dsh-stock-probability-chart
```

钉版本（推荐，避免后续推送悄悄改变运行内容）：

```sh
dsh plugin --profile web add github:tomcatle/dsh-stock-probability-chart#v0.1.0
```

> pnpm 会调用 `git ls-remote` 解析地址。本机没装 Git 会报 `ERR_PNPM_GIT_RESOLVE_FAILED` 或「'git' 不是内部或外部命令」——遇到就改用方式 A。

> 桌面版若提示 `profile "desktop" is managed exclusively by the Electron application`，请在 DSH 应用的插件管理界面内添加。

## 使用

安装后重开会话，直接说：

- 「用股票概率图评估 TCL 科技下周」
- 「XX 股下周上涨概率多大」

也可用 `/stock-scenario-probability` 手动触发。

## 兼容性

- DeepSeek Harness `>=0.2.0-rc.2 <0.3.0-0`
- Node `^22.19.0 || >=24.0.0`

## 限制

- 概率是主观估计，不是统计结论，不同权重假设会得出不同结果
- 需要当前环境具备联网取数能力；无联网时技能只提供方法论框架、不给概率
- 概率图能否内联渲染取决于宿主环境；无内联能力时退化为生成 SVG 文件预览

## 许可

MIT

---

<a name="english"></a>

## English

# Stock Probability Chart

A DeepSeek Harness skill that estimates short-horizon (1 week to 1 month) up/down scenario probabilities for a single stock and renders a four-scenario probability chart using the A-share red-up/green-down convention.

> Output is a **structured subjective probability estimate**, not a statistical backtest, not a quant signal, with no historical win-rate support. For research only; not investment advice.

### Features

- Fixed six-step method: lock baseline → gather six signal types → grade signals → weight bull/bear → Bayesian calibration → four-scenario mapping
- Four exhaustive scenarios (strong up / mild up / sideway down / breakdown) summing exactly to 100%
- Probabilities in 5% integer steps; no false precision; missing data marked "not covered"
- Chart labels "subjective estimate, not statistical backtest"; red = up, green = down
- Zero dependencies, zero build scripts — no install-time authorization required

### Install

Distributed via GitHub (no npm package). Choose by your environment:

**No local Git required (recommended):** download the `.tgz` from GitHub Releases and install locally:

```sh
dsh plugin --profile web add ./dsh-stock-probability-chart-0.1.0.tgz
```

**Requires local Git:**

```sh
dsh plugin --profile web add github:tomcatle/dsh-stock-probability-chart#v0.1.0
```

### Usage

After install, restart the session and say: "Use the stock probability chart to evaluate TCL Tech next week", or trigger `/stock-scenario-probability`.

### Compatibility

- DeepSeek Harness `>=0.2.0-rc.2 <0.3.0-0`
- Node `^22.19.0 || >=24.0.0`

### Limitations

- Probabilities are subjective estimates, not statistical conclusions; different weight assumptions yield different results
- Requires network access for data; without it, the skill provides the framework only
- Inline chart rendering depends on host capabilities; falls back to SVG file preview

### License

MIT
