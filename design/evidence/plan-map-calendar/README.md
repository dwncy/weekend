# Review evidence — plan map link and Google Calendar link

Screenshots used in the pull request, so the before/after comparison can be
checked against the code.

## Scenario

- **Page:** the latest plan
  (`/weekend/issues/2026-07-11-last-call-in-the-heat/`), titled *Last Call in the
  Heat* — four stops in North, West, North and South Jakarta.
- **Viewports:** 1440×900 and 390×844, light theme, full page, same browser
  (Chrome), captured with `deviceScaleFactor: 2`.
- **App:** the static build served by `astro preview` with the same base path
  (`/weekend`) as GitHub Pages.
- **State:** no interaction, no hover, fonts loaded (`networkidle`).

## Revisions

| Folder | Revision | Notes |
| --- | --- | --- |
| `before/` | `main@db5577a` | the plan page without whole-plan actions |
| `after/` | this branch | the same page with the “Map all 4 stops” and “Add to Google Calendar” row |

## Files

- `before/plan-desktop.png`, `before/plan-mobile.png`
- `after/plan-desktop.png`, `after/plan-mobile.png`

Both revisions were captured with the same script and browser settings. The only
visual difference is the new action row under the header chips: the first
differing pixel row is at 329 CSS px on desktop and 339 px on mobile, which is
the row's top edge, and the page grows by the row's height (69 px desktop, 124 px
mobile). The area above the row is identical in both captures (rust-coloured
pixels there: 734 desktop / 716 mobile in each), and the filled primary button
shows up only in `after/`. Everything below the row shifts down unchanged.

Regenerate with Playwright against `npm run build && npm run preview`; the
capture script is not committed because it only needs the plan URL and a 2×
full-page screenshot.
