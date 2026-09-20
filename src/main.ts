import './style.css';
import { buildReading, readingMarkdown, todayInChina, type Chapter } from './reading';
let readingDate = todayInChina();
import {
  calculate,
  compareZi,
  ELEMENTS,
  stemInfo,
  tenGod,
  type Input,
  type Direction,
  type Sect,
} from './core';
import { chartSvg, download, escapeHtml as esc } from './export';

type Language = 'zh' | 'en';
let lang: Language = 'zh';
let mode: Input['mode'] = 'solar';
let draft = {
  date: '',
  time: '',
  sect: '2',
  direction: 'none',
  pillars: '乙酉 戊子 辛巳 壬辰',
};
let result = calculate({
  mode: 'solar',
  date: '2005-12-23',
  time: '08:37',
  sect: 2,
  direction: 'none',
});
let selected = 2;
let showingResult = false;
let advancedOpen = false;
let isExample = true;

const app = document.querySelector<HTMLDivElement>('#app')!;
const t = (zh: string, en: string) => (lang === 'zh' ? zh : en);
const pos = (i: number) =>
  t(['年柱', '月柱', '日柱', '时柱'][i], ['Year', 'Month', 'Day', 'Hour'][i]);
const elName = (e: string) =>
  t(e, { 木: 'Wood', 火: 'Fire', 土: 'Earth', 金: 'Metal', 水: 'Water' }[e]!);
const eClass = (e: string) => ['wood', 'fire', 'earth', 'metal', 'water'][ELEMENTS.indexOf(e)];
const godEN: Record<string, string> = {
  比肩: 'Peer',
  劫财: 'Rob wealth',
  食神: 'Eating god',
  伤官: 'Hurting officer',
  偏财: 'Indirect wealth',
  正财: 'Direct wealth',
  七杀: 'Seven killings',
  正官: 'Direct officer',
  偏印: 'Indirect resource',
  正印: 'Direct resource',
  日主: 'Day master',
};
const godName = (g: string) => t(g, `${g} · ${godEN[g]}`);
const relationEN: Record<string, string> = {
  同我: 'Same phase',
  我生: 'I generate',
  我克: 'I control',
  克我: 'Controls me',
  生我: 'Generates me',
};
const namesEN: Record<string, string> = {
  六冲: 'Clash',
  六合: 'Pair combination',
  六害: 'Harm pair',
  三合组合: 'Three-branch group',
};
function option(value: string, current: string, zh: string, en: string) {
  return `<option value="${value}" ${value === current ? 'selected' : ''}>${t(zh, en)}</option>`;
}

