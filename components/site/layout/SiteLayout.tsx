import type { CasaqSiteConfig } from '@/lib/casaq';
import { SiteHeader } from '@/components/site/layout/SiteHeader';
import { SiteFooter } from '@/components/site/layout/SiteFooter';
import { SiteBodyTheme } from '@/components/site/layout/SiteBodyTheme';

type Props = {
    site: CasaqSiteConfig;
    currentDomain: string;
    previewDomain?: string;
    children: React.ReactNode;
};

type SiteAssets = {
    css?: string;
    googleFontHref?: string;
    fontFamily?: string;
};

const SITE_ASSETS_BY_DOMAIN: Record<string, SiteAssets> = {
    'exemple.ch': {
        googleFontHref:
            'https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap',
    },

    // Exemple pour un autre site plus tard
    // 'autre-site.ch': {
    //     css: '/styles/sites/autre-site.css',
    //     googleFontHref:
    //         'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
    //     fontFamily: "'Playfair Display', serif",
    // },
};

export function SiteLayout({
                               site,
                               currentDomain,
                               previewDomain,
                               children,
                           }: Props) {
    const activeDomain = normalizeDomain(previewDomain || currentDomain || site.domain);
    const assets = SITE_ASSETS_BY_DOMAIN[activeDomain] || null;

    return (
        <>
            <SiteBodyTheme config={site.config} />

            {assets?.googleFontHref ? (
                <>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin="anonymous"
                    />
                    <link rel="stylesheet" href={assets.googleFontHref} />
                </>
            ) : null}

            {assets?.css ? (
                <link rel="stylesheet" href={assets.css} />
            ) : null}

            <main
                className="site-layout"
                style={
                    assets?.fontFamily
                        ? { fontFamily: assets.fontFamily }
                        : undefined
                }
            >
                <SiteHeader site={site} previewDomain={previewDomain} />

                {children}

                <SiteFooter site={site} previewDomain={previewDomain} />
            </main>
        </>
    );
}

function normalizeDomain(domain?: string | null): string {
    return (domain || '')
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
}