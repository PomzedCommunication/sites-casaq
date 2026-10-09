'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

type GalleryImage = {
    src: string;
    alt?: string | null;
};

type Props = {
    images: GalleryImage[];
    title: string;
    onOpenGallery: () => void;
};

export function PropertyAutoGallerySlider({
                                              images,
                                              title,
                                              onOpenGallery,
                                          }: Props) {
    const canLoop = images.length > 1;

    if (!images.length) {
        return (
            <section className="property-detail__gallery">
                <div className="property-detail__gallery-empty" />
            </section>
        );
    }

    return (
        <section className="property-detail__gallery">
            <div className="property-detail__gallery-main">
                <Swiper
                    modules={[Autoplay, A11y]}
                    slidesPerView="auto"
                    centeredSlides
                    spaceBetween={6}
                    loop={canLoop}
                    grabCursor
                    watchOverflow
                    allowTouchMove
                    autoplay={
                        canLoop
                            ? {
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }
                            : false
                    }
                    speed={800}
                    className="property-detail__gallery-swiper"
                >
                    {images.map((image, index) => (
                        <SwiperSlide
                            key={`${image.src}-${index}`}
                            className="property-detail__gallery-slide"
                        >
                            <div className="property-detail__gallery-slide-inner">
                                <Image
                                    src={image.src}
                                    alt={
                                        image.alt ||
                                        `${title} - photo ${index + 1}`
                                    }
                                    fill
                                    sizes="(max-width: 768px) 90vw, (max-width: 1400px) 80vw, 1100px"
                                    quality={94}
                                    className="property-detail__gallery-image"
                                    priority={index === 0}
                                    loading={
                                        index === 0 ? undefined : 'lazy'
                                    }
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    type="button"
                    className="property-detail__gallery-all site-btn"
                    onClick={onOpenGallery}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.5625 4.01275C6.89061 3.68454 7.33566 3.5001 7.79975 3.5H13.2003C13.6643 3.5001 14.1094 3.68454 14.4375 4.01275L15.6747 5.25H16.625C17.0891 5.25 17.5342 5.43437 17.8624 5.76256C18.1906 6.09075 18.375 6.53587 18.375 7V15.75C18.375 16.2141 18.1906 16.6592 17.8624 16.9874C17.5342 17.3156 17.0891 17.5 16.625 17.5H4.375C3.91087 17.5 3.46575 17.3156 3.13756 16.9874C2.80937 16.6592 2.625 16.2141 2.625 15.75V7C2.625 6.53587 2.80937 6.09075 3.13756 5.76256C3.46575 5.43437 3.91087 5.25 4.375 5.25H5.32525L6.5625 4.01275ZM8.75 10.5C8.75 10.0359 8.93437 9.59075 9.26256 9.26256C9.59075 8.93437 10.0359 8.75 10.5 8.75C10.9641 8.75 11.4092 8.93437 11.7374 9.26256C12.0656 9.59075 12.25 10.0359 12.25 10.5C12.25 10.9641 12.0656 11.4092 11.7374 11.7374C11.4092 12.0656 10.9641 12.25 10.5 12.25C10.0359 12.25 9.59075 12.0656 9.26256 11.7374C8.93437 11.4092 8.75 10.9641 8.75 10.5ZM10.5 7C9.57174 7 8.6815 7.36875 8.02513 8.02513C7.36875 8.6815 7 9.57174 7 10.5C7 11.4283 7.36875 12.3185 8.02513 12.9749C8.6815 13.6313 9.57174 14 10.5 14C11.4283 14 12.3185 13.6313 12.9749 12.9749C13.6313 12.3185 14 11.4283 14 10.5C14 9.57174 13.6313 8.6815 12.9749 8.02513C12.3185 7.36875 11.4283 7 10.5 7Z" fill="#E41745"/>
                    </svg>
                    Toutes les images ({images.length})
                </button>
            </div>
        </section>
    );
}