function bookCover() {
  return `<div class="book-cover" aria-hidden="true"><img src="./book-landscape.jpg" alt="" width="1024" height="1536" fetchpriority="high"/><div class="binding"></div><div class="cover-title"><span>天机簿</span><small>四柱藏象 · 一人一卷</small></div><span class="cover-seal">见字<br/>如晤</span><div class="cover-bottom">TIANJI BU <span>东方命理手记</span></div></div>`;
}
function form() {
  return `<section class="entry"><div class="entry-world">${bookCover()}<p class="cover-caption">${t('山川有四时，人间有故事。', 'Seasons in the landscape. A story in your hands.')}</p></div><div class="entry-form" id="workspace"><span class="form-kicker">${t('东方命理 · 私人命书', 'A PERSONAL BOOK OF CHINESE BAZI')}</span><h1>${t('翻开此卷，<br/>读一读自己。', 'A moment in time.<br/>A book to unfold.')}</h1><p class="form-intro">${t('以生辰为引，从命局到岁运。<br/>六章白话解读，每一处都有迹可循。', 'From your birth chart to its changing seasons.<br/>Six readable chapters, with the reasoning beneath.')}</p><form id="chart-form" autocomplete="off">
  ${mode === 'solar' ? `<div class="birth-fields"><div><label for="date">${t('出生日期 · 公历', 'Birth date · Gregorian')}</label><input id="date" name="date" type="date" min="1901-01-01" max="2099-12-31" required value="${esc(draft.date)}"/></div><div><label for="time">${t('出生时间', 'Birth time')}</label><input id="time" name="time" type="time" required value="${esc(draft.time)}"/></div></div><p class="field-note">${t('北京时间（东八区标准时）', 'China standard time · UTC+08:00')}</p>` : `<label for="pillars">${t('已有八字', 'Known pillars')}</label><input id="pillars" name="pillars" required value="${esc(draft.pillars)}" placeholder="乙酉 戊子 辛巳 壬辰"/><p class="field-note">${t('年、月、日、时，用空格分隔。时辰未知时只填前三柱。', 'Separate year, month, day and hour with spaces. Omit an unknown hour.')}</p>`}
  <button type="submit" class="primary">${t('翻开我的命书', 'Open my book')}<span aria-hidden="true">→</span></button><p id="form-status" class="form-status" role="status"></p>
  <details class="form-options" ${advancedOpen ? 'open' : ''}><summary>${t('更多选项 · 已有八字 / 大运', 'Options · known pillars / cycles')}</summary><div class="segmented"><button type="button" data-mode="solar" aria-pressed="${mode === 'solar'}">${t('按生日', 'Birth date')}</button><button type="button" data-mode="pillars" aria-pressed="${mode === 'pillars'}">${t('已有八字', 'Known pillars')}</button></div>${mode === 'solar' ? `<label for="sect">${t('换日时间', 'Day boundary')}</label><select id="sect" name="sect">${option('2', draft.sect, '00:00 换日（默认）', '00:00 · midnight (default)')}${option('1', draft.sect, '23:00 换日', '23:00 · late Zi')}</select>` : ''}<label for="direction">${t('大运顺逆', 'Traditional cycle formula')}</label><select id="direction" name="direction">${option('none', draft.direction, '读完再选', 'Choose later')}${option('male', draft.direction, '男命公式 · 阳顺阴逆', 'Male convention')}${option('female', draft.direction, '女命公式 · 阴顺阳逆', 'Female convention')}</select><p class="field-note">${t('默认 00:00 换日。不自动换算出生地、夏令时或真太阳时；特殊时间需先自行校正。', 'Default boundary: midnight. No location, daylight-saving or true-solar-time conversion.')}</p></details></form><div class="sample-row"><button data-example="standard">${t('先读一卷示例', 'Read a sample book')} <span aria-hidden="true">↗</span></button><span>${t('无需填写', 'No details needed')}</span></div><p class="private-note">${t('不登录 · 不上传生辰 · 不需要 AI 密钥', 'No account · No uploads · No AI key')}</p></div></section>`;
}
function pillarCards() {
  return `<div class="pillars">${Array.from({ length: 4 }, (_, i) => {
    const p = result.pillars[i];
    if (!p)
      return `<div class="pillar unknown"><div class="pillar-label">${pos(i)}</div><div class="characters">?<br/>?</div><span>${t('时辰未知', 'Unknown')}</span></div>`;
    return `<button class="pillar ${i === 2 ? 'day-master' : ''}" data-pillar="${i}" aria-pressed="${selected === i}" aria-label="${pos(i)} ${p.text} ${t('查看推演', 'show explanation')}"><div class="pillar-label">${pos(i)} ${i === 2 ? `<span class="tiny-dot" aria-label="${t('日主', 'Day master')}"></span>` : ''}</div><div class="stem ${eClass(p.element)}">${p.stem}</div><div class="branch ${eClass(p.branchElement)}">${p.branch}</div><div class="pillar-god">${godName(p.god)}</div><div class="pillar-phase">${elName(p.element)} · ${elName(p.branchElement)}</div><div class="hidden-stems">${t('藏', 'Hidden')} ${p.hidden.map((h) => h.stem).join(' ')}</div></button>`;
  }).join('')}</div>`;
}

