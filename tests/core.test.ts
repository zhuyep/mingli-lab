import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { Solar, LunarUtil } from 'lunar-typescript';
import {
  calculate,
  compareZi,
  tenGod,
  voidBranches,
  STEMS,
  JIAZI,
  type Input,
} from '../src/core.ts';
import { chartSvg } from '../src/export.ts';
const solar = (date = '2005-12-23', time = '08:37'): Extract<Input, { mode: 'solar' }> => ({
  mode: 'solar',
  date,
  time,
  sect: 2,
  direction: 'none',
});

// Functional fixtures from the MIT-licensed upstream tests; see THIRD_PARTY_NOTICES.md.
test('published reference chart, hidden stems and ten gods', () => {
  const c = calculate(solar());
  assert.deepEqual(
    c.pillars.map((p) => p.text),
    ['乙酉', '戊子', '辛巳', '壬辰'],
  );
  assert.deepEqual(
    c.pillars.map((p) => p.god),
    ['偏财', '正印', '日主', '伤官'],
  );
  assert.deepEqual(c.pillars[3].hidden, [
    { stem: '戊', god: '正印' },
    { stem: '乙', god: '偏财' },
    { stem: '癸', god: '食神' },
  ]);
  assert.deepEqual(c.counts, [1, 1, 2, 2, 2]);
});
test('late Zi separates day boundary from hour stem', () => {
  const c = compareZi(solar('1988-02-15', '23:30'));
  assert.deepEqual(
    c.midnight.pillars.map((p) => p.text),
    ['戊辰', '甲寅', '庚子', '戊子'],
  );
  assert.deepEqual(
    c.lateZi.pillars.map((p) => p.text),
    ['戊辰', '甲寅', '辛丑', '戊子'],
  );
  assert.deepEqual(c.changed, [2]);
  assert.notEqual(c.midnight.pillars[1].god, c.lateZi.pillars[1].god);
});
test('22:59 agrees, 23:00 diverges, midnight uses the next day', () => {
  assert.deepEqual(compareZi(solar('1988-02-15', '22:59')).changed, []);
  assert.deepEqual(compareZi(solar('1988-02-15', '23:00')).changed, [2]);
  assert.equal(calculate(solar('1988-02-16', '00:00')).pillars[2].text, '辛丑');
});
test('Li Chun changes year and month at the library term boundary, not February 4 midnight', () => {
  const jie = Solar.fromYmd(2024, 2, 4).getLunar().getJieQiTable()['立春'];
  const before = `${String(jie.getHour()).padStart(2, '0')}:${String(jie.getMinute() - 1).padStart(2, '0')}`;
  const after = `${String(jie.getHour()).padStart(2, '0')}:${String(jie.getMinute() + 1).padStart(2, '0')}`;
  const a = calculate(solar('2024-02-04', before));
  const b = calculate(solar('2024-02-04', after));
  assert.deepEqual(
    a.pillars.slice(0, 2).map((p) => p.text),
    ['癸卯', '乙丑'],
  );
  assert.deepEqual(
    b.pillars.slice(0, 2).map((p) => p.text),
    ['甲辰', '丙寅'],
  );
  assert.equal(calculate(solar('2024-02-04', '00:00')).pillars[0].text, '癸卯');
});
test('all 100 ten-god mappings agree with the independently stored upstream table', () => {
  for (const day of STEMS)
    for (const target of STEMS)
      assert.equal(tenGod(day, target).name, LunarUtil.SHI_SHEN[day + target]);
  for (const day of STEMS) assert.equal(new Set(STEMS.map((s) => tenGod(day, s).name)).size, 10);
});
test('all 60 day pillars have two void branches outside the ten-day group', () => {
  for (const [i, p] of JIAZI.entries()) {
    const voids = voidBranches(p),
      group = JIAZI.slice(Math.floor(i / 10) * 10, Math.floor(i / 10) * 10 + 10);
    assert.equal(voids.length, 2);
    assert.ok(group.every((g) => !voids.includes(g[1])));
  }
  assert.deepEqual(voidBranches('戊辰'), ['戌', '亥']);
});
test('missing hour stays missing and prevents timed cycles', () => {
  const c = calculate({ mode: 'pillars', pillars: ['乙酉', '戊子', '辛巳'], direction: 'male' });
  assert.equal(c.pillars.length, 3);
  assert.equal(c.luck, null);
  assert.equal(
    c.counts.reduce((a, b) => a + b, 0),
    6,
  );
  assert.equal(c.trace.yearBoundary, null);
});
test('clash and combination coexist; repeated positions remain distinct', () => {
  const c = calculate({
    mode: 'pillars',
    pillars: ['丙申', '戊戌', '戊辰', '辛酉'],
    direction: 'male',
  });
  assert.ok(c.relations.some((r) => r.kind === '六冲' && r.branches === '戌辰'));
  assert.ok(c.relations.some((r) => r.kind === '六合' && r.branches === '辰酉'));
  assert.equal(c.luck?.pillars[0], '己亥');
  assert.equal(c.luck?.start, null);
});
test('all four traditional forward/reverse conditions', () => {
  for (const [year, direction, forward] of [
    ['甲子', 'male', true],
    ['甲子', 'female', false],
    ['乙丑', 'male', false],
    ['乙丑', 'female', true],
  ] as const) {
    const c = calculate({ mode: 'pillars', pillars: [year, '戊戌', '戊辰', '辛酉'], direction });
    assert.equal(c.luck?.forward, forward);
    assert.equal(c.luck?.pillars[0], forward ? '己亥' : '丁酉');
  }
});
test('minute-based cycle offset matches the public upstream reference', () => {
  const c = calculate({ ...solar('2022-03-09', '20:51'), direction: 'male' });
  assert.deepEqual(c.luck?.offset, [8, 9, 2]);
  assert.ok(c.luck?.start?.startsWith('2030-12-12'));
});
test('invalid dates, times, sexagenary pairs and conventions are rejected', () => {
  for (const date of ['2023-02-29', '2024-02-30', '1899-01-01', '2100-01-01', '2024-13-01', ''])
    assert.throws(() => calculate(solar(date)));
  for (const time of ['24:00', '23:60', '-1:00', '8:30', ''])
    assert.throws(() => calculate(solar('2024-02-29', time)));
  assert.doesNotThrow(() => calculate(solar('2024-02-29', '12:00')));
  assert.throws(() =>
    calculate({ mode: 'pillars', pillars: ['甲丑', '戊子', '辛巳'], direction: 'none' }),
  );
  assert.throws(() => calculate({ ...solar(), sect: 3 } as unknown as Input));
});
test('SVG omits raw date and input category, retains boundary metadata and is script-free', () => {
  const c = calculate({ ...solar(), direction: 'male' });
  const svg = chartSvg(c);
  assert.ok(!svg.includes('2005-12-23'));
  assert.ok(!svg.includes('08:37'));
  assert.ok(!svg.includes('male'));
  assert.ok(svg.includes('midnight boundary'));
  assert.ok(!/<script|foreignObject|onload=|https?:\/\/[^w]/i.test(svg));
});
test('input snapshots are immutable from the caller perspective', () => {
  const input = solar();
  const chart = calculate(input);
  input.date = '2000-01-01';
  assert.equal((chart.input as typeof input).date, '2005-12-23');
});
test('host timezone never changes the chart', () => {
  const outputs = ['UTC', 'America/New_York', 'Asia/Shanghai'].map((TZ) =>
    execFileSync(
      process.execPath,
      ['--import', 'tsx', 'scripts/chart.ts', '--date', '1988-02-15', '--time', '23:30'],
      { env: { ...process.env, TZ }, encoding: 'utf8' },
    ),
  );
  assert.equal(outputs[0], outputs[1]);
  assert.equal(outputs[1], outputs[2]);
});
