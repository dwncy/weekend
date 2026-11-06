// Checks that the plan finder search matches date ranges whatever dash the
// user types. Run after `astro build` (`npm test` does both).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

const searchFor = (title) => {
  for (const m of html.matchAll(/data-search="([^"]*)"[\s\S]*?class="archive__name"[^>]*>\s*([^<]*)/g)) {
    if (m[2].trim() === title) return m[1].replace(/&amp;/g, '&');
  }
  throw new Error(`no weekend titled ${title}`);
};

// The query normalizer from the finder's inline script, so the test uses the
// same code as the browser.
const fn = html.match(/var normalize = (function \([\s\S]*?\n {4}\});/);
assert.ok(fn, 'finder script has no normalize function');
const normalize = new Function(`return ${fn[1]}`)();

// Same rule as the finder: every word of the query must appear.
const matches = (text, query) =>
  normalize(query).split(/\s+/).filter(Boolean).every((w) => text.includes(w));

const raincheck = () => searchFor('Raincheck with a Spark');

test('a date range typed with a plain hyphen finds the weekend', () => {
  assert.ok(matches(raincheck(), 'jun 27-28'));
  assert.ok(matches(raincheck(), 'June 27-28'));
});

test('a date range typed with an en or em dash still finds the weekend', () => {
  assert.ok(matches(raincheck(), 'jun 27–28'));
  assert.ok(matches(raincheck(), 'jun 27—28'));
});

test('a date range does not match another weekend', () => {
  assert.ok(!matches(searchFor('Hot City Hideouts'), 'jun 27-28'));
});
