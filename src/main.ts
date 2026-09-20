import './style.css';
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

function astrolabe() {
  const branches = '子丑寅卯辰巳午未申酉戌亥'.split('');
  return `<div class="astrolabe" aria-hidden="true"><svg viewBox="0 0 560 560"><defs><radialGradient id="aura"><stop stop-color="#c9a868" stop-opacity=".12"/><stop offset="1" stop-color="#c9a868" stop-opacity="0"/></radialGradient></defs><circle cx="280" cy="280" r="270" fill="url(#aura)"/><g class="orbit"><circle cx="280" cy="280" r="244"/><circle cx="280" cy="280" r="237"/>${Array.from({ length: 120 }, (_, i) => `<path transform="rotate(${i * 3} 280 280)" d="M280 43v${i % 10 === 0 ? 18 : i % 5 === 0 ? 12 : 5}" opacity="${i % 5 === 0 ? 0.85 : 0.4}"/>`).join('')}</g><circle cx="280" cy="280" r="206"/>${branches
    .map((v, i) => {
      const a = ((i * 30 - 90) * Math.PI) / 180;
      return `<text x="${280 + 218 * Math.cos(a)}" y="${286 + 218 * Math.sin(a)}">${v}</text>`;
    })
    .join(
      '',
    )}<circle cx="280" cy="280" r="167" stroke-dasharray="2 10"/><path d="M280 92 468 280 280 468 92 280Z" opacity=".22"/><path d="M147 147H413V413H147Z" opacity=".18"/><circle cx="280" cy="280" r="124"/><path d="M280 140v23m0 234v23M140 280h23m234 0h23"/><g fill="#d8bb80"><circle cx="280" cy="92" r="3"/><circle cx="468" cy="280" r="3"/><circle cx="280" cy="468" r="3"/><circle cx="92" cy="280" r="3"/></g></svg><div class="astrolabe-center"><span class="north-star">✧</span><strong>问辰</strong><span>W E N C H E N</span><i>一 时 一 象 · 一 人 一 盘</i></div></div>`;
}
function form() {
  return `<section class="entry"><div class="entry-world"><div class="eyebrow">${t('东方命理 · 四柱八字', 'A JOURNEY THROUGH CHINESE BAZI')}</div>${astrolabe()}<h1>${t('把你的生辰，<em>写进星河。</em>', 'Your moment in time.<em>A story in the stars.</em>')}</h1><p>${t('从出生的一刻，展开属于你的八字命盘。', 'Explore the traditional symbols of your birth moment.')}</p></div><div class="entry-form" id="workspace"><span class="form-kicker">${t('此刻，问辰', 'BEGIN YOUR READING')}</span><h2>${t('从你的生辰开始', 'Begin with your birth')}</h2><p class="form-intro">${t('填好日期和时间，剩下的交给问辰。', 'Just a date and time. We’ll draw the chart.')}</p><form id="chart-form" autocomplete="off">
  ${mode === 'solar' ? `<label for="date">${t('出生日期 · 公历', 'Birth date · Gregorian')}</label><input id="date" name="date" type="date" min="1901-01-01" max="2099-12-31" required value="${esc(draft.date)}"/><label for="time">${t('出生时间', 'Birth time')}</label><input id="time" name="time" type="time" required value="${esc(draft.time)}"/><p class="field-note">${t('北京时间（东八区标准时）', 'China standard time · UTC+08:00')}</p>` : `<label for="pillars">${t('已有八字', 'Known pillars')}</label><input id="pillars" name="pillars" required value="${esc(draft.pillars)}" placeholder="乙酉 戊子 辛巳 壬辰"/><p class="field-note">${t('年、月、日、时，用空格分隔。时辰未知时只填前三柱。', 'Separate year, month, day and hour with spaces. Omit an unknown hour.')}</p>`}
  <button type="submit" class="primary">${t('开启我的命盘', 'Reveal my chart')}<span aria-hidden="true">✧</span></button><p id="form-status" class="form-status" role="status"></p>
  <details class="form-options" ${advancedOpen ? 'open' : ''}><summary>${t('更多选项', 'More options')}</summary><div class="segmented"><button type="button" data-mode="solar" aria-pressed="${mode === 'solar'}">${t('按生日', 'Birth date')}</button><button type="button" data-mode="pillars" aria-pressed="${mode === 'pillars'}">${t('已有八字', 'Known pillars')}</button></div>${mode === 'solar' ? `<label for="sect">${t('换日时间', 'Day boundary')}</label><select id="sect" name="sect">${option('2', draft.sect, '00:00 换日（默认）', '00:00 · midnight (default)')}${option('1', draft.sect, '23:00 换日', '23:00 · late Zi')}</select>` : ''}<label for="direction">${t('大运顺逆', 'Traditional cycle formula')}</label><select id="direction" name="direction">${option('none', draft.direction, '先不看大运', 'Skip cycles')}${option('male', draft.direction, '男命公式 · 阳顺阴逆', 'Male convention')}${option('female', draft.direction, '女命公式 · 阴顺阳逆', 'Female convention')}</select><p class="field-note">${t('默认 00:00 换日。不自动换算出生地、夏令时或真太阳时；特殊时间需先自行校正。', 'Default day boundary: midnight. No location, daylight-saving or true-solar-time conversion.')}</p></details></form><div class="sample-row"><span>${t('想先逛逛？', 'Just looking?')}</span><button data-example="standard">${t('看看示例命盘', 'Try an example')} <span aria-hidden="true">→</span></button></div><p class="private-note">${t('无需注册 · 生辰只在你的浏览器中计算', 'No signup · Birth details stay in your browser')}</p></div></section>`;
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

const imagery: Record<string, [string, string, string, string]> = {
  甲: [
    '参天之木',
    'A tall tree',
    '以生长为意象，向上舒展，也向下扎根。',
    'Growth above, roots below.',
  ],
  乙: [
    '柔韧之藤',
    'A winding vine',
    '以柔韧为意象，沿着自己的节奏寻找光。',
    'Finding light through flexibility.',
  ],
  丙: [
    '朗照之阳',
    'The bright sun',
    '以日光为意象，温暖与明亮相伴。',
    'Warmth and clarity, like daylight.',
  ],
  丁: [
    '静夜之灯',
    'A quiet lantern',
    '以灯火为意象，微光也能照亮一方。',
    'A small light illuminates a quiet corner.',
  ],
  戊: [
    '巍然之山',
    'A steady mountain',
    '以山岳为意象，安静地承载与积累。',
    'A symbol of steadiness and quiet accumulation.',
  ],
  己: [
    '温厚之田',
    'The patient earth',
    '以田园为意象，留出空间，让万物生长。',
    'Making room for things to grow.',
  ],
  庚: [
    '淬炼之金',
    'Forged metal',
    '以金铁为意象，在磨砺中渐见轮廓。',
    'Taking shape through refinement.',
  ],
  辛: [
    '含光之玉',
    'A polished jewel',
    '以珠玉为意象，细处藏光，静中见质。',
    'Light in the details, beauty in the quiet.',
  ],
  壬: [
    '流转之海',
    'The open sea',
    '以江海为意象，容纳百川，也走向远方。',
    'Gathering streams, reaching distant shores.',
  ],
  癸: [
    '润物之雨',
    'A gentle rain',
    '以雨露为意象，细水无声，润泽有时。',
    'A gentle rhythm, a quiet renewal.',
  ],
};
function board() {
  const day = stemInfo(result.dayMaster),
    story = imagery[result.dayMaster];
  return `<section class="board" id="results" tabindex="-1" aria-label="${t('排盘结果', 'Chart results')}"><div class="result-top"><button id="edit" class="text-button">← ${t('修改生辰', 'Edit birth details')}</button><span>${isExample ? t('示例命盘', 'EXAMPLE CHART') : t('你的命盘', 'YOUR CHART')}</span><button data-export="svg" class="text-button">${t('保存命盘', 'Save chart')} ↓</button></div><div class="reading-hero"><span class="form-kicker">${t('你的日主 · ' + day.polarity + day.element, 'YOUR DAY STEM · ' + (day.polarity === '阳' ? 'Yang' : 'Yin') + ' ' + elName(day.element))}</span><div class="day-emblem">${result.dayMaster}<span>${day.element}</span></div><h1>${t(story[0], story[1])}</h1><p>${t(story[2], story[3])}</p><small>${t('传统五行意象，留给自己一个思考的角度。', 'A traditional metaphor, offered as a reflection prompt.')}</small></div>
  <div class="simple-pillars">${Array.from({ length: 4 }, (_, i) => {
    const p = result.pillars[i];
    return `<div class="${i === 2 ? 'is-day' : ''}"><span>${pos(i)}</span><strong>${p?.stem ?? '—'}<br/>${p?.branch ?? '—'}</strong><small>${p ? elName(p.element) + ' · ' + elName(p.branchElement) : t('时辰未知', 'Unknown hour')}</small></div>`;
  }).join(
    '',
  )}</div><p class="result-meta">${result.input.mode === 'solar' ? esc(result.input.date) + ' · ' + esc(result.input.time) + ' · UTC+8' : t('手动八字 · 历法对应未经核验', 'Manual pillars · calendar correspondence unchecked')}</p>
  <section class="element-overview"><div><h2>${t('五行一览', 'The five phases')}</h2><p>${t('看看八字里的五种元素。', 'The five elements in the visible chart.')}</p></div><div class="element-counts">${ELEMENTS.map((e, i) => `<div class="${eClass(e)}"><b>${elName(e)}</b><span class="element-dots" aria-label="${result.counts[i]}">${Array.from({ length: 8 }, (_, n) => `<i class="${n < result.counts[i] ? 'filled' : ''}"></i>`).join('')}</span><strong>${result.counts[i]}</strong></div>`).join('')}</div><p class="caption">${t('字数多少不代表五行强弱，也不需要“缺什么补什么”。', 'Counts describe symbols, not strength or what you need to “fix”.')}</p></section>
  <div class="deep-reading"><h2>${t('想再看深一点', 'A closer look')}</h2><p>${t('好奇时再打开，不懂术语也没关系。', 'Open what interests you. No expertise needed.')}</p><details><summary>${t('八字是怎样组成的？', 'How do these symbols connect?')}<span>＋</span></summary><div class="detail-body">${pillarCards()}<div id="explanation">${explanation()}</div>${luckPanel()}<div class="relations">${result.relations.map((r) => `<div class="relation"><strong>${r.branches}</strong><span>${t(r.kind, namesEN[r.kind])}</span><small>${r.positions.map(pos).join(' / ')}</small></div>`).join('')}</div><p class="caption">${t('合、冲、害是传统关系名称，不是吉凶预告；日柱旬空：', 'These are traditional relationship names, not forecasts. Void branches: ')}${result.voidBranches.join('、')}</p></div></details><details><summary>${t('晚上 11 点，算哪一天？', 'Which day begins at 11 pm?')}<span>＋</span></summary><div class="detail-body">${comparison()}</div></details><details><summary>${t('这张命盘的计算依据', 'How this chart was calculated')}<span>＋</span></summary><div class="detail-body">${provenance()}<button data-export="json" class="secondary">${t('导出计算数据 JSON', 'Export calculation JSON')} ↓</button><p class="caption">${t('JSON 含原始生日与全部输入，请自行保管。', 'JSON contains all original birth inputs. Keep it private.')}</p></div></details></div><p class="export-note">${t('保存的卡片省略原始生日，但八字仍可能涉及个人隐私。', 'Saved cards omit raw birth details; the pillars may still be personal data.')}</p></section>`;
}
function render() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('问辰 · 把生辰写进星河', 'Wenchen · Your moment in the stars');
  app.innerHTML = `<a class="skip-link" href="${showingResult ? '#results' : '#workspace'}">${t('跳至主要内容', 'Skip to content')}</a><div class="sky" aria-hidden="true"></div><header class="site-header"><button class="brand" id="home" aria-label="${t('问辰首页', 'Wenchen home')}"><img src="./mark.svg" width="34" height="34" alt=""/><strong>问辰</strong><span>WENCHEN</span></button><nav><span class="nav-note">${t('生辰有迹 · 万象有序', 'A MOMENT · A PATTERN')}</span><button id="language">${lang === 'zh' ? 'English' : '中文'}</button></nav></header><main>${showingResult ? board() : form()}</main><footer><span>问辰 · WENCHEN <small>v0.2.0</small></span><p>${t('传统文化体验，仅供娱乐与自我思考。', 'A cultural experience for entertainment and reflection.')}</p><a href="https://github.com/zhuyep/mingli-lab" target="_blank" rel="noreferrer">${t('开源于 GitHub', 'Open source on GitHub')} ↗</a></footer><div id="toast" class="toast" role="status"></div>`;
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
  if (button.dataset.export) {
    const svg = button.dataset.export === 'svg';
    download(
      svg ? 'wenchen-chart.svg' : 'wenchen-chart.json',
      svg ? chartSvg(result) : JSON.stringify(result, null, 2),
      svg ? 'image/svg+xml' : 'application/json',
    );
    announce(t('命盘已备好，请留意下载提示。', 'Your chart is ready. Check your downloads.'));
  }
});
render();
// Same-origin parent handshake: the personal workbench waits for a rendered app.
if (window.parent !== window)
  window.parent.postMessage(
    { type: 'daji-game-load', game: 'wenchen', stage: 'ready' },
    window.location.origin,
  );
