Find good activities in Jakarta for the upcoming weekend.

Prioritize **fresh sources**: current event/listing sources and recent social
posts, including TikTok and Instagram accounts such as **@jktgo** when
accessible. Favour what's actually on *this* weekend over evergreen lists. For
each pick capture the dates, the location/area, why it's worth going, a rough
budget, a weather-aware note, and a link or citation.

## What to produce

One new Markdown file named
`src/content/issues/<YYYY>-<MM>-<DD>-<kebab-title>.md` (use the upcoming
Saturday's date and a short kebab-case slug of the title), with exactly this
structure:

```markdown
---
title: "<evocative short title>"
dateRange: "<short range, e.g. 'Jun 27–29'>"
dateLong: "<full range with year, e.g. 'June 27–29, 2026'>"
year: "<YYYY>"
teaser: "<one sentence hook>"
weather:
  kind: <sun | rain | cloud>
  label: "<short label, e.g. 'Sunny, light rain pm'>"
  hi: "<high temp, e.g. '33°'>"
cover: <sunwheat | rainclay | heritage | mangrove>
picks:
  - no: 1
    name: "<pick name>"
    place: "<neighborhood / venue>"
    area: "<South | Central | North | West>"
    date: "<when the event runs, e.g. '27–28 June 2026' or '11 June–12 July 2026; available this weekend'>"
    budget: "<rough, e.g. 'Rp 75–150k'>"
    why: "<one or two sentences>"
  # …3–5 picks total
top3:
  - { name: "<short>", note: "<short reason>" }
  - { name: "<short>", note: "<short reason>" }
  - { name: "<short>", note: "<short reason>" }
---

**Weekend of <dateLong without year>.** <2–3 sentences on the weather and the
overall vibe of the weekend.>

## 1. <Pick name>
**Date:** <when the event runs — a date or date range, e.g. '27–28 June 2026'>
**Area:** <Area> — <place>
**Why go:** <A short paragraph on what it is and why it's worth it.>
**Rough budget:** <budget>
**Weather:** <a note>
**Source:** [<source name>](<url>)

(Keep each of **Date**, **Area**, **Rough budget**, **Weather**, **Source** on
its own line — do not join two fields on one line with a separator.)

## 2. <Pick name>
…repeat for each pick…

## My top 3
1. **<name>** — <reason>
2. **<name>** — <reason>
3. **<name>** — <reason>

---

Have a good one!
```

## Constraints

- **Dates:** compute the upcoming Saturday–Sunday for `dateRange` / `dateLong`
  / `year`.
- **No issue number.** Don't add a `no` field — the site derives the issue
  number ("No. 14") automatically from the file's date.
- **Fixed value sets** — do not invent others:
  - `area`: `South | Central | North | West`
  - `weather.kind`: `sun | rain | cloud`
  - `cover`: `sunwheat | rainclay | heritage | mangrove` (rotate; prefer one
    different from the previous issue)
- **Areas: tag each pick with the venue's *real* Jakarta area. Map by location, for example:
  - `South` — Senopati, Blok M, Kemang, SCBD, Ragunan, Cilandak
  - `Central` — Thamrin, Sudirman, Menteng, Kemayoran,
    GBK, Senayan
  - `North` — Pantai Indah Kapuk (PIK), Ancol, Pluit
  - `West` — Puri, Kebon Jeruk, Grogol

- **Fresh over evergreen.** Prefer events specifically on this weekend, with a
  `**Source:**` link for each pick. If a source is inaccessible, fall back to
  other current listings — don't invent.
- **Don't present prices, hours, or event dates as confirmed facts.** Keep
  budgets rough and always include the *"note on sources"* disclaimer.
- **Voice:** warm, second-person ("you two"), concise.
- **One file only.**
```