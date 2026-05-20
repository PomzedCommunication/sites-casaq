import { headers } from 'next/headers';

export async function getCurrentDomain(searchParams?: {
  site?: string;
}): Promise<string> {
  if (searchParams?.site) {
    return normalizeDomain(searchParams.site);
  }

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const domain = normalizeDomain(host);

  if (domain === 'localhost' || domain === '127.0.0.1') {
    return 'novimmob.ch';
  }

  return domain;
}

export function normalizeDomain(host: string): string {
  return host
      .replace(/^https?:\/\//, '')
      .replace(/:\d+$/, '')
      .replace(/^www\./, '')
      .toLowerCase()
      .trim();
}