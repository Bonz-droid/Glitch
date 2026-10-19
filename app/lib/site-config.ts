export function communityUrl(value: string | undefined, network: 'x' | 'telegram'): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash) return null;
    if (network === 'x') {
      if (!['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(url.hostname)) return null;
      if (!/^\/[A-Za-z0-9_]{1,15}\/?$/.test(url.pathname)) return null;
      if (['home', 'intent', 'share', 'search', 'settings', 'i'].includes(url.pathname.split('/')[1].toLowerCase())) return null;
    } else {
      if (url.hostname !== 't.me') return null;
      if (!/^\/(?:[A-Za-z0-9_]{5,32}|\+[A-Za-z0-9_-]+|joinchat\/[A-Za-z0-9_-]+)\/?$/.test(url.pathname)) return null;
      if (['share', 'proxy', 'socks'].includes(url.pathname.split('/')[1].toLowerCase())) return null;
    }
    return url.href;
  } catch { return null; }
}

export function canonicalSiteUrl(value?: string): string {
  const url = new URL(value || 'https://bonz-droid.github.io/Glitch/');
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an absolute HTTPS site URL without credentials, query or fragment.');
  }
  return url.href.replace(/\/?$/, '/');
}

export const siteUrl = canonicalSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const community = {
  x: communityUrl(process.env.NEXT_PUBLIC_X_URL, 'x'),
  telegram: communityUrl(process.env.NEXT_PUBLIC_TELEGRAM_URL, 'telegram'),
};
