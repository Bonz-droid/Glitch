export const captions = [
  'WHEN THE BOT GETS THE MEME\nBUT YOU DON’T.',
  '404: SERIOUS PLAN\nNOT FOUND.',
  'I ASKED AI ABOUT THE FUTURE.\nIT SAID: LOL.',
  'THE MARKET SLEEPS.\nMY ROBOT POSTS.',
];
const escapeXml = (text: string) => text.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[character]!));

export function createMemeSvg(caption: string, robotMarkup: string): string {
  // robotMarkup comes only from our own rendered SVG, never from user input.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><defs><radialGradient id="backdrop"><stop stop-color="#492368"/><stop offset="1" stop-color="#0a090d"/></radialGradient></defs><rect width="1080" height="1080" fill="url(#backdrop)"/><path d="M0 180h1080M0 940h1080" stroke="#766184"/><text x="65" y="110" fill="#c0ff45" font-family="monospace" font-size="36">GLITCH // UNAUTHORIZED ORIGINAL</text><g transform="translate(260 145) scale(.875)">${robotMarkup}</g>${caption.split('\n').map((line,index)=>`<text x="540" y="${825+index*55}" text-anchor="middle" fill="#f4f0ed" font-family="monospace" font-weight="bold" font-size="34">${escapeXml(line)}</text>`).join('')}<text x="65" y="1010" fill="#b78cfa" font-family="monospace" font-size="26">$GLTCH / DEVNET EXPERIMENT / NO REAL VALUE</text></svg>`;
}
