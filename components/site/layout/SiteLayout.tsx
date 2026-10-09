import type { CasaqSiteConfig } from '@/lib/casaq';
import { SiteHeader } from '@/components/site/layout/SiteHeader';
import { SiteFooter } from '@/components/site/layout/SiteFooter';
import { SiteBodyTheme } from '@/components/site/layout/SiteBodyTheme';
import { ScrollToTop } from '@/components/site/layout/ScrollToTop';
import { SiteDomainCss } from '@/components/site/layout/SiteDomainCss';
import { SiteTemplateCss } from '@/components/site/layout/SiteTemplateCss';
import { GoogleAnalytics } from '@/components/site/GoogleAnalytics';
import { CookieBanner } from '@/components/site/CookieBanner';
import { SiteIconsResolver } from '@/components/site/icons/SiteIconsResolver';
import { useSiteConfig } from '@/components/site/SiteConfigProvider';
import { SiteConfigProvider } from '@/components/site/SiteConfigProvider';

export function ContactBlock() {
    const site = useSiteConfig();

    return (
        <div>
            {site.agence.nom}
        </div>
    );
}

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
    'novimmob.ch': {
        googleFontHref:
            'https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap',
    },


    // 'services.pix-preview.ch': {
    //     googleFontHref:
    //         'https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap',
    //     fontFamily: "'Urbanist', serif",
    // },

    // Exemple pour un autre site plus tard
    // 'autre-site.ch': {
    //     css: '/styles/sites/autre-site.css',
    //     googleFontHref:
    //         'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
    //     fontFamily: "'Playfair Display', serif",
    // },
};
import { SiteFloatingActions } from '@/components/site/SiteFloatingActions';

export function SiteLayout({
                               site,
                               currentDomain,
                               previewDomain,
                               children,
                           }: Props) {
    const activeDomain = normalizeDomain(previewDomain || currentDomain || site.domain);
    const assets = SITE_ASSETS_BY_DOMAIN[activeDomain] || null;

    // console.log('test css', site.template_key);

    return (
        // <>
        <SiteConfigProvider site={site}>
            <SiteIconsResolver icons={site.config?.icons}>
                <GoogleAnalytics measurementId={site.seo?.google_analytics} />

                <ScrollToTop />
                <SiteFloatingActions />
                <SiteDomainCss
                    currentDomain={currentDomain}
                    previewDomain={previewDomain}
                    siteDomain={site.domain}
                />
                <SiteTemplateCss
                    currentTemplate={site.template_key}
                />
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
                    (Array.isArray(assets.css) ? assets.css : [assets.css]).map((css, index) => (
                        <link key={index} rel="stylesheet" href={css} />
                    ))
                ) : null}

                <main
                    className={`site-layout  ${site.template_key}`}
                    style={
                        assets?.fontFamily
                            ? { fontFamily: assets.fontFamily }
                            : undefined
                    }
                >
                    <SiteHeader site={site} previewDomain={previewDomain} />

                    {children}

                    <SiteFooter site={site} previewDomain={previewDomain} />
                    <CookieBanner />
                </main>
            </SiteIconsResolver>
        </SiteConfigProvider>
        // </>
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