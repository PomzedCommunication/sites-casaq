'use client';

import { useRef } from 'react';

import type { CasaqSiteConfig } from '@/lib/casaq';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Controller, FreeMode } from 'swiper/modules';

import type { Swiper as SwiperType } from 'swiper';
import type { NavigationOptions } from 'swiper/types';

import type { SerializedBien } from './FeaturedBiensBlock';
import { FeaturedBienCard } from '@/components/site/listings/FeaturedBienCard';
import { SliderArrows } from '@/components/site/ui/SliderArrows';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

type Props = {
    site: CasaqSiteConfig;
    biens: SerializedBien[];
    previewDomain?: string;
};

export function FeaturedBiensSliderPoints({ site,
                                              biens,
                                              previewDomain,
                                          }: Props) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);


    const isTemplate2 = site.template_key === 'template_2';

    // const canLoop = biens.length > 3;
    const canLoop = biens.length > (isTemplate2 ? 4 : 3);

    const mainSwiperRef = useRef<SwiperType | null>(null);
    const pointsSwiperRef = useRef<SwiperType | null>(null);

    const bindNavigation = (swiper: SwiperType) => {
        setTimeout(() => {
            if (!prevRef.current || !nextRef.current) {
                return;
            }

            if (
                !swiper.params.navigation ||
                typeof swiper.params.navigation === 'boolean'
            ) {
                swiper.params.navigation = {};
            }

            const navigation =
                swiper.params.navigation as NavigationOptions;

            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;

            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
        });
    };

    const bindMainSwiper = (swiper: SwiperType) => {
        mainSwiperRef.current = swiper;

        bindNavigation(swiper);

        if (pointsSwiperRef.current) {
            swiper.controller.control = pointsSwiperRef.current;
            pointsSwiperRef.current.controller.control = swiper;
        }
    };

    const bindPointsSwiper = (swiper: SwiperType) => {
        pointsSwiperRef.current = swiper;

        if (mainSwiperRef.current) {
            mainSwiperRef.current.controller.control = swiper;
            swiper.controller.control = mainSwiperRef.current;
        }
    };

    return (
        <div className="featured-biens__slider featured-biens__slider--points">

            {/* Slider principal */}
            <Swiper
                modules={[Navigation, A11y, Controller]}
                // slidesPerView={3}
                slidesPerView={isTemplate2 ? 4 : 3}
                spaceBetween={24}
                grabCursor
                watchOverflow
                onSwiper={bindMainSwiper}
                breakpoints={{
                    0: {
                        slidesPerView: 1.1,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    980: {
                        slidesPerView: isTemplate2 ? 3 : 2,
                        spaceBetween: 24,
                    },
                    1250: {
                        slidesPerView: isTemplate2 ? 4 : 3,
                        spaceBetween: 24,
                    },
                }}
                className="featured-biens__swiper"
            >
                {biens.map((bien) => (
                    <SwiperSlide key={bien.id}>
                        <FeaturedBienCard
                            bien={bien}
                            site={site}
                            previewDomain={previewDomain}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="featured-biens__controls">

                <SliderArrows
                    prevRef={prevRef}
                    nextRef={nextRef}
                    prevClassName="featured-biens__prev"
                    nextClassName="featured-biens__next"
                    prevLabel="Bien précédent"
                    nextLabel="Bien suivant"
                >
                    {/* Slider des points */}
                    <Swiper
                        modules={[A11y, Controller, FreeMode]}
                        slidesPerView={5}
                        spaceBetween={8}
                        centeredSlides
                        slideToClickedSlide
                        freeMode={{
                            enabled: true,
                            sticky: true,
                        }}
                        grabCursor
                        watchSlidesProgress
                        onSwiper={bindPointsSwiper}
                        className="featured-biens__points-swiper"
                    >
                        {biens.map((bien) => (
                            <SwiperSlide
                                key={bien.id}
                                className="featured-biens__point-slide"
                            >
                                <button
                                    type="button"
                                    className="featured-biens__point"
                                    aria-label={`Afficher le bien ${bien.id}`}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </SliderArrows>

            </div>
        </div>
    );
}