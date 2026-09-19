# Contributing / 参与贡献

Run `npm ci`, `npm run format:check`, `npm test`, and `npm run build` on Node.js 22.12+ before proposing a change. Prefer one bounded change per PR. Describe the old behavior, new behavior and a reproducible example. CI repeats the rule checks and build.

## Good first contributions

- **Terminology:** improve one English explanation while retaining its Chinese term and giving a source. Translations differ across schools; document the choice.
- **Calendar fixtures:** add a synthetic/reference edge case with date, time basis, convention, expected pillars, source and license. Do not copy a closed-source chart database.
- **Accessibility:** reproduce a keyboard, contrast, screen-reader or mobile-layout failure, then supply before/after evidence. Keep key controls at least 44 CSS px high and respect reduced motion.

Before changing conventions, update `docs/method.md`, the relevant fixtures and the export schema if needed. Do not silently replace the calculation engine. Before adding a cloud model, telemetry, saved charts, lunar input or timezone correction, discuss privacy, evidence and scope first.

**Use fictional/reference birth data in public reports.** Personal stories do not validate predictive accuracy. Do not add health, wealth, lifespan, fertility or relationship forecasts. Traditional concepts may be explained as cultural material, not presented as proven real-world effects.

中文：欢迎有来源的边界样例、术语校订和可复现问题。先说明时间口径和预期结果，再改规则。不要公开自己或他人的真实生辰，也不要提交讲稿全文、私有资料或未经授权的素材。
