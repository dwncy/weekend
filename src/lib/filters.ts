// Labels and search text for the home page's plan finder. The tags themselves
// are optional per-stop frontmatter (see content.config.ts).

export type Duration = 'half' | 'full';
export type Spend = 'low' | 'mid' | 'high';

export const DURATION_LABELS: Record<Duration, string> = {
  half: 'Half day',
  full: 'Full day',
};

export const SPEND_LABELS: Record<Spend, string> = {
  low: 'Low budget',
  mid: 'Mid budget',
  high: 'Splurge',
};

interface Pick {
  name: string;
  area: string;
  duration?: Duration;
  spend?: Spend;
  rainProof?: boolean;
}

// Human-readable tags for one stop, in a fixed order.
export function stopTags(pick: Pick): string[] {
  const tags: string[] = [];
  if (pick.duration) tags.push(DURATION_LABELS[pick.duration]);
  if (pick.spend) tags.push(SPEND_LABELS[pick.spend]);
  if (pick.rainProof) tags.push('Works in rain');
  return tags;
}

// Lower-cased text the search box matches against: every word must appear.
export function searchText(data: {
  title: string;
  teaser: string;
  dateRange: string;
  dateLong: string;
  year: string;
  rainPlan?: string;
  picks: Pick[];
}): string {
  return [
    data.title,
    data.teaser,
    data.dateRange,
    data.dateLong,
    data.year,
    data.rainPlan ?? '',
    ...data.picks.flatMap((p) => [p.name, p.area]),
  ]
    .join(' ')
    .toLowerCase();
}
