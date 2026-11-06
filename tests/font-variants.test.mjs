// Checks that every page can switch to a font variant. Run after `astro build`
// (`npm test` does both).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const css = readdirSync(new URL('_astro/', dist))
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(new URL(`_astro/${f}`, dist), 'utf8'))
  .join('\n');
const home = readFileSync(new URL('index.html', dist), 'utf8');

for (const id of ['classic', 'modern', 'friendly']) {
  test(`"${id}" variant has a stylesheet and token overrides`, () => {
    assert.match(home, new RegExp(`"${id}":"https://fonts\\.googleapis\\.com/`));
    assert.match(css, new RegExp(`html\\[data-font=["']?${id}["']?\\]\\s*\\{[^}]*--font-display`));
  });
}

test('default fonts stay loaded without a variant', () => {
  assert.match(home, /family=Fraunces/);
});
