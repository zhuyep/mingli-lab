# 有据可查 · 校准透明 / Evidence & calibration

天机簿把「能复算的观察」和「项目解释」分开写清楚。本页是给星标者、二次开发者和审阅者的**校准橱窗**：可核对的固定案例、规则标识、测试覆盖边界，以及刻意不做的事。不复制其他命理产品的文案或数据集。

Tianji Bu separates **reproducible observations** from **project interpretation**. This page is a **calibration showcase** for stars, adapters and reviewers: fixed fixtures, rule identifiers, test boundaries, and deliberate non-goals. It does not reuse another product's prose or datasets.

完整规则与古籍短引见 [解读方法 · Reading method](reading-method.md)；历法输入见 [计算口径 · Calendar contract](method.md)。

## 五分钟能核对什么 · What you can verify in five minutes

| 核对项 · Check | 固定输入 · Fixture | 期望 · Expected | 代码位置 · Where |
| --- | --- | --- | --- |
| 00:00 / 23:00 换日分歧 · Day-boundary split | `1988-02-15 23:30` UTC+8 | 00:00 → 日柱庚子；23:00 → 日柱辛丑；时柱同为戊子 | `tests/core.test.ts` · README 对照表 |
| 22:59 一致、23:00 分歧 · Boundary edge | 同日 `22:59` / `23:00` | 仅日柱位置变化 | 同上 |
| 立春换年月 · Lichun year/month | `2024-02-04` 立春前后一分钟 | 年柱/月柱随库内节气时刻切换，非「2 月 4 日零点」 | `tests/core.test.ts` |
| 十神全表 · Ten-god table | 10×10 干干对照 | 与上游独立表一致（100 组） | `tests/core.test.ts` |
| 旬空全表 · Void branches | 60 日柱 | 每柱两个旬空支 | 同上 |
| 未知时辰留白 · Unknown hour | 仅三柱 | 不补造时柱；不起大运时间 | `tests/core.test.ts` · TJ 保守筛选 |
| 分析 ≠ 建议 · Analysis ≠ advice | 任意示例命书 | 倾向描述与调整建议分栏；困扰选项未选不生成「现状」 | `tests/reading.test.ts` · `tests/actions.test.ts` |
| 健康不由八字断 · No chart health claims | 同盘不同睡眠回答 | 睡眠提示只跟回答走，不进导出 | `tests/reading.test.ts` · TJ-09 |

本地复算：

```sh
npm test
npm run chart -- --date 1988-02-15 --time 23:30 --sect 2
npm run chart -- --date 1988-02-15 --time 23:30 --sect 1
```

## 规则标识 · Rule identifiers (TJ)

| ID | 可复算观察 · Observation | 解释边界 · Interpretation limit |
| --- | --- | --- |
| TJ-01 | 月支主气与日干十神 | 打开主题，不定格局或人格类型 |
| TJ-02 | 根气、透干、可见生克 | 有限强弱筛选；根气先于论化 |
| TJ-03 | 相对日主的通关候选 | 条件化出口，不是公认用神定论 |
| TJ-05 | 食伤/官杀/印比等组合键 | 工作场景类比，不定职业结果 |
| TJ-06 | 日支实有关系；旬空另记 | 合不消冲；无配偶判决或分数 |
| TJ-07 | 立春年柱；正午 UTC+8 流年 | 仅冲合害增量；非事件定时 |
| TJ-08 | 正偏财可见/藏；食伤与比劫共现 | 收入路径与合作议题，非金额或投资 |
| TJ-09 | 不由符号推健康；可选睡眠回答 | 一般作息提示；不诊断、不导出 |

强弱筛选是**项目启发式**（见 reading-method）：未知时辰、单相或过窄相、辰戌丑未主气月等情形**不定强弱**。`mixed` 不是「平衡」宣告。

## 开源边界 · Open boundary

| | 在仓库里 · In this repo | 不在仓库里 · Not here |
| --- | --- | --- |
| 计算 | DOM 无关 TypeScript 内核、`lunar-typescript` 钉死版本 | 真太阳时 / 出生地 / 夏令时自动换算 |
| 解读 | 六章确定性文案、古籍公版短引、TJ 规则与测试 | 云端模型、隐式评分、第三方断语库或私人讲稿 |
| 产品 | 静态 Vite 应用、本地导出 Markdown/SVG/JSON | 账号、付费墙、云端存盘 |
| 许可 | 代码 MIT；字体 SIL OFL；上游历法 MIT | 不暗示任何讲者背书或预测准确率 |

## 校准诚实清单 · Honest calibration

- **有分数吗？** 没有吉凶分、匹配分或「准确率」。
- **能保证命运吗？** 不能。这是文化体验与自我反思工具。
- **测试证明什么？** 软件口径可复现（换日、立春、十神、旬空、导出隔离等），**不**证明性格或人生预测有效。
- **专业审阅？** 仍待完成；独立用户反馈仍开放（见 [roadmap](roadmap.md)）。
- **和紫微/别家排盘引擎？** 本产品是**八字四柱命书**，本地优先、分析与建议分栏；不移植紫微斗数引擎或海量解读数据集。


## 在命书里打开 · Open from the reading

演示与本地应用的命书页提供「有据可查」入口（侧栏与正文提示），导出文件中的 `evidenceVersion` 与本页校准橱窗对应。当前版本标识：`evidence-calibration-1`。

The live reading page links here from the sidebar and an in-book hint. Exported files carry `evidenceVersion` for this showcase. Current stamp: `evidence-calibration-1`.

Sources last checked with the reading-method note (2026-09-20 / 2026-09-21). Fixtures above are maintained in `tests/` and must stay green in CI.
