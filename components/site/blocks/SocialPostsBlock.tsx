import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import { blockData, getLinkProps, siteAssetUrl, withPreviewUrl } from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
    previewDomain?: string;
};

type SocialPost = {
    image?: string;
    plateforme?: string;
    titre?: string;
    date?: string;
    likes?: number;
    comments?: number;
    link?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

type Data = {
    titre?: string;
    texte?: string;
    items?: SocialPost[];
};

export function SocialPostsBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];

    return (
        <section className={`section social-posts social-posts--${bloc.variant || 'cards'}`}>
            <div className="container">
                <div className="section-heading">
                    <h2>{data.titre || 'Nos réseaux sociaux'}</h2>
                    {data.texte ? <p>{data.texte}</p> : null}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {items.map((item, index) => {
                        const image = siteAssetUrl(item.image);
                        const link = getLinkProps(item.link);

                        const card = (
                            <article style={{ background: '#fff', padding: 16, borderRadius: 12 }}>
                                {image ? (
                                    <img src={image} alt={item.titre || ''} style={{ width: '100%', borderRadius: 8 }} />
                                ) : null}

                                <p>{item.plateforme || 'Réseau social'}</p>
                                <h3>{item.titre || 'Publication'}</h3>
                                {item.date ? <p>{item.date}</p> : null}
                                <p>{item.likes || 0} likes · {item.comments || 0} commentaires</p>
                            </article>
                        );

                        return link ? (
                            <Link
                                key={index}
                                href={withPreviewUrl(link.href, previewDomain)}
                                target={link.target}
                                rel={link.rel}
                            >
                                {card}
                            </Link>
                        ) : (
                            <div key={index}>{card}</div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}