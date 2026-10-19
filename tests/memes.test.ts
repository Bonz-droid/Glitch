import test from 'node:test';
import assert from 'node:assert/strict';
import { captions, characters, createMemeSvg, prepareCaption } from '../app/lib/memes.ts';

test('all presets export their caption and supplied mascot artwork', () => {
  const art = '<g id="robot"><circle cx="388" cy="246" r="30"/></g>';
  for (const caption of captions) {
    const svg = createMemeSvg(caption, art);
    assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
    assert.ok(svg.includes(art));
    for (const line of prepareCaption(caption).lines) assert.ok(svg.includes(line));
    assert.ok(svg.includes('DEVNET EXPERIMENT / NO REAL VALUE'));
    assert.ok(svg.endsWith('</svg>'));
  }
});
test('custom captions cannot inject executable SVG or invalid XML controls', () => {
  const svg = createMemeSvg('<script>alert("x")</script> & test\u0000', '<g/>');
  assert.ok(!svg.includes('<script>'));
  assert.ok(!svg.includes('\u0000'));
  assert.ok(svg.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'));
  assert.ok(svg.includes('&amp; test'));
});
test('caption wrapping preserves content and handles long words and grapheme clusters', () => {
  const result = prepareCaption('a'.repeat(60));
  assert.equal(result.error, null);
  assert.equal(result.lines.join(''), 'a'.repeat(60));
  assert.deepEqual(result.lines.map(line => line.length), [28, 28, 4]);
  const family = '👨‍👩‍👧‍👦';
  assert.equal(characters(family).length, 1);
  assert.equal(prepareCaption(family.repeat(29)).lines.length, 2);
  assert.equal(prepareCaption('a\r\nb').text, 'a\nb');
});
test('empty, excessive or too-many-line captions are rejected without silent truncation', () => {
  for (const text of ['   ', 'a'.repeat(121), '1\n2\n3\n4\n5']) {
    assert.ok(prepareCaption(text).error);
    assert.throws(() => createMemeSvg(text, '<g/>'));
  }
});
