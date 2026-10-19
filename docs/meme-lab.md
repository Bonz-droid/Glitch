# Meme Lab, sharing and Community

The English landing page keeps its cyberpunk design and renders G–01 memes entirely in the browser. No accounts, database, external image service, API key or trading functionality is involved.

## Caption editor and downloads

Choose one of the four original presets or write a custom caption. Press **Generate meme** to apply it; editing the field alone does not change the generated preview or downloads. Captions must be non-empty, at most 120 grapheme clusters, and fit in four wrapped lines of up to 28 graphemes. Overlong input shows an error rather than silently truncating text. SVG text is XML-escaped; control characters are removed. The renderer accepts mascot markup only from the built-in Robot component.

The displayed SVG and downloaded SVG use the same source. The browser rasterizes that SVG into a 1080 × 1080 PNG using canvas. PNG generation failures preserve SVG export. There are no remote images or fonts to taint the canvas. Emoji and non-Latin glyph rendering depends on fonts available on the user's device.

## Sharing behavior

- **Share meme** sends the prepared PNG to the native Web Share API when file sharing is supported. Preparing the image in advance preserves the click gesture required on mobile.
- When file sharing is unavailable, the native share sheet receives a caption and page link instead. The UI explains that the image must be attached separately.
- If native sharing is missing or denied, caption and link are copied to the clipboard. If clipboard access is also blocked, a labelled, selectable text field appears.
- Cancelling the native dialog does not copy text or open a second dialog.
- **Share page link** shares the caption and the public Meme Lab URL without a file. **Copy caption** remains available independently.

Native sharing and clipboard availability depend on HTTPS, browser support, user gesture, permissions, and installed share targets. Native OS dialogs are not covered by automated tests; their API payloads, cancellation and fallbacks are mocked in tests. Captions are never uploaded automatically, placed in URL parameters, or persisted. A public page link opens the default editor; it does not recreate someone's custom meme. Download/share the image to distribute a specific meme.

## Open Graph and X cards

`app/og.png/route.tsx` generates a 1200 × 630 PNG at build time. Static export includes `out/og.png`; no runtime image server is needed. Metadata contains absolute canonical, Open Graph and Twitter/X large-image URLs. The preview is the public GLITCH/G–01 artwork, not a visitor's private caption. Social platforms must be able to fetch the deployed public URL and may cache previews.

`NEXT_PUBLIC_SITE_URL` defaults to `https://bonz-droid.github.io/Glitch/`. For another hosting provider, set it to the actual HTTPS site URL including any deployment subpath. Set `NEXT_PUBLIC_BASE_PATH` to the matching path (empty for a root domain). Rebuild after changing either value.

## Official Community links

No official X or Telegram URLs were supplied during implementation. Buttons are therefore hidden by default rather than pointing to invented accounts. Configure actual owner-verified URLs at build time:

- `NEXT_PUBLIC_X_URL`: an HTTPS X/Twitter profile URL.
- `NEXT_PUBLIC_TELEGRAM_URL`: an HTTPS `t.me` channel/group or invite URL.
- `NEXT_PUBLIC_SITE_URL`: the deployed landing URL used for sharing and metadata.

Blank or invalid social URLs hide the corresponding button; GitHub stays visible. Validation checks platform host, HTTPS, URL shape, absence of credentials and unsafe query strings. It does not verify who owns a profile: confirm ownership before configuring a URL.

For GitHub Pages, add these public values under **Settings → Secrets and variables → Actions → Variables**. The manual Pages workflow reads the repository variables. Leave unknown social URLs blank. For local development, copy `.env.example` to `.env.local` and edit it. These `NEXT_PUBLIC_*` values are public and must never contain secrets. A rebuild/deploy is required for changes to appear.

## Verification

```sh
npm install
npm run typecheck
npm test
NEXT_PUBLIC_BASE_PATH=/Glitch npm run build
npm run devnet -- --plan
npm audit --omit=dev --audit-level=high
npx playwright install --with-deps chromium
mkdir -p preview
cp -R out preview/Glitch
npm run test:browser
```

The browser suite exercises desktop and mobile viewports, custom captions, invalid input, SVG parsing/escaping, PNG signatures and dimensions, native-share payloads, denied clipboard fallback, Open Graph metadata/PNG, control widths, and reduced motion. Tests run against the static export under `/Glitch`, matching GitHub Pages. Playwright is a free development-only dependency. CI does not execute blockchain transactions.
