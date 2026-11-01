# UX wireframes — “plan-first” redesign (review copy)

Low-fidelity wireframes for making the weekend guide easier to use. They are
deliberately structure-only — grey boxes, dashed placeholders, system type — so
a review can judge layout, hierarchy and flow without arguing about the visual
skin (the current editorial type and palette stay).

## Files

| Path | What it is |
| --- | --- |
| `desktop.html` | Two sheets: **A** home (1280px) and **B** plan detail (1280px). |
| `mobile.html` | Two sheets: **C** home (390px) and **D** plan detail (390px). |
| `wireframe.css` | Wireframe styling: greys, dashed placeholders, system type. |
| `png/` | Rendered copies posted on [issue #1](https://github.com/dwncy/weekend/issues/1). |
| `render.cjs` | Renders every sheet to `png/` at 2× and runs layout assertions. |

## Regenerate the PNGs

```bash
npm i -D playwright            # once; skip with PW_CHANNEL=chrome if Chrome is installed
PW_CHANNEL=chrome node design/wireframes/render.cjs
```

`render.cjs` writes `png/{home,plan}-{desktop,mobile}.png` and fails if a block
overflows its frame, a stop row or pin is missing, or the summary card stops
sitting above the stop sections.

## What the sheets show

- **A / C — home:** the weekend’s facts and one primary action above the fold,
  the plan as numbered stops (each linking to its own section), “If you only do
  three things” next to the plan, and past weekends as a compact list.
- **B / D — plan detail:** an at-a-glance summary (stops, areas, budget, best
  window, rain fallback), a sticky stop picker, labelled facts per stop, and
  previous-weekend navigation at the end.

Nothing in this folder is wired into the site yet; it is the design direction
under review on issue #1.
