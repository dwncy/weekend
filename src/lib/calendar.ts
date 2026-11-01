// "Add to calendar" is a generated .ics file (RFC 5545) built once per plan at
// build time, so one link works with Google Calendar, Apple Calendar and
// Outlook without a third-party service or client-side script.
//
// The event is an all-day one covering the weekend: per-stop times are free text
// ("11–12 July 2026; check daily lineup"), so the stops are listed in the event
// description rather than given times of their own.

export interface PlanDayRange {
  /** First day of the plan, ISO (YYYY-MM-DD). */
  start: string;
  /** Last day of the plan, ISO, inclusive. */
  end: string;
}

export interface PlanCalendarEvent {
  /** UID seed: the issue id, so re-importing updates one event. */
  id: string;
  title: string;
  dates: PlanDayRange;
  /** Description paragraphs; joined with newlines. */
  description: string[];
  url?: string;
  location?: string;
}

const PRODID = '-//The Jakarta Weekender//Weekend Plans//EN';

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

function isoDay(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
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

/** RFC 5545 TEXT escaping. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** UTC timestamp for DTSTAMP, e.g. 20260711T093000Z. */
function stamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${isoDay(date).replace(/-/g, '')}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

/**
 * RFC 5545 §3.1 folding: no line longer than 75 octets, and a folded
 * continuation starts with a single space (which counts towards its own limit).
 */
function fold(line: string): string {
  const encoder = new TextEncoder();
  const folded: string[] = [];
  let current = '';
  let octets = 0;
  let limit = 75;

  for (const char of line) {
    const size = encoder.encode(char).length;
    if (octets + size > limit) {
      folded.push(current);
      current = '';
      octets = 0;
      limit = 74;
    }
    current += char;
    octets += size;
  }
  folded.push(current);

  return folded.join('\r\n ');
}

export function buildIcs(event: PlanCalendarEvent): string {
  // An all-day DTEND is exclusive, so it is the day after the last day.
  const end = new Date(`${event.dates.end}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@jakarta-weekender`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART;VALUE=DATE:${event.dates.start.replace(/-/g, '')}`,
    `DTEND;VALUE=DATE:${isoDay(end).replace(/-/g, '')}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description.join('\n'))}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    // A plan should not block the whole day as busy in a shared calendar.
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.map(fold).join('\r\n') + '\r\n';
}
