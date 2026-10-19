import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => { await page.goto(''); await expect(page.getByRole('button', {name:'Download PNG'})).toBeEnabled(); });

test('custom caption is previewed and exported safely in SVG and a real PNG', async ({ page }) => {
  await page.getByLabel('Your caption').fill('MY <GLITCH> & YOU\nHELLO G–01');
  await page.getByRole('button', {name:'Generate meme'}).click();
  await expect(page.getByAltText(/G–01 wearing a crown. Caption: MY/)).toBeVisible();
  const svgDownload = page.waitForEvent('download');
  await page.getByRole('button', {name:'Download SVG'}).click();
  const svgFile = await svgDownload;
  const svg = await readFile((await svgFile.path())!, 'utf8');
  expect(svg).toContain('MY &lt;GLITCH&gt; &amp; YOU');
  expect(svg).not.toContain('<GLITCH>');
  expect(await page.evaluate(text => new DOMParser().parseFromString(text,'image/svg+xml').querySelector('parsererror')?.textContent || '', svg)).toBe('');
  await expect(page.getByRole('button', {name:'Download PNG'})).toBeEnabled();
  const pngDownload = page.waitForEvent('download');
  await page.getByRole('button', {name:'Download PNG'}).click();
  const png = await readFile((await (await pngDownload).path())!);
  expect(png.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBe(1080);
  expect(png.length).toBeGreaterThan(10000);
});

test('invalid caption keeps the last generated meme; presets remain usable', async ({ page }) => {
  const input = page.getByLabel('Your caption');
  await input.fill('');
  await page.getByRole('button', {name:'Generate meme'}).click();
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('aria-invalid','true');
  await expect(page.getByAltText(/Caption: WHEN THE BOT/)).toBeVisible();
  await page.getByRole('button',{name:'Caption 2',exact:true}).click();
  await expect(input).toHaveValue('404: SERIOUS PLAN\nNOT FOUND.');
});

test('native share receives the prepared PNG without network upload', async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator,'canShare',{configurable:true,value:() => true});
    Object.defineProperty(navigator,'share',{configurable:true,value:async (data: ShareData) => {
      document.body.dataset.shared = `${data.files?.[0]?.type}:${data.files?.[0]?.name}`;
    }});
  });
  await page.getByRole('button',{name:'Share meme',exact:true}).click();
  await expect(page.locator('body')).toHaveAttribute('data-shared','image/png:glitch-meme.png');
  await expect(page.getByText('Meme sent to the share sheet.',{exact:true})).toBeVisible();
});

test('unsupported sharing and blocked clipboard expose selectable fallback text', async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator,'share',{configurable:true,value:undefined});
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('denied');}}});
  });
  await page.getByRole('button',{name:'Share page link'}).click();
  await expect(page.getByLabel('Copy this text manually')).toHaveValue(/https:\/\/bonz-droid.github.io\/Glitch\/#memes/);
  await page.getByLabel('Copy this text manually').focus();
  expect(await page.getByLabel('Copy this text manually').evaluate((element: HTMLTextAreaElement) => element.selectionEnd - element.selectionStart)).toBeGreaterThan(10);
});

test('page metadata references a valid pre-rendered Open Graph PNG under the base path', async ({ page, request }) => {
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://bonz-droid.github.io/Glitch/og.png');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
  const response = await request.get('og.png');
  expect(response.ok()).toBeTruthy();
  const bytes = await response.body();
  expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
});

test('editor controls fit mobile and desktop and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  const input = page.getByLabel('Your caption');
  await input.scrollIntoViewIfNeeded();
  const box = (await input.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x+box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(await page.locator('.robot-float').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await expect(page.getByRole('link',{name:'Follow on X'})).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Join Telegram'})).toHaveCount(0);
});
