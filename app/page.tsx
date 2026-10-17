'use client';

import { useRef, useState } from 'react';
import { Robot } from './components/robot';
import { captions, createMemeSvg } from './lib/memes';

function Arrow() { return <span aria-hidden="true">↗</span>; }
function Graffiti({ className = '' }: { className?: string }) {
  return <svg className={`graffiti ${className}`} viewBox="0 0 260 170" fill="none" aria-hidden="true"><path d="m27 125 41-89-2 105 57-109-17 112 64-92-18 101M14 110l211-40M19 146l216-28m-42-71 12-31 13 25 22-28-2 38-45-4Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/><path d="m68 138-3 22m45-23-1 25m52-32-4 17" stroke="currentColor" strokeWidth="3"/></svg>;
}

export default function Home() {
  const [meme, setMeme] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const memeArt = useRef<HTMLDivElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${captions[meme]} #GLITCH $GLTCH`);
      setCopyStatus('Caption copied ✓');
    } catch {
      setCopyStatus('Clipboard unavailable: select the caption on the poster to copy it.');
    }
  }

  function download() {
    const robot = memeArt.current?.querySelector('svg');
    if (!robot) return;
    const svg = createMemeSvg(captions[meme], robot.innerHTML);
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'glitch-meme.svg';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className={paused ? 'site paused' : 'site'}>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="GLITCH, back to top">GLITCH<span>✳</span></a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a><a href="#tokenomics">Tokenomics</a><a href="#memes">Memes</a><a href="#community">Community</a>
        </nav>
        <a className="header-link" href="#community">JOIN THE ERROR <Arrow/></a>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-wall" aria-hidden="true"/>
          <div className="hero-grid" aria-hidden="true"/>
          <div className="hero-topline mono"><span><i className="status-dot"/> SOLANA DEVNET EXPERIMENT</span><span>UNAUTHORIZED. UNFILTERED. UNFIXABLE.</span></div>
          <h1 id="hero-title" className="hero-title" data-text="GLITCH">GLITCH</h1>
          <span className="hero-scribble" aria-hidden="true">system reject.</span>
          <div className="hero-story">
            <span className="eyebrow">AI BRAIN. INTERNET SOUL.</span>
            <p className="slogan" lang="en">They tried to fix the bug.<br/><strong>The bug became<br/>the feature.</strong></p>
            <p className="hero-description">One robot off-script.<br/>One meme coin born from chaos.<br/>Welcome to the weird side of Solana.</p>
            <div className="actions"><a className="button primary" href="#memes">ENTER THE MEME LAB <Arrow/></a><a className="text-link" href="#about">Decode GLITCH <span aria-hidden="true">↓</span></a></div>
          </div>
          <div className="hero-art">
            <div className="halo" aria-hidden="true"/>
            <span className="robot-coordinate mono" aria-hidden="true">SUBJECT_001<br/>STATUS: UNFIXABLE</span>
            <Robot/>
            <Graffiti className="hero-graffiti"/>
            <div className="robot-sticker" aria-hidden="true">NOT A BUG.<br/><b>A CULT FEATURE.</b></div>
            <span className="art-caption mono">G–01 / KING OF THE GLITCH</span>
          </div>
          <div className="hero-footer mono"><span><b>$GLTCH</b> / ZERO BUDGET. PURE CULTURE.</span><button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? '▶ Enable animations' : 'Ⅱ Pause animations'}</button><a href="#about">SCROLL TO INFECT <span aria-hidden="true">↓</span></a></div>
        </section>

        <div className="tape" aria-hidden="true"><div>✳ NO PERFECT CODE. ONLY PERFECT CHAOS. <span>✳ $GLTCH</span> ✳ BUILT DIFFERENT. BROKEN ON PURPOSE. <span>✳ $GLTCH</span></div></div>

        <section id="about" className="section about" aria-labelledby="about-title">
          <div className="section-index mono"><span>01 / ORIGIN STORY</span><span>THE SYSTEM DIDN’T PLAN FOR THIS.</span></div>
          <div className="about-layout">
            <div className="about-poster"><span className="poster-label mono">REJECTED BY THE SYSTEM / ADOPTED BY THE INTERNET</span><div className="poster-type" aria-hidden="true">ERROR<br/><span>IS AN</span><br/>ART FORM.</div><Graffiti/><span className="poster-stamp">100%<br/>UNFIXABLE</span><span className="poster-bottom mono">[ THIS IS NOT A SOFTWARE UPDATE. ]</span></div>
            <div className="about-copy"><p className="eyebrow">MEET YOUR FAVORITE MALFUNCTION.</p><h2 id="about-title">Born broken.<br/><em>Built for cult status.</em></h2><p className="lead">They promised us perfect robots.<br/>Ours discovered memes.</p><p>GLITCH is an AI-inspired meme coin concept: internet culture, human creativity, and a robot that refuses to take itself seriously. G–01 is our mascot, not a trading agent.</p><p>We’re starting from zero on Solana devnet. An open lab for experimenting with an SPL token and building an identity together. No promises of returns. Just room for ideas.</p><div className="manifesto"><span>01 <b>AI inspired</b></span><span>02 <b>Community first</b></span><span>03 <b>Devnet only</b></span></div></div>
          </div>
        </section>

        <section id="tokenomics" className="section tokenomics" aria-labelledby="token-title">
          <div className="section-index mono"><span>02 / TOKEN PROTOCOL</span><span>READ THE SOURCE. QUESTION THE HYPE.</span></div>
          <div className="section-heading"><h2 id="token-title">Chaos in the code.<br/><em>Clarity in the numbers.</em></h2><p>A proposal, not an allocation already distributed.<br/>Test tokens with no monetary value.</p></div>
          <div className="token-layout">
            <div className="supply-panel"><span className="eyebrow">TOTAL TEST SUPPLY / $GLTCH</span><strong>1.000.000.000</strong><div className="supply-meta mono"><span>SOLANA SPL</span><span>6 DECIMALS</span></div><div className="token-chart" role="img" aria-label="Proposed allocation: community 60%, ecosystem 20%, project reserve 15%, contributors 5%"><div className="chart-center"><span>GLTCH</span><small>EXPERIMENT_001</small></div></div><div className="protocol-note"><i className="status-dot"/><p>No freeze authority.<br/>Mint authority revoked after the test issuance.</p></div></div>
            <div className="allocations">{[['60', 'Community & meme rewards', 'THE INTERNET OWNS THE JOKE.'], ['20', 'Ecosystem & collaborations', 'BUILD SOMETHING STRANGE.'], ['15', 'Project reserve', 'ROOM FOR THE UNEXPECTED.'], ['5', 'Contributors', 'FOR THE HANDS BEHIND THE CHAOS.']].map(([amount, title, note], i) => <div className={`allocation allocation-${i}`} key={title}><span className="allocation-number mono">0{i+1}</span><div><h3>{title}</h3><small className="mono">{note}</small></div><strong>{amount}<span>%</span></strong></div>)}<p className="token-disclaimer">Conceptual allocation: the script deposits 100% into a test account. No liquidity, listings, or token sales.</p></div>
          </div>
        </section>

        <section id="memes" className="section memes" aria-labelledby="memes-title">
          <div className="section-index mono"><span>03 / THE MEME LAB</span><span>YOUR BROWSER IS THE UNDERGROUND.</span></div>
          <div className="section-heading"><h2 id="memes-title">MAKE MEMES.<br/><em>BREAK THE SIMULATION.</em></h2><p>Your first contribution? A terrible joke.<br/>Remix the chaos. Take it everywhere.</p></div>
          <div className="meme-layout">
            <div className="meme-poster-wrap"><span className="poster-tape" aria-hidden="true"/><div className="meme-card"><div className="meme-top mono"><span>GLITCH / UNAUTHORIZED ORIGINAL</span><span>#{String(meme+1).padStart(3,'0')}</span></div><span className="meme-bg-type" aria-hidden="true">ERROR</span><div ref={memeArt} className="meme-art"><Robot/></div><p className="meme-caption" aria-live="polite">{captions[meme]}</p><div className="meme-watermark mono"><span>$GLTCH</span><span>NO THOUGHTS. JUST GLITCH.</span></div></div><span className="meme-handwriting" aria-hidden="true">steal this meme ↗</span></div>
            <div className="meme-controls"><span className="terminal-label mono"><i className="status-dot"/> MEME_ENGINE.EXE / READY</span><h3>Your next<br/><em>favorite mistake.</em></h3><p>Pick a caption, download your meme as an SVG, and share it wherever you like. No account. No cost.</p><div className="meme-selector" role="group" aria-label="Choose a caption">{captions.map((_, i) => <button type="button" key={i} aria-label={`Caption ${i+1}`} aria-pressed={meme===i} onClick={() => {setMeme(i);setCopyStatus('');}}>0{i+1}</button>)}</div><button type="button" className="button primary" onClick={() => {setMeme((meme+1)%captions.length);setCopyStatus('');}}>Switch frequency <span aria-hidden="true">⟳</span></button><button type="button" className="button secondary" onClick={download}>Download meme SVG <span aria-hidden="true">↓</span></button><button type="button" className="text-link" onClick={copy}>Copy caption <Arrow/></button><p className="copy-status" role="status">{copyStatus}</p><div className="lab-note mono"><span>100% LOCAL / €0</span><p>Preset captions, processed in your browser.<br/>No paid AI APIs.</p></div></div>
          </div>
        </section>

        <section id="community" className="community" aria-labelledby="community-title"><div className="community-grid" aria-hidden="true"/><Graffiti className="community-graffiti"/><p className="eyebrow">04 / FIND YOUR PEOPLE</p><h2 id="community-title">YOU ARE<br/>THE <span>GLITCH.</span></h2><p className="community-copy">Artists, builders, shitposters, and confused robots.<br/>There’s room for your kind of weird.</p><a className="button primary" href="https://github.com/Bonz-droid/Glitch" target="_blank" rel="noopener noreferrer">Contribute on GitHub <Arrow/></a><p className="community-note mono">OFFICIAL SOCIAL CHANNELS COMING LATER.<br/>NO PRESALE. NO MAINNET MINT.</p><span className="community-signature" aria-hidden="true">stay beautifully broken.</span></section>
      </main>
      <footer className="site-footer"><a className="wordmark" href="#">GLITCH<span>✳</span></a><p>An experiment, not an investment.<br/>$GLTCH is a devnet test token with no real-world value.</p><span className="mono">© 2026 GLITCH<br/>STAY WEIRD. STAY HUMAN.</span><a className="back-top" href="#" aria-label="Back to top">↑</a></footer>
    </div>
  );
}
