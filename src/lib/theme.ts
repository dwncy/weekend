// Area → accent color, and cover theme → {bg, fg}. Lifted verbatim from the
// original design's DCLogic so the palette stays identical.
export const AREA_COLORS: Record<string, string> = {
  South: '#C0492A',
  Central: '#E0A93B',
  North: '#1E6E5A',
  'Old Town': '#3F5B45',
  West: '#8F3318',
};

// Text-safe variants of the area accents, so coloured labels and numerals keep
// their area hue while staying at or above 4.5:1 on --paper. The brighter
// AREA_COLORS stay for fills and other non-text decoration.
export const AREA_TEXT_COLORS: Record<string, string> = {
  South: '#A83F20',
  Central: '#7A5609',
  North: '#1E6E5A',
  'Old Town': '#3F5B45',
  West: '#8F3318',
};

export const COVERS = {
  sunwheat: { bg: '#E0A93B', fg: '#221C16' },
  // Slightly deeper than the source palette's #C0492A so the 11px cover text
  // clears 4.5:1 against it.
  rainclay: { bg: '#B5452A', fg: '#F7F2E9' },
  heritage: { bg: '#3F5B45', fg: '#F7F2E9' },
  mangrove: { bg: '#1E6E5A', fg: '#F7F2E9' },
} as const;

export type CoverKey = keyof typeof COVERS;

export function areaColor(area: string): string {
  return AREA_COLORS[area] ?? '#6E6456';
}

export function areaTextColor(area: string): string {
  return AREA_TEXT_COLORS[area] ?? '#5E5548';
}

export function cover(key: CoverKey) {
  return COVERS[key];
}

// Prefix an internal path with the configured base (e.g. '/weekend/') so links
// work both locally and on GitHub Pages. Handles slashes idempotently.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + '/' + path.replace(/^\//, '');
}

// Issue numbers are derived, not authored. The oldest issue is "No. 9"
// (preserving the original design's numbering) and each newer weekend counts up
// from there. Entry ids start with the issue's date (YYYY-MM-DD-…), so sorting
// them lexicographically is the same as sorting chronologically.
const BASE_ISSUE_NO = 9;

export function issueNumbers(ids: string[]): Map<string, number> {
  const map = new Map<string, number>();
  [...ids]
    .sort()
    .forEach((id, i) => map.set(id, BASE_ISSUE_NO + i));
  return map;
}

// Unique area names in first-seen order — used for area chips and archive rows.
export function uniqueAreas(picks: { area: string }[]): string[] {
  return [...new Set(picks.map((p) => p.area))];
}
