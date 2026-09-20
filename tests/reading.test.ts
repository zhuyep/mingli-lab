import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, compareZi, type Chart } from '../src/core.ts';
import {
  annualContext,
  buildStructureReading as buildReading,
  cycleWindows,
  features,
  readingMarkdown,
} from '../src/reading.ts';
const manual = (pillars: string[], direction: 'none' | 'male' | 'female' = 'none') =>
  calculate({ mode: 'pillars', pillars, direction });
const strong = () => manual(['壬辰', '甲寅', '甲寅', '丙申']);
const weak = () => manual(['庚申', '壬午', '甲申', '丙午']);
const sample = (): Chart =>
  calculate({ mode: 'solar', date: '2022-03-09', time: '20:51', sect: 2, direction: 'male' });

test('same day stem with different month and roots gives opposing conditional paths', () => {
  const a = buildReading(strong(), '2026-09-20'),
    b = buildReading(weak(), '2026-09-20');
  assert.equal(strong().dayMaster, weak().dayMaster);
  assert.equal(a.features.strength, 'supported');
  assert.equal(b.features.strength, 'drained');
  assert.match(a.chapters[1].lead.zh, /火.*土/);
  assert.match(b.chapters[1].lead.zh, /水.*木/);
  assert.notDeepEqual(a.chapters[0], b.chapters[0]);
});
test('roots distinguish main qi, additional hidden qi, and exact stem exposure', () => {
  const f = features(strong());
  assert.ok(f.roots.some((r) => r.branch === '寅' && r.stem === '甲' && r.main));
  assert.ok(f.roots.some((r) => r.branch === '辰' && r.stem === '乙' && !r.main));
  assert.ok(f.exposed.some((r) => r.branch === '申' && r.stem === '壬'));
  assert.ok(!f.exposed.some((r) => r.stem === '乙'));
});
test('unknown hour, mixed Earth months, and concentrated charts withhold strength', () => {
  const unknown = buildReading(manual(['壬辰', '甲寅', '甲寅'], 'male'), '2026-09-20');
  assert.equal(unknown.features.strength, 'withheld');
  assert.equal(unknown.annual.cycle, null);
  assert.equal(unknown.annual.windows.length, 0);
  assert.match(unknown.chapters[0].paragraphs[2].zh, /时辰未知/);
  assert.equal(features(manual(['丙申', '戊戌', '戊辰', '辛酉'])).strength, 'withheld');
  assert.equal(features(manual(['甲寅', '甲寅', '甲寅', '甲寅'])).strength, 'withheld');
});
test('a combination never deletes a simultaneous day-branch clash', () => {
  const c = manual(['丙申', '戊戌', '戊辰', '辛酉']);
  const relation = buildReading(c, '2026-09-20').chapters[4];
  assert.match(relation.paragraphs[0].zh, /戌辰六冲/);
  assert.match(relation.paragraphs[0].zh, /辰酉六合/);
  assert.match(relation.lead.zh, /靠近与拉扯/);
});
test('annual pillar changes at Lichun, not on January 1', () => {
  const c = strong();
  assert.equal(annualContext(c, '2024-01-01').pillar, '癸卯');
  assert.equal(annualContext(c, '2024-02-03').pillar, '癸卯');
  assert.equal(annualContext(c, '2024-02-05').pillar, '甲辰');
});
test('cycle selection uses ten-year anniversaries and never guesses outside range', () => {
  const c = sample(),
    windows = cycleWindows(c);
  assert.equal(windows.length, 8);
  assert.ok(windows[0].start.startsWith('2030-12-12'));
  assert.equal(windows[0].end, windows[1].start);
  assert.equal(annualContext(c, '2030-12-11').cycle, null);
  assert.equal(annualContext(c, '2030-12-13').cycle?.pillar, windows[0].pillar);
  assert.equal(annualContext(c, '2040-12-13').cycle?.pillar, windows[1].pillar);
  assert.equal(annualContext(c, '2120-01-01').cycle, null);
  assert.equal(
    annualContext(manual(['壬辰', '甲寅', '甲寅', '丙申'], 'male'), '2026-09-20').cycle,
    null,
  );
});
test('annual relations include natal locations and the active cycle separately', () => {
  const c = strong(),
    a = annualContext(c, '2028-06-01');
  assert.equal(a.pillar, '戊申');
  assert.ok(a.links.some((l) => l.target === '月支' && l.branches === '寅申' && l.kind === '六冲'));
  assert.ok(a.links.some((l) => l.target === '日支' && l.branches === '寅申' && l.kind === '六冲'));
});
test('switching Zi convention rebuilds the whole report from the new reference stem', () => {
  const c = compareZi({
    mode: 'solar',
    date: '1988-02-15',
    time: '23:30',
    sect: 2,
    direction: 'none',
  });
  const a = buildReading(c.midnight, '2026-09-20'),
    b = buildReading(c.lateZi, '2026-09-20');
  assert.notEqual(a.title.zh, b.title.zh);
  assert.notEqual(a.annual.god, b.annual.god);
  assert.notDeepEqual(a.chapters[2].evidence, b.chapters[2].evidence);
});
test('all six bilingual chapters carry evidence and rule identifiers; exports are deterministic', () => {
  const c = strong(),
    report = buildReading(c, '2026-09-20');
  assert.equal(report.chapters.length, 6);
  assert.equal(new Set(report.chapters.map((c) => c.id)).size, 6);
  for (const chapter of report.chapters) {
    assert.match(chapter.rule, /TJ-0[1-7]/);
    for (const text of [chapter.title, chapter.lead, ...chapter.paragraphs, ...chapter.evidence]) {
      assert.ok(text.zh.length > 0 && text.en.length > 0);
      assert.ok(!text.zh.includes('undefined') && !text.en.includes('undefined'));
    }
  }
  assert.equal(readingMarkdown(c, '2026-09-20', 'zh'), readingMarkdown(c, '2026-09-20', 'zh'));
  assert.match(readingMarkdown(c, '2026-09-20', 'en'), /Cycles & years/);
});
test('invalid exploration dates are rejected without silently rolling to another day', () => {
  for (const date of ['', '2023-02-29', '2026-13-01', '1900-12-31', '2200-01-01'])
    assert.throws(() => annualContext(strong(), date));
  assert.doesNotThrow(() => annualContext(strong(), '2024-02-29'));
});
