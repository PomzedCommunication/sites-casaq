import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_CASAQ_API_URL?.replace(/\/+$/, '') ||
    process.env.CASAQ_API_URL?.replace(/\/+$/, '') ||
    '';

export type CasaqLink = {
  label?: string;
  url?: string;
  target_blank?: boolean;
};

export function blockData<T extends Record<string, unknown> = Record<string, unknown>>(
    bloc: CasaqBloc,
): T {
  return (bloc.data || {}) as T;
}

export function siteAssetUrl(
    value?: string | null,
    fallback?: string,
): string | undefined {
  const path = String(value || '').trim();

  if (!path) {
    return fallback;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, '');

  if (!API_BASE_URL) {
    return `/${cleanPath}`;
  }

  return `${API_BASE_URL}/${cleanPath}`;
}

export function getLinkProps(link?: CasaqLink | string | null) {
  if (!link) {
    return null;
  }

  if (typeof link === 'string') {
    const href = link.trim();

    if (!href) {
      return null;
    }

    return {
      href,
      label: '',
      target: undefined,
      rel: undefined,
      isExternal: isExternalUrl(href),
    };
  }

  const href = String(link.url || '').trim();

  if (!href) {
    return null;
  }

  const external = isExternalUrl(href);

  return {
    href,
    label: String(link.label || '').trim(),
    target: link.target_blank || external ? '_blank' : undefined,
    rel: link.target_blank || external ? 'noopener noreferrer' : undefined,
    isExternal: external,
  };
}

export function withPreviewUrl(url: string, previewDomain?: string): string {
  if (!previewDomain) {
    return url;
  }

  if (isExternalUrl(url)) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}

export function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:');
}

export function agencyName(site: CasaqSiteConfig): string {
  return site.agence?.nom || '';
}