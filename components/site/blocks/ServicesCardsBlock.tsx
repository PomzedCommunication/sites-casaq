import Image from 'next/image';
import Link from 'next/link';
import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';
import {
    blockData,
    getLinkProps,
    siteAssetUrl,
    withPreviewUrl,
} from '@/lib/site-blocks';

type Props = {
    site: CasaqSiteConfig;
    bloc: CasaqBloc;
    previewDomain?: string;
};

type ServiceItem = {
    titre?: string;
    icone?: string;
    link?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

type Data = {
    titre?: string;
    texte?: string;
    items?: ServiceItem[];
};

export function ServicesCardsBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];

    return (
        <section className="services-cards">
            <div className="container">
                <div className="services-cards__grid">
                    {items.map((item, index) => {
                        const icon = isImagePath(item.icone)
                            ? siteAssetUrl(item.icone)
                            : null;

                        const link = getLinkProps(item.link);

                        const card = (
                            <article className="services-cards__card white">
                                {icon ? (
                                    <div className="services-cards__icon">
                                        <Image
                                            src={icon}
                                            alt={item.titre || 'Service'}
                                            width={72}
                                            height={72}
                                            className="services-cards__icon-image"
                                        />
                                    </div>
                                ) : null}

                                {item.titre ? <h3>{item.titre}</h3> : null}
                                <svg className='link-svg' width="61" height="61" viewBox="0 0 61 61" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 46L46 16M46 38.5V16L23.5 16" stroke="white" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>


                            </article>
                        );

                        if (!link?.href) {
                            return <div key={index}>{card}</div>;
                        }

                        return (
                            <Link
                                key={index}
                                href={withPreviewUrl(link.href, previewDomain)}
                                target={link.target}
                                rel={link.rel}
                                className="services-cards__card-link"
                            >
                                {card}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function isImagePath(value?: string): boolean {
    if (!value) {
        return false;
    }

    return /\.(png|jpe?g|webp|svg|gif)$/i.test(value);
}