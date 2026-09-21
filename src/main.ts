import './style.css';
import { sleepAdvice, type SleepCheck } from './topics';
import { yearNote } from './everyday';
import { ACTIONS, selectedActions, type ActionTopic, type ActionSelection } from './actions';
import { buildReading, readingMarkdown, todayInChina } from './reading';
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
let actionSelection: ActionSelection = {};
let sleepCheck: SleepCheck = { rhythm: 'unknown', quality: 'unknown' };

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
  return `<div class="ink-art" aria-hidden="true"><span class="art-coordinate">FIG. 01 / A MOMENT IN YOUR HANDS</span><img src="./ink-hand.jpg" alt="" width="1200" height="1200" fetchpriority="high"/><span class="art-note">八字是引子<br/>你才是故事</span></div>`;
}
function form() {
  return `<section class="entry"><div class="entry-world">${bookCover()}</div><div class="entry-form" id="workspace"><span class="form-kicker">${t('一份关于你的东方手记', 'A PERSONAL NOTE THROUGH CHINESE BAZI')}</span><h1>${t('你的故事，<br/>不止八个字。', 'A few symbols.<br/>An unwritten life.')}</h1><p class="form-intro">${t('从你的生辰出发，看工作、财富、感情与年份。<br/>先看风格和卡点，再看调整建议。', 'Explore work, income, relationships and years.<br/>Styles and friction first, suggestions separately.')}</p><form id="chart-form" autocomplete="off">
  ${mode === 'solar' ? `<div class="birth-fields"><div><label for="date">${t('出生日期 · 公历', 'Birth date · Gregorian')}</label><input id="date" name="date" type="date" min="1901-01-01" max="2099-12-31" required value="${esc(draft.date)}"/></div><div><label for="time">${t('出生时间', 'Birth time')}</label><input id="time" name="time" type="time" required value="${esc(draft.time)}"/></div></div><p class="field-note">${t('北京时间（东八区标准时）', 'China standard time · UTC+08:00')}</p>` : `<label for="pillars">${t('已有八字', 'Known pillars')}</label><input id="pillars" name="pillars" required value="${esc(draft.pillars)}" placeholder="乙酉 戊子 辛巳 壬辰"/><p class="field-note">${t('年、月、日、时，用空格分隔。时辰未知时只填前三柱。', 'Separate year, month, day and hour with spaces. Omit an unknown hour.')}</p>`}
  <button type="submit" class="primary">${t('看看我的解读', 'Read my chart')}<span aria-hidden="true">→</span></button><p id="form-status" class="form-status" role="status"></p>
  <details class="form-options" ${advancedOpen ? 'open' : ''}><summary>${t('更多选项 · 已有八字 / 大运', 'Options · known pillars / cycles')}</summary><div class="segmented"><button type="button" data-mode="solar" aria-pressed="${mode === 'solar'}">${t('按生日', 'Birth date')}</button><button type="button" data-mode="pillars" aria-pressed="${mode === 'pillars'}">${t('已有八字', 'Known pillars')}</button></div>${mode === 'solar' ? `<label for="sect">${t('换日时间', 'Day boundary')}</label><select id="sect" name="sect">${option('2', draft.sect, '00:00 换日（默认）', '00:00 · midnight (default)')}${option('1', draft.sect, '23:00 换日', '23:00 · late Zi')}</select>` : ''}<label for="direction">${t('大运顺逆', 'Traditional cycle formula')}</label><select id="direction" name="direction">${option('none', draft.direction, '读完再选', 'Choose later')}${option('male', draft.direction, '男命公式 · 阳顺阴逆', 'Male convention')}${option('female', draft.direction, '女命公式 · 阴顺阳逆', 'Female convention')}</select><p class="field-note">${t('默认 00:00 换日。不自动换算出生地、夏令时或真太阳时；特殊时间需先自行校正。', 'Default boundary: midnight. No location, daylight-saving or true-solar-time conversion.')}</p></details></form><div class="sample-row"><button data-example="standard">${t('先看看示例', 'Read a sample')} <span aria-hidden="true">↗</span></button><span>${t('无需填写', 'No details needed')}</span></div><p class="private-note">${t('不用登录，生辰只留在你的浏览器里。', 'No account. Your birth details stay in this browser.')}</p></div></section>`;
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

function sleepNotes() {
  return sleepAdvice(sleepCheck)
    .map((p) => `<p>${p[lang]}</p>`)
    .join('');
}
function sleepPanel() {
  return `<section class="sleep-check" aria-labelledby="sleep-title"><span class="form-kicker">A NOTE FROM REAL LIFE</span><h4 id="sleep-title">${t('填写现状 · 最近的作息', 'YOUR CONTEXT · RECENT SLEEP')}</h4><p>${t('下面只根据你此刻的回答给提示，不参与命盘推断。', 'These notes use only the answers below, independently of your chart.')}</p><div class="sleep-fields"><div><label for="sleep-rhythm">${t('最近一周，起睡时间', 'Your bed and wake times this week')}</label><select id="sleep-rhythm">${option('unknown', sleepCheck.rhythm, '请选择', 'Choose an answer')}${option('regular', sleepCheck.rhythm, '比较规律', 'Mostly regular')}${option('irregular', sleepCheck.rhythm, '经常变动', 'Often changing')}</select></div><div><label for="sleep-quality">${t('最近的睡眠感受', 'How sleep has felt recently')}</label><select id="sleep-quality">${option('unknown', sleepCheck.quality, '请选择', 'Choose an answer')}${option('rested', sleepCheck.quality, '醒后通常精神尚可', 'Usually refreshed')}${option('trouble', sleepCheck.quality, '经常睡不好，或醒后仍困', 'Often troubled or unrefreshed')}</select></div></div><h4 class="sleep-advice-label">${t('根据回答给出的作息建议', 'SLEEP GUIDANCE FROM YOUR ANSWERS')}</h4><div id="sleep-notes" role="status" aria-live="polite">${sleepNotes()}</div><small>${t('回答只留在本页，不保存、不进入下载文件。', 'Answers stay on this page and are neither stored nor exported.')} <a href="https://www.cdc.gov/sleep/about/" target="_blank" rel="noreferrer">${t('睡眠提示来源：CDC', 'Sleep guidance: CDC')} ↗</a></small></section>`;
}
function yearComparison(report: ReturnType<typeof buildReading>) {
  return `<section class="year-comparison" aria-labelledby="years-title"><h4 id="years-title">${t('前后几年的命理话题', 'Symbolic themes in nearby years')}</h4><p>${t('按传统说法选出的话题，供你参考，不是事件预告。', 'Themes from traditional symbolism, not forecasts of events.')}</p><div class="year-rows">${report.nearby.map((a) => `<div class="year-row ${a.date === readingDate ? 'selected-year' : ''}"><div><strong>${a.date.slice(0, 4)}</strong><span>${a.pillar} · ${a.god}</span></div><div><b>${yearNote(a.god).theme[lang]}</b><p>${yearNote(a.god).description[lang]}</p></div><span class="year-marker">${a.date === readingDate ? t('所选', 'Selected') : ''}</span></div>`).join('')}</div></section>`;
}
function actionPanel(topic: string) {
  if (!(topic in ACTIONS)) return '';
  const key = topic as ActionTopic;
  const chosen = ACTIONS[key].find((p) => p.id === actionSelection[key]);
  return `<section class="action-panel" id="action-${key}" aria-labelledby="action-title-${key}"><h4 id="action-title-${key}">${t('填写你的实际情况', 'Add your actual context')}</h4><p class="action-hint">${t('只有你选中的情况才算你的自述，下面的步骤由此匹配。', 'Only your chosen situation is treated as self-reported context; steps are matched to it.')}</p><div class="situation-choices">${ACTIONS[key].map((p) => `<button data-action-topic="${key}" data-situation="${p.id}" aria-pressed="${p.id === actionSelection[key]}">${p.label[lang]}</button>`).join('')}</div><div class="action-result" aria-live="polite">${chosen ? `<p class="reported-context"><b>${t('你填写的现状', 'YOUR REPORTED CONTEXT')}</b>${chosen.label[lang]}</p><p class="matched-advice-label">${t('针对这件事的建议', 'SUGGESTIONS FOR THIS SITUATION')}</p><h5>${chosen.title[lang]}</h5><ol>${chosen.steps.map((s) => `<li>${s[lang]}</li>`).join('')}</ol><blockquote>${chosen.example[lang]}</blockquote><p class="action-check"><b>${t('做完怎么看', 'What to check')}</b>${chosen.check[lang]}</p><button class="text-button" data-clear-action="${key}">${t('收起这条建议', 'Clear this choice')}</button>` : `<p class="action-empty">${t('尚未填写实际情况。没有符合的可以跳过。', 'No actual context reported. Skip if none fits.')}</p>`}</div></section>`;
}
function chapterView(c: ReturnType<typeof buildReading>['chapters'][number], index: number) {
  const report = c.id === 'timing' ? buildReading(result, readingDate) : null;
  const plain = c.everyday,
    analysis = plain.analysis,
    adjustment = plain.adjustment;
  return `<article class="chapter" id="chapter-${c.id}"><div class="chapter-label"><span>0${index + 1}</span><h2>${plain.title[lang]}</h2><span class="chapter-symbol" aria-hidden="true">${['✳', '↗', '◒', '∞', '✧', '☾'][index]}</span></div>
    <section class="analysis-section" aria-label="${t('命理倾向分析', 'Symbolic analysis')}"><div class="reading-section-label">${c.id === 'health' ? t('现状从哪里来', 'SOURCE OF ACTUAL CONTEXT') : t('命理倾向分析', 'SYMBOLIC ANALYSIS')}</div>
    <div class="professional-note"><span>${t('命理说法', 'TRADITIONAL TERM')}</span><p>${plain.professional[lang]}</p></div>
    <h3>${analysis.headline[lang]}</h3><div class="everyday-reading"><span class="plain-label">${t('说白了', 'IN EVERYDAY WORDS')}</span>${analysis.notes.map((p) => `<p>${p[lang]}</p>`).join('')}</div>
    ${analysis.strength ? `<div class="trait-row"><b>${t('可能的长处', 'POSSIBLE STRENGTH')}</b><p>${analysis.strength[lang]}</p></div>` : ''}
    ${analysis.pitfall ? `<div class="trait-row pitfall"><b>${t('容易卡住的地方', 'POSSIBLE FRICTION')}</b><p>${analysis.pitfall[lang]}</p></div>` : ''}
    ${report ? `<div class="time-controls"><div><label for="reading-date">${t('换个日期看看', 'Try another date')}</label><input type="date" id="reading-date" min="1901-01-01" max="2199-12-31" value="${readingDate}"/></div><details class="cycle-options"><summary>${t('还想看十年的阶段？', 'Explore a ten-year cycle?')}</summary>${result.pillars.length === 4 ? `<label for="cycle-direction">${t('选择传统大运公式', 'Choose a traditional convention')}</label><select id="cycle-direction">${option('none', result.input.direction, '暂不叠加大运', 'Annual reading only')}${option('male', result.input.direction, '男命 · 阳顺阴逆', 'Male convention')}${option('female', result.input.direction, '女命 · 阴顺阳逆', 'Female convention')}</select>` : `<p>${t('出生时辰未知，暂不计算大运。', 'An unknown hour leaves cycles uncalculated.')}</p>`}<p>${t('这是传统命理里约十年一段的说法，不是这十年一定会发生什么。', 'This is a traditional roughly ten-year cycle, not a forecast of events.')}</p></details></div><p id="timing-status" role="status"></p>${yearComparison(report)}` : ''}
    <details class="evidence"><summary>${t('这句话怎么来的？看依据', 'How was this derived?')} <span>＋</span></summary><div class="technical-reading"><p class="term-note">${c.plain.term[lang]}</p>${c.findings.map((f) => `<section class="technical-finding"><h4>${f.question[lang]}</h4><p>${f.answer[lang]}</p><p class="finding-basis">${t('本盘依据', 'Chart basis')}：${f.basis[lang]}</p>${f.condition ? `<p>${f.condition[lang]}</p>` : ''}</section>`).join('')}${c.paragraphs.map((p) => `<p>${p[lang]}</p>`).join('')}${report?.annual.windows.length ? `<div class="cycle-scroll" aria-label="${t('大运时间轴', 'Cycle timeline')}">${report.annual.windows.map((cycle) => `<div class="cycle ${report.annual.cycle?.pillar === cycle.pillar ? 'current' : ''}"><small>${cycle.start.slice(0, 4)} — ${cycle.end.slice(0, 4)}</small><strong>${cycle.pillar}</strong><span>${report.annual.cycle?.pillar === cycle.pillar ? t('所选日期', 'Selected date') : cycle.start.slice(0, 10)}</span></div>`).join('')}</div>` : ''}<ul>${c.evidence.map((e) => `<li>${e[lang]}</li>`).join('')}</ul><p class="rule-reference">${c.rule} · <a href="https://github.com/zhuyep/mingli-lab/blob/main/docs/reading-method.md" target="_blank" rel="noreferrer">${t('方法与边界', 'Method & limits')} ↗</a></p></div></details>
    </section>
    ${adjustment ? `<section class="adjustment-section" aria-label="${t('调整建议', 'Suggestions')}"><div class="reading-section-label">${t('调整建议', 'SUGGESTIONS')}</div><p class="advice-condition">${t('如果上面的卡点或话题符合你的经历，可以试这一项；不符合就跳过。', 'If the friction or theme above fits your experience, try this; otherwise leave it aside.')}</p><h4>${adjustment.title[lang]}</h4>${adjustment.notes.map((p) => `<p>${p[lang]}</p>`).join('')}${adjustment.example ? `<aside class="life-example"><span>${t('可以这样做 · 举例', 'AN EXAMPLE OF WHAT TO TRY')}</span><p>${adjustment.example[lang]}</p></aside>` : ''}${c.id in ACTIONS ? `<details class="situation-tools" ${actionSelection[c.id as ActionTopic] ? 'open' : ''}><summary>${t('有具体困扰？选填现状，再看对应步骤', 'Have a specific concern? Add context for matching steps')}</summary>${actionPanel(c.id)}</details>` : ''}</section>` : ''}
    ${c.id === 'health' ? sleepPanel() : ''}
    </article>`;
}

function board() {
  const report = buildReading(result, readingDate);
  return `<section class="board" id="results" tabindex="-1" aria-label="${t('命书结果', 'Your reading')}"><div class="result-top"><button id="edit" class="text-button">← ${t('修改生辰', 'Edit details')}</button><span>${isExample ? t('示例命书', 'SAMPLE BOOK') : t('私人命书', 'YOUR BOOK')}</span><button data-export="reading" class="text-button">${t('保存命书', 'Save reading')} ↓</button></div><div class="book-spread"><aside class="book-index"><span class="index-seal" aria-hidden="true">✳</span><p>${t('慢慢读，也没关系', 'TAKE YOUR TIME')}</p><nav aria-label="${t('命书目录', 'Reading chapters')}">${report.chapters.map((c, i) => `<a href="#chapter-${c.id}"><small>0${i + 1}</small>${c.everyday.title[lang]}</a>`).join('')}</nav><small class="index-note">${t('先看风格<br/>再谈调整', 'Style first.<br/>Suggestions next.')}</small></aside><div class="book-pages"><div class="reading-hero"><span class="form-kicker">${t('见字如面，这一页写给你。', 'A NOTE TO YOURSELF.')}</span><h1>${t('先看你的风格，<br/>再谈怎么调整。', 'Understand the style.<br/>Then consider a change.')}</h1><p class="hero-note">${t('“命理倾向分析”讲这张盘对应的风格、长处和卡点；“调整建议”另起一栏。倾向不等于已确认的现状，实际遇到什么由你补充。', 'Symbolic analysis describes a style, strengths and possible friction. Suggestions have their own section. Actual circumstances come from you, not the chart.')}</p><details class="chart-summary"><summary>${t('你的八字', 'Your chart')} · ${result.pillars.map((p) => p.text).join(' · ')} ＋</summary><p>${report.title[lang]} · ${report.subtitle[lang]}</p><div class="simple-pillars">${Array.from(
    { length: 4 },
    (_, i) => {
      const p = result.pillars[i];
      return `<div class="${i === 2 ? 'is-day' : ''}"><span>${pos(i)}</span><strong>${p?.stem ?? '—'}${p?.branch ?? '—'}</strong><small>${p ? godName(p.god) : t('时辰未知', 'Unknown hour')}</small></div>`;
    },
  ).join(
    '',
  )}</div><p class="result-meta">${result.input.mode === 'solar' ? esc(result.input.date) + ' · ' + esc(result.input.time) + ' · UTC+8' : t('手动四柱 · 历法对应未经核验', 'Manual pillars · calendar correspondence unchecked')}</p></details><small class="reading-note">${t('分析回答“像什么样的人”；建议回答“如果符合，可以怎么改”。', 'Analysis describes a style; suggestions describe a possible change if it fits.')}</small></div><div id="chapters">${report.chapters.map(chapterView).join('')}</div><section class="reader-questions"><h2>${t('读到这里，你也许想问', 'Questions along the way')}</h2><div class="question-buttons"><button data-question="roots">${t('为什么同一天出生，解读会不同？', 'Why can the same birthday read differently?')}</button><button data-question="balance">${t('缺什么，真的就要补什么？', 'Do missing symbols need fixing?')}</button><button data-question="timing">${t('能看出今年会发生什么吗？', 'Can this tell me what will happen?')}</button></div><div id="question-answer" role="status"></div><small>${t('按本卷规则解释 · 全程本地', 'Rule-based explanations · entirely local')}</small></section><div class="deep-reading"><h2>${t('附录 · 查盘与校对', 'Appendix · chart & conventions')}</h2><details><summary>${t('四柱、十神与五行', 'Pillars, roles & phases')}<span>＋</span></summary><div class="detail-body">${pillarCards()}<div id="explanation">${explanation()}</div><div class="element-counts">${ELEMENTS.map((e, i) => `<div><b>${elName(e)}</b><span>${'●'.repeat(result.counts[i]) || '—'}</span><strong>${result.counts[i]}</strong></div>`).join('')}</div><p class="caption">${t('显性字位计数，不代表五行力量。', 'Visible-symbol counts, not phase strength.')}</p><div id="appendix-luck">${luckPanel()}</div><div class="relations">${result.relations.map((r) => `<div class="relation"><strong>${r.branches}</strong><span>${t(r.kind, namesEN[r.kind])}</span><small>${r.positions.map(pos).join(' / ')}</small></div>`).join('')}</div></div></details><details><summary>${t('晚上 11 点，算哪一天？', 'Which day begins at 11 pm?')}<span>＋</span></summary><div class="detail-body">${comparison()}</div></details><details><summary>${t('历法依据与数据导出', 'Calendar trail & data export')}<span>＋</span></summary><div class="detail-body">${provenance()}<button data-export="svg" class="secondary">${t('保存四柱卡片', 'Save chart card')} ↓</button><button data-export="json" class="secondary">${t('导出计算数据', 'Export chart JSON')} ↓</button><p class="caption">${t('保存命书会带上已选的做法；作息回答不保存。文件含四柱，JSON 还含原始生辰，请自行保管。', 'Readings and cards contain pillars; JSON also includes raw birth details. Keep them private.')}</p></div></details></div><p class="colophon">${t('天机可问，人生自书。', 'Read the symbols. Write your own life.')}<span>天机簿 · TIANJI BU</span></p></div></div></section>`;
}
function render() {
  document.body.classList.toggle('reading-open', showingResult);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('天机簿 · 天机可问，人生自书', 'Tianji Bu · A personal book of BaZi');
  app.innerHTML = `<a class="skip-link" href="${showingResult ? '#results' : '#workspace'}">${t('跳至主要内容', 'Skip to content')}</a><header class="site-header"><button class="brand" id="home" aria-label="${t('天机簿首页', 'Tianji Bu home')}"><img src="./mark.svg" width="34" height="34" alt=""/><strong>天机簿</strong><span>TIANJI BU</span></button><nav><span class="nav-note">${t('天机可问，人生自书。', 'YOUR LIFE IS STILL YOURS.')}</span><button id="language">${lang === 'zh' ? 'English' : '中文'}</button></nav></header><main>${showingResult ? board() : form()}</main><footer><span>天机簿 · TIANJI BU <small>v0.7.0</small></span><p>${t('传统文化体验，仅供娱乐与自我思考。', 'A cultural experience for entertainment and reflection.')}</p><a href="https://github.com/zhuyep/mingli-lab" target="_blank" rel="noreferrer">${t('开源于 GitHub', 'Open source on GitHub')} ↗</a></footer><div id="toast" class="toast" role="status"></div>`;
}
function showResult() {
  actionSelection = {};
  sleepCheck = { rhythm: 'unknown', quality: 'unknown' };
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

  if (button.dataset.actionTopic && button.dataset.situation) {
    const topic = button.dataset.actionTopic as ActionTopic;
    if (ACTIONS[topic]?.some((p) => p.id === button.dataset.situation)) {
      actionSelection[topic] = button.dataset.situation;
      document.querySelector(`#action-${topic}`)!.outerHTML = actionPanel(topic);
      document
        .querySelector<HTMLButtonElement>(
          `[data-action-topic="${topic}"][data-situation="${actionSelection[topic]}"]`,
        )
        ?.focus({ preventScroll: true });
    }
  }
  if (button.dataset.clearAction) {
    const topic = button.dataset.clearAction as ActionTopic;
    delete actionSelection[topic];
    document.querySelector(`#action-${topic}`)!.outerHTML = actionPanel(topic);
    document
      .querySelector<HTMLButtonElement>(`[data-action-topic="${topic}"]`)
      ?.focus({ preventScroll: true });
  }
  if (button.dataset.question) {
    const report = buildReading(result, readingDate);
    const answers = {
      roots: t(
        `同一天出生，也可能因为出生时刻不同，多出不同的一组信息。传统八字会一起看年、月、日、时，不只看代表自己的那个字。就像不能只凭一个习惯，就判断一个人的全部性格。`,
        `Sharing ${result.dayMaster} does not mean sharing a reading. Month, roots and other stems change the context. This chart has month ${result.pillars[1].branch} and ${report.features.roots.length} same-phase roots; chapter one lists their positions.`,
      ),
      balance: t(
        '不一定。可以把五行想成一张食谱里的不同食材：一种少，不代表一定要加；还要看整体搭配。这张盘的具体情况在第一章里，不建议单凭“缺某个字”去改名或买东西。',
        `No. A phase absent from visible symbols may still occur in hidden stems, and low counts do not prove need. ${report.balance.lead.en}. The overview explains the conditional alternatives.`,
      ),
      timing: t(
        '不能可靠地说出会升职、发财或分手。这里把每一年的传统符号翻译成一个提醒，帮助你回看选择和习惯。它更像给自己的一道问题，不是一份已经写好的剧本。',
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
        ? readingMarkdown(result, readingDate, lang, actionSelection)
        : kind === 'svg'
          ? chartSvg(result)
          : JSON.stringify(
              {
                ...result,
                reading: buildReading(result, readingDate),
                chosenSituations: selectedActions(actionSelection),
              },
              null,
              2,
            ),
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
  if (el.id === 'sleep-rhythm' || el.id === 'sleep-quality') {
    const key = el.id === 'sleep-rhythm' ? 'rhythm' : 'quality';
    const next = { ...sleepCheck, [key]: el.value } as SleepCheck;
    sleepAdvice(next);
    sleepCheck = next;
    document.querySelector('#sleep-notes')!.innerHTML = sleepNotes();
    return;
  }
  if (el.id !== 'reading-date' && el.id !== 'cycle-direction') return;
  try {
    if (el.id === 'reading-date') {
      buildReading(result, el.value);
      readingDate = el.value;
    } else {
      result = calculate({ ...result.input, direction: el.value as Direction });
      draft.direction = el.value;
    }
    const cycleOpen = !!document.querySelector<HTMLDetailsElement>('.cycle-options')?.open;
    const evidenceOpen = !!document.querySelector<HTMLDetailsElement>('#chapter-timing .evidence')
      ?.open;
    const report = buildReading(result, readingDate);
    document.querySelector('#appendix-luck')!.innerHTML = luckPanel();
    document.querySelector('#chapter-timing')!.outerHTML = chapterView(report.chapters[5], 5);
    document.querySelector<HTMLDetailsElement>('.cycle-options')!.open = cycleOpen;
    document.querySelector<HTMLDetailsElement>('#chapter-timing .evidence')!.open = evidenceOpen;
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
