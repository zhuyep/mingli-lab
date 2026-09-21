# 天机簿 · Tianji Bu

**一纸生辰，万象成章。你的故事，不止八个字。**<br>
**A moment becomes a chart. A chart opens a story. Yours is still being written.**

翻开一卷黑白命书，在干支与五行之间，分别看工作、收入、感情与年份。每章先给一句专业说法，再用大白话解释，配生活例子与具体做法。

Open an ink-and-paper book of BaZi — the traditional Chinese Four Pillars. Explore six distinct topics on work, money, relationships, health and years, with a traditional term, plain explanation, everyday example and practical steps.

[**翻开示例命书 · Read a sample →**](https://zhuyep.github.io/mingli-lab/) · [中文快速指南 · Chinese guide](README.zh-CN.md) · [解读方法 · Reading method](docs/reading-method.md) · [版本说明 · Release notes](https://github.com/zhuyep/mingli-lab/releases/tag/v0.6.0)

**无需登录 · 无需 API Key · 生辰本地计算 · 中英双语**<br>
**No account · No API key · Local birth-data processing · Chinese & English**

![天机簿黑白手绘首页 · Tianji Bu, an ink-and-paper reading experience](docs/images/desktop.png)

## 先翻一页 · Open the first page

1. **不填生辰，也能先看示例。** 打开演示，选择示例命书。<br>
   **Start without entering personal details.** Open the demo and read a sample.
2. **用白话读六章，再看依据。** 专业说法之后有详细解释和例子；按实际困扰选择三步做法，完整依据可展开。<br>
   **Read first, inspect the reasoning next.** Each term has an everyday explanation and example; choose a real situation to see three practical steps.
3. **把这一卷留在自己手里。** 可导出 Markdown 命书、SVG 四柱卡片或 JSON 数据。<br>
   **Keep a copy of your own.** Export the book as Markdown, the chart as SVG, or the full input and reading as JSON.

## 六章命书 · Six chapters to explore

| 章节 · Chapter | 这一页读什么 · What to explore |
| --- | --- |
| 先看重点 · Start here | 月令、根气与判断的成立条件。 / Month context, roots and remaining uncertainty. |
| 工作 · Work | 工作方式、职责与自主空间、交付卡点。 / Work setting, responsibilities, autonomy and delivery. |
| 钱与收入 · Money | 正偏财、能力与回款、合作分配。 / Income themes, the pathway to payment and shared resources. |
| 感情 · Relationships | 日支所见的关系需求，以及实际关联的生活位置。 / Relationship needs and positions linked to the day branch. |
| 睡眠与作息 · Sleep | 解释八字的健康边界，选填真实睡眠情况。 / Limits of chart symbolism and optional actual sleep observations. |
| 今年与前后几年 · This year and nearby years | 大运、流年与相邻年份的具体差异。 / Dated cycles, annual roles and adjacent-year differences. |

专业说法 → 大白话详解 → 生活例子 → 具体做法。工作、金钱、感情共有九个困扰选项，每个选项有三步做法、示例话和检查点。选中的做法会进入 Markdown/JSON 导出。健康提示只根据作息回答生成，不由八字推断，也不进入导出。文末保留本地问答、十神推演与 23 点换日对照。

Terms are followed by detailed plain explanations and examples. Nine real-life situations offer steps, a sample phrase and a check afterward. Sleep notes use only actual responses, independently of birth symbols, and stay out of exports. The appendix retains guided questions, ten-god reasoning and day-boundary comparisons.

## 意境之外，依据可查 · Atmosphere on the surface, rules underneath

- **推演可展开。** 查看月令、根气、透干、条件化平衡路径与规则标识。<br>
  **Inspectable reasoning.** Follow month context, roots, visible stems, conditional balance paths and rule identifiers.
- **不确定就留白。** 未知时辰不补造；杂气月和部分集中结构不强行定强弱。<br>
  **Uncertainty stays visible.** Unknown hours are not invented; mixed Earth months and some concentrated charts withhold strength judgments.
- **私密、不依赖云模型。** 计算与解读均在浏览器本地完成，不调用模型服务、不存储命盘。<br>
  **Private, without a cloud model.** Calculation and interpretation run in the browser, without model calls or chart storage.
- **可复用的开源内核。** 不依赖 DOM 的 TypeScript 模块、规则案例与结构化导出，方便研究和二次开发。<br>
  **A reusable open-source core.** DOM-independent TypeScript modules, rule cases and structured exports support inspection and adaptation.

## 本地翻开 · Run locally

需要 Node.js 22.12+。 / Requires Node.js 22.12+.

```sh
git clone https://github.com/zhuyep/mingli-lab.git
cd mingli-lab
npm ci
npm run dev
```

打开终端给出的本地地址。输入公历生日和时间，或选择示例；已有四柱与可选大运位于“更多选项”。仓库沿用 `mingli-lab` 地址，原链接继续有效。

Open the local address printed in the terminal. Enter a Gregorian birth date and time, or read a sample. Known pillars and optional cycle formulas are under Options. The repository stays at `mingli-lab` to preserve existing links.

## 同一刻，两种换日口径 · One moment, two day boundaries

示例 / Reference input: **1988-02-15 23:30，固定 UTC+08:00 / fixed UTC+08:00**.

| 口径 · Convention | 年 · Year | 月 · Month | 日 · Day | 时 · Hour |
| --- | --- | --- | --- | --- |
| 00:00 换日 · Midnight boundary | 戊辰 | 甲寅 | 庚子 | 戊子 |
| 23:00 换日 · Late-Zi boundary | 戊辰 | 甲寅 | 辛丑 | 戊子 |

两种模式的时干都随次日计算，日柱却不同。十神以日干为参照，因此关系名称也可能变化。天机簿把这种依赖摆出来，供你比较。

The hour stem follows the next day in both modes, while the day pillar differs. Ten gods are relative to the day stem, so their labels can change too. The app makes that dependency visible for comparison.

<a id="use-the-calculation-core"></a>

## 调用计算内核 · Use the calculation core

```sh
npm run chart -- --date 2005-12-23 --time 08:37
npm run chart -- --date 1988-02-15 --time 23:30 --sect 1
npm run chart -- --pillars "乙酉 戊子 辛巳"
```

只输出 JSON，不含 npm 提示行：<br>
For plain JSON on stdout, without npm's script banner:

```sh
node --import tsx scripts/chart.ts --date 2005-12-23 --time 08:37
```

```ts
import { calculate } from './src/core';

const chart = calculate({
  mode: 'solar', date: '2005-12-23', time: '08:37',
  sect: 2, direction: 'none',
});
console.log(chart.pillars.map(p => p.text));
// [ '乙酉', '戊子', '辛巳', '壬辰' ]
```

`sect: 2` 为 00:00 换日，`sect: 1` 为 23:00 换日。`direction` 可选 `none`、`male` 或 `female`，仅选择传统大运公式。本仓库是应用，尚未发布为 npm 包。

`sect: 2` uses midnight; `sect: 1` uses 23:00. `direction` is `none`, `male` or `female` and selects a traditional cycle formula only. This repository is an application, not a published npm package.

## 留白与边界 · What the book leaves open

**这是一种传统文化体验与自我反思工具，不是对命运的保证。** 白话类比不是心理测量；没有吉凶分数、疾病断言、投资时机或婚姻成败预测。

**This is a cultural experience and a tool for reflection, not a promise about fate.** Its everyday analogies are not psychological measurements. It offers no fortune scores, disease claims, investment timing or marriage predictions.

- **日期口径 / Calendar:** 公历 1901–2099，固定东八区标准时；不自动换算出生地、时区、夏令时、真太阳时或农历。其他时间口径需另行核验转换，或输入已有四柱。手动干支字对合法不证明整盘对应真实出生时刻。<br>
  Gregorian dates from 1901–2099, fixed UTC+08:00 standard time. No automatic birthplace, timezone, daylight-saving, apparent-solar-time or lunar-date conversion. Verify other time conventions separately, or enter known pillars. Valid manual pairs do not prove a real birth moment.
- **方法与测试 / Method and tests:** 历法采用 [lunar-typescript 1.8.6](https://github.com/6tail/lunar-typescript)。测试核对参考案例、换日边界、100 组十神与 60 组旬空等软件规则，不构成独立天文认证或预测有效性证据。强弱筛选是公开的项目启发式，专业审阅与独立用户反馈仍待完成。<br>
  Calendar calculations use lunar-typescript 1.8.6. Tests check reference cases, convention edges, all 100 ten-god pairs and all 60 void-branch groups, among other software rules. They do not certify astronomical or predictive validity. Strength screening is a documented project heuristic; professional review and independent user feedback remain open.
- **隐私与离线 / Privacy and offline use:** 不发起 API 请求、不保存浏览器命盘数据；静态托管仍可记录普通访问元数据。已加载页面可离线计算，但不保证首次离线打开。导出与截图可能含个人四柱，JSON 还含原始输入，请自行保管。<br>
  No API requests or browser chart storage. Static hosting can still log ordinary asset requests. Calculation works after the page has loaded; offline cold starts are not supported. Exports and screenshots may contain personal pillars, and JSON includes the original input. Keep them private.

[解读方法 · Reading method](docs/reading-method.md) · [历法口径 · Calendar contract](docs/method.md) · [隐私说明 · Privacy](docs/privacy.md)

## 一起续写 · Build the next page

如果你喜欢这种有意境、也能追问依据的开源尝试，欢迎给天机簿一个 **Star**，方便日后回来。一个具体的“哪里看不懂、哪里算得不同、哪里用不顺”的反馈，同样珍贵。

If you enjoy an atmospheric reading whose rules stay within reach, **star the project** to find it again. A specific report about confusing wording, a different calculation or a usability problem is just as welcome.

```sh
npm test
npm run format:check
npm run build
npm run preview
```

TypeScript + Vite，运行时仅依赖 `lunar-typescript`；输出为静态 HTML/CSS/JS。CI 检查格式、规则和构建，Pages 由手动工作流部署。欢迎贡献可复算案例、规则分歧、英文表达和无障碍改进；公开反馈请用虚构或参考日期。

TypeScript + Vite, with `lunar-typescript` as the only runtime dependency; the output is static HTML/CSS/JS. CI checks formatting, rules and builds; Pages deployment is manual. Contribute reproducible cases, rule disagreements, English terminology or accessibility improvements. Please use fictional or reference dates in public feedback.

[贡献指南 · Contributing](CONTRIBUTING.md) · [提交反馈 · Share feedback](https://github.com/zhuyep/mingli-lab/issues) · [部署说明 · Deployment](docs/deploy.md) · [路线图 · Roadmap](docs/roadmap.md)

## 来处与致谢 · Sources and credits

历法与藏干表来自 6tail 的 MIT 开源库 lunar-typescript；界面、关系解释与规则适配为本项目工作。封面是为项目创作的 AI 辅助手绘风插画，不是古籍扫描。Long Cang 字体子集遵循 SIL OFL 1.1，其余项目代码采用 MIT。未收录私人讲稿、逐字稿或在世人物的生辰叙事，不暗示任何讲者背书。

Calendar and hidden-stem tables come from 6tail's MIT-licensed lunar-typescript; the interface, relationship explanations and rule adapter are project work. The cover is original AI-assisted ink artwork, not an antique scan. The Long Cang font subset uses SIL OFL 1.1; project code is MIT. No private lecture, transcript or living person's biographical chart is bundled, and no lecturer endorsement is implied.

[MIT 许可 · MIT license](LICENSE) · [第三方许可与图片来源 · Third-party notices](THIRD_PARTY_NOTICES.md)
