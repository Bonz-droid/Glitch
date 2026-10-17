import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'GLITCH — A beautiful error. $GLTCH', description: 'One robot. Too many memes. Zero promises. GLITCH is an AI-inspired meme coin experiment on Solana devnet.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
