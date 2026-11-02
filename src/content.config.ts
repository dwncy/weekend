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
    // Optional short lines for the plan page's "at a glance" card.
    bestWindow: z.string().optional(), // e.g. "Sat late afternoon · Sun morning"
    rainPlan: z.string().optional(), // e.g. "Museum MACAN — fully indoors"

    // Picks power the home stop rows, the area chips and the archive rows. The
    // per-stop prose (place, why, weather, source) and the top-three list come
    // from the Markdown body, which src/lib/plan.ts parses.
    picks: z
      .array(
        z.object({
          no: z.number(),
          name: z.string(),
          area: z.string(), // South | Central | North | Old Town | West
          date: z.string(), // when the event runs, e.g. "27–28 June 2026"
          budget: z.string(),
          // Optional tags for the home page's plan filters. A stop without a
          // tag simply doesn't match that filter.
          duration: z.enum(['half', 'full']).optional(), // half day | full day
          spend: z.enum(['low', 'mid', 'high']).optional(), // rough budget tier
          rainProof: z.boolean().optional(), // still works if it rains
        }),
      )
      .default([]),
  }),
});

export const collections = { issues };
