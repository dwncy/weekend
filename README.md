# The Jakarta Weekender

An Astro + Markdown implementation of the **Editorial Magazine** direction from
the *Jakarta Weekend Guide* design handoff. Each weekend is a Markdown file; the
site renders a magazine-style home (masthead, cover spread, contents, back
issues) and a per-issue detail page with the full article.

## Stack

- **Astro 5** static site (no client framework needed)
- **Markdown content collection** (`src/content/issues/`) typed by a Zod schema
- `remark-breaks` to preserve single-line breaks inside picks, matching the
  original prototype's markdown renderer
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
no: 13                       # issue number — highest is the "latest" issue
title: "..."
dateRange: "Jun 27–29"       # short, for cards/header
dateLong: "June 27–29, 2026" # full, for the detail page
year: "2026"
teaser: "..."
weather:
  kind: sun                  # sun | rain | cloud  → weather glyph
  label: "..."
  hi: "33°"
cover: sunwheat              # sunwheat | rainclay | heritage | mangrove
picks:                       # powers the "In this issue" contents list + area tags
  - no: 1
    name: "..."
    place: "..."
    area: "South"            # South | Central | North | Old Town | West → accent color
    when: "Sat 9–11am"
    budget: "Rp 75–150k"
    why: "..."
top3:
  - { name: "...", note: "..." }
---

Markdown article body goes here…
```

The issue with the highest `no` automatically becomes the cover story on the
home page; the rest fall into "Back issues".

## Project layout

```
src/
  content/issues/      # one Markdown file per weekend
  content.config.ts    # collection schema
  layouts/Base.astro   # html shell + web fonts
  components/          # Marquee, Weather (glyph)
  lib/theme.ts         # area colors, cover themes, marquee items
  pages/
    index.astro            # magazine home
    issues/[...slug].astro # per-issue detail page
  styles/global.css    # design tokens + article prose styles
```

## Origin

The original handoff (`.dc.html` prototype + `support.js` runtime) is kept under
`_import/` for reference. It contained three design directions (Magazine,
Journal, City Guide); this project implements the first one only.
