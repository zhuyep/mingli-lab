# 天机簿解读方法 / Reading method

Version: `tianji-rules-2-plain-actions-1`. Calculation and technical rules were introduced in v0.3.0; the plain-language presentation layer was added in v0.4.0. v0.5.0 replaces repeated reflections with six separate topic chapters. The rules are deterministic and bilingual. There is no hidden model call, generated certainty score or purported prediction accuracy. Original project prose joins chart-specific facts to explicitly conditional cultural interpretations.

## What is calculated, and what is interpreted

| Rule | Reproducible observation | Interpretation / limit |
| --- | --- | --- |
| TJ-01 | Month branch, first hidden stem (main qi in the pinned library), its ten-god relation | Opens a theme; it does not establish a formal pattern or personality type |
| TJ-02 | Same-phase hidden roots, main vs additional qi, exact hidden-stem exposure in year/month/hour stems, visible support/drain | Limited strength screening below; roots are recorded before considering transformations |
| TJ-03 | Generating relationships relative to day phase | Conditional support/outlet candidates using a balancing approach, not a universally agreed useful god |
| TJ-04 | Legacy structural layer only | No longer a separate personality chapter |
| TJ-05 | Output/authority, authority/resource, output/wealth combinations in visible stems or main month qi; otherwise a single role family | Separate work-setting and friction analogies; no formal pattern, vocation or career outcome is established |
| TJ-06 | All supported natal relationships involving the day branch; void branches separately recorded | Combinations never erase clashes. No spouse verdicts, compatibility scores or marriage predictions |
| TJ-07 | Lichun-based annual pillar; optional cycle at selected date; annual/natal and annual/cycle pair matches | Selected date is evaluated at **12:00 UTC+8**. Only clash, pair-combination and harm additions are supported |

| TJ-08 | Direct and indirect wealth separately; visible vs main-month vs other hidden roles; output and peer co-presence | Income, delivery/payment and collaboration are separate questions; not a money amount or investment rule |
| TJ-09 | No health inference from chart symbols; optional actual sleep responses | General sleep notes based on CDC guidance; no diagnosis, storage or export of responses |

## Conservative strength screening

This is a **project heuristic**, not a formula quoted from a classical text. It checks alignment rather than assigning numeric weights:

- Withhold judgment for unknown hour, charts with only one visible phase or at most two phases across visible and hidden stems, and main-qi Earth months 辰戌丑未. These require context not resolved here.
- `supported`: month main qi has the same phase as, or generates, the day phase; at least one main-qi same-phase root; at least one supporting year/month/hour stem; at most one draining/controlling visible stem.
- `drained`: month main qi neither matches nor generates the day phase; no same-phase hidden root; at most one supporting year/month/hour stem.
- All other charts retain `mixed`. This is not a declaration of balance, and does not mean all candidate phases are beneficial.

The supported branch explores output then wealth as possible pathways. The drained branch explores resource then peer support. Mixed/withheld charts retain both **conditional alternatives**. Missing elements do not trigger prescriptions. Winter/summer notes describe a separate climatic question without automatically choosing Fire/Water.

**Not implemented:** day-by-day qi rulership after a solar term, strength weights, complete climatic balancing, stem combinations/transformation, root cancellation after clashes, formal格局, 从格/专旺/化气 classification. A concentrated chart screen is only a reason to withhold; it is not a detector for all special patterns. All conclusions remain provisional even when the simple screening conditions align.

## Cycles

Calculation uses the [existing calendar contract](method.md). The UI maps a date to ten-year anniversaries of the upstream start timestamp, using inclusive start and exclusive end. It does not use January 1 bins or nominal-age cycle labels. A transition date is evaluated at noon, not at the user's current local time. Dates before the first cycle or beyond the eight calculated cycles have no assigned cycle. A manual chart has no unique calendar date and receives only a sequence, never a dated active cycle. Unknown-hour charts receive no cycles.

The annual layer currently excludes stem transformation, three-way combinations introduced by a year/cycle, punishment/break rules and event timing. The absence of a pair match is not a complete absence of traditional relationships.

## Sources, authorship and verification

