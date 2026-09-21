import { selectedActions, type ActionSelection } from './actions';
import { buildTopics } from './topics';
import { Solar } from 'lunar-typescript';
import { ELEMENTS, stemInfo, tenGod, type Chart } from './core';

export type Words = { zh: string; en: string };
const w = (zh: string, en: string): Words => ({ zh, en });
export type Chapter = {
  id: string;
  title: Words;
  lead: Words;
  paragraphs: Words[];
  evidence: Words[];
  rule: string;
};
export const READING_VERSION = 'tianji-rules-2-analysis-advice-1';
const positions = ['年支', '月支', '日支', '时支'];
const positionsEn = ['year branch', 'month branch', 'day branch', 'hour branch'];
const phaseEn = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const phase = (e: string) => phaseEn[ELEMENTS.indexOf(e)];
const groupNames = ['比劫', '食伤', '财星', '官杀', '印星'];
const groupEn = [
  'peers',
  'expression',
  'resources to manage',
  'standards and responsibility',
  'learning and support',
];
const delta = (a: string, b: string) => (ELEMENTS.indexOf(b) - ELEMENTS.indexOf(a) + 5) % 5;

export function features(chart: Chart) {
  const day = stemInfo(chart.dayMaster).element;
  const month = chart.pillars[1];
  const monthMain = month.hidden[0];
  const monthElement = stemInfo(monthMain.stem).element;
  const monthRelation = delta(day, monthElement);
  const roots = chart.pillars.flatMap((p, position) =>
    p.hidden
      .filter((h) => stemInfo(h.stem).element === day)
      .map((h) => ({
        position,
        branch: p.branch,
        stem: h.stem,
        main: p.hidden[0].stem === h.stem,
      })),
  );
  const visible = chart.pillars.flatMap((p, position) =>
    position === 2 ? [] : [{ position, stem: p.stem, group: delta(day, p.element) }],
  );
  const support = visible.filter((p) => p.group === 0 || p.group === 4);
  const drain = visible.filter((p) => p.group > 0 && p.group < 4);
  const exposed = chart.pillars.flatMap((p, position) =>
    p.hidden
      .filter((h) => visible.some((v) => v.stem === h.stem))
      .map((h) => ({ position, branch: p.branch, stem: h.stem, god: h.god })),
  );
  const complete = chart.pillars.length === 4;
  const concentrated =
    new Set(chart.pillars.flatMap((p) => [p.element, p.branchElement])).size === 1 ||
    new Set(
      chart.pillars.flatMap((p) => [p.element, ...p.hidden.map((h) => stemInfo(h.stem).element)]),
    ).size <= 2;
  // A conservative project heuristic, not a classical formula or a fitted prediction model.
  // Earth months and concentrated charts are deliberately withheld from this simple classifier.
  let strength: 'supported' | 'drained' | 'mixed' | 'withheld' = 'mixed';
  if (!complete || concentrated || monthElement === '土') strength = 'withheld';
  else if (
    (monthRelation === 0 || monthRelation === 4) &&
    roots.some((r) => r.main) &&
    support.length >= 1 &&
    drain.length <= 1
  )
    strength = 'supported';
  else if (monthRelation !== 0 && monthRelation !== 4 && !roots.length && support.length <= 1)
    strength = 'drained';
  return {
    day,
    monthElement,
    monthMain,
    monthRelation,
    roots,
    visible,
    support,
    drain,
    exposed,
    complete,
    concentrated,
    strength,
  };
}

