import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'GLITCH — A beautiful error. $GLTCH', description: 'Un robot, troppi meme, zero promesse. GLITCH è un esperimento AI meme coin su Solana devnet.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="it"><body>{children}</body></html>; }
