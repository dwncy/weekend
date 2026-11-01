# Review evidence — plan-first UX

Screenshots used in the pull request, so the before/after comparison can be
checked against the code.

## Scenario

- **Pages:** home (`/weekend/`) and the latest plan
  (`/weekend/issues/2026-07-11-last-call-in-the-heat/`).
- **Viewports:** 1440×900 and 390×844, light theme, full page, same browser
  (Chrome), captured with `deviceScaleFactor: 2` and exported at 1.5×/2×.
- **App:** the static build served by `astro preview` with the same base path
  (`/weekend`) as GitHub Pages.
- **State:** the latest weekend selected; no interaction, no hover, fonts
  loaded (`networkidle`).

## Revisions

| Folder | Revision | Notes |
| --- | --- | --- |
| `before/` | `main@85904d2` | the magazine-style home and article page before this change |
| `after/` | this branch | the plan-first home and plan page |

## Files

- `before/{home,plan}-{desktop,mobile}.png`
- `after/{home,plan}-{desktop,mobile}.png`

Regenerate with Playwright against `npm run build && npm run preview`; the
capture script is not committed because it only needs the four URLs and a
2× full-page screenshot.
