import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { buildIcs, planDates } from '../../lib/calendar';
import { allStopsMapUrl } from '../../lib/map';
import { parsePlan, planStops } from '../../lib/plan';
import { withBase } from '../../lib/theme';

// One .ics per plan, generated at build time: /plans/<issue-id>.ics. It is a
// real file, so the same link opens a calendar import on phones, desktops and
// third-party calendar apps without any client-side script.
export async function getStaticPaths() {
  const issues = await getCollection('issues');
  return issues.map((issue) => ({ params: { slug: issue.id }, props: { issue } }));
}

export const GET: APIRoute = ({ props, site, url }) => {
  const { issue } = props as { issue: CollectionEntry<'issues'> };
  const dates = planDates(issue.id, issue.data.dateRange);
  if (!dates) return new Response('Not found', { status: 404 });

  const plan = parsePlan(issue.body);
  const stops = plan.ok ? planStops(issue.data.picks, plan) : [];
  const planUrl = new URL(withBase(`issues/${issue.id}/`), site ?? url).href;
  const mapUrl = allStopsMapUrl(stops);

  const stopLines = stops.map((stop) => {
    const when = [stop.date, stop.place ? `${stop.area} — ${stop.place}` : stop.area]
      .filter(Boolean)
      .join(' · ');
    return `${stop.no}. ${stop.name}${when ? ` — ${when}` : ''}`;
  });

  const description = [
    issue.data.teaser,
    '',
    ...stopLines,
    ...(mapUrl ? ['', `All stops on a map: ${mapUrl}`] : []),
    '',
    `Full plan: ${planUrl}`,
  ];

  const ics = buildIcs({
    id: issue.id,
    title: `${issue.data.title} · ${issue.data.dateRange}`,
    dates,
    description,
    url: planUrl,
    location: stops[0]?.place,
  });

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="weekend-${issue.id}.ics"`,
      'Cache-Control': 'public, max-age=600',
    },
  });
};
