'use client';

import { useRef } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';

import type { Swiper as SwiperType } from 'swiper';
import type { NavigationOptions } from 'swiper/types';
import type { CasaqSiteConfig } from '@/lib/casaq';

import { SliderArrows } from '@/components/site/ui/SliderArrows';
import type { SerializedBien } from './FeaturedBiensBlock';
import { FeaturedBienCard  } from '@/components/site/listings/FeaturedBienCard';
import { useSiteConfig } from '@/components/site/SiteConfigProvider';


import 'swiper/css';
import 'swiper/css/navigation';

type Props = {
    biens: SerializedBien[];
    previewDomain?: string;
};

export function FeaturedBiensSlider({ biens, previewDomain }: Props) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    const site = useSiteConfig();

    const isTemplate2 = site.template_key === 'template_2';

    // const canLoop = biens.length > 3;
    const canLoop = biens.length > (isTemplate2 ? 4 : 3);


    // const bindNavigation = (swiper: SwiperType) => {
    //     setTimeout(() => {
    //         if (!prevRef.current || !nextRef.current) {
    //             return;
    //         }
    //
    //         const navigation = swiper.params.navigation as NavigationOptions;
    //
    //         navigation.prevEl = prevRef.current;
    //         navigation.nextEl = nextRef.current;
    //
    //         swiper.navigation.destroy();
    //         swiper.navigation.init();
    //         swiper.navigation.update();
    //     });
    // };
    const bindNavigation = (swiper: SwiperType) => {
        setTimeout(() => {
            if (!swiper || !swiper.params || !swiper.navigation) {
                return;
            }

            if (!prevRef.current || !nextRef.current) {
                return;
            }

            if (!swiper.params.navigation || typeof swiper.params.navigation === 'boolean') {
                swiper.params.navigation = {};
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
                // slidesPerView={3}
                slidesPerView={isTemplate2 ? 4 : 3}
                spaceBetween={24}
                navigation
                grabCursor
                watchOverflow
                loop={canLoop}
                onSwiper={bindNavigation}
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
                {biens.map((bien) => {

                    return (
                        <SwiperSlide key={bien.id}>


                            <FeaturedBienCard
                                bien={bien}
                                site={site}
                                previewDomain={previewDomain}
                            />
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