const theme: Words[] = [
  w('自主与协作', 'Independence & collaboration'),
  w('表达与创造', 'Expression & creation'),
  w('投入与回报', 'Effort & exchange'),
  w('标准与责任', 'Standards & responsibility'),
  w('理解与积累', 'Understanding & learning'),
];
const personality: Words[] = [
  w(
    '比劫在传统象征中关注“我与同伴”。可以把它读成对自主、平等和共同立场的重视：有主见时能稳定团队，也可能在意见相左时不愿退让。',
    'The peer theme concerns autonomy and equals. As a symbolic reading, it invites reflection on independence and shared ground: conviction can steady a group, while disagreement can become a contest of wills.',
  ),
  w(
    '食伤关注“把内在变成作品”。传统解读常从表达、创造和改进切入：长处可能是把复杂感受说清、把想法做出来；另一面则是想得快、说得快，给倾听留下的时间较少。',
    'Expression turns inner ideas into something others can see. This traditional theme suggests reflecting on making, explaining and improving. Its tension is between quick expression and leaving enough space to listen.',
  ),
  w(
    '财星关注“我如何安排外部资源”。这里可读成对实际结果、交换和投入产出的留意：能把事情往落地方向推，也可能过早用结果衡量一段尚需生长的过程。',
    'The wealth category symbolically concerns managing external resources. It can frame a reflection on practical outcomes and exchange, with a tension between getting things done and measuring a developing process too early.',
  ),
  w(
    '官杀关注“我如何回应外部标准”。传统解读会留意秩序、责任和约束：认真履约是一种力量，但如果时时对照标准，也可能很难允许自己试错。',
    'The authority category concerns external standards. It offers a frame for responsibility and commitments, while asking whether constant self-monitoring leaves enough room for trial and error.',
  ),
  w(
    '印星关注“什么在支持我”。传统解读常落在学习、理解、照顾与经验积累：愿意弄清来龙去脉，也需要留意准备是否已经足够，能不能从理解迈向行动。',
    'The resource category concerns what sustains you: learning, context, care and accumulated experience. Its reflective question is when preparation is sufficient and understanding can become action.',
  ),
];
const work: Words[] = [
  w(
    '在工作议题上，可先观察自己如何与同级协作：分工清楚时，自主性较容易转成推进力；职责含混时，则容易把对事的分歧变成对立场的坚持。',
    'For work, observe collaboration among equals. Clear responsibilities can turn autonomy into momentum; vague roles can turn a practical disagreement into a struggle over position.',
  ),
  w(
    '在工作议题上，可留意“想法—作品—反馈”这条链。先做出能被别人评价的东西，再修订，通常比一直解释自己的想法更容易看见真实差距。',
    'For work, consider the chain from idea to artifact to feedback. A reviewable piece of work can expose practical gaps more clearly than repeatedly explaining an idea.',
  ),
  w(
    '在工作议题上，可留意资源统筹、履约和成果交付。把时间、投入、责任与验收说清楚，有助于分辨眼前忙碌究竟换来了什么。',
    'For work, reflect on coordination, delivery and commitments. Making time, resources, responsibilities and acceptance criteria explicit helps separate activity from an actual result.',
  ),
  w(
    '在工作议题上，可留意自己与规则的关系：哪些标准保证质量，哪些习惯只是增加负担。把“必须做到”和“希望做到”分开，责任感才更容易持续。',
    'For work, examine your relationship with rules: which standards protect quality, and which habits only add burden? Separating requirements from preferences can make responsibility more sustainable.',
  ),
  w(
    '在工作议题上，可留意知识能否转成别人用得上的成果。把积累整理成一个说明、一份方案或一次帮助，让“知道很多”有机会变成具体贡献。',
    'For work, ask whether accumulated knowledge becomes something others can use: an explanation, a proposal or a concrete piece of help.',
  ),
];

export function todayInChina() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function asSolar(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('请选择完整日期 / Choose a complete date');
  const [y, m, d] = date.split('-').map(Number);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (
    y < 1901 ||
    y > 2199 ||
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  )
    throw new Error('日期范围为 1901–2199 / Date range: 1901–2199');
  return Solar.fromYmdHms(y, m, d, 12, 0, 0);
}

export function cycleWindows(chart: Chart) {
  if (!chart.luck?.start) return [];
  const parts = chart.luck.start.split(/[- :]/).map(Number);
  const start = Solar.fromYmdHms(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]);
  return chart.luck.pillars.map((pillar, i) => ({
    pillar,
    start: start.nextYear(i * 10).toYmdHms(),
    end: start.nextYear((i + 1) * 10).toYmdHms(),
  }));
}

const pairTypes: Record<string, string[]> = {
  六冲: ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'],
  六合: ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'],
  六害: ['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'],
};
export function annualContext(chart: Chart, date: string) {
  const solar = asSolar(date);
  const at = solar.toYmdHms();
  const pillar = solar.getLunar().getYearInGanZhiExact();
  const windows = cycleWindows(chart);
  const cycle = windows.find((c) => at >= c.start && at < c.end) ?? null;
  const links: { target: string; targetEn: string; branches: string; kind: string }[] = [];
  const targets = chart.pillars.map((p, i) => ({
    branch: p.branch,
    target: positions[i],
    targetEn: positionsEn[i],
  }));
  if (cycle)
    targets.push({ branch: cycle.pillar[1], target: '所处大运', targetEn: 'the selected cycle' });
  for (const target of targets)
    for (const [kind, pairs] of Object.entries(pairTypes)) {
      const pair = target.branch + pillar[1];
      if (pairs.includes(pair) || pairs.includes([...pair].reverse().join('')))
        links.push({ ...target, branches: pair, kind });
    }
  return { date, pillar, god: tenGod(chart.dayMaster, pillar[0]).name, cycle, windows, links };
}

