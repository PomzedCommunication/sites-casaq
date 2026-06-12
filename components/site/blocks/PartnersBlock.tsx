import type { CasaqBloc } from '@/lib/casaq';
import {
    getSitePartners,
    getSitePartnersByIds,
} from '@/lib/casaq';
import { blockData, siteAssetUrl } from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
    currentDomain: string;
};

type Data = {
    titre?: string;
    texte?: string;
    mode?: 'all' | 'manual' | 'latest';
    partner_ids?: Array<string | number>;
    nb?: number;
};

export async function PartnersBlock({ bloc, currentDomain }: Props) {
    const data = blockData<Data>(bloc);

    const mode = data.mode === 'latest' ? 'all' : data.mode || 'all';
    const limit = Number(data.nb || 24);
    const partnerIds = Array.isArray(data.partner_ids) ? data.partner_ids : [];

    const partners =
        mode === 'manual'
            ? await getSitePartnersByIds(currentDomain, partnerIds)
            : await getSitePartners(currentDomain, { limit });

    return (
        <section className={`section partners partners--${bloc.variant || 'cards'}`}>
            <div className="container">
                <div className="section-heading">
                    <h2>{data.titre || 'Nos partenaires'}</h2>
                    {data.texte ? <p>{data.texte}</p> : null}
                </div>

                {partners.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {partners.map((partner) => {
                            const logo = siteAssetUrl(partner.logo_image);

                            return (
                                <article
                                    key={partner.id}
                                    style={{ background: '#fff', padding: 24, borderRadius: 12 }}
                                >
                                    {logo ? (
                                        <img
                                            src={logo}
                                            alt={partner.name || ''}
                                            style={{
                                                width: '100%',
                                                maxHeight: 120,
                                                objectFit: 'contain',
                                            }}
                                        />
                                    ) : null}

                                    <h3>{partner.name}</h3>

                                    {partner.trade ? <p>{partner.trade}</p> : null}
                                    {partner.description ? <p>{partner.description}</p> : null}

                                    {partner.website ? (
                                        <p>
                                            <a href={partner.website} target="_blank" rel="noreferrer">
                                                Site web
                                            </a>
                                        </p>
                                    ) : null}

                                    {partner.email ? <p>{partner.email}</p> : null}
                                    {partner.phone ? <p>{partner.phone}</p> : null}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
                        Aucun partenaire disponible.
                    </div>
                )}
            </div>
        </section>
    );
}