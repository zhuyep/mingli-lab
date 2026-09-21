import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, JIAZI, STEMS, tenGod } from '../src/core.ts';
import { buildReading, readingMarkdown } from '../src/reading.ts';
import { CLASSICS } from '../src/classics.ts';

// Symbolic fixtures; no claim that arbitrary manual combinations represent real dates.
const manual = (...pillars: string[]) => calculate({ mode: 'pillars', pillars, direction: 'none' });
const chapter = (pillars: string[], id: string, date = '2026-09-21') =>
  buildReading(manual(...pillars), date).chapters.find((c) => c.id === id)!;
const sample = ['乙酉', '戊子', '辛巳', '壬辰'];

test('every domain has bilingual depth with resolvable historical references across varied charts', () => {
  for (let i = 0; i < 60; i++) {
    const r = buildReading(
      manual(JIAZI[i], JIAZI[(i + 17) % 60], JIAZI[(i + 29) % 60], JIAZI[(i + 41) % 60]),
      '2026-09-21',
    );
    for (const c of r.chapters) {
      assert.ok(c.depth.length >= 2);
      assert.ok(c.depth.some((s) => s.source));
      for (const s of c.depth) {
        for (const words of [s.title, ...s.paragraphs, ...(s.basis ? [s.basis] : [])]) {
          assert.ok(words.zh && words.en);
          assert.doesNotMatch(words.zh + words.en, /undefined|NaN/);
        }
        if (s.source) assert.ok(CLASSICS[s.source].url.startsWith('https://'));
      }
    }
  }
});
test('wealth polarity definitions are relative to all ten day stems, not fixed salary labels', () => {
  for (let i = 0; i < 10; i++) {
    const c = chapter(['乙酉', '戊子', JIAZI[i], '壬辰'], 'wealth');
    const s = c.depth[0].paragraphs[0].zh;
    for (const role of ['正财', '偏财']) {
      const expected = STEMS.find((stem) => tenGod(STEMS[i], stem).name === role)!;
      assert.ok(s.includes(`${expected}是${role}`));
    }
  }
});
test('same work theme retains different chart basis and support rather than repeating the whole chapter', () => {
  const a = chapter(sample, 'work'),
    b = chapter(['乙卯', '戊子', '辛巳', '壬辰'], 'work');
  assert.equal(a.everyday.professional.zh, b.everyday.professional.zh);
  assert.notEqual(a.depth[1].basis!.zh, b.depth[1].basis!.zh);
  assert.match(a.depth[1].basis!.zh, /酉藏辛/);
  assert.doesNotMatch(b.depth[1].basis!.zh, /酉藏辛/);
});
test('hidden and absent wealth evidence cannot be turned into visible wealth', () => {
  const hidden = chapter(['甲寅', '甲寅', '甲寅', '甲寅'], 'wealth');
  assert.match(hidden.depth[1].basis!.zh, /显干：已知字位中未见/);
  assert.match(hidden.depth[1].basis!.zh, /支藏戊/);
  const absent = chapter(['壬子', '甲子', '甲子'], 'wealth');
  assert.match(absent.depth[0].paragraphs[1].zh, /暂不选财务风格/);
  assert.match(absent.depth[1].basis!.zh, /时柱未知/);
});
test('relationship depth keeps simultaneous day-branch combination and clash with actual positions', () => {
  const c = chapter(['甲申', '丙寅', '甲寅', '己亥'], 'relationships');
  const last = c.depth.at(-1)!;
  assert.match(last.paragraphs[0].zh, /合与冲同时/);
  assert.match(last.basis!.zh, /年支、日支/);
  assert.match(last.basis!.zh, /日支、时支/);
});
test('annual depth changes at Lichun while unknown and manual cycles stay unassigned', () => {
  const before = chapter(sample, 'timing', '2024-02-03');
  const after = chapter(sample, 'timing', '2024-02-05');
  assert.match(before.depth[0].basis!.zh, /癸卯/);
  assert.match(after.depth[0].basis!.zh, /甲辰/);
  assert.match(after.depth[0].basis!.zh, /手动四柱没有唯一/);
  assert.match(chapter(sample.slice(0, 3), 'timing').depth[0].basis!.zh, /时柱未知/);
});
test('health historical explanation is invariant across charts and stays separate from inferred conditions', () => {
  assert.deepEqual(
    chapter(sample, 'health').depth,
    chapter(['甲子', '丙寅', '庚申'], 'health').depth,
  );
  assert.ok(chapter(sample, 'health').depth.every((s) => !s.basis));
});
test('both exports preserve quotes, sources and analysis-before-advice boundaries', () => {
  const c = manual(...sample),
    report = buildReading(c, '2026-09-21');
  for (const lang of ['zh', 'en'] as const) {
    const md = readingMarkdown(c, '2026-09-21', lang);
    for (const ch of report.chapters)
      for (const s of ch.depth) {
        assert.ok(md.includes(s.title[lang]));
        if (s.source) {
          const ref = CLASSICS[s.source];
          assert.ok(md.includes(ref.quote));
          assert.ok(md.includes(ref.url));
        }
      }
    const start = md.indexOf('## ' + report.chapters[1].everyday.title[lang]);
    const end = md.indexOf('## ' + report.chapters[2].everyday.title[lang]);
    const work = md.slice(start, end);
    assert.ok(
      work.indexOf(report.chapters[1].depth[0].title[lang]) <
        work.indexOf('### ' + (lang === 'zh' ? '调整建议' : 'Suggestions')),
    );
  }
  const json = JSON.parse(JSON.stringify(report));
  assert.equal(json.chapters[1].depth[0].source, 'output');
  assert.equal(json.sources[json.chapters[1].depth[0].source].quote, CLASSICS.output.quote);
});
