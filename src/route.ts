/** Demo deep-link routes for heat/discovery (README / X / V2EX one-liners). */

export type DemoRoute =
  | { kind: 'home' }
  | { kind: 'sample'; sect: 1 | 2; openCompare: boolean }
  | { kind: 'chapter'; id: string };

const SAMPLE_ALIASES = new Set(['sample', 'demo', 'example', 'examples', '试读', '示例']);
const FLIP_ALIASES = new Set(['flip', 'zi', '23', '2300', 'late-zi', 'latezi', '换日']);
const MIDNIGHT_ALIASES = new Set(['00', '0000', 'midnight', 'noon']);

/** Strip leading # and optional slash; keep path-like tokens. */
export function normalizeHash(hash: string): string {
  return hash.replace(/^#/, '').replace(/^\//, '').trim();
}

/**
 * Parse location.hash into a demo route.
 * Discovery targets:
 *   #sample       → late-Zi sample @ 00:00, scroll to live boundary
 *   #sample/flip  → same birth @ 23:00 so the day-pillar split is already visible
 *   #flip         → alias of #sample/flip
 * Chapter anchors (#chapter-*) stay browse-only and do not reopen the sample.
 */
export function parseHash(hash: string): DemoRoute {
  const raw = normalizeHash(hash);
  if (!raw || raw === 'home' || raw === 'index') return { kind: 'home' };

  const path = raw.split(/[?&]/)[0] ?? raw;
  if (path.startsWith('chapter-')) {
    return { kind: 'chapter', id: path.slice('chapter-'.length) };
  }

  const parts = path
    .toLowerCase()
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return { kind: 'home' };

  const [head, ...rest] = parts;
  if (FLIP_ALIASES.has(head) && !SAMPLE_ALIASES.has(head)) {
    return { kind: 'sample', sect: 1, openCompare: head === 'zi' };
  }

  if (!SAMPLE_ALIASES.has(head)) return { kind: 'home' };

  let sect: 1 | 2 = 2;
  let openCompare = false;
  for (const token of rest) {
    if (FLIP_ALIASES.has(token)) {
      sect = 1;
      if (token === 'zi') openCompare = true;
    } else if (MIDNIGHT_ALIASES.has(token)) {
      sect = 2;
    } else if (token === 'compare' || token === 'appendix') {
      openCompare = true;
    }
  }
  return { kind: 'sample', sect, openCompare };
}

/** Canonical shareable hash for a sample reading (omit #). */
export function hashForSample(sect: 1 | 2, openCompare = false): string {
  if (openCompare) return sect === 1 ? 'sample/flip/zi' : 'sample/zi';
  return sect === 1 ? 'sample/flip' : 'sample';
}

export function isDemoSampleHash(hash: string): boolean {
  return parseHash(hash).kind === 'sample';
}
