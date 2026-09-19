import type { Chart } from './core';

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}

// The visual card intentionally omits the original date, time and sex category.
// Pillars remain personal data; omission of raw birth data is not anonymization.
export function chartSvg(chart: Chart): string {
  const names = ['年 YEAR', '月 MONTH', '日 DAY', '时 HOUR'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="780" viewBox="0 0 1080 780">
<rect width="1080" height="780" fill="#eef3fa"/><rect x="50" y="50" width="980" height="680" rx="28" fill="#fff"/>
<g font-family="PingFang SC,Microsoft YaHei,sans-serif" fill="#254d85"><text x="90" y="122" font-size="32">明理 · BAZI LAB</text>
<text x="90" y="164" font-size="18" fill="#5e6e83">传统符号的可解释演算 / An explainable symbolic chart</text>
${Array.from({ length: 4 }, (_, i) => {
  const p = chart.pillars[i],
    x = 200 + i * 225;
  return `<text text-anchor="middle" x="${x}" y="240" font-size="20">${names[i]}</text><text text-anchor="middle" x="${x}" y="345" font-size="78">${escapeHtml(p?.stem ?? '—')}</text><text text-anchor="middle" x="${x}" y="450" font-size="78">${escapeHtml(p?.branch ?? '—')}</text><text text-anchor="middle" x="${x}" y="515" font-size="23">${escapeHtml(p?.god ?? '时辰未知')}</text>`;
}).join('')}
<path d="M90 565H990" stroke="#ccd7e6"/><text x="90" y="610" font-size="18">${chart.input.mode === 'solar' ? `UTC+08:00 · ${chart.input.sect === 2 ? '00:00 换日 / midnight boundary' : '23:00 换日 / late Zi boundary'}` : '手动四柱 / Manual symbolic input'}</text>
<text x="90" y="648" font-size="17">五行计数不代表力量；规则计算不预测人生。Symbolic rules, not life predictions.</text>
<text x="90" y="683" font-size="15" fill="#5e6e83">${escapeHtml(chart.engine)} · mingli-lab v0.1.0 · 原始生日已省略，四柱仍可能涉及隐私</text></g></svg>`;
}

export function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
