# Review evidence: font variants

## Scenario

- **Pages:** home (`/weekend/`) and the latest plan
  (`/weekend/issues/2026-07-11-last-call-in-the-heat/`).
- **Viewports:** 1440×900 and 390×844, light theme, first screen only,
  Chrome via Playwright, `deviceScaleFactor: 1`, after `document.fonts.ready`.
- **App:** `astro build` + `astro preview` with the `/weekend` base path.

## Revisions

| Folder | Revision | URL |
| --- | --- | --- |
| `before/` | `main@b9850a3` | no `?font` |
| `classic/` | this branch | `?font=classic` |
| `modern/` | this branch | `?font=modern` |
| `friendly/` | this branch | `?font=friendly` |

Without `?font`, this branch renders pixel-identical to `before/` (checked
with `cmp` on `home-desktop.png`).
