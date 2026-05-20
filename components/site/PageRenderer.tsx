import type { CasaqSiteConfig } from '@/lib/casaq';
import { SiteHeader } from '@/components/site/SiteHeader';

type CasaqPage = CasaqSiteConfig['pages'][number];
type CasaqBloc = CasaqPage['blocs'][number];

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    currentDomain: string;
    previewDomain?: string;
};

export function PageRenderer({ site, page, currentDomain, previewDomain }: Props) {
    const primary = site.config.couleur_primaire || '#2563eb';
    const secondary = site.config.couleur_secondaire || '#1e293b';

    return (
        <main
            style={{
                minHeight: '100vh',
                fontFamily: site.config.font || 'Inter, sans-serif',
                background: '#f8fafc',
                color: secondary,
            }}
        >
            <SiteHeader site={site} previewDomain={previewDomain} />

            <div
                style={{
                    padding: '12px 48px',
                    fontSize: 13,
                    background: '#eef2ff',
                    color: '#334155',
                }}
            >
                Domaine : <strong>{currentDomain}</strong> · Template :{' '}
                <strong>{site.template}</strong> · Page : <strong>/{page.slug}</strong>
            </div>

            {page.blocs.map((bloc, index) => (
                <BlockRenderer
                    key={`${bloc.type}-${index}`}
                    bloc={bloc}
                    site={site}
                    primary={primary}
                    secondary={secondary}
                    previewDomain={previewDomain}
                />
            ))}
        </main>
    );
}

function BlockRenderer({
                           bloc,
                           site,
                           primary,
                           secondary,
                           previewDomain,
                       }: {
    bloc: CasaqBloc;
    site: CasaqSiteConfig;
    primary: string;
    secondary: string;
    previewDomain?: string;
}) {
    const data = bloc.data || {};

    if (bloc.type === 'hero') {
        return (
            <section
                style={{
                    padding: '90px 48px',
                    background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                    color: 'white',
                }}
            >
                <h1 style={{ fontSize: 56, margin: 0 }}>
                    {String(data.titre || `Bienvenue chez ${site.agence.nom}`)}
                </h1>

                {data.sous_titre ? (
                    <p style={{ fontSize: 20, maxWidth: 760, marginTop: 20 }}>
                        {String(data.sous_titre)}
                    </p>
                ) : null}

                {data.cta_label ? (
                    <a
                        href={buildUrl(String(data.cta_url || '/biens'), previewDomain)}
                        style={{
                            display: 'inline-block',
                            marginTop: 28,
                            padding: '14px 22px',
                            background: 'white',
                            color: primary,
                            borderRadius: 999,
                            fontWeight: 700,
                            textDecoration: 'none',
                        }}
                    >
                        {String(data.cta_label)}
                    </a>
                ) : null}
            </section>
        );
    }

    if (bloc.type === 'texte') {
        return (
            <section style={{ padding: 48, maxWidth: 900 }}>
                <h1>{String(data.titre || '')}</h1>
                <p style={{ fontSize: 18, lineHeight: 1.7 }}>
                    {String(data.contenu || 'Contenu à compléter dans CasaQ.')}
                </p>
            </section>
        );
    }

    if (bloc.type === 'biens') {
        return (
            <section style={{ padding: 48 }}>
                <h2>{String(data.titre || 'Nos biens')}</h2>
                <p>
                    Bloc biens détecté. La connexion à l’API biens sera ajoutée à l’étape suivante.
                </p>
            </section>
        );
    }

    if (bloc.type === 'equipe') {
        return (
            <section style={{ padding: 48 }}>
                <h1>{String(data.titre || 'Notre équipe')}</h1>
                <p>Les courtiers seront chargés depuis CasaQ à l’étape suivante.</p>
            </section>
        );
    }

    if (bloc.type === 'contact') {
        return (
            <section style={{ padding: 48 }}>
                <h1>{String(data.titre || 'Contactez-nous')}</h1>

                {data.texte ? <p>{String(data.texte)}</p> : null}

                <div style={{ marginTop: 24 }}>
                    {site.infos.email ? <p>Email : {site.infos.email}</p> : null}
                    {site.infos.telephone ? <p>Téléphone : {site.infos.telephone}</p> : null}
                    {site.infos.adresse ? <p>Adresse : {site.infos.adresse}</p> : null}
                </div>
            </section>
        );
    }

    if (bloc.type === 'image') {
        return (
            <section style={{ padding: 48 }}>
                {data.url ? (
                    <img
                        src={String(data.url)}
                        alt={String(data.legende || '')}
                        style={{
                            maxWidth: '100%',
                            borderRadius: 16,
                        }}
                    />
                ) : (
                    <p>Image à configurer dans CasaQ.</p>
                )}
            </section>
        );
    }

    if (bloc.type === 'cta') {
        return (
            <section style={{ padding: 48, background: '#e2e8f0' }}>
                <h2>{String(data.titre || '')}</h2>
                <p>{String(data.texte || '')}</p>

                {data.btn_label ? (
                    <a
                        href={buildUrl(String(data.btn_url || '/contact'), previewDomain)}
                        style={{
                            display: 'inline-block',
                            marginTop: 16,
                            padding: '12px 18px',
                            background: primary,
                            color: 'white',
                            borderRadius: 8,
                            textDecoration: 'none',
                            fontWeight: 700,
                        }}
                    >
                        {String(data.btn_label)}
                    </a>
                ) : null}
            </section>
        );
    }

    return (
        <section style={{ padding: 48 }}>
            <p>Bloc non géré : {bloc.type}</p>
        </section>
    );
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}