import assert from 'node:assert/strict';
import { test } from 'node:test';
import { allStopsMapUrl } from '../src/lib/map.ts';

test('one stop opens a search for its place in Jakarta', () => {
  const url = allStopsMapUrl([{ name: 'Fair', place: 'JIExpo Kemayoran / Hall A' }]);
  assert.equal(url, 'https://www.google.com/maps/search/?api=1&query=JIExpo%20Kemayoran%2C%20Jakarta%2C%20Indonesia');
});

test('no geocodable stop gives no link', () => {
  assert.equal(allStopsMapUrl([{ name: ' ', place: ' ' }]), undefined);
});
