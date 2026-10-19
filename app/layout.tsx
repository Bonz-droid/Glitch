import type { Metadata } from 'next';
import { siteUrl } from './lib/site-config';
import './globals.css';

const title = 'GLITCH — A beautiful error. $GLTCH';
const description = 'Make your own G–01 memes. One robot. Too many memes. Zero promises. An AI-inspired experiment on Solana devnet.';
const image = { url: new URL('og.png', siteUrl).href, width: 1200, height: 630, alt: 'GLITCH Meme Lab with the crowned G–01 robot. Make memes. Break the simulation.' };
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title, description,
  alternates: { canonical: siteUrl },
  openGraph: { type: 'website', locale: 'en_US', siteName: 'GLITCH', title, description, url: siteUrl, images: [image] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
