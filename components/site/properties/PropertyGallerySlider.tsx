'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { NavigationOptions } from 'swiper/types';
import { SliderArrows } from '@/components/site/ui/SliderArrows';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

type GalleryImage = {
    src: string;
    alt?: string | null;
};

type Props = {
    images: GalleryImage[];
    title: string;
};

export function PropertyGallerySlider({ images, title }: Props) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const canLoop = images.length > 1;

    const bindNavigation = (swiper: SwiperType) => {
        setTimeout(() => {
            if (!prevRef.current || !nextRef.current || !swiper.navigation) {
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

    if (!images.length) {
        return (
            <section className="property-detail__gallery pd-l-r">
                <div className="property-detail__gallery-empty" />
            </section>
        );
    }

    return (
        <section className="property-detail__gallery pd-l-r">
            <div className="property-detail__gallery-main">
                <Swiper
                    modules={[Navigation, A11y, Thumbs]}
                    slidesPerView={1}
                    spaceBetween={1}
                    navigation
                    grabCursor
                    watchOverflow
                    loop={canLoop}
                    thumbs={{
                        swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed
                                ? thumbsSwiper
                                : null,
                    }}
                    onSwiper={bindNavigation}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                    }}
                    className="property-detail__gallery-swiper"
                >
                    {images.map((image, index) => {
                        const isImportant =
                            index === activeIndex ||
                            index === activeIndex + 1 ||
                            index === activeIndex - 1;

                        return (
                            <SwiperSlide key={`${image.src}-${index}`}>
                                <div className="property-detail__gallery-slide">
                                    <Image
                                        src={image.src}
                                        alt={image.alt || `${title} - photo ${index + 1}`}
                                        fill
                                        priority={index === 0}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1400px) 92vw, 1280px"
                                        quality={isImportant ? 88 : 78}
                                        className="property-detail__gallery-image"
                                    />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            {images.length > 1 ? (
                <div className="property-detail__thumbs">
                    <Swiper
                        modules={[Thumbs, A11y]}
                        onSwiper={setThumbsSwiper}
                        slidesPerView="auto"
                        spaceBetween={10}
                        watchSlidesProgress

                        className="property-detail__thumbs-swiper"
                    >
                        {images.slice(0, 12).map((image, index) => (
                            <SwiperSlide
                                key={`${image.src}-thumb-${index}`}
                                className="property-detail__thumb-slide"
                            >
                                <button
                                    type="button"
                                    className="property-detail__thumb"
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt || `${title} - miniature ${index + 1}`}
                                        fill
                                        loading="lazy"
                                        sizes="120px"
                                        quality={45}
                                        className="property-detail__thumb-image"
                                    />
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : null}

            <div className="property-detail__gallery-actions">
                <SliderArrows
                    prevRef={prevRef}
                    nextRef={nextRef}
                    prevClassName="property-detail__gallery-prev"
                    nextClassName="property-detail__gallery-next"
                    prevLabel="Image précédente"
                    nextLabel="Image suivante"
                />
            </div>
        </section>
    );
}