export function buildStructureReading(chart: Chart, date = todayInChina()) {
  const f = features(chart);
  const annual = annualContext(chart, date);
  const d = ELEMENTS.indexOf(f.day);
  const resource = ELEMENTS[(d + 4) % 5],
    output = ELEMENTS[(d + 1) % 5],
    wealth = ELEMENTS[(d + 2) % 5];
  const rootText = f.roots.length
    ? f.roots
        .map((r) => `${positions[r.position]}${r.branch}藏${r.stem}（${r.main ? '本气' : '兼藏'}）`)
        .join('、')
    : '所列地支藏干中未见同类根气';
  const rootEn = f.roots.length
    ? f.roots
        .map(
          (r) =>
            `${positionsEn[r.position]} ${r.branch} contains ${r.stem} (${r.main ? 'main qi' : 'other hidden qi'})`,
        )
        .join('; ')
    : 'No same-phase root appears in the supplied hidden stems';
  const supportText = f.support.length
    ? f.support.map((v) => `${chart.pillars[v.position].text}之${v.stem}`).join('、')
    : '其余天干未见比劫或印星';
  const exposedText = f.exposed.length
    ? f.exposed.map((r) => `${r.branch}中${r.stem}见于天干`).join('、')
    : '未发现藏干与年、月、时干同字透出';
  const state = {
    supported: w('生扶较足，留意气的出口', 'Support is visible; consider its outlet'),
    drained: w('承泄较多，先看支持从何而来', 'Outward demands lead; consider support'),
    mixed: w('生扶与耗泄并见，需要兼看两端', 'Support and outward demands coexist'),
    withheld: w('先读结构，强弱暂不定论', 'Read the structure before judging strength'),
  }[f.strength];
  const missingNote = !f.complete
    ? w(
        '时辰未知，以下只解释已知三柱；新增一柱可能改变强弱、取用和关系判断。',
        'The hour is unknown. These observations concern three pillars only; adding an hour may change the interpretation.',
      )
    : f.concentrated
      ? w(
          '五行较集中，可能涉及普通扶抑法之外的结构，本版不判断从格、专旺或化气格。',
          'The phases are concentrated. Structures beyond this simple balancing method may matter; special and transformed patterns are not classified.',
        )
      : f.monthElement === '土'
        ? w(
            '辰、戌、丑、未属于杂气月；本版未细分节后司令天数，也未作完整调候，因此保留强弱分歧。',
            'An Earth month contains mixed qi. This version does not resolve within-month rulership or a full climatic reading, so strength remains open.',
          )
        : w(
            '这里采用保守的扶抑初读：先看月令，再看根气与透干，不做权重打分，也不把强弱等同人生高低。',
            'This is a conservative balance reading using month, roots and visible stems. It uses no numerical strength score and does not rank a person.',
          );
  const chapters: Chapter[] = [];
  chapters.push({
    id: 'overview',
    title: w('命局总评', 'The whole chart'),
    lead: state,
    paragraphs: [
      w(
        `日主为${chart.dayMaster}${f.day}，生于${chart.pillars[1].branch}月。月支本气${f.monthMain.stem}${f.monthElement}，相对日主属于${f.monthMain.god}，所以这张盘先从“${theme[f.monthRelation].zh}”这一条线展开。月令描述环境，日主描述观察中心；两者不能互相替代。`,
        `The reference stem is ${chart.dayMaster} (${phase(f.day)}), in month branch ${chart.pillars[1].branch}. Its main hidden stem ${f.monthMain.stem} (${phase(f.monthElement)}) relates to the day stem as ${f.monthMain.god}. This gives the opening theme: ${theme[f.monthRelation].en.toLowerCase()}. The month is context, not a substitute for the whole chart.`,
      ),
      w(
        `根气方面，${rootText}；天干生扶方面，${supportText}。${f.strength === 'supported' ? '月令、生根与天干支持方向较一致，可作偏强的初步观察，重点继续看能否顺畅表达、落实。' : f.strength === 'drained' ? '月令不直接生扶，所列地支又未见同类根气，可作偏弱的初步观察，重点继续看印比是否有力。' : '这些信号未达到本版同向判读的条件，不宜只凭五行字数给出身强或身弱的结论。'}`,
        `${rootEn}. Other visible supporting stems: ${f.support.map((v) => v.stem).join(', ') || 'none'}. ${f.strength === 'supported' ? 'Month, roots and visible support align in this limited method; a supported reading is a candidate, and expression becomes the next question.' : f.strength === 'drained' ? 'The month does not directly support the day phase and no same-phase root is present; a less-supported reading is a candidate.' : 'These signals do not align enough for this method to assign a strong or weak label.'}`,
      ),
      missingNote,
    ],
    evidence: [
      w(
        `月柱 ${chart.pillars[1].text}；本气 ${f.monthMain.stem} → ${f.monthMain.god}`,
        `Month ${chart.pillars[1].text}; main qi ${f.monthMain.stem} → ${f.monthMain.god}`,
      ),
      w(rootText, rootEn),
      w(
        `透干核对：${exposedText}。`,
        `Hidden stems also visible above: ${f.exposed.map((r) => `${r.branch} → ${r.stem}`).join('; ') || 'none'}.`,
      ),
    ],
    rule: 'TJ-01 / TJ-02',
  });

  const candidate =
    f.strength === 'supported'
      ? w(
          `先看${output}的疏泄，再看${wealth}的承接`,
          `Explore ${phase(output)} as an outlet, then ${phase(wealth)} as a channel`,
        )
      : f.strength === 'drained'
        ? w(
            `先看${resource}的生扶，再看${f.day}的根基`,
            `Explore ${phase(resource)} for support and ${phase(f.day)} for roots`,
          )
        : w('保留两条路径，不硬定唯一用神', 'Keep two paths open');
  const paths =
    f.strength === 'supported'
      ? w(
          `若偏强初判成立，${f.day}生${output}，可以沿食伤疏泄这条路径观察；${output}再生${wealth}，则多一层承接。这是“如何流通”的候选，不是见到这两种五行就一定有利。`,
          `If the supported reading holds, ${phase(f.day)} generates ${phase(output)}, offering an expression pathway; ${phase(output)} then generates ${phase(wealth)}. These are candidate relationships, not automatic benefits.`,
        )
      : f.strength === 'drained'
        ? w(
            `若偏弱初判成立，${resource}生${f.day}，可先核对印星有没有根、有没有透出；同类${f.day}则提供另一条支持路径。没有出现的字，只能作为待观察因素，不能据此要求取名或佩戴某种物品。`,
            `If the less-supported reading holds, ${phase(resource)} generates ${phase(f.day)}. Examine whether that supporting phase is rooted and visible; same-phase stems provide another route. An absent symbol does not justify a purchase or a name change.`,
          )
        : w(
            `若后续核定日主有力，可以观察${output}的疏泄与${wealth}的承接；若核定承泄过多，则转看${resource}与${f.day}的生扶。当前不把两条相反路径揉成一句“都适合你”，而是把尚缺的判断保留下来。`,
            `If further analysis supports a strong day phase, examine ${phase(output)} and ${phase(wealth)}. If demands outweigh support, examine ${phase(resource)} and ${phase(f.day)} instead. These are alternative conditions, not a claim that both are equally suitable.`,
          );
  const climate = '亥子丑'.includes(chart.pillars[1].branch)
    ? w(
        '另有寒暖这一层：冬令可观察火的温暖作用，但调候与扶抑是两种问题。本版只标出季节背景，不把“冬天见火”直接定为用神。',
        'Winter adds a temperature metaphor: Fire can be examined for warmth. Climate and balance are different questions; this version does not automatically appoint Fire as the useful phase.',
      )
    : '巳午未'.includes(chart.pillars[1].branch)
      ? w(
          '另有寒暖这一层：夏令可观察水的润泽作用，但是否适用还取决于全局。本版不把“夏天见水”直接定为用神。',
          'Summer adds a temperature metaphor: Water can be examined for cooling. Whether that applies depends on the whole chart; it is not an automatic choice.',
        )
      : w(
          '季节、强弱与格局是不同观察层。用神在不同流派中也有不同含义，本章只给扶抑候选，不冒充完整格局定论。',
          'Season, balance and formal pattern classification are separate layers. Schools also define the useful phase differently; these are balance candidates only.',
        );
  chapters.push({
    id: 'balance',
    title: w('用神取舍', 'Balance & alternatives'),
    lead: candidate,
    paragraphs: [paths, climate],
    evidence: [
      w(
        `判读状态：${state.zh}。候选随月令、根气、透干重新计算。`,
        `Reading state: ${state.en}. Candidates are rebuilt from the month, roots and visible stems.`,
      ),
      missingNote,
    ],
    rule: 'TJ-03',
  });

  const visibleGroups = [...new Set(f.visible.map((v) => v.group))];
  chapters.push({
    id: 'character',
    title: w('性情处事', 'Temperament & action'),
    lead: theme[f.monthRelation],
    paragraphs: [
      personality[f.monthRelation],
      w(
        `再看外显的一面：年、月、时干出现${visibleGroups.map((g) => groupNames[g]).join('、')}。${f.visible.map((v) => `${['年干', '月干', '日干', '时干'][v.position]}${v.stem}为${tenGod(chart.dayMaster, v.stem).name}`).join('；')}。这些关系给月令主题增加不同侧面，不能把你缩成一种固定性格。`,
        `Visible stems add ${visibleGroups.map((g) => groupEn[g]).join(', ')}. Their relationships are ${f.visible.map((v) => `${v.stem}: ${tenGod(chart.dayMaster, v.stem).name}`).join('; ')}. They complicate the month theme rather than define a fixed personality.`,
      ),
      w(
        '可以对照一个具体场景：事情没按预期推进时，你更想亲自接手、表达意见、重新分配资源、明确标准，还是先弄懂原因？用实际经历检验这些描述，合不上的部分可以放下。',
        'Compare this with a real situation: when work stalls, do you take over, express an idea, rearrange resources, set a standard, or seek more context? Keep only what your experience supports.',
      ),
    ],
    evidence: [
      w(
        `月支本气 → ${f.monthMain.god}；显干（不含日干本人）→ ${f.visible.map((v) => `${v.stem}/${groupNames[v.group]}`).join('、')}。`,
        `Main month qi: ${f.monthMain.god}; visible roles excluding the day stem: ${f.visible.map((v) => `${v.stem}/${groupEn[v.group]}`).join('; ')}.`,
      ),
    ],
    rule: 'TJ-04',
  });

  const hasOutput = f.visible.some((v) => v.group === 1),
    hasWealth = f.visible.some((v) => v.group === 2);
  chapters.push({
    id: 'work',
    title: w('事业财务', 'Work & resources'),
    lead: w('把盘面的关系，放回具体的事情', 'Bring the symbols back to a concrete task'),
    paragraphs: [
      work[f.monthRelation],
      hasOutput && hasWealth
        ? w(
            `盘面显干同时有食伤与财星，可观察“${output}→${wealth}”的表达与承接路径。但只见两类符号，还不能认定食伤生财成格；根气、阻隔与身的承受力仍需核对。现实里可以用“作品有没有被需要”来检验这条类比。`,
            `Expression and wealth roles both appear in visible stems: ${phase(output)} → ${phase(wealth)}. Their presence alone does not establish a formal pattern. Roots, interruptions and support still matter. A practical reflection is whether what you make is actually needed.`,
          )
        : w(
            `显干中${hasOutput ? '有食伤而未见财星' : hasWealth ? '有财星而未见食伤' : '食伤与财星未同时出现'}，所以本版不套用“食伤生财”的完整叙事。没透出不等于不存在，藏干中仍可能有相关因素；更不等于缺少能力或收入。`,
            `Expression and wealth roles are not both visible, so this reading does not apply a complete output-to-wealth narrative. Hidden roles may still exist; a missing visible symbol says nothing about ability or income.`,
          ),
      w(
        '财星是关系名称，不是财富额度。涉及职业或投资时，把这章当作整理问题的角度；选择仍要看能力、现金流、机会和可承担的风险。',
        'The wealth role is a symbolic relationship, not an amount of money. Use it to formulate questions; actual choices require evidence about skills, cash flow, opportunities and risk.',
      ),
    ],
    evidence: [
      w(
        `食伤对应${output}；财星对应${wealth}。显干食伤：${
          f.visible
            .filter((v) => v.group === 1)
            .map((v) => v.stem)
            .join('、') || '未见'
        }；显干财星：${
          f.visible
            .filter((v) => v.group === 2)
            .map((v) => v.stem)
            .join('、') || '未见'
        }。`,
        `Expression: ${phase(output)}; wealth role: ${phase(wealth)}. Visible expression stems: ${
          f.visible
            .filter((v) => v.group === 1)
            .map((v) => v.stem)
            .join(', ') || 'none'
        }; wealth stems: ${
          f.visible
            .filter((v) => v.group === 2)
            .map((v) => v.stem)
            .join(', ') || 'none'
        }.`,
      ),
    ],
    rule: 'TJ-04 / TJ-05',
  });

  const dayLinks = chart.relations.filter((r) => r.positions.includes(2));
  const clash = dayLinks.some((r) => r.kind === '六冲'),
    combine = dayLinks.some((r) => r.kind === '六合' || r.kind === '三合组合');
  chapters.push({
    id: 'relationships',
    title: w('关系相处', 'Connection & boundaries'),
    lead:
      clash && combine
        ? w('靠近与拉扯，需要一起读', 'Connection and tension coexist')
        : clash
          ? w('遇到差异，先分辨节奏与立场', 'Distinguish pace from position')
          : combine
            ? w('愿意靠近，也要留有边界', 'Connection still needs boundaries')
            : w('从日常沟通，看彼此怎样靠近', 'Observe how connection happens'),
    paragraphs: [
      dayLinks.length
        ? w(
            `日支${chart.pillars[2].branch}与其他位置出现：${dayLinks.map((r) => `${r.branches}${r.kind}`).join('、')}。传统上常从日支讨论近身关系；在这里，它只提供一个观察互动节奏的角度，不指认某位伴侣的品行。`,
            `The day branch ${chart.pillars[2].branch} participates in ${dayLinks.map((r) => `${r.branches} (${r.kind})`).join(', ')}. Traditional readings associate this position with close relationships; here it provides a reflective angle, not a judgment of a partner.`,
          )
        : w(
            `日支${chart.pillars[2].branch}在本版所查的六合、六冲、六害及完整三合中，没有与其他柱形成已列出的组合。这只能说明这些规则未命中，不等于关系一定平顺，也不等于没有其他传统关系。`,
            `The day branch ${chart.pillars[2].branch} has no matching relationship in the supported pair and complete-triad rules. This is an absence of a rule match, not proof that relationships will be easy.`,
          ),
      clash && combine
        ? w(
            '同一盘里有合也有冲，不能用“合了就没事”把冲清掉。可以同时问：什么让你愿意靠近，什么又让你想保留距离？把两种需要说清，比急着判定关系好坏更有用。',
            'A combination does not erase a clash. Ask both what draws you close and what makes you seek distance. Naming both needs is more useful than assigning a good-or-bad label.',
          )
        : clash
          ? w(
              '“冲”可用来比喻节奏或方向相撞。发生争执时，先确认彼此是在争做法、时间还是价值判断，避免把一次分歧解释为整段关系不合。',
              'A clash can serve as a metaphor for competing directions. In disagreement, distinguish method, timing and values before treating one conflict as a verdict on the whole relationship.',
            )
          : combine
            ? w(
                '“合”可用来比喻靠近与牵连。愿意协调是长处，但一致也可能来自一方一直迁就；留意双方能否表达不同意见，而非只看表面和气。',
                'A combination can symbolize connection and entanglement. Coordination is useful, but apparent agreement may also hide one-sided accommodation. Look for room to disagree.',
              )
            : w(
                '可以从一个很小的问题开始：你需要帮助时会直接说，还是希望对方自己看出来？把期待说成可以回应的请求，是比符号标签更具体的相处线索。',
                'Start with a small question: when you need help, do you ask directly or hope the other person notices? A request that can be answered is more concrete than a symbolic label.',
              ),
    ],
    evidence: [
      w(
        `日支相关记录：${dayLinks.map((r) => `${r.positions.map((i) => positions[i]).join('/')} ${r.branches} ${r.kind}`).join('；') || '本版规则未命中'}。旬空：${chart.voidBranches.join('、')}；只登记，不按空亡删除关系。`,
        `Day-branch matches: ${dayLinks.map((r) => `${r.branches} ${r.kind}`).join('; ') || 'none in supported rules'}. Void branches: ${chart.voidBranches.join(', ')}; no relationship is removed because of this label.`,
      ),
    ],
    rule: 'TJ-06',
  });

  const annualGroup = delta(f.day, stemInfo(annual.pillar[0]).element);
  const cycleText = annual.cycle
    ? w(
        `按所选日期，你处在${annual.cycle.pillar}运（${annual.cycle.start.slice(0, 10)}至${annual.cycle.end.slice(0, 10)}前）。运干${annual.cycle.pillar[0]}为${tenGod(chart.dayMaster, annual.cycle.pillar[0]).name}；本章把运看作阶段背景，再看流年带来的关系。`,
        `The selected date falls in cycle ${annual.cycle.pillar}, from ${annual.cycle.start.slice(0, 10)} until before ${annual.cycle.end.slice(0, 10)}. Its stem is ${tenGod(chart.dayMaster, annual.cycle.pillar[0]).name}. The cycle is context for the annual relationships.`,
      )
    : w(
        !chart.luck
          ? '尚未选大运顺逆公式，先读流年与原局。下方可以补选；时辰未知时不计算大运。'
          : chart.luck.start
            ? '所选日期在已列八步大运之外，或尚未到起运时刻；不硬配一段大运。'
            : '已有大运顺序，但手动四柱没有唯一出生日期，不能判断所选日期处在哪一步。',
        !chart.luck
          ? 'No cycle convention is selected. Read the annual relationships first, or choose a convention below. Unknown-hour charts omit cycles.'
          : chart.luck.start
            ? 'The selected date is before cycle start or outside the eight listed cycles; no cycle is assigned.'
            : 'The cycle order is known, but manual pillars do not identify a unique birth date, so no dated cycle is assigned.',
      );
  const relationshipText = annual.links.length
    ? annual.links
        .map((l) => `${l.target}${l.branches[0]}与流年${l.branches[1]}${l.kind}`)
        .join('；')
    : '本版六冲、六合、六害中未见流年新增的配对';
  chapters.push({
    id: 'timing',
    title: w('大运流年', 'Cycles & the year'),
    lead: w(
      `${annual.pillar}流年 · ${theme[annualGroup].zh}`,
      `${annual.pillar} year · ${theme[annualGroup].en}`,
    ),
    paragraphs: [
      cycleText,
      w(
        `流年天干${annual.pillar[0]}相对${chart.dayMaster}为${annual.god}，对应“${theme[annualGroup].zh}”主题。${relationshipText}。这些新增关系需要放回前面尚带条件的命局判断，不能直接换算成年份吉凶。`,
        `Annual stem ${annual.pillar[0]} is ${annual.god} relative to ${chart.dayMaster}, giving the theme ${theme[annualGroup].en.toLowerCase()}. ${annual.links.length ? annual.links.map((l) => `${l.targetEn}: ${l.branches} ${l.kind}`).join('; ') : 'No annual pair matches the supported clash, combination or harm rules'}. These additions depend on the conditional whole-chart reading; they are not a yearly fortune score.`,
      ),
      w(
        `这一页可以留给自己一个年度问题：${['哪些事适合独立承担，哪些值得邀请同伴？', '哪一个想法值得做成可以被看见的成果？', '时间和资源，是否投在真正重视的事情上？', '哪些责任愿意承担，哪些边界需要说明？', '今年最值得深入理解的一件事是什么？'][annualGroup]}`,
        `A question for this year: ${['What should you own yourself, and where would a collaborator help?', 'Which idea deserves to become something others can see?', 'Are time and resources going toward what actually matters?', 'Which responsibilities do you choose, and which boundaries need stating?', 'What is worth understanding deeply this year?'][annualGroup]}`,
      ),
    ],
    evidence: [
      w(
        `核对日 ${date} 12:00（UTC+8）；流年以立春换年：${annual.pillar}。交运按起运时刻每十周年切换，起点含、终点不含。`,
        `Reference: ${date} 12:00 (UTC+8); annual pillar changes at Lichun: ${annual.pillar}. Cycles use ten-year anniversaries of the start timestamp, inclusive start and exclusive end.`,
      ),
      w(
        '流年新增关系当前仅查六冲、六合、六害；未推演天干合化、岁运三合、刑破或事件应期。',
        'Annual additions cover clash, pair combination and harm only; stem transformation, annual triads, punishments and event timing are not evaluated.',
      ),
    ],
    rule: 'TJ-07',
  });
  return {
    version: READING_VERSION,
    features: f,
    title: w(
      `${chart.dayMaster}${f.day} · ${chart.pillars[1].branch}月命书`,
      `${chart.dayMaster} ${phase(f.day)} · ${chart.pillars[1].branch} month`,
    ),
    subtitle: state,
    chapters,
    annual,
  };
}

