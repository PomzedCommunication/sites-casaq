'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import type { Swiper as SwiperType } from 'swiper';
import type { NavigationOptions } from 'swiper/types';
import { withPreviewUrl } from '@/lib/site-blocks';
import { SliderArrows } from '@/components/site/ui/SliderArrows';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Category = {
    id: string | number;
    slug?: string;
    label?: string;
    count?: string | number;
};

type Props = {
    categories: Category[];
    previewDomain?: string;
};

export function PropertyCategoriesSlider({
                                             categories,
                                             previewDomain,
                                         }: Props) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    const canLoop = categories.length > 3;

    const bindNavigation = (swiper: SwiperType) => {
        setTimeout(() => {
            if (
                !swiper ||
                swiper.destroyed ||
                !swiper.params ||
                !prevRef.current ||
                !nextRef.current
            ) {
                return;
            }

            swiper.params.navigation = {
                ...(typeof swiper.params.navigation === 'object'
                    ? swiper.params.navigation
                    : {}),
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            };

            swiper.navigation?.destroy();
            swiper.navigation?.init();
            swiper.navigation?.update();
        });
    };

    return (
        <div className="property-categories__slider">
            <Swiper
                modules={[Navigation, Pagination, A11y]}
                slidesPerView={3}
                spaceBetween={24}
                navigation
                pagination={{
                    clickable: true,
                    el: '.property-categories__pagination',
                }}
                grabCursor
                watchOverflow
                loop={canLoop}
                onSwiper={bindNavigation}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 16,
                    },
                    980: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1250: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                }}
                className="property-categories__swiper"
            >
                {categories.map((category) => {
                    const count = Number(category.count || 0);

                    return (
                        <SwiperSlide key={category.id}>
                            <Link
                                href={withPreviewUrl(
                                    `/biens?category_parent=${encodeURIComponent(
                                        category.slug || String(category.id)
                                    )}`,
                                    previewDomain
                                )}
                                className="property-categories__card white"
                            >
                                <span>+{count}</span>
                                <br />

                                <strong className='h3'>{category.label}</strong>

                                <svg
                                    className='link-more'
                                    width="61"
                                    height="61"
                                    viewBox="0 0 61 61"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16 46L46 16M46 38.5V16L23.5 16"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <div className="property-categories__controls">
                <SliderArrows
                    prevRef={prevRef}
                    nextRef={nextRef}
                    prevClassName="property-categories__prev"
                    nextClassName="property-categories__next"
                    prevLabel="Catégorie précédente"
                    nextLabel="Catégorie suivante"
                />

                {/*<div className="property-categories__pagination" />*/}
            </div>
        </div>
    );
}