// Area → accent color, and cover theme → {bg, fg}. Lifted verbatim from the
// original design's DCLogic so the palette stays identical.
export const AREA_COLORS: Record<string, string> = {
  South: '#C0492A',
  Central: '#E0A93B',
  North: '#1E6E5A',
  'Old Town': '#3F5B45',
  West: '#8F3318',
};

export const COVERS = {
  sunwheat: { bg: '#E0A93B', fg: '#221C16' },
  rainclay: { bg: '#C0492A', fg: '#F7F2E9' },
  heritage: { bg: '#3F5B45', fg: '#F7F2E9' },
  mangrove: { bg: '#1E6E5A', fg: '#F7F2E9' },
} as const;

export type CoverKey = keyof typeof COVERS;

export function areaColor(area: string): string {
  return AREA_COLORS[area] ?? '#6E6456';
}

export function cover(key: CoverKey) {
  return COVERS[key];
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

// Unique areas in first-seen order — used for the detail page's area tags.
export function uniqueAreas(
  picks: { area: string }[],
): { name: string; color: string }[] {
  const seen = new Set<string>();
  const out: { name: string; color: string }[] = [];
  for (const p of picks) {
    if (!seen.has(p.area)) {
      seen.add(p.area);
      out.push({ name: p.area, color: areaColor(p.area) });
    }
  }
  return out;
}

// The scrolling marquee strip is built from the latest issue's facts.
export function marqueeItems(
  no: number,
  latest: {
    dateRange: string;
    year: string;
    weather: { hi: string; label: string };
    picks: unknown[];
  },
): string[] {
  return [
    'No. ' + no,
    latest.dateRange + ', ' + latest.year,
    latest.weather.hi + ' · ' + latest.weather.label,
    latest.picks.length + ' picks this weekend',
    'Pasar Santa · Car Free Day · Senopati · Kota Tua · PIK',
    'Honest plans for two',
    'Smooth as butter',
  ];
}