export function buildReading(chart: Chart, date = todayInChina()) {
  const structure = buildStructureReading(chart, date);
  const solar = asSolar(date);
  const nearby = [-1, 0, 1]
    .map((offset) => solar.nextYear(offset).toYmd())
    .filter((d) => d >= '1901-01-01' && d <= '2199-12-31')
    .map((d) => annualContext(chart, d));
  return {
    ...structure,
    balance: structure.chapters.find((c) => c.id === 'balance')!,
    chapters: buildTopics(chart, structure, nearby),
    nearby,
  };
}

export function readingMarkdown(
  chart: Chart,
  date: string,
  lang: 'zh' | 'en',
  selection: ActionSelection = {},
) {
  const report = buildReading(chart, date);
  return [
    `# 天机簿 · Tianji Bu`,
    report.title[lang],
    `> ${lang === 'zh' ? '传统文化解读，不是确定的人生预测。含四柱资料，请自行保管。' : 'A cultural reading, not a prediction. Contains personal chart data; keep it private.'}`,
    chart.pillars.map((p) => p.text).join(' '),
    ...report.chapters.map((c) => {
      const plain = c.everyday;
      const action = selectedActions(selection).find((a) => a.topic === c.id)?.plan;
      const analysis = plain.analysis,
        adjustment = plain.adjustment;
      return `## ${plain.title[lang]}\n\n### ${lang === 'zh' ? (c.id === 'health' ? '现状从哪里来' : '命理倾向分析') : c.id === 'health' ? 'Source of actual context' : 'Symbolic analysis'}\n\n${lang === 'zh' ? '命理说法' : 'Traditional term'}：${plain.professional[lang]}\n\n**${analysis.headline[lang]}**\n\n${analysis.notes.map((p) => p[lang]).join('\n\n')}${analysis.strength ? '\n\n**' + (lang === 'zh' ? '可能的长处' : 'Possible strength') + '**：' + analysis.strength[lang] : ''}${analysis.pitfall ? '\n\n**' + (lang === 'zh' ? '容易卡住的地方' : 'Possible friction') + '**：' + analysis.pitfall[lang] : ''}\n\n<details><summary>${lang === 'zh' ? '这句话怎么来的？看依据' : 'How was this derived?'}</summary>\n\n${c.plain.term[lang]}\n\n${c.findings.map((f) => `${f.answer[lang]}\n\n> ${lang === 'zh' ? '本盘依据' : 'Chart basis'}：${f.basis[lang]}${f.condition ? '\n\n' + f.condition[lang] : ''}`).join('\n\n')}\n\n${c.paragraphs.map((p) => p[lang]).join('\n\n')}\n\n${c.evidence.map((e) => '- ' + e[lang]).join('\n')}\n\n${c.rule}\n\n</details>${adjustment ? `\n\n### ${lang === 'zh' ? '调整建议' : 'Suggestions'}\n\n${lang === 'zh' ? '如果上述卡点或话题符合你的经历，可以尝试；不符合就跳过。' : 'Try this if the friction or theme fits your experience; otherwise leave it aside.'}\n\n**${adjustment.title[lang]}**\n\n${adjustment.notes.map((p) => p[lang]).join('\n\n')}${adjustment.example ? '\n\n' + (lang === 'zh' ? '可以这样做 · 举例：' : 'Example of what to try: ') + adjustment.example[lang] : ''}` : ''}${action ? `\n\n#### ${lang === 'zh' ? '你填写的现状' : 'Your reported context'}\n\n${action.label[lang]}\n\n#### ${lang === 'zh' ? '针对这件事的建议' : 'Suggestions for this situation'}\n\n${action.title[lang]}\n\n${action.steps.map((s, i) => `${i + 1}. ${s[lang]}`).join('\n')}\n\n${action.example[lang]}\n\n${action.check[lang]}` : ''}`;
    }),
    `### ${lang === 'zh' ? '相邻年份对照（同月日）' : 'Adjacent years (same month/day)'}\n\n${report.nearby.map((a) => `- ${a.date}: ${a.pillar} · ${a.god} · ${a.links.map((l) => `${lang === 'zh' ? l.target : l.targetEn} ${l.branches} ${l.kind}`).join('; ') || (lang === 'zh' ? '无支持规则命中' : 'No supported pair')}`).join('\n')}`,
    `Method: ${READING_VERSION}\nhttps://github.com/zhuyep/mingli-lab/blob/main/docs/reading-method.md`,
  ].join('\n\n');
}
