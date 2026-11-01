import assert from 'node:assert/strict';
import test from 'node:test';
import { hashForSample, normalizeHash, parseHash } from '../src/route';

test('normalizeHash strips # and leading slash', () => {
  assert.equal(normalizeHash('#sample/flip'), 'sample/flip');
  assert.equal(normalizeHash('#/sample'), 'sample');
  assert.equal(normalizeHash('sample'), 'sample');
});

test('#sample opens late-Zi sample on midnight boundary', () => {
  assert.deepEqual(parseHash('#sample'), {
    kind: 'sample',
    sect: 2,
    openCompare: false,
  });
  assert.deepEqual(parseHash('#demo'), {
    kind: 'sample',
    sect: 2,
    openCompare: false,
  });
});

test('#sample/flip and #flip open the 23:00 boundary so the split is visible', () => {
  assert.deepEqual(parseHash('#sample/flip'), {
    kind: 'sample',
    sect: 1,
    openCompare: false,
  });
  assert.deepEqual(parseHash('#flip'), {
    kind: 'sample',
    sect: 1,
    openCompare: false,
  });
  assert.deepEqual(parseHash('#sample/23'), {
    kind: 'sample',
    sect: 1,
    openCompare: false,
  });
});

test('#zi opens sample with compare appendix hint', () => {
  assert.deepEqual(parseHash('#zi'), {
    kind: 'sample',
    sect: 1,
    openCompare: true,
  });
  assert.deepEqual(parseHash('#sample/zi'), {
    kind: 'sample',
    sect: 1,
    openCompare: true,
  });
});

test('chapter hashes do not reopen the sample', () => {
  assert.deepEqual(parseHash('#chapter-work'), { kind: 'chapter', id: 'work' });
  assert.equal(parseHash('#chapter-timing').kind, 'chapter');
});

test('empty / home hashes stay on the form', () => {
  assert.deepEqual(parseHash(''), { kind: 'home' });
  assert.deepEqual(parseHash('#'), { kind: 'home' });
  assert.deepEqual(parseHash('#home'), { kind: 'home' });
});

test('hashForSample is the canonical share URL fragment', () => {
  assert.equal(hashForSample(2), 'sample');
  assert.equal(hashForSample(1), 'sample/flip');
  assert.equal(hashForSample(1, true), 'sample/flip/zi');
});
