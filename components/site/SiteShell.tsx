import type { CasaqSiteConfig } from '@/lib/casaq';
import { BlockRenderer } from '@/components/site/BlockRenderer';

type Props = {
    site: CasaqSiteConfig;
    pageSlug: string;
};

export function SiteShell({ site, pageSlug }: Props) {
    const secondary = site.config.couleur_secondaire || '#1e293b';

    const page =
        site.pages.find((item) => item.slug === pageSlug) ||
        site.pages.find((item) => item.slug === 'accueil');

    return (
        <main
            style={{
                minHeight: '100vh',
                fontFamily: site.config.font || 'Inter, sans-serif',
                background: '#f8fafc',
                color: secondary,
            }}
        >
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
                <a href="/" style={{ fontSize: 22, fontWeight: 800, color: secondary, textDecoration: 'none' }}>
                    {site.agence.nom}
                </a>

                <nav style={{ display: 'flex', gap: 18 }}>
                    {site.menu.map((item) => (
                        <a
                            key={item.url}
                            href={item.url}
                            style={{
                                color: secondary,
                                textDecoration: 'none',
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </header>

            {page ? (
                page.blocs.map((bloc, index) => (
                    <BlockRenderer key={`${bloc.type}-${index}`} bloc={bloc} site={site} />
                ))
            ) : (
                <section style={{ padding: 48 }}>
                    <h1>Page introuvable</h1>
                </section>
            )}
        </main>
    );
}