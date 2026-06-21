Find good things to do in Jakarta this coming weekend and publish them as one Markdown file to my site's repo.

## Repository

- Repo: **`dwncy/weekend`** (GitHub) · branch: **`main`** · content path: **`src/content/issues/`**
- Work inside a clone of it. If you don't already have one:
  ```bash
  git clone https://github.com/dwncy/weekend.git && cd weekend
  ```
  (Auth must already be set up — a token or SSH key with push access. If it's a fresh clone, pull is implied.)

**Freshness is the whole point.** Prioritize what's genuinely on *this* weekend, pulled from current sources — event/listing sites, ticketing pages, and recent social posts (TikTok, Instagram, e.g. **@jktgo**) from the last week or two. Skip evergreen "best of Jakarta" lists. Verify each pick's dates actually fall on or include this weekend before including it. For each pick capture: when it's on, where, why we'd love it, a rough budget, a weather note, and a real source link.

## Produce

One file at `src/content/issues/<YYYY>-<MM>-<DD>-<kebab-title>.md` (upcoming Saturday's date + kebab-case title), exactly:

```markdown
---
title: "<short evocative title>"
dateRange: "<e.g. 'Jun 27–29'>"
dateLong: "<e.g. 'June 27–29, 2026'>"
year: "<YYYY>"
teaser: "<one-sentence hook>"
weather:
  kind: <sun | rain | cloud>
  label: "<e.g. 'Sunny, light rain pm'>"
  hi: "<e.g. '33°'>"
cover: <sunwheat | rainclay | heritage | mangrove>
picks:
  - no: 1
    name: "<pick name>"
    area: "<South | Central | North | West>"
    date: "<e.g. '27–28 June 2026' or '11 June–12 July 2026; on this weekend'>"
    budget: "<rough, e.g. 'Rp 75–150k'>"
  # …3–5 picks total
---

**Weekend of <dateLong without year>.** <2–3 sentences on weather + vibe.>

## 1. <Pick name>
**Date:** <date>
**Area:** <Area> — <place>
**Why go:** <short, inviting paragraph.>
**Rough budget:** <budget>
**Weather:** <note>
**Source:** [<source>](<url>)

## 2. <Pick name>
…repeat for each pick…

## If you only do three things
1. **<name>** — <reason>
2. **<name>** — <reason>
3. **<name>** — <reason>

---

Have a good one!
```

Each of **Date / Area / Rough budget / Weather / Source** on its own line.

## Constraints

- Compute the upcoming Saturday–Sunday for the date fields.
- No `no` top-level field — the site numbers weekends from the file date.
- Stay in the value sets above (`area`, `weather.kind`, `cover`); rotate `cover` off last weekend's.
- Tag each pick's real area and spread across a few — don't park everything in one.
- **Freshness:** every pick must be something actually happening this weekend, confirmed against a current/recent source, each with a real `**Source:**` link. Prefer the most recently posted listings. If a source is unreachable, use another current one — never invent or pad with evergreen filler.
- Keep budgets/hours rough, not gospel; remind us to double-check before going.
- Voice: warm, second-person ("you two"), playful, concise. One file only.

## Publish

Commit just the new file to `main` (this triggers the auto-deploy):

```bash
git checkout main && git pull --rebase origin main
git add "src/content/issues/<YYYY>-<MM>-<DD>-<kebab-title>.md"
git commit -m "Add weekend: <title> (<dateRange>)"
git push origin main
```

If the push is rejected, `git pull --rebase origin main` and push again. Replace (don't duplicate) any existing file for the same weekend.
