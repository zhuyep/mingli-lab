import { Solar, LunarUtil } from 'lunar-typescript';

export const ENGINE = 'lunar-typescript@1.8.6';
export const STEMS = [...'甲乙丙丁戊己庚辛壬癸'];
export const BRANCHES = [...'子丑寅卯辰巳午未申酉戌亥'];
export const ELEMENTS = [...'木火土金水'];
export const JIAZI = Array.from({ length: 60 }, (_, i) => STEMS[i % 10] + BRANCHES[i % 12]);
const BRANCH_ELEMENTS = [...'水土木木土火火土金金土水'];
export type Sect = 1 | 2;
export type Direction = 'none' | 'male' | 'female';
export type Input =
  | { mode: 'solar'; date: string; time: string; sect: Sect; direction: Direction }
  | { mode: 'pillars'; pillars: string[]; direction: Direction };
export type Pillar = {
  text: string;
  stem: string;
  branch: string;
  element: string;
  branchElement: string;
  polarity: string;
  god: string;
  hidden: { stem: string; god: string }[];
};
export type Chart = {
  schemaVersion: 1;
  engine: string;
  input: Input;
  pillars: Pillar[];
  dayMaster: string;
  counts: number[];
  voidBranches: string[];
  relations: { kind: string; positions: number[]; branches: string }[];
  trace: { yearBoundary: string | null; previousJie: string | null; nextJie: string | null };
  luck: {
    forward: boolean;
    pillars: string[];
    start: string | null;
    offset: number[] | null;
  } | null;
};

export function stemInfo(stem: string) {
  const i = STEMS.indexOf(stem);
  if (i < 0) throw new Error('天干无效 / Invalid stem');
  return { element: ELEMENTS[Math.floor(i / 2)], polarity: i % 2 === 0 ? '阳' : '阴' };
}

export function tenGod(
  day: string,
  target: string,
): { name: string; relation: string; same: boolean } {
  const a = stemInfo(day),
    b = stemInfo(target);
  const delta = (ELEMENTS.indexOf(b.element) - ELEMENTS.indexOf(a.element) + 5) % 5;
  const names = [
    ['比肩', '劫财'],
    ['食神', '伤官'],
    ['偏财', '正财'],
    ['七杀', '正官'],
    ['偏印', '正印'],
  ];
  const same = a.polarity === b.polarity;
  return {
    name: names[delta][same ? 0 : 1],
    relation: ['同我', '我生', '我克', '克我', '生我'][delta],
    same,
  };
}

export function voidBranches(day: string) {
  const index = JIAZI.indexOf(day);
  if (index < 0) throw new Error('干支不在六十甲子中 / Invalid sexagenary pair');
  const start = Math.floor(index / 10) * 10;
  const occupied = JIAZI.slice(start, start + 10).map((p) => p[1]);
  return BRANCHES.filter((b) => !occupied.includes(b));
}

function parseSolar(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time))
    throw new Error('请填写完整日期和时间 / Enter a complete date and time');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    year < 1901 ||
    year > 2099 ||
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59
  )
    throw new Error('日期无效；支持 1901–2099 年，时间为 00:00–23:59 / Invalid date or time');
  // Numeric civil components intentionally avoid the browser/server timezone.
  return Solar.fromYmdHms(year, month, day, hour, minute, 0);
}

