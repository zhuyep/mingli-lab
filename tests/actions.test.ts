import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from '../src/core.ts';
import { buildReading, readingMarkdown } from '../src/reading.ts';
import { ACTIONS, selectedActions } from '../src/actions.ts';
const chart = () =>
  calculate({ mode: 'solar', date: '2005-12-23', time: '08:37', sect: 2, direction: 'none' });
test('no real-life situation is inferred from a birth chart or an invalid selection', () => {
  assert.deepEqual(selectedActions({}), []);
  assert.deepEqual(selectedActions({ work: 'not-a-situation' }), []);
  assert.deepEqual(selectedActions({ work: 'payment' }), []);
  assert.equal(selectedActions({ wealth: 'payment' })[0].plan.id, 'payment');
});
test('situations select distinct steps without changing the chart or its traditional reading', () => {
  const c = chart(),
    before = JSON.stringify(buildReading(c, '2026-09-21'));
  const busy = selectedActions({ work: 'busy' }),
    change = selectedActions({ work: 'change' });
  assert.notDeepEqual(busy[0].plan.steps, change[0].plan.steps);
  assert.equal(JSON.stringify(buildReading(c, '2026-09-21')), before);
  for (const plans of Object.values(ACTIONS))
    for (const p of plans) {
      assert.equal(p.steps.length, 3);
      for (const v of [p.label, p.title, ...p.steps, p.example, p.check]) assert.ok(v.zh && v.en);
    }
});
test('saved reading separates symbolic analysis, suggestions and self-reported context', () => {
  const c = chart(),
    text = readingMarkdown(c, '2026-09-21', 'zh', { wealth: 'payment' });
  const work = text.slice(text.indexOf('## 工作'), text.indexOf('## 钱与收入'));
  const analysis = work.slice(work.indexOf('### 命理倾向分析'), work.indexOf('<details>'));
  const advice = work.slice(work.indexOf('### 调整建议'));
  assert.match(analysis, /食伤与财星并见/);
  assert.match(analysis, /可能的长处/);
  assert.match(analysis, /容易卡住的地方/);
  assert.doesNotMatch(analysis, /先问别人要什么|先拿一小份|可以这样做/);
  assert.match(advice, /先问别人要什么/);
  assert.match(advice, /可以这样做 · 举例/);
  assert.ok(work.indexOf('命理倾向分析') < work.indexOf('调整建议'));
  assert.match(text, /#### 你填写的现状\n\n做了事，钱还没收到/);
  assert.doesNotMatch(readingMarkdown(c, '2026-09-21', 'zh'), /#### 你填写的现状/);
  assert.match(text, /预计哪天能付款/);
  assert.doesNotMatch(text, /### 很忙，却没成果|### 总为小事吵架/);
  assert.doesNotMatch(readingMarkdown(c, '2026-09-21', 'zh'), /预计哪天能付款/);
  assert.doesNotMatch(text, /sleepCheck|你选了经常|你选了作息/);
});
test('everyday explanation remains bilingual and changes with evidence; partial input stays partial', () => {
  const a = calculate({
    mode: 'pillars',
    pillars: ['庚申', '甲寅', '甲寅', '丙申'],
    direction: 'none',
  });
  const b = calculate({
    mode: 'pillars',
    pillars: ['戊辰', '甲寅', '甲寅', '丙申'],
    direction: 'none',
  });
  const ra = buildReading(a, '2026-09-21'),
    rb = buildReading(b, '2026-09-21');
  assert.notDeepEqual(ra.chapters[1].everyday, rb.chapters[1].everyday);
  for (const c of ra.chapters) {
    for (const s of [
      c.everyday.title,
      c.everyday.professional,
      c.everyday.analysis.headline,
      ...c.everyday.analysis.notes,
      ...(c.everyday.adjustment
        ? [c.everyday.adjustment.title, ...c.everyday.adjustment.notes]
        : []),
    ]) {
      assert.ok(s.zh && s.en);
      assert.doesNotMatch(s.zh + s.en, /undefined|NaN/);
    }
  }
  const partial = calculate({
    mode: 'pillars',
    pillars: ['庚申', '甲寅', '甲寅'],
    direction: 'none',
  });
  assert.match(
    buildReading(partial, '2026-09-21').chapters[0].everyday.analysis.notes[2].zh,
    /没有填出生时间/,
  );
});

test('descriptive portraits never use adjustment commands as their headline or observed facts', () => {
  for (const c of buildReading(chart(), '2026-09-21').chapters) {
    assert.doesNotMatch(c.everyday.analysis.headline.zh, /先问|试试|应该|需要改|别只|要先/);
  }
  const c = chart();
  const before = buildReading(c, '2026-09-21').chapters.map((x) => x.everyday.analysis);
  readingMarkdown(c, '2026-09-21', 'zh', { work: 'busy', relationships: 'arguments' });
  assert.deepEqual(
    buildReading(c, '2026-09-21').chapters.map((x) => x.everyday.analysis),
    before,
  );
  assert.match(before[0].notes[2].zh, /尚未由你确认/);
});
