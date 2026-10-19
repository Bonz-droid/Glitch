import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-static';
export async function GET() {
  const svg = await readFile(join(process.cwd(), 'public/token/g-01.svg'));
  return new ImageResponse(
    <img src={`data:image/svg+xml;base64,${svg.toString('base64')}`} width={512} height={512} alt="GLITCH mascot G-01"/>,
    { width: 512, height: 512 },
  );
}
