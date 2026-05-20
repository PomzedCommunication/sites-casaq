import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';

type Props = {
    site: CasaqSiteConfig;
    bloc: CasaqBloc;
};

export function ContactBlock({ site, bloc }: Props) {
    const data = bloc.data || {};

    return (
        <section className="section">
            <h1>{String(data.titre || 'Contactez-nous')}</h1>

            {data.texte ? <p>{String(data.texte)}</p> : null}

            <div>
                {site.infos.email ? <p>Email : {site.infos.email}</p> : null}
                {site.infos.telephone ? <p>Téléphone : {site.infos.telephone}</p> : null}
                {site.infos.adresse ? <p>Adresse : {site.infos.adresse}</p> : null}
            </div>
        </section>
    );
}