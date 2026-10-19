import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalSiteUrl, communityUrl } from '../app/lib/site-config.ts';

test('community configuration accepts HTTPS profiles and Telegram invites', () => {
  assert.equal(communityUrl('https://x.com/bonz_droid', 'x'), 'https://x.com/bonz_droid');
  assert.equal(communityUrl('https://t.me/example_channel', 'telegram'), 'https://t.me/example_channel');
  assert.ok(communityUrl('https://t.me/+abc123_xyz', 'telegram'));
});
test('missing, wrong-platform and executable URLs never produce community buttons', () => {
  for (const value of [undefined, '', 'javascript:alert(1)', 'http://x.com/test', 'https://x.com.evil.test/a', 'https://u:p@x.com/test', 'https://x.com/intent', 'https://x.com/test?x=1']) assert.equal(communityUrl(value, 'x'), null);
  for (const value of ['https://evil.test/channel', 'https://t.me/share', 'https://x.com/a']) assert.equal(communityUrl(value, 'telegram'), null);
});
test('canonical URLs preserve deployment subpaths and reject unsafe schemes', () => {
  assert.equal(canonicalSiteUrl(), 'https://bonz-droid.github.io/Glitch/');
  assert.equal(canonicalSiteUrl('https://example.org/app'), 'https://example.org/app/');
  assert.throws(() => canonicalSiteUrl('javascript:alert(1)'));
  assert.throws(() => canonicalSiteUrl('https://user:pass@example.org'));
});