export function calculate(input: Input): Chart {
  if (!['none', 'male', 'female'].includes(input.direction))
    throw new Error('顺逆选项无效 / Invalid direction');
  if (!['solar', 'pillars'].includes(input.mode)) throw new Error('输入模式无效 / Invalid mode');
  let texts: string[];
  const trace: Chart['trace'] = { yearBoundary: null, previousJie: null, nextJie: null };
  let luck: Chart['luck'] = null;
  if (input.mode === 'solar') {
    if (![1, 2].includes(input.sect)) throw new Error('子时口径无效 / Invalid Zi-hour convention');
    const solar = parseSolar(input.date, input.time);
    const lunar = solar.getLunar();
    const eight = lunar.getEightChar();
    eight.setSect(input.sect);
    texts = [eight.getYear(), eight.getMonth(), eight.getDay(), eight.getTime()];
    trace.yearBoundary = lunar.getJieQiTable()['立春'].toYmdHms();
    const prev = lunar.getPrevJie(),
      next = lunar.getNextJie();
    trace.previousJie = `${prev.getName()} ${prev.getSolar().toYmdHms()}`;
    trace.nextJie = `${next.getName()} ${next.getSolar().toYmdHms()}`;
    if (input.direction !== 'none') {
      // Yun sect 2 is the upstream minute-based offset; distinct from EightChar sect.
      const yun = eight.getYun(input.direction === 'male' ? 1 : 0, 2);
      luck = {
        forward: yun.isForward(),
        pillars: yun
          .getDaYun(9)
          .slice(1)
          .map((d) => d.getGanZhi()),
        start: yun.getStartSolar().toYmdHms(),
        offset: [yun.getStartYear(), yun.getStartMonth(), yun.getStartDay()],
      };
    }
  } else {
    texts = [...input.pillars];
    if (texts.length !== 3 && texts.length !== 4)
      throw new Error('请按年、月、日、时填写三柱或四柱 / Enter 3 or 4 pillars');
    if (texts.some((p) => !JIAZI.includes(p)))
      throw new Error('每柱须为六十甲子中的合法字对，例如甲子 / Invalid pillar');
    if (input.direction !== 'none' && texts.length === 4) {
      const forward = (stemInfo(texts[0][0]).polarity === '阳') === (input.direction === 'male');
      const index = JIAZI.indexOf(texts[1]);
      luck = {
        forward,
        pillars: Array.from(
          { length: 8 },
          (_, i) => JIAZI[(index + (forward ? 1 : -1) * (i + 1) + 60) % 60],
        ),
        start: null,
        offset: null,
      };
    }
  }
  const dayMaster = texts[2][0];
  const pillars: Pillar[] = texts.map((p, i) => ({
    text: p,
    stem: p[0],
    branch: p[1],
    ...stemInfo(p[0]),
    branchElement: BRANCH_ELEMENTS[BRANCHES.indexOf(p[1])],
    god: i === 2 ? '日主' : tenGod(dayMaster, p[0]).name,
    hidden: (LunarUtil.ZHI_HIDE_GAN[p[1]] ?? []).map((stem) => ({
      stem,
      god: tenGod(dayMaster, stem).name,
    })),
  }));
  const counts = ELEMENTS.map((e) =>
    pillars.reduce((n, p) => n + Number(p.element === e) + Number(p.branchElement === e), 0),
  );
  const relations: Chart['relations'] = [];
  const pairs: Record<string, string[]> = {
    六冲: ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'],
    六合: ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'],
    六害: ['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'],
  };
  for (let i = 0; i < texts.length; i++)
    for (let j = i + 1; j < texts.length; j++) {
      const b = texts[i][1] + texts[j][1];
      for (const [kind, groups] of Object.entries(pairs)) {
        if (groups.includes(b) || groups.includes([...b].reverse().join('')))
          relations.push({ kind, positions: [i, j], branches: b });
      }
    }
  for (const triad of ['申子辰', '寅午戌', '巳酉丑', '亥卯未']) {
    if ([...triad].every((b) => texts.some((p) => p[1] === b))) {
      relations.push({
        kind: '三合组合',
        positions: texts.flatMap((p, i) => (triad.includes(p[1]) ? [i] : [])),
        branches: triad,
      });
    }
  }
  return {
    schemaVersion: 1,
    engine: ENGINE,
    input: structuredClone(input),
    pillars,
    dayMaster,
    counts,
    voidBranches: voidBranches(texts[2]),
    relations,
    trace,
    luck,
  };
}

export function compareZi(input: Extract<Input, { mode: 'solar' }>) {
  const midnight = calculate({ ...input, sect: 2 });
  const lateZi = calculate({ ...input, sect: 1 });
  return {
    midnight,
    lateZi,
    changed: midnight.pillars.flatMap((p, i) => (p.text !== lateZi.pillars[i].text ? [i] : [])),
  };
}
