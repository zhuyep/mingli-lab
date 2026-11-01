import assert from 'node:assert/strict';
import test from 'node:test';
import { EVIDENCE_SECTIONS, evidencePanelHtml } from '../src/evidence';
import { EVIDENCE_VERSION } from '../src/reading';

test('calibration archive copy stays available without being a primary CTA', () => {
  assert.match(EVIDENCE_VERSION, /^evidence-/);
  assert.ok(EVIDENCE_SECTIONS.length >= 4);
  const html = evidencePanelHtml('zh', (zh) => zh);
  assert.match(html, /换日双口径/);
  assert.match(html, new RegExp(EVIDENCE_VERSION));
});
