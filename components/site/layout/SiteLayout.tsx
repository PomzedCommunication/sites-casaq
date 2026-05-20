import type { CasaqSiteConfig } from '@/lib/casaq';
import { SiteHeader } from '@/components/site/layout/SiteHeader';

type Props = {
    site: CasaqSiteConfig;
    currentDomain: string;
    previewDomain?: string;
    children: React.ReactNode;
};

export function SiteLayout({
                               site,
                               currentDomain,
                               previewDomain,
                               children,
                           }: Props) {
    return (
        <main
            className="site-layout"
            style={
                {
                    '--site-primary': site.config.couleur_primaire || '#2563eb',
                    '--site-secondary': site.config.couleur_secondaire || '#1e293b',
                    '--site-font': site.config.font || 'Inter, sans-serif',
                } as React.CSSProperties
            }
        >
            <SiteHeader site={site} previewDomain={previewDomain} />

            <div className="site-debug">
                Domaine : <strong>{currentDomain}</strong> · Template site :{' '}
                <strong>{site.template}</strong>
            </div>

            {children}
        </main>
    );
}