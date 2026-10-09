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
    colonnes?: string;
    image?: string;
    tag?: string;
    titre?: string;
    texte?: string;
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
    variant?: 'image_left' | 'image_right';
    items?: {
        texte?: string;
    }[];
};

export function ImageTextListeBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const image = siteAssetUrl(data.image);
    const cta = getLinkProps(data.cta);

    // console.log(bloc);

    const variant =
        getBlockVariant(bloc, data) || 'image_right';

    const imageLeft = variant === 'image_left';
    const textHtml = data.texte ? { __html: data.texte } : null;

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

    // console.log('tag', data);

    const tagId = data.tag
        ? data.tag
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-_]/g, '')
        : null;


    const content = (
        <div  id={tagId || undefined} className={`image-text__content txt ${
            data.items?.length ? 'contain_liste' : ''
        }`}>
            <div className="mx-wd">

                {data.tag ? <span className={'tag'}>{data.tag}</span> : null}

            {data.titre ? <h2>{data.titre}</h2> : null}

            {textHtml ? (
                <div
                    className="image-text__text"
                    dangerouslySetInnerHTML={textHtml}
                />
            ) : null}


            {/*{data.items?.length ? (*/}
            {/*    <div className={`liste liste_num colonne-${data.colonnes}`}>*/}
            {/*        {data.items.map((point, index) => (*/}
            {/*            <div className="point" key={index}>*/}
            {/*                {point.texte ? (*/}
            {/*                    <span>{point.texte}</span>*/}
            {/*                ) : null}*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*) : null}*/}

                {data.items?.length ? (
                    <div className={`liste liste_num colonne-${data.colonnes}`}>
                        {data.items.map((point, index) => (
                            <div key={index}>
                <span className="num">
                    {String(index + 1).padStart(2, '0')}
                </span>

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
        <section className={`section image-text pd-l-r image-text--${variant}`}>
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