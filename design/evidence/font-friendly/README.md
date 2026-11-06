# Review evidence: friendly font as the default

- **Pages:** home (`/weekend/`) and the latest plan
  (`/weekend/issues/2026-07-11-last-call-in-the-heat/`).
- **Viewports:** 1440×900 and 390×844, light theme, first screen only,
  Chrome via Playwright, after `document.fonts.ready`.
- **App:** `astro build` + `astro preview` with the `/weekend` base path.

| Folder | Revision | Fonts |
| --- | --- | --- |
| `before/` | `main@a2c23b7` | Fraunces / Newsreader / Inter / Space Mono |
| `after/` | this branch | Outfit / Literata / JetBrains Mono |
