# 天机簿 · Tianji Bu

**A few symbols. An unwritten life. Six plain-language chapters on habits, work and connection, with the reasoning beneath.**

[**Open a sample book →**](https://zhuyep.github.io/mingli-lab/) · [中文](README.zh-CN.md) · [Reading method](docs/reading-method.md) · [Calendar contract](docs/method.md) · [MIT license](LICENSE)

![Tianji Bu black-and-white hand-drawn interface](docs/images/desktop.png)

No account. No API key. No birth-data upload. A black-and-white, bilingual, local-first reading experience with a small TypeScript calculation and interpretation core.

## Read the whole chart

1. **The whole chart** — month context, roots, visible support and exact hidden-stem exposure.
2. **Balance & alternatives** — conditional pathways, with disagreement left visible.
3. **Temperament & action** — month and visible roles as reflective themes.
4. **Work & resources** — making, collaboration and practical outcomes.
5. **Connection & boundaries** — day-branch relationships, with combinations and clashes kept together.
6. **Cycles & the year** — select a date, inspect the Lichun-based annual pillar, optionally add a traditional cycle.

Each chapter starts with plain language, an everyday example and a reflection prompt. Technical interpretation, chart evidence and rule identifiers expand on demand. Guided local questions explain common ambiguities. Save the book as Markdown, a chart as SVG, or the complete input and reading as JSON. The appendix preserves the interactive ten-god trace and midnight/23:00 comparison.

> Public preview 0.4.0. Strength screening is a documented project heuristic, not a classical authority or validated predictor. Unknown hours, mixed Earth months and some concentrated charts withhold judgment. Professional rule review and independent user feedback are still open.

## Try it locally

Requires Node.js 22.12+:

```sh
npm ci
npm run dev
```

Enter a Gregorian birth date and time, or choose **Read a sample**. Known pillars and optional cycle formulas are under **Options**. The repository slug remains `mingli-lab` to preserve existing links.

## A concrete boundary example

Input: **1988-02-15 23:30, fixed UTC+08:00**.

| Convention | Year | Month | Day | Hour |
| --- | --- | --- | --- | --- |
| Midnight day boundary | 戊辰 | 甲寅 | 庚子 | 戊子 |
| 23:00 day boundary | 戊辰 | 甲寅 | 辛丑 | 戊子 |

The hour stem follows the next day in both modes. The day pillar differs. Because ten gods are relative to the day stem, their labels can differ too. The UI makes that dependency visible rather than silently mixing conventions.

## Use the calculation core

```sh
npm run chart -- --date 2005-12-23 --time 08:37
npm run chart -- --date 1988-02-15 --time 23:30 --sect 1
npm run chart -- --pillars "乙酉 戊子 辛巳"
```

For plain JSON on stdout (without npm's script banner):

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

`sect: 2` uses midnight; `sect: 1` uses 23:00. `direction` is `none`, `male` or `female` and selects a traditional cycle formula only. This repository is an application, not a published npm package.

## Time, evidence and privacy

Supported date input: **1901–2099, Gregorian, fixed UTC+08:00 standard time**. No automatic birthplace, timezone, daylight-saving or apparent-solar-time conversion; no lunar-date input. If your recorded time uses another clock convention, use a separately verified conversion or enter already calculated pillars. A valid manual pair does not prove the whole chart corresponds to a real birth moment.

Year/month boundaries and calendar tables use [lunar-typescript 1.8.6](https://github.com/6tail/lunar-typescript). Regression tests check upstream reference cases, convention edges, all 100 ten-god pairs and all 60 void-branch groups. These are rule-consistency tests, not independent astronomical certification or evidence that birth time predicts life outcomes.

The app makes no API requests and stores no chart in browser storage. A static host can still log normal asset requests. Calculations continue after the app has loaded; this release does not install an offline cache or claim offline cold-start support. See [privacy](docs/privacy.md) and [method](docs/method.md).

## Develop and contribute

```sh
npm test
npm run build
npm run preview
```

Stack: TypeScript + Vite + one runtime dependency (`lunar-typescript`). The calculation core has no DOM dependency. Output is static HTML/CSS/JS; see [deployment](docs/deploy.md). CI checks types, rules and production build on pushes and pull requests. Pages deployment is manual.

Useful contributions: sourced calendar edge cases, English terminology review, accessibility fixes, or a reproducible failure report. Please use fictional/reference dates in public issues. [Contribution guide](CONTRIBUTING.md) · [Roadmap](docs/roadmap.md).

## Credits

Calendar engine and hidden-stem tables: 6tail's MIT-licensed lunar-typescript. [Third-party notices](THIRD_PARTY_NOTICES.md). The UI, relation explanations and rule adapter are original project work. The cover is an original AI-assisted woodcut-style illustration; see the asset notice. No lecture PDF, transcript or living person's biographical chart is bundled, and no lecturer endorsement is implied.
