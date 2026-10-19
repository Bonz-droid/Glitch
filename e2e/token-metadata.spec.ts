import { test, expect } from '@playwright/test';

test('prelaunch metadata and G-01 PNG are included in the static export', async ({ request }) => {
  const response = await request.get('token/glitch.json');
  expect(response.ok()).toBeTruthy();
  const metadata = await response.json();
  expect(metadata.name).toBe('GLITCH');
  expect(metadata.symbol).toBe('GLTCH');
  expect(metadata.image).toBe('https://bonz-droid.github.io/Glitch/token/g-01.png');
  const pngResponse = await request.get('token/g-01.png');
  expect(pngResponse.ok()).toBeTruthy();
  const bytes = await pngResponse.body();
  expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBe(512);
  expect(bytes.readUInt32BE(20)).toBe(512);
  expect(bytes.length).toBeGreaterThan(1000);
});
