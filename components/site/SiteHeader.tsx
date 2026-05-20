import Link from 'next/link';
import type { CasaqSiteConfig } from '@/lib/casaq';

type Props = {
    site: CasaqSiteConfig;
    previewDomain?: string;
};

export function SiteHeader({ site, previewDomain }: Props) {
    const secondary = site.config.couleur_secondaire || '#1e293b';

    return (
        <header
            style={{
                padding: '24px 48px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e5e7eb',
                background: 'white',
            }}
        >
            <Link
                href={buildUrl('/', previewDomain)}
                style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: secondary,
                    textDecoration: 'none',
                }}
            >
                {site.agence.nom}
            </Link>

            <nav style={{ display: 'flex', gap: 18 }}>
                {site.menu.map((item) => (
                    <Link
                        key={`${item.label}-${item.url}`}
                        href={buildUrl(item.url, previewDomain)}
                        style={{
                            color: secondary,
                            textDecoration: 'none',
                        }}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </header>
    );
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}