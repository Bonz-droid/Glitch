'use client';

import { useEffect, useRef, useState } from 'react';
import { Robot } from './robot';
import { captions, characters, createMemeSvg, MAX_CAPTION_LENGTH, prepareCaption } from '../lib/memes';
import { renderPng, saveBlob } from '../lib/export-meme';
import { shareContent } from '../lib/share';
import { siteUrl } from '../lib/site-config';

export function MemeLab() {
  const [preset, setPreset] = useState(0);
  const [draft, setDraft] = useState(captions[0]);
  const [caption, setCaption] = useState(captions[0]);
  const [art, setArt] = useState('');
  const [rendered, setRendered] = useState<{svg: string; blob: Blob} | null>(null);
  const [status, setStatus] = useState('');
  const [renderError, setRenderError] = useState('');
  const [manualText, setManualText] = useState('');
  const [sharing, setSharing] = useState(false);
  const robotRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const validation = prepareCaption(draft);
  const svg = art ? createMemeSvg(caption, art) : '';
  const png = rendered?.svg === svg ? rendered.blob : null;
  const changed = validation.text !== caption;

  useEffect(() => { setArt(robotRef.current?.querySelector('svg')?.innerHTML || ''); }, []);
  useEffect(() => {
    let active = true;
    setRendered(null);
    setRenderError('');
    if (svg) renderPng(svg).then(blob => { if (active) setRendered({svg, blob}); }).catch(() => {
      if (active) setRenderError('PNG could not be prepared. SVG download and link sharing are still available.');
    });
    return () => { active = false; };
  }, [svg]);

  function choosePreset(index: number) {
    setPreset(index);
    setDraft(captions[index]);
    setCaption(captions[index]);
    setStatus(`Preset ${index + 1} generated.`);
    setManualText('');
  }

  async function copy() {
    const text = `${caption} #GLITCH $GLTCH`;
    try {
      await navigator.clipboard.writeText(text);
      setManualText('');
      setStatus('Caption copied.');
    } catch {
      setManualText(text);
      setStatus('Clipboard unavailable. Select and copy the text below.');
    }
  }

  async function share(withImage: boolean) {
    setSharing(true);
    setManualText('');
    // The PNG is prepared in advance so navigator.share is called during the click gesture.
    const file = withImage && png ? new File([png], 'glitch-meme.png', { type: 'image/png' }) : undefined;
    const result = await shareContent({
      share: navigator.share?.bind(navigator),
      canShare: navigator.canShare?.bind(navigator),
      writeText: navigator.clipboard?.writeText.bind(navigator.clipboard),
    }, caption, `${siteUrl}#memes`, file);
    const messages = {
      'shared-file': 'Meme sent to the share sheet.',
      'shared-link': 'Caption and page link sent to the share sheet. Download the PNG to attach the image separately.',
      copied: 'Caption and page link copied. Download the PNG to attach your meme.',
      manual: 'Sharing and clipboard unavailable. Select the text below, copy it, and attach your downloaded meme.',
      cancelled: 'Sharing cancelled. Your meme is still here.',
    };
    setStatus(messages[result.kind]);
    if (result.kind === 'manual') setManualText(result.text);
    setSharing(false);
  }

  return <div className="meme-layout">
    <div className="meme-poster-wrap"><span className="poster-tape" aria-hidden="true"/>
      <div ref={robotRef} hidden aria-hidden="true"><Robot/></div>
      <div className="meme-card generated-card">
        {svg ? <img className="generated-meme" src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} width="1080" height="1080" alt={`G–01 wearing a crown. Caption: ${caption}`}/> : <div className="meme-loading">Preparing G–01…</div>}
      </div>
      <span className="meme-handwriting" aria-hidden="true">steal this meme ↗</span>
    </div>
    <div className="meme-controls">
      <span className="terminal-label mono"><i className="status-dot"/> MEME_ENGINE.EXE / LOCAL MODE</span>
      <h3>Your next<br/><em>favorite mistake.</em></h3>
      <p>Write your own caption or remix a preset. Generate a G–01 meme, then save or share it. No account. No cost.</p>
      <div className="meme-selector" role="group" aria-label="Choose a preset caption">{captions.map((text, index) => <button type="button" key={index} aria-label={`Caption ${index+1}`} aria-pressed={draft === text} onClick={() => choosePreset(index)}>0{index+1}</button>)}</div>
      <form onSubmit={event => {
        event.preventDefault();
        if (validation.error) { inputRef.current?.focus(); return; }
        setCaption(validation.text);
        setManualText('');
        setStatus('Meme generated. The preview and downloads use your caption.');
      }}>
        <label className="caption-label" htmlFor="custom-caption">Your caption</label>
        <textarea id="custom-caption" ref={inputRef} rows={4} value={draft} aria-describedby="caption-help caption-count caption-error" aria-invalid={!!validation.error} onChange={event => {setDraft(event.target.value);setStatus('');setManualText('');}}/>
        <div className="caption-details"><span id="caption-help">Up to 120 characters and four wrapped lines.</span><span id="caption-count">{characters(draft).length}/{MAX_CAPTION_LENGTH}</span></div>
        <p id="caption-error" className="caption-error" aria-live="polite">{validation.error || (changed ? 'Press Generate meme to apply your changes.' : 'Preview and downloads are up to date.')}</p>
        <button type="submit" className="button primary">Generate meme <span aria-hidden="true">↗</span></button>
      </form>
      <button type="button" className="text-link" onClick={() => choosePreset((preset+1)%captions.length)}>Switch frequency <span aria-hidden="true">⟳</span></button>
      <div className="meme-action-grid">
        <button type="button" className="button secondary" disabled={!svg} onClick={() => {saveBlob(new Blob([svg], {type:'image/svg+xml'}), 'glitch-meme.svg');setStatus('SVG download started.');}}>Download SVG <span aria-hidden="true">↓</span></button>
        <button type="button" className="button secondary" disabled={!png} onClick={() => {if (png) {saveBlob(png, 'glitch-meme.png');setStatus('PNG download started.');}}}>Download PNG <span aria-hidden="true">↓</span></button>
        <button type="button" className="button secondary" disabled={!png || sharing} onClick={() => share(true)}>Share meme <span aria-hidden="true">↗</span></button>
        <button type="button" className="button secondary" disabled={sharing} onClick={() => share(false)}>Share page link <span aria-hidden="true">↗</span></button>
      </div>
      <p className="render-status" role="status">{renderError || (!png ? 'Preparing PNG…' : 'PNG ready · 1080 × 1080')}</p>
      <button type="button" className="text-link" onClick={copy}>Copy caption <span aria-hidden="true">↗</span></button>
      <p className="copy-status" role="status">{status}</p>
      {manualText && <div className="manual-share"><label htmlFor="share-text">Copy this text manually</label><textarea id="share-text" readOnly value={manualText} rows={5} onFocus={event => event.target.select()}/></div>}
      <div className="lab-note mono"><span>100% LOCAL / €0</span><p>Your caption stays in this browser until you choose to share it.<br/>Page links show the GLITCH preview, not your private custom caption.</p></div>
    </div>
  </div>;
}
