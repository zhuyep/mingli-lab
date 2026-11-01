import { compareZi, type Chart } from './core';

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}

const PILLAR_LABELS = ['年 YEAR', '月 MONTH', '日 DAY', '时 HOUR'];

/** Single-boundary chart card (legacy). Omits raw birth date/time/sex. */
export function chartSvg(chart: Chart): string {
  const names = PILLAR_LABELS;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="780" viewBox="0 0 1080 780">
<rect width="1080" height="780" fill="#111111"/><rect x="50" y="50" width="980" height="680" rx="0" fill="#ffffff"/>
<g font-family="PingFang SC,Microsoft YaHei,sans-serif" fill="#111111"><text x="90" y="122" font-size="32">天机簿 · TIANJI BU</text>
<text x="90" y="164" font-size="18" fill="#626262">传统符号的可解释演算 / An explainable symbolic chart</text>
${Array.from({ length: 4 }, (_, i) => {
  const p = chart.pillars[i],
    x = 200 + i * 225;
  return `<text text-anchor="middle" x="${x}" y="240" font-size="20">${names[i]}</text><text text-anchor="middle" x="${x}" y="345" font-size="78">${escapeHtml(p?.stem ?? '—')}</text><text text-anchor="middle" x="${x}" y="450" font-size="78">${escapeHtml(p?.branch ?? '—')}</text><text text-anchor="middle" x="${x}" y="515" font-size="23">${escapeHtml(p?.god ?? '时辰未知')}</text>`;
}).join('')}
<path d="M90 565H990" stroke="#11111150"/><text x="90" y="610" font-size="18">${chart.input.mode === 'solar' ? `UTC+08:00 · ${chart.input.sect === 2 ? '00:00 换日 / midnight boundary' : '23:00 换日 / late Zi boundary'}` : '手动四柱 / Manual symbolic input'}</text>
<text x="90" y="648" font-size="17">五行计数不代表力量；规则计算不预测人生。Symbolic rules, not life predictions.</text>
<text x="90" y="683" font-size="15" fill="#626262">${escapeHtml(chart.engine)} · Tianji Bu v0.8.0 · 原始生日已省略，四柱仍可能涉及隐私</text></g></svg>`;
}

function dualSide(
  x0: number,
  title: string,
  subtitle: string,
  pillars: Chart['pillars'],
  changed: number[],
): string {
  const cols = pillars
    .map((p, i) => {
      const x = x0 + 70 + i * 108;
      const hit = changed.includes(i);
      return `<g>
  ${hit ? `<rect x="${x - 42}" y="268" width="84" height="168" fill="#1111110D" stroke="#111111" stroke-width="1.25"/>` : ''}
  <text text-anchor="middle" x="${x}" y="292" font-size="13" fill="#626262">${['年', '月', '日', '时'][i]}</text>
  <text text-anchor="middle" x="${x}" y="348" font-size="42" fill="#111111">${escapeHtml(p.stem)}</text>
  <text text-anchor="middle" x="${x}" y="398" font-size="42" fill="#111111">${escapeHtml(p.branch)}</text>
  <text text-anchor="middle" x="${x}" y="428" font-size="14" fill="${hit ? '#111111' : '#626262'}">${escapeHtml(p.god || '—')}</text>
</g>`;
    })
    .join('');
  return `<g>
  <rect x="${x0}" y="210" width="470" height="280" fill="#ffffff" stroke="#111111" stroke-width="1.5"/>
  <text x="${x0 + 24}" y="248" font-size="22" fill="#111111">${title}</text>
  <text x="${x0 + 24}" y="274" font-size="14" fill="#626262">${subtitle}</text>
  ${cols}
</g>`;
}

/**
 * Product share / export card that sells the dual day-boundary flip.
 * Solar charts: side-by-side 00:00 vs 23:00, changed pillars framed.
 * Manual pillars: falls back to the single chart card.
 * Omits raw civil date/time; still may reveal personal pillars.
 */
export function shareCardSvg(chart: Chart): string {
  if (chart.input.mode !== 'solar') return chartSvg(chart);
  const { midnight, lateZi, changed } = compareZi(chart.input);
  const headline =
    changed.length > 0
      ? `同一时刻 · ${changed.length} 柱因换日口径而变 / Same moment · ${changed.length} pillar(s) flip`
      : '同一时刻 · 两种换日口径一致 / Same moment · both boundaries agree';
  const tip =
    changed.length > 0
      ? '框出的是差异柱。本地私密 · 无账号 · Demo 可当场拨动'
      : '本地私密 · 无账号 · 晚子时示例更能看出差异';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="900" viewBox="0 0 1080 900">
<rect width="1080" height="900" fill="#111111"/>
<rect x="36" y="36" width="1008" height="828" fill="#ffffff"/>
<g font-family="PingFang SC,Microsoft YaHei,sans-serif" fill="#111111">
  <text x="72" y="98" font-size="15" letter-spacing="3">天机簿 · TIANJI BU</text>
  <text x="72" y="148" font-size="36">换日对照卡</text>
  <text x="72" y="186" font-size="18" fill="#626262">${headline}</text>
  <text x="860" y="98" font-size="14" text-anchor="end" fill="#626262">LOCAL · PRIVATE</text>
  ${dualSide(72, '00:00 换日', 'midnight boundary', midnight.pillars, changed)}
  ${dualSide(538, '23:00 换日', 'late Zi boundary', lateZi.pillars, changed)}
  <path d="M72 530H1008" stroke="#11111130"/>
  <text x="72" y="580" font-size="20">${tip}</text>
  <text x="72" y="618" font-size="17" fill="#626262">分析与建议分栏 · 无吉凶分数 · 规则可复算</text>
  <text x="72" y="656" font-size="17" fill="#626262">Analysis separate from advice · no fortune scores · recomputable rules</text>
  <rect x="72" y="690" width="936" height="96" fill="#111111"/>
  <text x="96" y="732" font-size="20" fill="#ffffff">当场试试 · Try the live flip</text>
  <text x="96" y="766" font-size="18" fill="#ffffff">zhuyep.github.io/mingli-lab/#sample/flip</text>
  <text x="72" y="830" font-size="14" fill="#626262">${escapeHtml(chart.engine)} · Tianji Bu v0.8.0 · 原始生日已省略，四柱仍可能涉及隐私 · stars welcome on GitHub</text>
</g></svg>`;
}

export function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Absolute demo URL used on share cards and copy-link (no personal birth data). */
export function demoFlipUrl(origin = 'https://zhuyep.github.io'): string {
  return `${origin.replace(/\/$/, '')}/mingli-lab/#sample/flip`;
}

export function shareBlurb(lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'en') {
    return `Tianji Bu — local-first BaZi book. Flip 00:00 / 23:00 day boundary live; pillars update on the spot. No account.\n${demoFlipUrl()}\n★ github.com/zhuyep/mingli-lab`;
  }
  return `天机簿开源八字命书：本地算、无账号。\n一点直达示例，当场拨 00:00/23:00 换日——日柱当场变。\n${demoFlipUrl()}\n求星 ★ github.com/zhuyep/mingli-lab`;
}
