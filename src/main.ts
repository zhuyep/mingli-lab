import './style.css';
import {
  calculate,
  compareZi,
  ELEMENTS,
  stemInfo,
  tenGod,
  type Chart,
  type Input,
  type Direction,
  type Sect,
} from './core';
import { chartSvg, download, escapeHtml as esc } from './export';

type Language = 'zh' | 'en';
let lang: Language = 'zh';
let mode: Input['mode'] = 'solar';
let draft = {
  date: '2005-12-23',
  time: '08:37',
  sect: '2',
  direction: 'none',
  pillars: '乙酉 戊子 辛巳 壬辰',
};
let result = calculate({
  mode: 'solar',
  date: draft.date,
  time: draft.time,
  sect: 2,
  direction: 'none',
});
let selected = 2;
let tab = 'reading';
let isExample = true;
let dirty = false;
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

function form() {
  return `<aside class="notebook"><div class="section-label">${t('从这里开始', 'START HERE')}<span>01</span></div>
  <h2>${t('写下你的四柱', 'Find your four pillars')}</h2>
  <div class="segmented" aria-label="${t('输入方式', 'Input mode')}">
    <button data-mode="solar" aria-pressed="${mode === 'solar'}">${t('出生日期', 'Date & time')}</button>
    <button data-mode="pillars" aria-pressed="${mode === 'pillars'}">${t('已有八字', 'Known pillars')}</button>
  </div>
  <form id="chart-form" autocomplete="off">
  ${
    mode === 'solar'
      ? `<label for="date">${t('公历日期', 'Gregorian date')}</label><input id="date" name="date" type="date" min="1901-01-01" max="2099-12-31" required value="${esc(draft.date)}"/>
    <label for="time">${t('出生时间', 'Birth time')}</label><input id="time" name="time" type="time" required value="${esc(draft.time)}"/>
    <p class="field-note">${t('按东八区标准时（UTC+8）输入；不自动处理夏令时或真太阳时。', 'Enter UTC+08:00 standard time. No daylight-saving or true-solar-time correction.')}</p>
    <label for="sect">${t('子时换日口径', 'Day boundary')}</label><select id="sect" name="sect">${option('2', draft.sect, '00:00 换日 · 晚子时保留日柱', '00:00 · midnight')}${option('1', draft.sect, '23:00 换日 · 晚子时用次日日柱', '23:00 · late Zi hour')}</select>`
      : `<label for="pillars">${t('年、月、日、时，以空格分隔', 'Year, month, day, hour; separate with spaces')}</label><input id="pillars" name="pillars" type="text" required value="${esc(draft.pillars)}" spellcheck="false" autocomplete="off"/><p class="field-note">${t('例如：乙酉 戊子 辛巳 壬辰。时辰未知时只填前三柱；不推算起运。', 'Example: 乙酉 戊子 辛巳 壬辰. If the hour is unknown, enter only three pillars. No timed luck cycle is inferred.')}</p>`
  }
    <label for="direction">${t('大运顺逆公式', 'Traditional luck-cycle formula')}</label><select id="direction" name="direction">${option('none', draft.direction, '暂不计算', 'Skip for now')}${option('male', draft.direction, '阳男顺、阴男逆', 'Male convention')}${option('female', draft.direction, '阴女顺、阳女逆', 'Female convention')}</select>
    <p class="field-note">${t('此项只选择传统公式，不用于推断性格或身份。', 'Selects a traditional formula only; not a claim about identity or character.')}</p>
    <button type="submit" class="primary">${t('排盘，看推演', 'Build my chart')} <span aria-hidden="true">↗</span></button>
    <p id="form-status" class="form-status" role="status">${dirty ? t('输入已修改，点击排盘更新结果。', 'Inputs changed. Build the chart to update.') : ''}</p>
  </form>
  <div class="examples"><span>${t('先试一个例子', 'EXPLORE AN EXAMPLE')}</span><button data-example="standard">${t('普通时刻', 'Standard time')} <span>↗</span></button><button data-example="zi">${t('23 点，会换一天吗？', 'What changes at 23:00?')} <span>↗</span></button><button data-example="unknown">${t('不知道时辰', 'Unknown birth hour')} <span>↗</span></button></div>
  <p class="private-note"><span aria-hidden="true">◇</span>${t('计算留在浏览器。不收集生日。', 'Calculated in your browser. No birth-data collection.')}</p></aside>`;
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

function phaseWheel(chart: Chart) {
  const points = [
    [100, 25],
    [171, 77],
    [144, 158],
    [56, 158],
    [29, 77],
  ];
  return `<svg class="phase-wheel" viewBox="0 0 200 190" role="img" aria-label="${t('五行相生次序：木火土金水', 'Generating cycle: Wood, Fire, Earth, Metal, Water')}"><path d="M100 25L171 77L144 158L56 158L29 77Z" fill="none" stroke="#d9e3ee" stroke-width="1.5"/><circle cx="100" cy="98" r="45" fill="none" stroke="#e5edf5" stroke-dasharray="3 5"/><text x="100" y="95" text-anchor="middle" class="wheel-center">${chart.pillars.length * 2}</text><text x="100" y="114" text-anchor="middle" class="wheel-label">${t('显性字位', 'positions')}</text>${points.map(([x, y], i) => `<g class="${eClass(ELEMENTS[i])}"><circle cx="${x}" cy="${y}" r="20" fill="currentColor" opacity=".09"/><text x="${x}" y="${y + 6}" text-anchor="middle">${ELEMENTS[i]}</text></g>`).join('')}</svg>`;
}

function reading() {
  return `${explanation()}<div class="insight-grid"><section class="phase-panel"><div class="section-label">${t('五行分布', 'FIVE PHASES')}<span>${t('计数 ≠ 强弱', 'COUNTS ≠ STRENGTH')}</span></div><div class="phase-content">${phaseWheel(result)}<div class="bars">${ELEMENTS.map((e, i) => `<div class="bar-row"><span>${elName(e)}</span><div class="bar-track"><div class="bar-fill ${eClass(e)}" style="width:${(result.counts[i] / (result.pillars.length * 2)) * 100}%"></div></div><b>${result.counts[i]}</b></div>`).join('')}</div></div><p class="caption">${t('每个天干、地支本气各计一次。藏干另列，不叠加为力量分数；不能据此“缺什么补什么”。', 'One count per visible stem and principal branch phase. Hidden stems are separate. This is not a strength score or a prescription.')}</p></section>
    <section class="relations-panel"><div class="section-label">${t('地支关系', 'BRANCH RELATIONS')}<span>${t('符号匹配', 'SYMBOLIC')}</span></div><div class="relations">${result.relations.length ? result.relations.map((r) => `<div class="relation"><strong>${r.branches}</strong><span>${t(r.kind, namesEN[r.kind])}</span><small>${r.positions.map(pos).join(' / ')}</small></div>`).join('') : `<p class="muted">${t('已知地支中没有匹配到六合、六冲、六害或完整三合组合。', 'No listed pair or complete three-branch group matches the known branches.')}</p>`}</div><p class="caption">${t(`日柱旬空：${result.voidBranches.join('、')}。合与冲分别保留；有合不等于冲自动消失。`, `Day-pillar void branches: ${result.voidBranches.join(', ')}. Combinations and clashes are listed independently.`)}</p></section></div>
    ${luckPanel()}`;
}

function luckPanel() {
  if (!result.luck)
    return `<div class="quiet-note">${t('大运尚未计算。可在左侧选择传统顺逆公式；时辰未知时不推算大运。', 'Luck cycles are not calculated. Choose a traditional formula in the form; unknown-hour charts omit cycles.')}</div>`;
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

function board() {
  return `<section class="board" id="results" aria-label="${t('排盘结果', 'Chart results')}"><div class="board-heading"><div><div class="section-label">${isExample ? t('教学示例', 'TEACHING EXAMPLE') : t('当前结果', 'CURRENT CHART')}<span>${t('点击四柱，逐步看懂', 'SELECT A PILLAR TO EXPLORE')}</span></div><h2>${t('四柱之间，自有来路', 'Every symbol has a reason')}</h2></div><span class="chart-seal">${t('明<br/>理', '明<br/>理')}</span></div>
  ${pillarCards()}<div class="result-meta"><span>${result.input.mode === 'solar' ? `${esc(result.input.date)} · ${esc(result.input.time)} · UTC+8` : t('手动四柱 · 未核验历法对应', 'Manual pillars · calendar correspondence unchecked')}</span><span>${t('日主', 'Day master')} ${result.dayMaster} · ${elName(stemInfo(result.dayMaster).element)}</span></div>
  <nav class="tabs" aria-label="${t('结果视图', 'Result view')}">${[
    ['reading', '结构解读', 'Read the chart'],
    ['compare', '子时对照', 'Zi-hour lab'],
    ['sources', '演算依据', 'How it works'],
  ]
    .map(
      ([id, zh, en]) =>
        `<button data-tab="${id}" aria-pressed="${tab === id}">${t(zh, en)}</button>`,
    )
    .join('')}</nav>
  <div id="result-detail">${tab === 'reading' ? reading() : tab === 'compare' ? comparison() : provenance()}</div>
  <div class="export-row"><span>${t('把推演带走', 'KEEP THE CALCULATION')}</span><button data-export="svg">${t('下载命盘卡片', 'Download chart card')} ↓</button><button data-export="json">${t('导出 JSON（含输入）', 'Export JSON (includes inputs)')} ↓</button></div><p class="export-note">${t('卡片不含原始生日，但四柱仍可能涉及隐私。JSON 包含全部输入，请自行保管。', 'The card omits raw birth details, but pillars can still be personal data. JSON includes all inputs; store it privately.')}</p></section>`;
}

function render() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('明理 · 看得见推演的八字实验室', 'Mingli · An explainable BaZi lab');
  app.innerHTML = `<a class="skip-link" href="#workspace">${t('跳至排盘', 'Skip to the chart')}</a><header class="site-header"><a href="#" class="brand"><img src="./mark.svg" width="36" height="36" alt=""/><strong>明理</strong><span>BAZI LAB</span></a><nav><a href="#workspace">${t('排盘实验室', 'Playground')}</a><a href="#about">${t('读盘方法', 'Reading guide')}</a><button id="language">${lang === 'zh' ? 'English' : '中文'}</button></nav></header>
  <main><section class="intro"><div><div class="eyebrow"><span></span>${t('传统文化 × 可解释计算', 'CHINESE TRADITION × EXPLAINABLE COMPUTING')}</div><h1>${t('一张命盘，<br/><em>看见推演的来路。</em>', 'A chart to explore.<br/><em>A method to understand.</em>')}</h1><p>${t('从八个字开始，认识五行与十神。<br/>每一步有依据，每一种口径都说清。', 'Explore the eight characters, five phases and ten gods.<br/>Follow each calculation. Understand every convention.')}</p><a class="preview-link" href="#results">${t('直接看示例命盘', 'Explore the example chart')} ↓</a></div><div class="intro-aside"><span>开</span><div><b>${t('打开就能用', 'Ready when you are')}</b><p>${t('无需账号 · 无需 API Key<br/>浏览器本地计算 · 中英双语', 'No account · No API key<br/>Local calculations · 中文 / English')}</p></div></div></section>
  <div class="workspace" id="workspace">${form()}${board()}</div>
  <section id="about" class="about"><div class="about-title"><div class="section-label">${t('读懂，而非断言', 'UNDERSTAND, THEN QUESTION')}</div><h2>${t('把命理当成<br/>一套可以追问的语言。', 'A symbolic language<br/>you can question.')}</h2></div><div class="about-copy"><div><h3>${t('先看关系，再看解释', 'Start with relationships')}</h3><p>${t('“伤官”“七杀”是传统关系名，不是坏事预告。月令、藏干、通根与流派都会影响解释；简单计数不能自动选出用神。', 'Traditional names such as Seven killings are relationship labels, not warnings. Season, hidden stems and schools shape interpretations; counts alone cannot select a useful god.')}</p></div><div><h3>${t('保留未知，才有讨论的起点', 'Make uncertainty visible')}</h3><p>${t('这是一款传统文化学习与娱乐工具。规则能复算，不代表能预测人生；不据此判断疾病、投资、婚姻成败。首版聚焦四柱，不包含住宅风水。', 'This is a cultural learning and entertainment tool. Reproducible rules do not establish predictive validity. Do not use it for medical, investment or relationship decisions. Home Feng Shui is outside this release.')}</p></div></div></section>
  </main><footer><span>明理 · BAZI LAB <small>v0.1.0</small></span><span>${t('MIT 开源代码 · 无分析追踪 · 无远程字体', 'MIT source · No analytics · No remote fonts')} · <a href="https://github.com/zhuyep/mingli-lab" target="_blank" rel="noreferrer">GitHub ↗</a></span></footer><div id="toast" class="toast" role="status"></div>`;
}

function updateBoard() {
  document.querySelector('#results')!.outerHTML = board();
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
  if (el.name in draft) {
    (draft as Record<string, string>)[el.name] = el.value;
    dirty = true;
    document.querySelector('#form-status')!.textContent = t(
      '输入已修改，点击排盘更新结果。',
      'Inputs changed. Build the chart to update.',
    );
  }
});
app.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    result = calculate(readInput());
    selected = 2;
    isExample = false;
    dirty = false;
    updateBoard();
    document.querySelector('#form-status')!.textContent = t(
      '已更新。点击四柱查看推演。',
      'Updated. Select a pillar to explore.',
    );
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
    render();
    document.querySelector<HTMLButtonElement>('#language')?.focus();
  }
  if (button.dataset.mode) {
    mode = button.dataset.mode as Input['mode'];
    dirty = true;
    render();
    document.querySelector<HTMLButtonElement>(`[data-mode="${mode}"]`)?.focus();
  }
  if (button.dataset.pillar) {
    selected = Number(button.dataset.pillar);
    updateBoard();
    document
      .querySelector<HTMLButtonElement>(`[data-pillar="${selected}"]`)
      ?.focus({ preventScroll: true });
  }
  if (button.dataset.tab) {
    tab = button.dataset.tab;
    updateBoard();
    document
      .querySelector<HTMLButtonElement>(`[data-tab="${tab}"]`)
      ?.focus({ preventScroll: true });
  }
  if (button.dataset.example) {
    const kind = button.dataset.example;
    mode = kind === 'unknown' ? 'pillars' : 'solar';
    draft = {
      date: kind === 'zi' ? '1988-02-15' : '2005-12-23',
      time: kind === 'zi' ? '23:30' : '08:37',
      sect: '2',
      direction: 'none',
      pillars: '乙酉 戊子 辛巳',
    };
    result = calculate(readInput());
    tab = kind === 'zi' ? 'compare' : 'reading';
    selected = 2;
    isExample = true;
    dirty = false;
    render();
    document
      .querySelector<HTMLButtonElement>(`[data-example="${kind}"]`)
      ?.focus({ preventScroll: true });
    announce(t('已载入教学示例。', 'Teaching example loaded.'));
    if (innerWidth < 741)
      document
        .querySelector('#results')
        ?.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start',
        });
  }
  if (button.dataset.export) {
    const svg = button.dataset.export === 'svg';
    download(
      svg ? 'mingli-chart.svg' : 'mingli-chart.json',
      svg ? chartSvg(result) : JSON.stringify(result, null, 2),
      svg ? 'image/svg+xml' : 'application/json',
    );
    announce(
      t('已生成下载文件；请留意浏览器下载提示。', 'File prepared. Check your browser downloads.'),
    );
  }
});
render();
