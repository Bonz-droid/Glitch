import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', fullyParallel: true, retries: 0, workers: 2,
  use: { baseURL: 'http://127.0.0.1:4173/Glitch/', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory preview', url: 'http://127.0.0.1:4173/Glitch/', reuseExistingServer: false },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: {width:1440,height:1000} } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: {width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 } },
  ],
});