function explanation() {
  const p = result.pillars[selected],
    day = stemInfo(result.dayMaster),
    rel = tenGod(result.dayMaster, p.stem);
  return `<div class="explanation"><div class="explanation-top"><span>${t('正在看', 'EXPLORING')} · ${pos(selected)}</span><span class="rule-id">${selected === 2 ? 'DAY MASTER' : 'TEN GODS'}</span></div>
    <h3>${selected === 2 ? t(`${p.stem}，是这张盘的观察中心。`, `${p.stem} is the reference point of this chart.`) : t(`${p.stem}为什么是「${p.god}」？`, `Why is ${p.stem} called ${godEN[p.god]}?`)}</h3>
    <div class="formula"><span>${t('日干', 'Day stem')} <b>${result.dayMaster}</b> <small>${t(day.polarity, day.polarity === '阳' ? 'Yang ' : 'Yin ')}${elName(day.element)}</small></span><i aria-hidden="true">→</i><span>${t('所看天干', 'Target stem')} <b>${p.stem}</b> <small>${t(p.polarity, p.polarity === '阳' ? 'Yang ' : 'Yin ')}${elName(p.element)}</small></span><i aria-hidden="true">→</i><span><b class="formula-name">${selected === 2 ? t('日主', 'Self') : godName(p.god)}</b></span></div>
    <p>${selected === 2 ? t('十神是其他天干相对日干的关系。切换上方任意一柱，看五行生克与阴阳如何共同决定名称。', 'Ten gods describe how other stems relate to the day stem. Select any other pillar to trace the phase and polarity calculation.') : t(`五行关系为「${rel.relation}」，阴阳${rel.same ? '相同' : '不同'}，所以记作「${rel.name}」。这是关系名称，不是对人的好坏评价。`, `${relationEN[rel.relation]}, with ${rel.same ? 'the same' : 'opposite'} polarity, gives ${godEN[rel.name]}. This is a symbolic relationship, not a judgment of a person.`)}</p>
    <div class="hidden-detail">${t('该地支的藏干', 'Hidden stems in this branch')}：${p.hidden.map((h) => `<span>${h.stem} <small>${godName(h.god)}</small></span>`).join('')}</div>
  </div>`;
}

function luckPanel() {
  if (!result.luck)
    return `<div class="quiet-note">${t('大运尚未计算。可在“修改生辰 → 更多选项”中选择传统顺逆公式；时辰未知时不推算大运。', 'Luck cycles are not calculated. Choose a traditional formula in the form; unknown-hour charts omit cycles.')}</div>`;
  const luck = result.luck;
  return `<section class="luck-panel"><div class="section-label">${t('大运序列', 'TRADITIONAL CYCLES')}<span>${luck.forward ? t('顺排', 'FORWARD') : t('逆排', 'REVERSE')}</span></div><div class="luck-list">${luck.pillars.map((p, i) => `<div><small>${i + 1}</small><strong>${p}</strong></div>`).join('')}</div><p class="caption">${luck.start ? t(`历法库起运日期：${luck.start}（UTC+8）。按分钟折算口径；不是讲稿的整数虚岁法，也不表示现实运势。`, `Upstream cycle start: ${luck.start} (UTC+8), using minute-based offset conversion. This is a traditional convention, not a forecast.`) : t('手动四柱仅推演顺序。没有出生日期与交节间隔，起运日期未知。', 'Manual pillars provide a sequence only. Without a date and solar-term interval, the start date is unknown.')}</p></section>`;
}

function comparison() {
  if (result.input.mode !== 'solar')
    return `<div class="explanation"><h3>${t('比较口径，需要同一个出生时刻。', 'Compare conventions using a date and time.')}</h3><p>${t('手动四柱不能还原唯一出生日期。试试“23 点”示例。', 'Manual pillars cannot identify a unique birth timestamp. Try the 23:00 example.')}</p><button data-example="zi" class="secondary">${t('打开子时示例', 'Open Zi-hour example')} ↗</button></div>`;
  const compare = compareZi(result.input);
  return `<section class="comparison"><div class="section-label">${t('同一个时刻，两种口径', 'ONE TIME, TWO CONVENTIONS')}</div><h3>${compare.changed.length ? t('换了日柱，关系的中心也变了。', 'Change the day stem, change the relationships.') : t('这个时刻，两种口径结果相同。', 'Both conventions agree at this time.')}</h3><p>${esc(result.input.date)} ${esc(result.input.time)} · UTC+08:00</p><div class="compare-grid">${[compare.midnight, compare.lateZi].map((c, n) => `<div><h4>${n === 0 ? t('00:00 换日', 'Midnight boundary') : t('23:00 换日', '23:00 boundary')}</h4><div class="mini-pillars">${c.pillars.map((p, i) => `<div class="${compare.changed.includes(i) ? 'changed' : ''}"><small>${pos(i)}</small><b>${p.text}</b><span>${godName(p.god)}</span></div>`).join('')}</div></div>`).join('')}</div><p class="caption">${t('00:00 口径下，23 点仍保留当日日柱，但时干按次日日干推。比较展示的是规则选择的后果，不判定哪个流派更“准确”。', 'With the midnight convention, 23:00 retains the current day pillar while the hour stem follows the next day. This shows the effect of conventions; it does not rank their predictive validity.')}</p><button class="secondary" data-example="zi">${t('试试 23:30 的差异', 'Try the 23:30 difference')} ↗</button></section>`;
}

