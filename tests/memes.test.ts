import test from 'node:test';
import assert from 'node:assert/strict';
import { captions, createMemeSvg } from '../app/lib/memes.ts';

test('all original captions export with both lines and the supplied mascot artwork', () => {
  assert.equal(captions.length, 4);
  const robot = '<g id="robot"><circle cx="388" cy="246" r="30"/></g>';
  for (const caption of captions) {
    const result = createMemeSvg(caption, robot);
    assert.ok(result.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
    assert.ok(result.includes(robot));
    for (const line of caption.split('\n')) assert.ok(result.includes(line));
    assert.ok(result.includes('DEVNET EXPERIMENT / NO REAL VALUE'));
    assert.ok(result.endsWith('</svg>'));
  }
});

test('caption text cannot inject markup into a downloaded SVG', () => {
  const result = createMemeSvg('<script>alert("x")</script> & test', '<g/>');
  assert.ok(!result.includes('<script>'));
  assert.ok(result.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; test'));
});
