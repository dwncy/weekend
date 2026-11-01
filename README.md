# The Jakarta Weekender

An Astro + Markdown weekend guide, built from the **Editorial Magazine**
direction of the *Jakarta Weekend Guide* design handoff and organised around the
plan itself: the home page answers "what are we doing this weekend?", and each
plan page is a scannable list of stops you can jump around.

## What a visit looks like

- **Home** — the weekend's date, title, weather, stop count and one primary
  action; the stops as numbered rows that deep-link into the plan; "If you only
  do three things" next to the plan; past weekends as a compact list.
- **Plan page** — an at-a-glance summary (stops, areas, best window, rain
  fallback), two whole-plan actions (one map link covering every stop, and an
  add-to-calendar download), a stop picker that stays in view while you scroll
  (a rail on desktop, chips on mobile), one labelled section per stop (when /
  where / budget / weather, then why it's worth it, then the source), and links
  to the previous and next weekend.

Both views keep the editorial type, paper palette, area colours and cover art.

## Stack

- **Astro 5** static site (no client framework needed)
- **Markdown content collection** (`src/content/issues/`) typed by a Zod schema
- `remark-breaks` to preserve single-line breaks in any Markdown that still
  renders as an article, matching the original prototype's markdown renderer
- Web fonts (Fraunces / Newsreader / Inter / Space Mono) standing in for the
  original "grain & mortar" design-system tokens, which were not shipped in the
  handoff

## Commands

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static build to dist/
npm run preview  # serve the production build
```

## Authoring a new weekend

Add a Markdown file to `src/content/issues/`. Frontmatter mirrors the handoff's
authoring format:

```yaml
---
title: "..."
dateRange: "Jun 27–29"       # short, for cards/header
dateLong: "June 27–29, 2026" # full, for the plan page
year: "2026"
teaser: "..."
weather:
  kind: sun                  # sun | rain | cloud  → weather glyph
  label: "..."
  hi: "33°"
cover: sunwheat              # sunwheat | rainclay | heritage | mangrove
bestWindow: "..."            # optional — "at a glance" card
rainPlan: "..."              # optional — "if the sky turns" line
picks:                       # stop rows, area chips, archive rows
  - no: 1
    name: "..."
    area: "South"            # South | Central | North | Old Town | West → accent colour
    date: "Sat 9–11am"
    budget: "Rp 75–150k"
---

Intro paragraph (one or two sentences)…

## 1. Stop name
**Date:** …
**Area:** North — JIExpo Kemayoran
**Why go:** …
**Rough budget:** …
**Weather:** …
**Source:** [Label](https://…)

## 2. Next stop
…

## If you only do three things
1. **Stop name** — why it made the cut.
```

The plan page is generated from that body: `src/lib/plan.ts` parses the intro,
the `## N. Stop` sections (place, why, weather, source — `Date` and
`Rough budget` are checked but the frontmatter picks stay the single source for
those two) and the top-three list at build time. If a file drifts from the format — a new heading,
a missing fact — the build prints a warning and the page falls back to rendering
the Markdown article, so new content can never break the site.

The issue with the highest `no` automatically becomes the cover story on the
home page; the rest fall into "Past weekends".

## Map link and calendar file

Both are generated from the content — no extra frontmatter to author:

- **Map all N stops** — one Google Maps directions link built from each stop's
  place (`**Area:** North — JIExpo Kemayoran` → `JIExpo Kemayoran, Jakarta`), in
  plan order. Google accepts 11 places per link; a longer plan is capped, with a
  build warning.
- **Add to calendar** — `/plans/<file-name>.ics`, a standards-based all-day
  event covering the weekend, with the stops, the map link and the plan page in
  its description. The first day comes from the file name (`2026-07-11-…`) and
  the last day from `dateRange` (`Jul 11–12`). Rename a file or drop the range
  and the event falls back to a single day; a missing leading date hides the
  link and prints a build warning.

## Project layout

```
src/
  content/issues/      # one Markdown file per weekend
  content.config.ts    # collection schema
  layouts/Base.astro   # html shell + web fonts
  components/
    SiteHeader.astro   # wordmark + "this weekend / past weekends" nav
    SiteFooter.astro
    AtAGlance.astro    # stops, areas, best window, rain fallback
    PlanActions.astro  # whole-plan map link + add-to-calendar
    StopPicker.astro   # sticky stop rail (desktop) / chips (mobile) + scroll spy
    TopThree.astro     # "if you only do three things"
    Weather.astro      # weather glyph
  lib/
    plan.ts            # parses a weekend body into stops + top three
    map.ts             # one Google Maps route covering every stop
    calendar.ts        # weekend dates + the .ics built from a plan
    theme.ts           # area colours, cover themes, issue numbers, base URLs
  pages/
    index.astro            # home: this weekend + past weekends
    issues/[...slug].astro # one plan: summary, stop picker, stops
    plans/[slug].ics.ts    # one .ics calendar file per plan
  styles/global.css    # design tokens, focus styles, article prose
design/wireframes/     # the reviewed wireframes behind this layout
design/evidence/       # before/after screenshots used in pull requests
```

## Origin

The original handoff (`.dc.html` prototype + `support.js` runtime) is kept under
`_import/` for reference. It contained three design directions (Magazine,
Journal, City Guide); this project implements the first one.
