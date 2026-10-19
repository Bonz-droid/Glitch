export interface ShareServices {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
  writeText?: (text: string) => Promise<void>;
}
export type ShareResult = { kind: 'shared-file' | 'shared-link' | 'copied' | 'manual' | 'cancelled'; text: string };

export async function shareContent(services: ShareServices, caption: string, url: string, file?: File): Promise<ShareResult> {
  const text = `${caption}\n#GLITCH $GLTCH\n${url}`;
  if (services.share) {
    try {
      const files = file ? [file] : undefined;
      let supportsFiles = false;
      try { supportsFiles = !!files && !!services.canShare?.({ files }); } catch { /* Fall back to sharing a link. */ }
      if (supportsFiles) {
        await services.share({ title: 'GLITCH Meme Lab', text: `${caption}\n#GLITCH $GLTCH`, files });
        return { kind: 'shared-file', text };
      }
      await services.share({ title: 'GLITCH Meme Lab', text: `${caption}\n#GLITCH $GLTCH`, url });
      return { kind: 'shared-link', text };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return { kind: 'cancelled', text };
    }
  }
  try {
    if (services.writeText) {
      await services.writeText(text);
      return { kind: 'copied', text };
    }
  } catch { /* HTTPS, browser policy or permissions may block the clipboard. */ }
  return { kind: 'manual', text };
}
