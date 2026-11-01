import assert from 'node:assert/strict';
import test from 'node:test';
import { calculate, compareZi } from '../src/core';
import { boundaryHeadline, changedPillarIndexes } from '../src/boundary';

const lateZiInput = {
  mode: 'solar' as const,
  date: '1988-02-15',
  time: '23:30',
  sect: 2 as const,
  direction: 'none' as const,
};

test('sample late-Zi birth shows a live dual-boundary split on day pillar', () => {
  const compare = compareZi(lateZiInput);
  assert.equal(compare.midnight.pillars[2].text, '庚子');
  assert.equal(compare.lateZi.pillars[2].text, '辛丑');
  assert.equal(compare.midnight.pillars[3].text, '戊子');
  assert.equal(compare.lateZi.pillars[3].text, '戊子');
  assert.ok(compare.changed.includes(2));
  const active = calculate(lateZiInput);
  const changed = changedPillarIndexes(active, compare.lateZi);
  assert.deepEqual(changed, compare.changed);
  assert.match(boundaryHeadline(changed.length, 'zh'), /换日口径/);
});

test('flipping sect recomputes the active day stem used by the reading', () => {
  const midnight = calculate({ ...lateZiInput, sect: 2 });
  const late = calculate({ ...lateZiInput, sect: 1 });
  assert.notEqual(midnight.dayMaster, late.dayMaster);
  assert.equal(midnight.pillars[2].text, '庚子');
  assert.equal(late.pillars[2].text, '辛丑');
});
