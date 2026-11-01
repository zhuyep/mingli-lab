import type { Chart } from './core';

export type BoundaryLang = 'zh' | 'en';

/** Pure copy for the live day-boundary playground (heat lever, not a docs panel). */
export function boundaryHeadline(changedCount: number, lang: BoundaryLang): string {
  if (lang === 'zh') {
    return changedCount
      ? `同一生辰，换日口径一变，有 ${changedCount} 柱跟着变`
      : '这个时刻两种换日口径结果相同';
  }
  return changedCount
    ? `Same birth time: ${changedCount} pillar(s) change when the day boundary flips`
    : 'Both day-boundary conventions agree at this time';
}

export function changedPillarIndexes(active: Chart, other: Chart): number[] {
  return active.pillars.flatMap((p, i) => (p.text !== other.pillars[i]?.text ? [i] : []));
}
