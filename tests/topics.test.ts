import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, type Chart } from '../src/core.ts';
import { buildReading, readingMarkdown } from '../src/reading.ts';
import { roleFacts, sleepAdvice } from '../src/topics.ts';

// Synthetic symbolic fixtures: these are not asserted to be real birth timestamps.
const manual = (...pillars: string[]) => calculate({ mode: 'pillars', pillars, direction: 'none' });
const read = (c: Chart, date = '2026-09-20') => buildReading(c, date);
const topic = (c: Chart, id: string) => read(c).chapters.find((x) => x.id === id)!;
const outputOfficer = () => manual('庚申', '甲寅', '甲寅', '丙申');
const outputMoney = () => manual('戊辰', '甲寅', '甲寅', '丙申');

test('six domains answer distinct questions with bilingual, chart-specific evidence', () => {
  for (const c of [outputOfficer(), outputMoney(), manual('辛酉', '癸卯', '乙巳')]) {
    const r = read(c);
    assert.deepEqual(
      r.chapters.map((x) => x.id),
      ['overview', 'work', 'wealth', 'relationships', 'health', 'timing'],
    );
    const answers: string[] = [];
    for (const chapter of r.chapters) {
      assert.ok(chapter.findings.length > 0);
      for (const f of chapter.findings) {
        for (const words of [
          f.question,
          f.answer,
          f.basis,
          chapter.plain.title,
          chapter.plain.lead,
          chapter.plain.term,
        ]) {
          assert.ok(words.zh && words.en);
          assert.ok(!/undefined|NaN/.test(words.zh + words.en));
        }
        answers.push(f.answer.zh);
      }
    }
    assert.equal(new Set(answers).size, answers.length);
  }
});
test('same day and month can produce different work and money readings from other stems', () => {
  const a = outputOfficer(),
    b = outputMoney();
  assert.equal(a.pillars[1].text, b.pillars[1].text);
  assert.equal(a.dayMaster, b.dayMaster);
  assert.notEqual(topic(a, 'work').findings[0].answer.zh, topic(b, 'work').findings[0].answer.zh);
  assert.match(topic(a, 'work').findings[0].basis.zh, /年干庚（七杀）/);
  assert.match(topic(b, 'work').findings[0].basis.zh, /年干戊（偏财）/);
  assert.notEqual(topic(a, 'wealth').plain.lead.zh, topic(b, 'wealth').plain.lead.zh);
});
test('visible, month-main, and other hidden wealth stay distinct', () => {
  const hidden = topic(manual('甲寅', '甲寅', '甲寅', '甲寅'), 'wealth');
  assert.match(hidden.plain.lead.zh, /藏在地支/);
  assert.match(hidden.findings[0].basis.zh, /支藏干戊/);
  const main = topic(manual('甲寅', '戊辰', '甲寅', '甲寅'), 'wealth');
  assert.match(main.findings[0].basis.zh, /月支藏干戊（偏财，本气）/);
  assert.match(main.plain.lead.zh, /项目/);
  const absent = topic(manual('壬子', '甲子', '甲子'), 'wealth');
  assert.match(absent.plain.lead.zh, /未见财星/);
  assert.match(absent.findings[0].answer.zh, /时辰未知/);
  assert.match(absent.findings[0].answer.zh, /收入还取决于/);
});
test('every selected role fact corresponds to an actual supplied position; self stem excluded', () => {
  for (const r of roleFacts(outputOfficer())) {
    const p = outputOfficer().pillars[r.position];
    if (r.layer === 'visible') {
      assert.notEqual(r.position, 2);
      assert.equal(r.stem, p.stem);
      assert.equal(r.god, p.god);
    } else {
      assert.ok(p.hidden.some((h) => h.stem === r.stem && h.god === r.god));
      if (r.layer === 'main') assert.equal(r.stem, p.hidden[0].stem);
    }
  }
});
test('relationship context follows actual linked positions and retains both clash and combination', () => {
  const c = manual('丙申', '戊戌', '戊辰', '辛酉');
  const r = topic(c, 'relationships');
  assert.match(r.findings[1].basis.zh, /月支\/日支 戌辰六冲/);
  assert.match(r.findings[1].basis.zh, /日支\/时支 辰酉六合/);
  assert.match(r.findings[1].answer.zh, /工作安排.*长期计划/);
  assert.doesNotMatch(r.findings[1].answer.zh, /家庭或外部圈子/);
  assert.match(r.findings[1].answer.zh, /不会把冲自动取消/);
});
test('unknown hour adds no role facts or timed cycles and remains explicit', () => {
  const c = manual('壬辰', '甲寅', '甲寅');
  assert.ok(roleFacts(c).every((f) => f.position < 3));
  assert.equal(read(c).annual.cycle, null);
  assert.match(topic(c, 'overview').findings[1].answer.zh, /缺少时辰/);
  assert.ok(read(c).nearby.every((a) => !a.cycle));
});
test('adjacent years preserve Lichun and valid date limits including leap days', () => {
  const c = outputOfficer();
  assert.deepEqual(
    read(c, '2024-02-03').nearby.map((a) => a.pillar),
    ['壬寅', '癸卯', '甲辰'],
  );
  assert.deepEqual(
    read(c, '2024-02-29').nearby.map((a) => a.date),
    ['2023-02-28', '2024-02-29', '2025-02-28'],
  );
  assert.equal(read(c, '1901-01-01').nearby.length, 2);
  assert.equal(read(c, '2199-12-31').nearby.length, 2);
  assert.notDeepEqual(read(c, '2026-09-20').chapters[5], read(c, '2027-09-20').chapters[5]);
});
test('health reading is invariant under changed birth symbols, and sleep notes depend only on answers', () => {
  assert.deepEqual(topic(outputOfficer(), 'health'), topic(outputMoney(), 'health'));
  assert.match(sleepAdvice({ rhythm: 'unknown', quality: 'unknown' })[0].zh, /选择/);
  assert.match(sleepAdvice({ rhythm: 'irregular', quality: 'unknown' })[0].zh, /一周/);
  assert.match(sleepAdvice({ rhythm: 'regular', quality: 'trouble' })[0].zh, /医护/);
  assert.match(sleepAdvice({ rhythm: 'regular', quality: 'rested' })[0].zh, /不能证明整体健康/);
  assert.throws(() => sleepAdvice({ rhythm: 'invalid' as never, quality: 'unknown' }));
});
test('saved reading contains topic questions, evidence and years, but no sleep response', () => {
  const text = readingMarkdown(outputOfficer(), '2026-09-20', 'zh');
  assert.match(text, /## 钱与收入/);
  assert.match(text, /## 睡眠与作息/);
  assert.match(text, /本盘依据.*年干庚/);
  assert.match(text, /2025-09-20/);
  assert.doesNotMatch(text, /你选了作息|你选了经常|你填写的是|sleepCheck/);
});
