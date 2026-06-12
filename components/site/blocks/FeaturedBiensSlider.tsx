'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { NavigationOptions } from 'swiper/types';
import { withPreviewUrl } from '@/lib/site-blocks';
import { FavoriteButton } from '@/components/site/favorites/FavoriteButton';
import { SliderArrows } from '@/components/site/ui/SliderArrows';
import type { SerializedBien } from './FeaturedBiensBlock';

import 'swiper/css';
import 'swiper/css/navigation';

type Props = {
    biens: SerializedBien[];
    previewDomain?: string;
};

export function FeaturedBiensSlider({ biens, previewDomain }: Props) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    const canLoop = biens.length > 3;

    const bindNavigation = (swiper: SwiperType) => {
        setTimeout(() => {
            if (!prevRef.current || !nextRef.current) {
                return;
            }

            const navigation = swiper.params.navigation as NavigationOptions;

            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;

            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
        });
    };

    return (
        <div className="featured-biens__slider">
            <Swiper
                modules={[Navigation, A11y]}
                slidesPerView={3}
                spaceBetween={24}
                navigation
                grabCursor
                watchOverflow
                loop={canLoop}
                onSwiper={bindNavigation}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 16,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                }}
                className="featured-biens__swiper"
            >
                {biens.map((bien) => {
                    const href = withPreviewUrl(bien.href, previewDomain);

                    return (
                        <SwiperSlide key={bien.id}>
                            <article className="featured-bien-card">
                                <Link href={href} className="featured-bien-card__link-full">
                                    <div className="featured-bien-card__image-wrap">
                                        {bien.image ? (
                                            <Image
                                                src={bien.image}
                                                alt={bien.imageAlt}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="featured-bien-card__image"
                                            />
                                        ) : (
                                            <div className="featured-bien-card__placeholder">
                                                Aucun visuel
                                            </div>
                                        )}

                                        {bien.category ? (
                                            <span className="featured-bien-card__badge white">
                                                {bien.category}
                                            </span>
                                        ) : null}
                                    </div>

                                    <div className="featured-bien-card__body">
                                        {bien.heading ? (
                                            <h3 className="featured-bien-card__title">
                                                {bien.heading}
                                            </h3>
                                        ) : null}

                                        {bien.titre ? (
                                            <p className="featured-bien-card__text">
                                                {bien.titre}
                                            </p>
                                        ) : null}

                                        {bien.bedrooms || bien.bathrooms ? (
                                            <div className="featured-bien-card__features">
                                                {bien.bedrooms ? (
                                                    <span className="featured-bien-card__feature site-btn btn-grey btn-sm">
                                                        {bien.bedrooms}{' '}
                                                        {Number(bien.bedrooms) > 1
                                                            ? 'Chambres'
                                                            : 'Chambre'}
                                                    </span>
                                                ) : null}

                                                {bien.bathrooms ? (
                                                    <span className="featured-bien-card__feature site-btn btn-grey btn-sm">
                                                        {bien.bathrooms}{' '}
                                                        {Number(bien.bathrooms) > 1
                                                            ? 'Salles de bains'
                                                            : 'Salle de bain'}
                                                    </span>
                                                ) : null}
                                            </div>
                                        ) : null}

                                        <div className="featured-bien-card__bottom">
                                            <p className="featured-bien-card__price h3">
                                                {bien.price}
                                            </p>

                                            <span
                                                className="featured-bien-card__arrow"
                                                aria-hidden="true"
                                            >
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M1 21L21 1M21 16V1L6 1"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                <div className="featured-bien-card__favorite">
                                    {/*<FavoriteButton*/}
                                    {/*    bienId={bien.id}*/}
                                    {/*    previewDomain={previewDomain}*/}
                                    {/*/>*/}
                                    <FavoriteButton
                                        bienId={Number(bien.id)}
                                        previewDomain={previewDomain}
                                    />
                                </div>
                            </article>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <div className="featured-biens__controls">
                <SliderArrows
                    prevRef={prevRef}
                    nextRef={nextRef}
                    prevClassName="featured-biens__prev"
                    nextClassName="featured-biens__next"
                    prevLabel="Bien précédent"
                    nextLabel="Bien suivant"
                />
            </div>
        </div>
    );
}