// "Add to Google Calendar" opens Calendar's own new-event form with the weekend
// already filled in, so the plan lands in the calendar without a file download,
// a third-party API key or client-side script — the link is built at build time
// from the same content as the page.
//
// Per-stop times are free text ("11–12 July 2026; check daily lineup"), so the
// event is one all-day weekend entry that lists the stops, the map link and the
// plan page in its description.

export interface PlanDayRange {
  /** First day of the plan, ISO (YYYY-MM-DD). */
  start: string;
  /** Last day of the plan, ISO, inclusive. */
  end: string;
}

export interface PlanCalendarStop {
  no: number;
  name: string;
  date?: string;
  area?: string;
  place?: string;
}

export interface PlanCalendar {
  title: string;
  dates: PlanDayRange;
  /** Intro line shown above the stops. */
  teaser?: string;
  stops: PlanCalendarStop[];
  /** One map link covering the whole plan, repeated in the event. */
  mapUrl?: string;
  /** Public plan page. */
  planUrl: string;
}

const TEMPLATE = 'https://calendar.google.com/calendar/render';

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

// "Jun 27–29", "Jul 4–5", "Jun 30 – Jul 2": an optional leading month, the first
// day, then an optional dash and second day (with its own optional month).
const RANGE = /([A-Za-z]{3,9})?\.?\s*(\d{1,2})(?:\s*[–—−-]\s*(?:([A-Za-z]{3,9})\.?\s*)?(\d{1,2}))?/;

function monthIndex(token: string | undefined): number | undefined {
  if (!token) return undefined;
  const key = token.toLowerCase().replace(/\./g, '').slice(0, 3);
  const index = MONTH_NAMES.findIndex((name) => name.startsWith(key));
  return index === -1 ? undefined : index;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function isoDay(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** ISO day for a year/month/day, or undefined when the date does not exist. */
function isoUtc(year: number, month: number, day: number): string | undefined {
  const date = new Date(Date.UTC(year, month, day));
  const real =
    date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day;
  return real ? isoDay(date) : undefined;
}

/**
 * The weekend a plan covers. Entry ids start with the plan's first day
 * (`2026-07-11-last-call-in-the-heat`), so that date is canonical and
 * `dateRange` only supplies how many days the weekend runs.
 */
export function planDates(id: string, dateRange: string): PlanDayRange | undefined {
  const start = id.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!start) return undefined;

  const year = Number(start[1]);
  const month = Number(start[2]) - 1;
  const dayNo = Number(start[3]);
  const startIso = isoUtc(year, month, dayNo);
  if (!startIso) return undefined;

  const range = dateRange.match(RANGE);
  if (!range) return { start: startIso, end: startIso };

  const [, firstMonth, , secondMonth, secondDay] = range;
  if (!secondDay) return { start: startIso, end: startIso };

  const endDayNo = Number(secondDay);
  const namedMonth = monthIndex(secondMonth) ?? monthIndex(firstMonth);
  let endMonth = month;
  let endYear = year;

  if (namedMonth !== undefined && namedMonth !== month) {
    // A second month is named ("Dec 31 – Jan 1").
    endMonth = namedMonth;
    if (namedMonth < month) endYear = year + 1;
  } else if (endDayNo < dayNo) {
    // No month named and the end day is earlier: the weekend rolls over.
    endMonth = month + 1;
    if (endMonth > 11) {
      endMonth = 0;
      endYear = year + 1;
    }
  }

  const endIso = isoUtc(endYear, endMonth, endDayNo);
  if (!endIso || endIso < startIso) return { start: startIso, end: startIso };
  return { start: startIso, end: endIso };
}

/** "North — JIExpo Kemayoran", or just the area. */
function locationLine(stop: PlanCalendarStop): string {
  return stop.place ? `${stop.area ?? ''} — ${stop.place}`.replace(/^ — /, '') : (stop.area ?? '');
}

function describe(plan: PlanCalendar): string {
  const stops = plan.stops.map((stop) => {
    const when = [stop.date, locationLine(stop)].filter(Boolean).join(' · ');
    return `${stop.no}. ${stop.name}${when ? ` — ${when}` : ''}`;
  });

  return [
    ...(plan.teaser ? [plan.teaser, ''] : []),
    ...stops,
    ...(plan.mapUrl ? ['', `All stops on a map: ${plan.mapUrl}`] : []),
    '',
    `Full plan: ${plan.planUrl}`,
  ].join('\n');
}

/**
 * Google Calendar's template link: an all-day event (bare YYYYMMDD dates, with
 * the end exclusive, like the calendar UI shows it) that the person only has to
 * save.
 */
export function googleCalendarUrl(plan: PlanCalendar): string {
  const end = new Date(`${plan.dates.end}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);

  const params = [
    'action=TEMPLATE',
    `text=${encodeURIComponent(plan.title)}`,
    `dates=${plan.dates.start.replace(/-/g, '')}/${isoDay(end).replace(/-/g, '')}`,
    `details=${encodeURIComponent(describe(plan))}`,
    ...(plan.stops[0]?.place ? [`location=${encodeURIComponent(plan.stops[0].place)}`] : []),
  ];

  return `${TEMPLATE}?${params.join('&')}`;
}
