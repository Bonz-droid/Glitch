import { useId } from 'react';

/** Original vector artwork: scalable, local and shared with the meme export. */
export function Robot({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={`robot ${className}`} viewBox="0 0 640 720" role="img" aria-label="G–01, robot con corona neon, occhio sinistro a X e occhio destro circolare">
      <defs>
        <linearGradient id={`${id}-shell`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c6bdd8"/><stop offset=".18" stopColor="#5c536e"/><stop offset=".5" stopColor="#292532"/><stop offset=".83" stopColor="#17151f"/><stop offset="1" stopColor="#786685"/></linearGradient>
        <linearGradient id={`${id}-edge`}><stop stopColor="#bdff43"/><stop offset=".5" stopColor="#8e789c"/><stop offset="1" stopColor="#a34dff"/></linearGradient>
        <linearGradient id={`${id}-crown`} x2="0" y2="1"><stop stopColor="#d8ff72"/><stop offset="1" stopColor="#77bd1c"/></linearGradient>
        <radialGradient id={`${id}-glass`}><stop stopColor="#22232a"/><stop offset="1" stopColor="#060709"/></radialGradient>
        <filter id={`${id}-glow`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <ellipse cx="323" cy="664" rx="173" ry="25" fill="#9a3dff" opacity=".16"/>
      <g className="robot-float">
        <g transform="rotate(-7 320 330)">
          <path d="m232 529-24 94 76 9 24-91m54-12 28 94-74 9-26-91" fill={`url(#${id}-shell)`} stroke="#70667f" strokeWidth="3"/>
          <path d="m210 611-25 29v13h98l11-24m94-18 28 29v13h-99l-12-24" fill="#27232f" stroke="#766580" strokeWidth="3"/>
          <path d="m196 359-47 22-37 100 31 24 54-75m244-71 45 22 39 100-31 24-53-75" fill={`url(#${id}-shell)`} stroke={`url(#${id}-edge)`} strokeWidth="3"/>
          <circle cx="148" cy="465" r="25" fill="#1a1721" stroke="#82758c" strokeWidth="4"/>
          <circle cx="491" cy="465" r="25" fill="#1a1721" stroke="#82758c" strokeWidth="4"/>
          <path d="m121 484-18 39 11 20 14-22 8 27 20-3 9-51m353-10 18 39-11 20-14-22-8 27-20-3-9-51" fill="#453b50" stroke="#84738f" strokeWidth="3"/>
          <path d="m222 350-31 36 24 154 40 22h127l37-22 25-154-31-36z" fill={`url(#${id}-shell)`} stroke={`url(#${id}-edge)`} strokeWidth="4"/>
          <path d="m224 386 23 129h143l23-129z" fill="#17151e" stroke="#685775" strokeWidth="2"/>
          <rect x="263" y="407" width="111" height="70" rx="8" fill="#090c0a" stroke="#526c3e"/>
          <path d="m283 444 22-22-5 37 23-20m10 6h20" fill="none" stroke="#beff48" strokeWidth="7"/>
          <path d="M280 496h66m-51 9h38" stroke="#807189" strokeWidth="3"/>
          <path d="M139 211h-24v79h24m360-79h24v79h-24" fill="#6e3ba3" stroke="#b78bdf" strokeWidth="3"/>
          <path d="m157 167 41-35h249l43 35 10 142-40 51H181l-42-51z" fill={`url(#${id}-shell)`} stroke={`url(#${id}-edge)`} strokeWidth="4"/>
          <path d="m178 192 27-23h222l31 25 6 104-27 29H203l-30-29z" fill={`url(#${id}-glass)`} stroke="#81738b" strokeWidth="4"/>
          <path d="m192 197 252-5-61 40H188z" fill="#c8d4f0" opacity=".06"/>
          <g fill="none" stroke="#bdff43" strokeWidth="15" strokeLinecap="square">
            <path d="m224 220 49 50m0-50-49 50"/>
            <circle cx="388" cy="246" r="30"/>
          </g>
          <g fill="none" stroke="#bdff43" strokeWidth="15" opacity=".6" filter={`url(#${id}-glow)`}><path d="m224 220 49 50m0-50-49 50"/><circle cx="388" cy="246" r="30"/></g>
          <path d="M293 299h53" stroke="#b9a7cb" strokeWidth="5"/>
          <path d="M304 291v16m14-16v16m14-16v16" stroke="#b9a7cb" strokeWidth="2"/>
          <path d="m202 146 28-8m185 3 25 12M158 305l18 19m292-20-17 22" stroke="#d3b8eb" strokeWidth="3"/>
          {[187,451].map(x=><g key={x}><circle cx={x} cy="343" r="5" fill="#bba8ca"/><path d={`m${x-3} 343h6`} stroke="#302537" strokeWidth="2"/></g>)}
          <g className="robot-crown"><path d="m227 117-18-72 61 31 47-61 42 61 62-31-17 72z" fill={`url(#${id}-crown)`} stroke="#e0ff99" strokeWidth="3"/><path d="M231 130h171" stroke="#bdff43" strokeWidth="10"/><path d="m317 72 13 19-13 16-13-16z" fill="#27252b"/><circle cx="209" cy="44" r="5" fill="#e3ffa8"/><circle cx="317" cy="14" r="5" fill="#e3ffa8"/><circle cx="421" cy="44" r="5" fill="#e3ffa8"/></g>
          <path d="m224 536 18-11m154 9-14-10" stroke="#b6ff3f" strokeWidth="4"/>
          <text x="327" y="546" textAnchor="middle" fill="#bbaacb" fontFamily="monospace" fontSize="12" letterSpacing="4">G—01</text>
        </g>
      </g>
    </svg>
  );
}
