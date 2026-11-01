import assert from 'node:assert/strict';
import test from 'node:test';
import { EVIDENCE_SECTIONS, evidenceEntryHtml, evidencePanelHtml } from '../src/evidence';
import { EVIDENCE_VERSION } from '../src/reading';

const t = (zh: string, en: string) => zh;

test('in-app evidence panel keeps end-user sections and version stamp', () => {
  assert.equal(EVIDENCE_VERSION, 'evidence-calibration-2');
  assert.ok(EVIDENCE_SECTIONS.length >= 4);
  const ids = EVIDENCE_SECTIONS.map((s) => s.id);
  assert.deepEqual(ids, ['day-boundary', 'analysis-advice', 'no-scores', 'honesty']);
  for (const section of EVIDENCE_SECTIONS) {
    assert.ok(section.title.zh.trim());
    assert.ok(section.body.zh.trim());
    assert.ok(section.title.en.trim());
    assert.ok(section.body.en.trim());
  }
  const html = evidencePanelHtml('zh', t);
  assert.match(html, /id="evidence-dialog"/);
  assert.match(html, new RegExp(EVIDENCE_VERSION));
  assert.match(html, /换日双口径/);
  assert.match(html, /分析与建议分栏/);
  assert.match(html, /无吉凶分数/);
  assert.match(html, /诚实边界/);
  assert.match(html, /1988-02-15 23:30/);
  assert.doesNotMatch(html, /github\.com\/zhuyep\/mingli-lab\/blob\/main\/docs\/evidence\.md/);
});

test('evidence entry opens in-app notes instead of GitHub docs', () => {
  const html = evidenceEntryHtml(t);
  assert.match(html, /data-open-evidence/);
  assert.match(html, /打开校准说明/);
  assert.match(html, new RegExp(EVIDENCE_VERSION));
  assert.doesNotMatch(html, /github\.com\/zhuyep\/mingli-lab\/blob\/main\/docs\/evidence\.md/);
  assert.doesNotMatch(html, /target="_blank"/);
});
