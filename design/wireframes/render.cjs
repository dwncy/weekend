#!/usr/bin/env node
/**
 * Renders the wireframe sheets to PNG (one file per .shot: label + frame +
 * legend) and runs structural assertions, so a broken layout is caught
 * without eyeballing it.
 *
 *   npm i -D playwright                  # once
 *   PW_CHANNEL=chrome node design/wireframes/render.cjs
 *
 * PW_CHANNEL=chrome uses an installed Chrome instead of Playwright's own
 * Chromium download.
 */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const DIR = __dirname;
const OUT = path.join(DIR, 'png');

const SHEETS = [
  { file: 'desktop.html', dpr: 2, viewport: { width: 1400, height: 900 } },
  { file: 'mobile.html', dpr: 2, viewport: { width: 440, height: 900 } },
];

/** Runs inside the page, scoped to one .shot element; coordinates relative to it. */
function measure(shotEl) {
  const base = shotEl.getBoundingClientRect();
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x - base.x),
      y: Math.round(r.y - base.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  };
  const q = (s) => shotEl.querySelector(s);
  const frame = q('.frame');
  return {
    frame: {
      w: Math.round(frame.getBoundingClientRect().width),
      h: Math.round(frame.getBoundingClientRect().height),
      overflow: frame.scrollWidth / frame.clientWidth,
    },
    heroAsideDisplay: q('.hero__aside') ? getComputedStyle(q('.hero__aside')).display : 'none',
    boxes: {
      hero: box(q('.hero')),
      aside: box(q('.hero__aside')),
      actions: box(q('.actions')),
      firstStop: box(q('.stop')),
      callout: box(q('.callout')),
      archive: box(q('.archive')),
      glance: box(q('.glance')),
      stopbar: box(q('.stopbar')),
      firstStopcard: box(q('.stopcard')),
      planFoot: box(q('.plan-foot')),
    },
    counts: {
      stops: shotEl.querySelectorAll('.stop').length,
      stopcards: shotEl.querySelectorAll('.stopcard').length,
      pins: shotEl.querySelectorAll('.pin').length,
      legend: shotEl.querySelectorAll('.legend li').length,
    },
  };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
  const problems = [];

  for (const sheet of SHEETS) {
    const context = await browser.newContext({ viewport: sheet.viewport, deviceScaleFactor: sheet.dpr });
    const page = await context.newPage();
    await page.goto('file://' + path.join(DIR, sheet.file), { waitUntil: 'load' });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const shots = await page.$$('.shot');
    console.log(`\n${sheet.file}: ${shots.length} shot(s)`);

    for (const shot of shots) {
      const name = await shot.getAttribute('data-name');
      const frameBox = await (await shot.$('.frame')).boundingBox();
      const info = await shot.evaluate(measure);

      const file = path.join(OUT, `${name}.png`);
      await shot.screenshot({ path: file, animations: 'disabled' });

      const { boxes, counts, frame } = info;
      if (frame.overflow > 1.001) problems.push(`${name}: content overflows its frame (${frame.overflow})`);
      if (!counts.stopcards && counts.stops !== 4) problems.push(`${name}: expected 4 stop rows, found ${counts.stops}`);
      if (counts.pins !== counts.legend) problems.push(`${name}: ${counts.pins} pins but ${counts.legend} legend items`);
      if (info.heroAsideDisplay !== 'none' && boxes.aside && boxes.hero && boxes.aside.x <= boxes.hero.x + 20) {
        problems.push(`${name}: cover art is not beside the hero text`);
      }
      if (boxes.glance && boxes.firstStopcard && boxes.glance.y >= boxes.firstStopcard.y) {
        problems.push(`${name}: summary card is not above the stop sections`);
      }
      if (boxes.actions && boxes.hero && boxes.actions.y + boxes.actions.h > boxes.hero.y + boxes.hero.h + 2) {
        problems.push(`${name}: hero actions fall outside the hero block`);
      }

      console.log(
        `  ${name}: ${Math.round(frameBox.width)}×${Math.round(frameBox.height)} css · frame ${frame.h}px · ${Math.round(fs.statSync(file).size / 1024)} kB` +
          ` | stops ${counts.stops} · cards ${counts.stopcards} · pins ${counts.pins} · legend ${counts.legend}`,
      );
      console.log('    ' + JSON.stringify(boxes));
    }
    await context.close();
  }

  await browser.close();
  if (problems.length) {
    console.error('\nPROBLEMS:\n' + problems.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('\nNo layout problems detected.');
  }
})();