- Calendar, hidden stems and ten-god mappings: [6tail / lunar-typescript](https://github.com/6tail/lunar-typescript), version 1.8.6, MIT; see the full [calendar contract](method.md).
- Historical context: 万民英《三命通会》卷二，sections on earthly branches, qi rulership, seasonal strength and cycles. [Public transcription](https://zh.wikisource.org/zh-hant/三命通會/卷二). The text treats season and whole-chart relationships as separate considerations and also contains historical claims this app does not adopt.
- Terminology contrast: 《子平真诠》〈论用神〉 uses a month-centered pattern approach. [Public transcription](https://donglishuzhai.net/chapter/3721.html). This app's balancing candidates should not be mistaken for an implementation of that complete method.

Sources were checked on 2026-09-20. Links identify conceptual context; they do **not** endorse our heuristic, thresholds, modern reflective prose or the app. No historical passages, private lecture transcript or third-party rule dataset are copied into the product. In particular, we did not import the separately licensed bazi-engine knowledge base.

Tests cover different readings for the same day stem, root/exposure distinctions, withheld judgments, simultaneous clash and combination, Lichun, cycle intervals, unknown timing and day-boundary changes. Tests validate these software contracts, not life-outcome prediction. Professional review of the interpretation rules and independent user feedback remain open work.

## Topic selection and presentation

The six chapters are **overview, work, money, relationships, health and timing**. v0.6 shows a short professional statement first, followed by plain explanation, an example and optional situation-based steps; full chart facts and technical answers remain expandable. There is no repeated reflection-prompt template.

Work selects the first applicable combination: output+authority, authority+resource, output+wealth; otherwise authority, output, resource, wealth, then peers. These are editorial priorities, not a traditional strength ranking. Candidate detection checks visible year/month/hour stems and the main hidden month stem; it does not equate all hidden stems with visible roles. Complete pattern formation, transformations and outcomes are not established.

Money distinguishes direct/indirect/both, hidden-only and absent roles. Output-to-wealth is a candidate pathway; peer+wealth co-presence is a collaboration topic, not a loss prediction. Relationships use day-branch main qi and actual supported links to other positions. Palace-to-life analogies are modern editorial interpretations, not verified facts about a person. Cycle direction is not reused as gender or spouse-role data.

Neighboring years use the same month/day at noon UTC+8, clamping February 29 to February 28 where necessary. Lichun determines each annual pillar. Each row independently resolves the active cycle; the supported range remains 1901–2199.

Health content is invariant across charts. The two optional sleep responses change general observations only; unknown answers are not read as normal, and even positive responses do not establish overall health. They are not persisted, uploaded or exported, and reset when a new chart is opened.

## Focused product research (2026-09-20)

- [Xuanji BaZi Skills](https://github.com/AITCX08/xuanji-bazi-skills): separates natal evidence, timing and domains including career, income and relationships. Used as a question-organization reference; no code or prompts imported, and no prediction validity assumed.
- [MingMing3 application dimensions](https://mingming3.com/en/bazi/articles/bazi_apply): illustrates common career, wealth, relationship and health categories. Its medical and event claims are not adopted.
- [BaZiSifu](https://bazisifu.com/): distinguishes career methods and wealth themes. No profession list is copied or prescribed.
- [三命通会卷五](https://zh.wikisource.org/wiki/三命通會/卷五): historical context for visible/hidden roles and conditional structures, not evidence of prediction accuracy.
- [CDC About Sleep](https://www.cdc.gov/sleep/about/): source for consistent schedules, sleep-quality observations, a sleep diary and seeking healthcare support for recurring problems. No disease inference is made from birth data.

New tests specifically compare different charts with the same day/month, verify the positions behind evidence, retain hidden/visible distinctions and simultaneous relationships, exercise adjacent years and verify that health notes do not depend on the chart. Independent user assessment of specificity and usefulness is still needed.

## v0.6: explanations and actions (2026-09-21)

The user asked to retain professional terms at the front and then explain them in detail. `everyday.ts` maps the same explicit role-selection keys to short, original explanations and examples. It does not change chart calculations or claim the analogy describes measured personality. A reader can inspect the original facts and conditional interpretation under each chapter.

`actions.ts` contains nine optional situations across work, money and relationships. No situation is selected from a chart. Each has three small steps, a sample phrase and an observable check. These are everyday suggestions, not computed destiny or verified personalized advice. Selected situations persist while changing language or year, reset for a new chart, and enter Markdown/JSON only when the user chooses to download. Sleep data stays out of exports.

General references checked on 2026-09-21:

- [CFPB Your Money, Your Goals toolkit](https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/toolkit/): supports recording actual income, spending and bill timing. The app's short examples and collaboration checklist are original editorial suggestions, not legal or investment advice.
- [Gottman Institute: Soften Your Start-Up](https://www.gottman.com/blog/softening-startup/): informs describing a specific event, feeling and request without character blame. App wording is original; no claim is made that these prompts resolve all relationship problems.
- [CDC About Sleep](https://www.cdc.gov/sleep/about/): existing general sleep notes retained; no health inference from chart symbols.

Software checks cover selection isolation, explanation/example order, distinct scenarios, bilingual fields and selected-only exports. Readability and usefulness still require user review; neither test count nor successful publication is acceptance.
