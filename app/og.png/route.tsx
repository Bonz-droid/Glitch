import { ImageResponse } from 'next/og';

// Pre-rendered into out/og.png by the static export. No server or remote fonts.
export const dynamic = 'force-static';
export function GET() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0c0912', color: '#f4f0ed', padding: 64, alignItems: 'center', border: '8px solid #ac6fff' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: 650 }}>
        <span style={{ fontSize: 23, color: '#beff45', letterSpacing: 4 }}>GLITCH / MEME LAB</span>
        <span style={{ fontSize: 110, fontWeight: 900, letterSpacing: -7, marginTop: 20 }}>GLITCH</span>
        <span style={{ fontSize: 34, marginTop: 20 }}>MAKE MEMES.</span>
        <span style={{ fontSize: 34, color: '#ac6fff' }}>BREAK THE SIMULATION.</span>
        <span style={{ fontSize: 18, marginTop: 48, color: '#c5b7d0' }}>$GLTCH · DEVNET EXPERIMENT · ZERO COST</span>
      </div>
      <svg width="360" height="440" viewBox="0 0 360 440">
        <path d="m76 105-16-72 66 32 54-54 50 54 68-32-18 72z" fill="#beff45" stroke="#e5ffae" strokeWidth="4"/>
        <path d="M78 120h200" stroke="#beff45" strokeWidth="8"/>
        <rect x="42" y="145" width="276" height="175" rx="32" fill="#51415f" stroke="#ac6fff" strokeWidth="5"/>
        <rect x="64" y="167" width="232" height="124" rx="18" fill="#090b10"/>
        <path d="m94 199 47 47m0-47-47 47" stroke="#beff45" strokeWidth="13"/>
        <circle cx="240" cy="225" r="28" fill="none" stroke="#beff45" strokeWidth="12"/>
        <path d="M159 276h42" stroke="#d3bbdf" strokeWidth="5"/>
        <path d="m86 336 20 82h148l20-82z" fill="#51415f" stroke="#ac6fff" strokeWidth="4"/>
        <path d="m162 377 22-23-4 41 22-24" fill="none" stroke="#beff45" strokeWidth="7"/>
      </svg>
    </div>,
    { width: 1200, height: 630 },
  );
}
