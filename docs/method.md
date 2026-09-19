# Calculation contract / 计算口径

## Input and calendar

Gregorian dates 1901–2099 with civil hour/minute in **fixed UTC+08:00 standard time**. Numeric components are passed to `Solar.fromYmdHms`; host OS timezone is not used. This is not a global birth-time converter. Historical daylight saving, birthplace longitude, apparent solar time, lunar dates and uncertain recorded clock conventions are unsupported.

Year and month use the upstream exact Lichun/Jie transitions. The UI shows the relevant table's Lichun and neighboring Jie timestamps. The calendar engine is pinned to lunar-typescript **1.8.6**; astronomical precision is inherited, not independently certified. Inputs are minute-granular (seconds = 0). A birth in the same minute as a solar-term crossing needs a separate second-level check.

## Midnight and Zi hour

| EightChar sect | Day pillar at 23:00–23:59 | Hour stem |
| --- | --- | --- |
| 2 (default) | Current civil day | Calculated from next day's stem |
| 1 | Next day | Calculated from next day's stem |

This is the upstream implementation. At other times both normally agree. The app compares results rather than labeling one school empirically superior.

## Symbolic structure

- Each of 10 stems has a phase and yin/yang polarity.
- Five phase relationships, combined with equal/opposite polarity, produce the ten-god labels. They are relative to the day stem. A day master is shown as Self, not as a prediction.
- Hidden stems come from `LunarUtil.ZHI_HIDE_GAN`. They are shown separately with their own ten-god relationship.
- Counts assign one unit to each visible stem and one to each branch's principal phase. They exclude hidden-stem weights, seasons, roots and transformation conditions; they cannot establish strength or a useful god.
- Branch pairs list six clashes, six combinations and six harms; complete three-branch groups are listed without asserting successful elemental transformation. This release does not implement a full punishment or stem-combination system.
- Void branches are the two branches absent from the day pillar's ten-day sexagenary group. Their presence has no established predictive consequence here.

## Traditional luck cycles

Forward for yang-year male convention / yin-year female convention; reverse otherwise. Formula selection is optional and is never guessed. Eight sequential pillars follow the month pillar.

For calendar input, cycle timing uses `EightChar.getYun(gender, 2)` — the upstream **minute-based offset**. This `2` is a separate parameter from the EightChar day-boundary sect. It is not the integer-day rounded nominal-age method found in some lectures. Manual four-pillar input supplies the sequence only, without a date or age. Three-pillar input supplies no cycle.

## Sources and limits

- [lunar-typescript source](https://github.com/6tail/lunar-typescript), MIT.
- [EightChar implementation, pinned source](https://github.com/6tail/lunar-typescript/blob/f086189a0b159cd5d71d1b23090ccf034444fa04/src/lib/EightChar.ts).
- [Upstream reference tests](https://github.com/6tail/lunar-typescript/blob/f086189a0b159cd5d71d1b23090ccf034444fa04/src/test/EightCharTest.ts).
- [Cycle reference tests](https://github.com/6tail/lunar-typescript/blob/f086189a0b159cd5d71d1b23090ccf034444fa04/src/test/YunTest.ts).

The project originated in a private reading of a circulated lecture transcript. That transcript is **not distributed, not authoritative calendar documentation and not an endorsed source for this product**. Public algorithm behavior is documented against the pinned open-source implementation, with original explanatory prose. No lecturer's name, face or purported accuracy rate is used to market this app.

Tests demonstrate reproducibility and adapter consistency, not that a birthday predicts character, health, financial outcomes or relationships. There is no empirically validated prediction model in this release.
