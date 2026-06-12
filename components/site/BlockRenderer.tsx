import type { CasaqSiteConfig } from '@/lib/casaq';

type Page = CasaqSiteConfig['pages'][number];
type Bloc = Page['blocs'][number];

type Props = {
    bloc: Bloc;
    site: CasaqSiteConfig;
};

export function BlockRenderer({ bloc, site }: Props) {
    const data = bloc.data || {};

    if (bloc.type === 'hero') {
        return (
            <section style={{ padding: '80px 48px',  color: 'white' }}>
                <h1 style={{ fontSize: 52, margin: 0 }}>
                    {String(data.titre || `Bienvenue chez ${site.agence.nom}`)}
                </h1>

                {data.sous_titre ? (
                    <p style={{ fontSize: 20, marginTop: 18 }}>{String(data.sous_titre)}</p>
                ) : null}

                {data.cta_label ? (
                    <a
                        href={String(data.cta_url || '/biens')}
                        style={{
                            display: 'inline-block',
                            marginTop: 28,
                            padding: '14px 22px',
                            background: 'white',
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
            <section style={{ padding: '48px', maxWidth: 900 }}>
                <h2>{String(data.titre || '')}</h2>
                <p style={{ fontSize: 18, lineHeight: 1.7 }}>
                    {String(data.contenu || 'Contenu à compléter dans CasaQ.')}
                </p>
            </section>
        );
    }

    if (bloc.type === 'equipe') {
        return (
            <section style={{ padding: '48px' }}>
                <h2>{String(data.titre || 'Notre équipe')}</h2>
                <p>Les courtiers seront chargés depuis CasaQ.</p>
            </section>
        );
    }

    if (bloc.type === 'contact') {
        return (
            <section style={{ padding: '48px' }}>
                <h2>{String(data.titre || 'Contactez-nous')}</h2>
                <p>{String(data.texte || '')}</p>

                <div style={{ marginTop: 24 }}>
                    {site.infos.email ? <p>Email : {site.infos.email}</p> : null}
                    {site.infos.telephone ? <p>Téléphone : {site.infos.telephone}</p> : null}
                    {site.infos.adresse ? <p>Adresse : {site.infos.adresse}</p> : null}
                </div>
            </section>
        );
    }

    if (bloc.type === 'biens') {
        return (
            <section style={{ padding: '48px' }}>
                <h2>{String(data.titre || 'Nos biens')}</h2>
                <p>Les biens seront connectés à l’étape suivante.</p>
            </section>
        );
    }

    return (
        <section style={{ padding: '48px' }}>
            <p>Bloc non géré : {bloc.type}</p>
        </section>
    );
}