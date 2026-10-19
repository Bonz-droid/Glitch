export const captions = [
  'WHEN THE BOT GETS THE MEME\nBUT YOU DON’T.',
  '404: SERIOUS PLAN\nNOT FOUND.',
  'I ASKED AI ABOUT THE FUTURE.\nIT SAID: LOL.',
  'THE MARKET SLEEPS.\nMY ROBOT POSTS.',
];
export const MAX_CAPTION_LENGTH = 120;
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
export const characters = (text: string) => Array.from(segmenter.segment(text), part => part.segment);
export const escapeXml = (text: string) => text.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[character]!));

export function prepareCaption(raw: string): { text: string; lines: string[]; error: string | null } {
  const text = raw.toWellFormed().normalize('NFC').replace(/\r\n?/g, '\n').replace(/\t/g, ' ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '').trim();
  if (!text) return { text, lines: [], error: 'Write a caption before generating your meme.' };
  if (characters(text).length > MAX_CAPTION_LENGTH) return { text, lines: [], error: 'Keep your caption to 120 characters or fewer.' };
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line: string[] = [];
    for (const word of paragraph.split(/ +/)) {
      const letters = characters(word);
      if (line.length && line.length + 1 + letters.length > 28) { lines.push(line.join('')); line = []; }
      if (line.length) line.push(' ');
      for (const letter of letters) {
        if (line.length === 28) { lines.push(line.join('')); line = []; }
        line.push(letter);
      }
    }
    lines.push(line.join(''));
  }
  return { text, lines, error: lines.length > 4 ? 'Use up to four lines. Shorten your caption or remove line breaks.' : null };
}

export function createMemeSvg(caption: string, robotMarkup: string): string {
  const prepared = prepareCaption(caption);
  if (prepared.error) throw new Error(prepared.error);
  // robotMarkup is exclusively our own rendered Robot SVG, never user-supplied HTML.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img"><title>G–01 meme: ${escapeXml(prepared.text)}</title><defs><radialGradient id="backdrop"><stop stop-color="#492368"/><stop offset="1" stop-color="#0a090d"/></radialGradient></defs><rect width="1080" height="1080" fill="url(#backdrop)"/><path d="M0 180h1080M0 960h1080" stroke="#766184"/><text x="65" y="110" fill="#c0ff45" font-family="monospace" font-size="36">GLITCH // UNAUTHORIZED ORIGINAL</text><g transform="translate(277 130) scale(.82)">${robotMarkup}</g>${prepared.lines.map((line,index)=>`<text x="540" y="${800+index*43}" text-anchor="middle" fill="#f4f0ed" font-family="monospace" font-weight="bold" font-size="34">${escapeXml(line)}</text>`).join('')}<text x="65" y="1020" fill="#b78cfa" font-family="monospace" font-size="26">$GLTCH / DEVNET EXPERIMENT / NO REAL VALUE</text></svg>`;
}