function provenance() {
  return `<section class="provenance"><div class="section-label">${t('这张盘如何得到', 'CALCULATION TRAIL')}</div><ol>
    <li><b>${t('确认输入口径', 'Read the convention')}</b><p>${result.input.mode === 'solar' ? t('公历、东八区标准时、按分钟输入；不做出生地、夏令时及真太阳时换算。', 'Gregorian civil time at fixed UTC+08:00, to the minute. No location, DST or apparent-solar-time conversion.') : t('手动输入只检查干支字对合法，不保证四柱能对应真实历法时刻。', 'Manual input validates symbolic pairs only, not whether all pillars can coexist at a real timestamp.')}</p></li>
    <li><b>${t('年柱按立春，月柱按交节', 'Year at Lichun, month at Jie boundaries')}</b><p>${result.trace.yearBoundary ? `${t('立春', 'Lichun')}：${esc(result.trace.yearBoundary)}<br/>${t('前节 / 后节', 'Previous / next Jie')}：${esc(result.trace.previousJie!)} / ${esc(result.trace.nextJie!)}` : t('手动四柱没有日期，未核验交节。', 'No calendar boundaries are checked for manual input.')}</p></li>
    <li><b>${t('日柱与时柱采用已选子时规则', 'Apply the selected day boundary')}</b><p>${result.input.mode === 'solar' ? (result.input.sect === 2 ? t('00:00 换日；晚子时的时干按次日日干计算。', 'Midnight boundary; late-Zi hour stem follows the next day.') : t('23:00 换日；晚子时的日柱与时干均按次日计算。', '23:00 boundary; late-Zi day and hour stems follow the next day.')) : t('直接使用输入柱；时辰未知时保持缺失。', 'Use the supplied pillars; unknown hours stay unknown.')}</p></li>
    <li><b>${t('从日干计算相对关系', 'Compute relationships from the day stem')}</b><p>${t('五类生克关系 × 阴阳同异 = 十神。藏干使用历法库表，五行计数与藏干不混算。', 'Five phase relationships × two polarity relationships = ten gods. Hidden stems use the upstream table and are not mixed into visible counts.')}</p></li>
  </ol><p class="caption">${t('计算依赖', 'Calendar engine')}：${result.engine} · <a href="https://github.com/6tail/lunar-typescript" target="_blank" rel="noreferrer">${t('开源算法与许可', 'Source & license')} ↗</a></p><p class="caption">${t('边界时刻精度取决于历法库；分钟内的交节、特殊历史历法与其他流派需另行校核。测试核对规则一致性，不验证命运预测。', 'Boundary precision depends on the library. Sub-minute term crossings, historical edge cases and other schools require separate verification. Tests check rules, not fortune-telling validity.')}</p></section>`;
}

