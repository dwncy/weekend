// Checks how the built home page shows budget tiers. Run after `astro build`
// (`npm test` does both).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();

const texts = (re) => [...html.matchAll(re)].map((m) => decode(m[1]));

test('budget filter options show their Rupiah range', () => {
  const options = texts(/name="spend"[^>]*>\s*<span[^>]*>([^<]*)</g);
  assert.deepEqual(options, ['Any', 'Low (< Rp 5k)', 'Up to mid (≤ Rp asdasda)']);
});

test('budget filter heading says the range is entry per person', () => {
  assert.ok(
    texts(/<legend[^>]*>([^<]*)</g).includes('Budget · entry per person'),
    'missing "Budget · entry per person" legend',
  );
});

test('every stop budget tag shows its Rupiah range', () => {
  const tags = texts(/class="match__tags"[^>]*>([^<]*)</g);
  assert.ok(tags.length > 0, 'no stop tags rendered');
  const budgets = tags.map((t) => t.split(' · ').find((part) => /budget|Splurge/.test(part)));
  for (const budget of budgets) {
    assert.match(budget ?? '', /^(Low budget \(< Rp 5k\)|Mid budget \(Rp 5k–150k\)|Splurge \(> Rp 150k\))$/);
  }
});
