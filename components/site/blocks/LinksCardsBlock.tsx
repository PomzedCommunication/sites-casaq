import Image from 'next/image';
import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import {
    blockData,
    getLinkProps,
    siteAssetUrl,
    withPreviewUrl,
} from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';

type Props = {
    bloc: CasaqBloc;
    previewDomain?: string;
};

type LinkItem = {
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
    titre?: string;
    texte?: string;
    items?: LinkItem[];
};

export function LinksCardsBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];
    const variant = String(bloc.data.variant || 'cards');

    if (!data.titre && !data.texte && !items.length) {
        return null;
    }

    return (
        <section className={`section links-cards links-cards--${variant} pd-l-r`}>
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Nos actualités'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>


                </div>

                {items.length ? (
                    <div className="links-cards__grid">
                        {items.map((item, index) => {
                            const link = getLinkProps(item.link);

                            const content = (
                                <>
                                    {siteAssetUrl(item.image) ? (
                                        <div className="links-cards__logo">
                                            <Image
                                                src={siteAssetUrl(item.image) as string}
                                                alt={item.titre || ''}
                                                width={220}
                                                height={90}
                                                className="links-cards__image"
                                            />
                                        </div>
                                    ) : null}

                                    <div className="links-cards__content">
                                        <h3>{item.titre || 'Lien'}</h3>

                                        {item.texte ? (
                                            <div className="txt">
                                                {parseSiteHtml(item.texte)}
                                            </div>
                                        ) : null}
                                    </div>
                                    <svg className="links-cards__arrow" width="32" height="32" viewBox="0 0 32 32" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 31L31 1M31 23.5V1L8.5 1" stroke="white" strokeWidth="2"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>

                                </>
                            );

                            if (!link) {
                                return (
                                    <article key={`${item.titre}-${index}`} className="links-cards__card white">
                                        {content}
                                    </article>
                                );
                            }

                            return (
                                <Link
                                    key={`${item.titre}-${index}`}
                                    href={withPreviewUrl(link.href, previewDomain)}
                                    target={link.target}
                                    rel={link.rel}
                                    className="links-cards__card white"
                                >
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </section>
    );
}