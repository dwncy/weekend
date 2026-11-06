// Checks which web fonts the built pages load. Run after `astro build`
// (`npm test` does both).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('pages load the friendly font pairing', () => {
  for (const family of ['Outfit', 'Literata', 'JetBrains\\+Mono']) {
    assert.match(home, new RegExp(`fonts\\.googleapis\\.com/css2\\?[^"]*family=${family}`));
  }
  assert.doesNotMatch(home, /family=Fraunces|family=Newsreader/);
});
