import Image from 'next/image';
import Link from 'next/link';
import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';
import { cleanSiteText } from '@/lib/text';
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

type Data = {
    titre?: string;
    texte?: string;
    sous_titre?: string;
    image?: string;
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

export function HeroSimpleBlock({ site, bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const image = siteAssetUrl(data.image);
    const cta = getLinkProps(data.cta);

    const title = data.titre;
    const text = data.texte || data.sous_titre;

    return (
        <section className={`site-hero site-hero--simple ${!image ? 'site-hero--no-image' : ''}`}>
            {image ? (
            <>
                <Image
                    src={image}
                        alt={title || site.agence.nom || ''}
                        fill
                        priority
                        sizes="100vw"
                        className="site-hero__image"
                    />

                    <div className="site-hero__overlay" />
                </>
            ) : null}

                <div className="site-hero__content white">

                    {title ? (
                        <h1>{title}</h1>
                    ) : null}
                    {text ? (
                        <p>{cleanSiteText(text)}</p>
                    ) : null}

                    {cta ? (
                        <Link
                            href={withPreviewUrl(cta.href, previewDomain)}
                            target={cta.target}
                            rel={cta.rel}
                            className="site-btn site-btn--primary"
                        >
                            {cta.label || 'En savoir plus'}
                        </Link>
                    ) : null}
                </div>
        </section>
    );
}