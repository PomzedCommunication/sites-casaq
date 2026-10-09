// components/site/blocks/ImageTextBlock.tsx

import Image from 'next/image';
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
    variant?: 'image_left' | 'image_right';
    points?: {
        icone?: string;
        texte?: string;
    }[];
};

export function ImageTextPointsBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const image = siteAssetUrl(data.image);
    const cta = getLinkProps(data.cta);

    const variant =
        getBlockVariant(bloc, data) || 'image_right';

    const imageLeft = variant === 'image_left';
    const textHtml = data.texte ? { __html: data.texte } : null;

    // console.log( 'Image', bloc);

    const media = image ? (
        <div className="image-text__media">
            <Image
                src={image}
                alt={data.titre || ''}
                width={2000}
                height={800}
                className="image-text__image"
            />
        </div>
    ) : null;

    const content = (
        <div className="image-text__content txt">
            <div className="mx-wd">

            {data.titre ? <h2>{data.titre}</h2> : null}

            {textHtml ? (
                <div
                    className="image-text__text"
                    dangerouslySetInnerHTML={textHtml}
                />
            ) : null}

                {data.points?.length ? (
                    <div className="points">
                        {data.points.map((point, index) => (
                            <div className="point" key={index}>
                                {point.icone ? (
                                    <img
                                        src={siteAssetUrl(point.icone)}
                                        alt=""
                                    />
                                ) : null}

                                {point.texte ? (
                                    <span>{point.texte}</span>
                                ) : null}
                            </div>
                        ))}
                    </div>
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
    );

    return (
        <section className={`section image-text pd-l-r img_txt_points image-text--${variant}`}>
                <div className="image-text__grid">
                    {imageLeft ? (
                        <>
                            {media}
                            {content}
                        </>
                    ) : (
                        <>
                            {content}
                            {media}
                        </>
                    )}
                </div>

        </section>
    );
}

function getBlockVariant(
    bloc: CasaqBloc,
    data: Data,
): 'image_left' | 'image_right' | null {
    const rawBloc = bloc as CasaqBloc & {
        variant?: string;
        data?: {
            variant?: string;
        };
    };

    const variant =
        rawBloc.variant ||
        rawBloc.data?.variant ||
        data.variant ||
        null;

    if (variant === 'image_left' || variant === 'image_right') {
        return variant;
    }

    return null;
}