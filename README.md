# 问辰 · Wenchen

**Your moment in the stars. A private, one-step BaZi reading with an explorable calculation trail.**

[**Try the live demo →**](https://zhuyep.github.io/mingli-lab/) · [中文说明](README.zh-CN.md) · [Method](docs/method.md) · [Contributing](CONTRIBUTING.md) · [MIT license](LICENSE)

![Wenchen celestial interface](docs/images/desktop.png)

No account. No API key. No birth-data upload. A bilingual browser app and a small TypeScript core for exploring traditional Chinese Four Pillars (八字) rules.

> Public preview 0.2.0. Source and live demo are available. Calendar conventions are explicit; independent user adoption and predictive validity are not claimed.

## Try it in a minute

Requires Node.js 22.12+ and npm. From this directory:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Enter a birth date and time, or select **Try an example**. The result opens with a day-stem metaphor and your four pillars. Expand **A closer look** for the calculation, boundary comparison and JSON export. Known pillars and optional cycle formulas are under **More options**.

Formerly 明理 / Bazi Lab. The repository URL remains `mingli-lab` so existing links keep working.

## What you can explore

- Gregorian date → four pillars, hidden stems and ten gods, with visible calculation steps.
- Midnight vs. 23:00 boundary comparison: the same input produces different day stems and relationships.
- Known-pillar input, including three-pillar charts when the birth hour is unknown.
- Five-phase counts, branch pairs, complete three-branch groups and day-pillar void branches.
- Optional traditional luck-cycle sequence and upstream minute-based starting date.
- Download a local SVG chart card or reproducible JSON. JSON includes your input; the card omits raw birth details, but pillars can still be personal data.
- Chinese / English UI, mobile layout, keyboard controls, no remote fonts or tracking.

This release explains symbolic structure. It does not generate personality verdicts, compatibility scores, financial guidance or health predictions. No AI model is needed to calculate a chart.

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

Calendar engine and hidden-stem tables: 6tail's MIT-licensed lunar-typescript. [Third-party notices](THIRD_PARTY_NOTICES.md). The UI, relation explanations and rule adapter are original project work. No lecture PDF, transcript or living person's biographical chart is bundled, and no lecturer endorsement is implied.
