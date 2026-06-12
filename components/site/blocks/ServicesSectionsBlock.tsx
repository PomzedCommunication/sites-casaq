import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import { blockData, getLinkProps, siteAssetUrl, withPreviewUrl } from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
    previewDomain?: string;
};

type ServiceItem = {
    icone?: string;
    titre?: string;
    texte?: string;
    image?: string;
    link?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

type Data = {
    items?: ServiceItem[];
};

export function ServicesSectionsBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];

    return (
        <section className={`section services-sections services-sections--${bloc.variant || 'alternating'}`}>
            <div className="container">
                {items.length ? (
                    items.map((item, index) => {
                        const link = getLinkProps(item.link);
                        const image = siteAssetUrl(item.image);

                        return (
                            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>
                                <div>
                                    <p><strong>Icône :</strong> {item.icone || '—'}</p>
                                    <h2>{item.titre || 'Service sans titre'}</h2>
                                    {item.texte ? <p>{item.texte}</p> : null}

                                    {link ? (
                                        <Link
                                            href={withPreviewUrl(link.href, previewDomain)}
                                            target={link.target}
                                            rel={link.rel}
                                            className="site-btn site-btn--primary"
                                        >
                                            {link.label || 'En savoir plus'}
                                        </Link>
                                    ) : null}
                                </div>

                                <div>
                                    {image ? (
                                        <img src={image} alt={item.titre || ''} style={{ width: '100%', borderRadius: 12 }} />
                                    ) : (
                                        <div style={{ background: '#fff', padding: 32, borderRadius: 12 }}>Aucune image</div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state">Aucun service configuré.</div>
                )}
            </div>
        </section>
    );
}