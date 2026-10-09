// components/site/blocks/ImageTextBlock.tsx
import React from "react";

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
    avis?: {
        afficher_note_avis?: boolean;
        lien?: string;
        logo?: string;
        nombre_avis?: number;
        note?: number;
        texte_lien?: string;
    }[];
};

export function ImageTextReviewsBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const image = siteAssetUrl(data.image);
    const cta = getLinkProps(data.cta);

    // console.log('reviews', data, bloc);

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


    const avisList = data.avis ?? [];


    const content = (
        <div  id={tagId || undefined} className={`image-text__content txt ${
            data.avis?.length ? 'contain_reviews' : ''
        }`}>
            <div className="mx-wd">

                {data.tag ? <span className={'tag'}>{data.tag}</span> : null}

            {data.titre ? <h1>{data.titre}</h1> : null}

            {textHtml ? (
                <div
                    className="image-text__text"
                    dangerouslySetInnerHTML={textHtml}
                />
            ) : null}

                {avisList.length > 0 ? (
                    <div className="image-text__reviews">
                        {avisList.map((avis, index) => (
                            <React.Fragment key={index}>
                                {/* Contenu de l'avis */}


                                <div className="image-text__review">

                                    {avis.logo && siteAssetUrl(avis.logo) ? (
                                        <div className="image-text__review-logo">
                                            <Image
                                                src={siteAssetUrl(avis.logo)!}
                                                alt=""
                                                width={200}
                                                height={80}
                                            />
                                        </div>
                                    ) : null}

                                    {avis.afficher_note_avis ? (
                                        <div className="image-text__review-rating">
                                            <div
                                                className="image-text__review-stars"
                                                aria-label={`${avis.note ?? 0} sur 5`}
                                            >
                                                {[1, 2, 3, 4, 5].map((star) => {
                                                    const note = avis.note ?? 0;

                                                    let starClass = '';

                                                    if (note >= star) {
                                                        starClass = 'is-full';
                                                    } else if (note >= star - 0.5) {
                                                        starClass = 'is-half';
                                                    }

                                                    return (
                                                        <svg
                                                            key={star}
                                                            className={`image-text__review-star ${starClass}`}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="15"
                                                            height="14"
                                                            viewBox="0 0 15 14"
                                                            fill="none"
                                                        >
                                                            <path d="M6.99294 0.303532C7.20422 -0.101177 7.79578 -0.101178 8.00706 0.303531L9.92814 3.98335C10.0109 4.1418 10.1661 4.25204 10.3458 4.27998L14.5195 4.92887C14.9786 5.00024 15.1614 5.55021 14.8329 5.8717L11.8465 8.79485C11.7179 8.92072 11.6586 9.09909 11.6869 9.2748L12.3454 13.3557C12.4178 13.8045 11.9392 14.1444 11.5249 13.9384L7.75812 12.0651C7.59593 11.9845 7.40407 11.9845 7.24188 12.0651L3.47506 13.9384C3.06078 14.1444 2.5822 13.8044 2.65462 13.3557L3.31307 9.2748C3.34142 9.09909 3.28213 8.92072 3.15354 8.79485L0.167068 5.8717C-0.161387 5.55021 0.0214155 5.00024 0.480449 4.92887L4.65421 4.27998C4.83392 4.25204 4.98914 4.1418 5.07186 3.98335L6.99294 0.303532Z" />
                                                        </svg>
                                                    );
                                                })}
                                            </div>

                                            <div className="image-text__review-info">
                                                {avis.nombre_avis !== undefined ? (
                                                    <span>{avis.nombre_avis} avis</span>
                                                ) : null}

                                                {avis.note !== undefined ? (
                                                    <span>
                                        {avis.nombre_avis !== undefined ? ' | ' : ''}
                                                        {avis.note.toFixed(1).replace('.', ',')}
                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}

                                    {avis.lien ? (
                                        <a
                                            href={avis.lien}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="image-text__review-link"
                                        >
                                            {avis.texte_lien || 'Voir les avis'}
                                        </a>
                                    ) : null}

                                </div>


                                {index < avisList.length - 1 ? (
                                    <div className="image-text__review-separator" />
                                ) : null}
                            </React.Fragment>
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
        <section className={`section image-text reviews_bloc pd-l-r image-text--${variant}`}>
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