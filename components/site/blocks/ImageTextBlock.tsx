// components/site/blocks/ImageTextBlock.tsx

import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import {
    blockData,
    getLinkProps,
    siteAssetUrl,
    withPreviewUrl,
} from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
    previewDomain?: string;
};

type Data = {
    image?: string;
    titre?: string;
    texte?: string;
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

export function ImageTextBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const image = siteAssetUrl(data.image);
    const cta = getLinkProps(data.cta);

    const imageLeft = bloc.variant === 'image_left';
    const textHtml = data.texte ? { __html: data.texte } : null;

    return (
        <section className={`section image-text image-text--${bloc.variant || 'image_right'}`}>
            <div className="container">
                <div className={`image-text__grid ${imageLeft ? 'image-text__grid--image-left' : ''}`}>
                    {image ? (
                        <div className="image-text__media">
                            <img
                                src={image}
                                alt={data.titre || ''}
                                className="image-text__image"
                            />
                        </div>
                    ) : null}

                    <div className="image-text__content">
                        {data.titre ? <h2>{data.titre}</h2> : null}

                        {textHtml ? (
                            <div
                                className="image-text__text"
                                dangerouslySetInnerHTML={textHtml}
                            />
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
                </div>
            </div>
        </section>
    );
}