function chapterView(c: Chapter, index: number) {
  const report = buildReading(result, readingDate);
  const timing = c.id === 'timing';
  return `<article class="chapter" id="chapter-${c.id}"><div class="chapter-label"><span>${t('卷' + ['一', '二', '三', '四', '五', '六'][index], 'CHAPTER ' + (index + 1))}</span><h2>${c.title[lang]}</h2></div>${timing ? `<div class="time-controls"><div><label for="reading-date">${t('看哪一天所在的流年', 'Year containing this date')}</label><input type="date" id="reading-date" min="1901-01-01" max="2199-12-31" value="${readingDate}"/></div>${result.pillars.length === 4 ? `<div><label for="cycle-direction">${t('大运公式', 'Cycle convention')}</label><select id="cycle-direction">${option('none', result.input.direction, '暂不叠加大运', 'Annual reading only')}${option('male', result.input.direction, '男命 · 阳顺阴逆', 'Male convention')}${option('female', result.input.direction, '女命 · 阴顺阳逆', 'Female convention')}</select></div>` : ''}</div><p id="timing-status" role="status"></p>` : ''}<h3>${c.lead[lang]}</h3>${c.paragraphs.map((p) => `<p>${p[lang]}</p>`).join('')}${timing && report.annual.windows.length ? `<div class="cycle-scroll" aria-label="${t('大运时间轴', 'Cycle timeline')}">${report.annual.windows.map((cycle) => `<div class="cycle ${report.annual.cycle?.pillar === cycle.pillar ? 'current' : ''}"><small>${cycle.start.slice(0, 4)} — ${cycle.end.slice(0, 4)}</small><strong>${cycle.pillar}</strong><span>${report.annual.cycle?.pillar === cycle.pillar ? t('所选日期', 'Selected date') : cycle.start.slice(0, 10)}</span></div>`).join('')}</div>` : ''}<details class="evidence"><summary>${t('为什么这样看', 'Show the reasoning')} <span>＋</span></summary><ul>${c.evidence.map((e) => `<li>${e[lang]}</li>`).join('')}</ul><p class="rule-reference">${c.rule} · <a href="https://github.com/zhuyep/mingli-lab/blob/main/docs/reading-method.md" target="_blank" rel="noreferrer">${t('方法与边界', 'Method & limits')} ↗</a></p></details></article>`;
}
function board() {
  const report = buildReading(result, readingDate);
  return `<section class="board" id="results" tabindex="-1" aria-label="${t('命书结果', 'Your reading')}"><div class="result-top"><button id="edit" class="text-button">← ${t('修改生辰', 'Edit details')}</button><span>${isExample ? t('示例命书', 'SAMPLE BOOK') : t('私人命书', 'YOUR BOOK')}</span><button data-export="reading" class="text-button">${t('保存命书', 'Save reading')} ↓</button></div><div class="book-spread"><aside class="book-index"><span class="index-seal">天机</span><p>${t('此卷六章', 'SIX CHAPTERS')}</p><nav aria-label="${t('命书目录', 'Reading chapters')}">${report.chapters.map((c, i) => `<a href="#chapter-${c.id}"><small>${['壹', '贰', '叁', '肆', '伍', '陆'][i]}</small>${c.title[lang]}</a>`).join('')}</nav><small class="index-note">${t('先读白话<br/>再看依据', 'Read the story.<br/>Explore its basis.')}</small></aside><div class="book-pages"><div class="reading-hero"><span class="form-kicker">${t('你的四柱，写成一卷。', 'YOUR FOUR PILLARS, UNFOLDED.')}</span><h1>${report.title[lang]}</h1><p>${report.subtitle[lang]}</p><div class="simple-pillars">${Array.from(
    { length: 4 },
    (_, i) => {
      const p = result.pillars[i];
      return `<div class="${i === 2 ? 'is-day' : ''}"><span>${pos(i)}</span><strong>${p?.stem ?? '—'}${p?.branch ?? '—'}</strong><small>${p ? godName(p.god) : t('时辰未知', 'Unknown hour')}</small></div>`;
    },
  ).join(
    '',
  )}</div><p class="result-meta">${result.input.mode === 'solar' ? esc(result.input.date) + ' · ' + esc(result.input.time) + ' · UTC+8' : t('手动四柱 · 历法对应未经核验', 'Manual pillars · calendar correspondence unchecked')}</p><small class="reading-note">${t('传统命理的条件式解读，留给自己一个观察角度。', 'A conditional cultural reading, offered as a reflective lens.')}</small></div><div id="chapters">${report.chapters.map(chapterView).join('')}</div><section class="reader-questions"><h2>${t('读到这里，你也许想问', 'Questions along the way')}</h2><div class="question-buttons"><button data-question="roots">${t('为什么不是只看日主？', 'Why not just the day stem?')}</button><button data-question="balance">${t('五行缺什么，就补什么？', 'Should I add a missing phase?')}</button><button data-question="timing">${t('流年能看出具体事件吗？', 'Does this predict events?')}</button></div><div id="question-answer" role="status"></div><small>${t('按本卷规则解释 · 全程本地', 'Rule-based explanations · entirely local')}</small></section><div class="deep-reading"><h2>${t('附录 · 查盘与校对', 'Appendix · chart & conventions')}</h2><details><summary>${t('四柱、十神与五行', 'Pillars, roles & phases')}<span>＋</span></summary><div class="detail-body">${pillarCards()}<div id="explanation">${explanation()}</div><div class="element-counts">${ELEMENTS.map((e, i) => `<div><b>${elName(e)}</b><span>${'●'.repeat(result.counts[i]) || '—'}</span><strong>${result.counts[i]}</strong></div>`).join('')}</div><p class="caption">${t('显性字位计数，不代表五行力量。', 'Visible-symbol counts, not phase strength.')}</p><div id="appendix-luck">${luckPanel()}</div><div class="relations">${result.relations.map((r) => `<div class="relation"><strong>${r.branches}</strong><span>${t(r.kind, namesEN[r.kind])}</span><small>${r.positions.map(pos).join(' / ')}</small></div>`).join('')}</div></div></details><details><summary>${t('晚上 11 点，算哪一天？', 'Which day begins at 11 pm?')}<span>＋</span></summary><div class="detail-body">${comparison()}</div></details><details><summary>${t('历法依据与数据导出', 'Calendar trail & data export')}<span>＋</span></summary><div class="detail-body">${provenance()}<button data-export="svg" class="secondary">${t('保存四柱卡片', 'Save chart card')} ↓</button><button data-export="json" class="secondary">${t('导出计算数据', 'Export chart JSON')} ↓</button><p class="caption">${t('命书和卡片含四柱，JSON 还含原始生辰；请自行保管。', 'Readings and cards contain pillars; JSON also includes raw birth details. Keep them private.')}</p></div></details></div><p class="colophon">${t('天机可问，人生自书。', 'Read the symbols. Write your own life.')}<span>天机簿 · TIANJI BU</span></p></div></div></section>`;
}
function render() {
  document.body.classList.toggle('reading-open', showingResult);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('天机簿 · 天机可问，人生自书', 'Tianji Bu · A personal book of BaZi');
  app.innerHTML = `<a class="skip-link" href="${showingResult ? '#results' : '#workspace'}">${t('跳至主要内容', 'Skip to content')}</a><header class="site-header"><button class="brand" id="home" aria-label="${t('天机簿首页', 'Tianji Bu home')}"><img src="./mark.svg" width="34" height="34" alt=""/><strong>天机簿</strong><span>TIANJI BU</span></button><nav><span class="nav-note">${t('生辰有迹 · 万象有序', 'A MOMENT · A PATTERN')}</span><button id="language">${lang === 'zh' ? 'English' : '中文'}</button></nav></header><main>${showingResult ? board() : form()}</main><footer><span>天机簿 · TIANJI BU <small>v0.3.0</small></span><p>${t('传统文化体验，仅供娱乐与自我思考。', 'A cultural experience for entertainment and reflection.')}</p><a href="https://github.com/zhuyep/mingli-lab" target="_blank" rel="noreferrer">${t('开源于 GitHub', 'Open source on GitHub')} ↗</a></footer><div id="toast" class="toast" role="status"></div>`;
}
function showResult() {
  showingResult = true;
  render();
  window.scrollTo(0, 0);
  document.querySelector<HTMLElement>('#results')?.focus({ preventScroll: true });
}
function announce(message: string) {
  const el = document.querySelector('#toast')!;
  el.textContent = message;
  setTimeout(() => {
    if (el.textContent === message) el.textContent = '';
  }, 4000);
}
function readInput(): Input {
  return mode === 'solar'
    ? {
        mode,
        date: draft.date,
        time: draft.time,
        sect: Number(draft.sect) as Sect,
        direction: draft.direction as Direction,
      }
    : { mode, pillars: draft.pillars.trim().split(/\s+/), direction: draft.direction as Direction };
}
app.addEventListener('input', (event) => {
  const el = event.target as HTMLInputElement;
  if (el.name in draft) (draft as Record<string, string>)[el.name] = el.value;
});
app.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    result = calculate(readInput());
    selected = 2;
    isExample = false;
    showResult();
  } catch (err) {
    document.querySelector('#form-status')!.textContent =
      err instanceof Error ? err.message : String(err);
  }
});
app.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest('button');
  if (!button) return;
  if (button.id === 'language') {
    lang = lang === 'zh' ? 'en' : 'zh';
    advancedOpen = !!document.querySelector<HTMLDetailsElement>('.form-options')?.open;
    render();
    document.querySelector<HTMLButtonElement>('#language')?.focus();
  }
  if (button.id === 'edit' || button.id === 'home') {
    showingResult = false;
    render();
    window.scrollTo(0, 0);
    document.querySelector<HTMLInputElement>('#date, #pillars')?.focus({ preventScroll: true });
  }
  if (button.dataset.mode) {
    mode = button.dataset.mode as Input['mode'];
    advancedOpen = true;
    render();
    document.querySelector<HTMLButtonElement>(`[data-mode="${mode}"]`)?.focus();
  }
  if (button.dataset.pillar) {
    selected = Number(button.dataset.pillar);
    document.querySelector('#explanation')!.innerHTML = explanation();
    document
      .querySelectorAll('[data-pillar]')
      .forEach((el) =>
        el.setAttribute(
          'aria-pressed',
          String((el as HTMLElement).dataset.pillar === String(selected)),
        ),
      );
  }
  if (button.dataset.example) {
    const kind = button.dataset.example;
    mode = 'solar';
    draft = {
      date: kind === 'zi' ? '1988-02-15' : '2005-12-23',
      time: kind === 'zi' ? '23:30' : '08:37',
      sect: '2',
      direction: 'none',
      pillars: '乙酉 戊子 辛巳 壬辰',
    };
    result = calculate(readInput());
    selected = 2;
    isExample = true;
    showResult();
    if (kind === 'zi') {
      const detail = document.querySelectorAll<HTMLDetailsElement>('.deep-reading>details')[1];
      detail.open = true;
      detail.scrollIntoView({ block: 'start' });
    }
  }

  if (button.dataset.question) {
    const report = buildReading(result, readingDate);
    const answers = {
      roots: t(
        `同为${result.dayMaster}日主，生在不同月份、地支有没有根、其他天干是生扶还是耗泄，都会改变解释。这张盘的月令是${result.pillars[1].branch}，已知同类根气有${report.features.roots.length}处；第一章列出了具体位置。`,
        `Sharing ${result.dayMaster} does not mean sharing a reading. Month, roots and other stems change the context. This chart has month ${result.pillars[1].branch} and ${report.features.roots.length} same-phase roots; chapter one lists their positions.`,
      ),
      balance: t(
        `不直接这样判断。字面没出现，不等于藏干没有；出现次数少，也不等于需要更多。${report.chapters[1].lead.zh}。第二章给出当前条件下的路径，不提供改名或佩饰“补运”的建议。`,
        `No. A phase absent from visible symbols may still occur in hidden stems, and low counts do not prove need. ${report.chapters[1].lead.en}. Chapter two explains the conditional alternatives.`,
      ),
      timing: t(
        '这版只能说明某年干支与原局、大运增加了哪些已支持的关系，不能推出升职、发财或分手等具体事件。可以切换日期观察关系如何变化，把年度问题留给实际经历来回答。',
        'This version describes supported symbolic relationships between a year, chart and selected cycle. It cannot infer a promotion, financial gain or breakup. Compare dates and test the reflective questions against experience.',
      ),
    };
    document.querySelector('#question-answer')!.textContent =
      answers[button.dataset.question as keyof typeof answers];
    document
      .querySelectorAll('[data-question]')
      .forEach((el) => el.setAttribute('aria-pressed', String(el === button)));
  }
  if (button.dataset.export) {
    const kind = button.dataset.export;
    download(
      kind === 'reading'
        ? 'tianji-book.md'
        : kind === 'svg'
          ? 'tianji-chart.svg'
          : 'tianji-chart.json',
      kind === 'reading'
        ? readingMarkdown(result, readingDate, lang)
        : kind === 'svg'
          ? chartSvg(result)
          : JSON.stringify({ ...result, reading: buildReading(result, readingDate) }, null, 2),
      kind === 'reading'
        ? 'text/markdown;charset=utf-8'
        : kind === 'svg'
          ? 'image/svg+xml'
          : 'application/json',
    );
    announce(t('已备好，请留意下载提示。', 'Ready. Check your downloads.'));
  }
});

app.addEventListener('change', (event) => {
  const el = event.target as HTMLInputElement;
  if (el.id !== 'reading-date' && el.id !== 'cycle-direction') return;
  try {
    if (el.id === 'reading-date') {
      buildReading(result, el.value);
      readingDate = el.value;
    } else {
      result = calculate({ ...result.input, direction: el.value as Direction });
      draft.direction = el.value;
    }
    const report = buildReading(result, readingDate);
    document.querySelector('#appendix-luck')!.innerHTML = luckPanel();
    document.querySelector('#chapter-timing')!.outerHTML = chapterView(report.chapters[5], 5);
    document.getElementById(el.id)?.focus({ preventScroll: true });
  } catch (error) {
    document.querySelector('#timing-status')!.textContent =
      error instanceof Error ? error.message : String(error);
  }
});

render();
// Same-origin parent handshake: the personal workbench waits for a rendered app.
if (window.parent !== window)
  window.parent.postMessage(
    { type: 'daji-game-load', game: 'wenchen', stage: 'ready' },
    window.location.origin,
  );
