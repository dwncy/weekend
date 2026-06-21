import { defineConfig } from 'astro/config';
import remarkBreaks from 'remark-breaks';

// remark-breaks turns single newlines into <br>, matching the original
// design's markdown renderer (it joined consecutive non-blank lines with
// line breaks rather than collapsing them).
export default defineConfig({
  // GitHub Pages project site: https://dwncy.github.io/weekend/
  // If you later attach a custom domain or rename the repo to
  // `dwncy.github.io`, change `base` to '/' (and update `site`).
  site: 'https://dwncy.github.io',
  base: '/weekend',
  // Honor the PORT env var (the preview harness assigns a free port); fall back
  // to Astro's default 4321 for plain `npm run dev`.
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },
  markdown: {
    remarkPlugins: [remarkBreaks],
  },
});
