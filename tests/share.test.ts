import test from 'node:test';
import assert from 'node:assert/strict';
import { shareContent } from '../app/lib/share.ts';
const url = 'https://bonz-droid.github.io/Glitch/#memes';
const file = new File(['png'], 'meme.png', { type: 'image/png' });

test('supported file sharing sends the prepared file in the initial call', async () => {
  let data: ShareData | undefined;
  const result = await shareContent({canShare: () => true, share: async value => { data = value; }}, 'Hello', url, file);
  assert.equal(result.kind, 'shared-file');
  assert.equal(data?.files?.[0], file);
  assert.equal(data?.url, undefined);
});
test('unsupported file share falls back to native link sharing', async () => {
  let data: ShareData | undefined;
  const result = await shareContent({canShare: () => false, share: async value => { data = value; }}, 'Hi', url, file);
  assert.equal(result.kind, 'shared-link');
  assert.equal(data?.url, url);
  assert.equal(data?.files, undefined);
});
test('user cancellation does not copy or start another share', async () => {
  const result = await shareContent({share: async () => { throw new DOMException('Cancelled', 'AbortError'); }, writeText: async () => { assert.fail('Unexpected clipboard access'); }}, 'Hi', url);
  assert.equal(result.kind, 'cancelled');
});
test('denied native share uses clipboard; clipboard denial offers manual text', async () => {
  let copied = '';
  const denied = {share: async () => { throw new DOMException('Denied', 'NotAllowedError'); }};
  assert.equal((await shareContent({...denied, writeText: async value => {copied = value;}}, 'My meme', url)).kind, 'copied');
  assert.ok(copied.includes('My meme'));
  assert.ok(copied.includes(url));
  const result = await shareContent({writeText: async () => {throw new Error('Blocked');}}, 'My meme', url);
  assert.equal(result.kind, 'manual');
  assert.ok(result.text.includes(url));
  assert.equal((await shareContent({}, 'Hi', url)).kind, 'manual');
});
