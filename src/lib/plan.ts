// Pages render a weekend as a structured plan (summary, numbered stops, "if
// you only do three things"), so the Markdown body is parsed once at build
// time. The authoring format is the one documented in the README:
//
//   Intro paragraph…
//
//   ## 1. Stop name
//   **Date:** …
//   **Area:** North — JIExpo Kemayoran
//   **Why go:** …
//   **Rough budget:** …
//   **Weather:** …
//   **Source:** [Label](https://…)
//
//   ## If you only do three things
//   1. **Stop name** — why it made the cut.
//
// Any body that does not follow it is reported as not `ok`, and the detail page
// falls back to rendering the article as-is, so future content can never break.

export interface PlanSource {
  label: string;
  url: string;
}

export interface PlanStop {
  no: number;
  name: string;
  date?: string;
  /** Area tag, e.g. "North". */
  area?: string;
  /** Place after the area, e.g. "JIExpo Kemayoran". */
  place?: string;
  why?: string;
  budget?: string;
  weather?: string;
  source?: PlanSource;
}

export interface PlanTopNote {
  name: string;
  note: string;
}

export interface ParsedPlan {
  ok: boolean;
  intro: string;
  stops: PlanStop[];
  topNotes: PlanTopNote[];
  /** Sections that are neither a numbered stop nor the top-three list. */
  unknownSections: string[];
}

const HEADING = /^##\s+(.*\S)\s*$/;
const STOP_HEADING = /^(\d+)[.)]\s+(.*\S)\s*$/;
const TOP_HEADING = /^if you only do three/i;
const FACT = /^\*\*([^*]+?)\*\*\s*:?\s*(.*\S)\s*$/;
const LINK = /^\[([^\]]+)\]\(\s*([^)\s]+)\s*\)$/;
const TOP_ITEM = /^(\d+)[.)]\s+\*\*(.+?)\*\*\s*[—–-]\s*(.*\S)\s*$/;

/** "North — JIExpo Kemayoran" -> area "North", place "JIExpo Kemayoran". */
function splitArea(value: string): { area: string; place?: string } {
  const match = value.match(/^(.*?)\s+—\s+(.*)$/);
  if (match) return { area: match[1].trim(), place: match[2].trim() };
  return { area: value.trim() };
}

function parseSource(value: string): PlanSource | undefined {
  const link = value.trim().match(LINK);
  if (!link) return undefined;
  return { label: link[1].trim(), url: link[2].trim() };
}

const FACT_KEYS: Record<string, 'date' | 'area' | 'why' | 'budget' | 'weather' | 'source'> = {
  date: 'date',
  area: 'area',
  'why go': 'why',
  why: 'why',
  'rough budget': 'budget',
  budget: 'budget',
  weather: 'weather',
  source: 'source',
};

export function parsePlan(body: string | undefined): ParsedPlan {
  const result: ParsedPlan = { ok: true, intro: '', stops: [], topNotes: [], unknownSections: [] };
  if (!body) {
    result.ok = false;
    return result;
  }

  const lines = body.replace(/\r\n/g, '\n').split('\n');
  let section: 'intro' | 'stop' | 'top' | 'unknown' = 'intro';
  let stop: PlanStop | null = null;
  const introLines: string[] = [];

  const closeStop = () => {
    if (stop) result.stops.push(stop);
    stop = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const heading = line.match(HEADING);

    if (heading) {
      const title = heading[1].trim();
      closeStop();
      const asStop = title.match(STOP_HEADING);
      if (asStop) {
        section = 'stop';
        stop = { no: Number(asStop[1]), name: asStop[2].trim() };
      } else if (TOP_HEADING.test(title)) {
        section = 'top';
      } else {
        section = 'unknown';
        result.unknownSections.push(title);
      }
      continue;
    }

    if (section === 'intro') {
      introLines.push(line);
      continue;
    }

    if (section === 'top') {
      const item = line.trim().match(TOP_ITEM);
      if (item) result.topNotes.push({ name: item[2].trim(), note: item[3].trim() });
      continue;
    }

    if (section === 'stop' && stop) {
      const fact = line.match(FACT);
      if (!fact) continue;
      const key = FACT_KEYS[fact[1].trim().toLowerCase().replace(/:$/, '')];
      if (!key) continue;
      const value = fact[2].trim();
      if (key === 'source') stop.source = parseSource(value);
      else if (key === 'area') Object.assign(stop, splitArea(value));
      else stop[key] = value;
    }
  }
  closeStop();

  result.intro = introLines
    .join('\n')
    .replace(/\n?-{3,}\s*$/g, '')
    .trim();

  result.stops.sort((a, b) => a.no - b.no);
  if (!result.stops.length || !result.topNotes.length || result.unknownSections.length) result.ok = false;
  return result;
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

/** Minimal inline Markdown for the parsed one-paragraph intro. */
export function renderInline(markdown: string): string {
  return markdown
    .trim()
    .replace(/[&<>"]/g, (char) => ESCAPES[char])
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>');
}
