# 天机簿解读方法 / Reading method

Version: `tianji-rules-1`, introduced in v0.3.0. The six chapters are deterministic and bilingual. There is no hidden model call, generated certainty score or purported prediction accuracy. Original project prose joins chart-specific facts to explicitly conditional cultural interpretations.

## What is calculated, and what is interpreted

| Rule | Reproducible observation | Interpretation / limit |
| --- | --- | --- |
| TJ-01 | Month branch, first hidden stem (main qi in the pinned library), its ten-god relation | Opens a theme; it does not establish a formal pattern or personality type |
| TJ-02 | Same-phase hidden roots, main vs additional qi, exact hidden-stem exposure in year/month/hour stems, visible support/drain | Limited strength screening below; roots are recorded before considering transformations |
| TJ-03 | Generating relationships relative to day phase | Conditional support/outlet candidates using a balancing approach, not a universally agreed useful god |
| TJ-04 | Main month role plus other visible ten-god groups | Original reflective prose about temperament and work; not an empirically validated personality assessment |
| TJ-05 | Whether expression and wealth roles both appear in visible stems | An available relationship to examine; presence alone does not establish an output-to-wealth pattern or predict income |
| TJ-06 | All supported natal relationships involving the day branch; void branches separately recorded | Combinations never erase clashes. No spouse verdicts, compatibility scores or marriage predictions |
| TJ-07 | Lichun-based annual pillar; optional cycle at selected date; annual/natal and annual/cycle pair matches | Selected date is evaluated at **12:00 UTC+8**. Only clash, pair-combination and harm additions are supported |

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
