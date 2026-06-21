import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each weekend "issue" is one Markdown file. Frontmatter mirrors the authoring
// format from the original design handoff (sample-content/*.md): the structured
// fields power the masthead, cover, contents list and area tags; the Markdown
// body is the article rendered on the detail page.
const issues = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/issues' }),
  schema: z.object({
    // Note: the issue number ("No. 13") is NOT authored here — it's derived
    // from chronological order at build time (see issueNumbers in lib/theme.ts).
    title: z.string(),
    dateRange: z.string(), // short, for cards/header
    dateLong: z.string(), // full, for detail page
    year: z.string(),
    teaser: z.string(),
    weather: z.object({
      kind: z.enum(['sun', 'rain', 'cloud']), // picks the weather glyph
      label: z.string(),
      hi: z.string(),
    }),
    cover: z.enum(['sunwheat', 'rainclay', 'heritage', 'mangrove']),
    // Only the fields the site actually renders. The full prose for each pick
    // (place, why, the top-3 list) lives in the Markdown body, which is the
    // source of truth for the detail page.
    picks: z
      .array(
        z.object({
          no: z.number(),
          name: z.string(),
          area: z.string(), // South | Central | North | Old Town | West
          date: z.string(), // when the event runs, e.g. "27–28 June 2026"
          budget: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { issues };
