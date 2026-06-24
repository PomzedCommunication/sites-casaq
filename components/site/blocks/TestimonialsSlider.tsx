'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';

import type { Swiper as SwiperType } from 'swiper';
import type { NavigationOptions } from 'swiper/types';
import { SliderArrows } from '@/components/site/ui/SliderArrows';
import { parseSiteHtml } from '@/lib/site-html';

import 'swiper/css';
import 'swiper/css/navigation';

export type SerializedTestimonial = {
    id: string | number;
    content?: string | null;
    author_name?: string | null;
    author_role?: string | null;
    photo?: string | null;
    rating?: number;
};

type Props = {
    testimonials: SerializedTestimonial[];
};

export function TestimonialsSlider({ testimonials }: Props) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    const canSlide = testimonials.length > 3;

    const bindNavigation = (swiper: SwiperType) => {
        setTimeout(() => {
            if (!canSlide) {
                return;
            }

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
        <div className="testimonials__slider">
            <Swiper
                modules={[Navigation, A11y]}
                slidesPerView={3}
                spaceBetween={24}
                navigation={canSlide}
                grabCursor={canSlide}
                watchOverflow
                loop={canSlide}
                onSwiper={canSlide ? bindNavigation : undefined}
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
                className="testimonials__swiper"
            >
                {testimonials.map((testimonial) => {
                    const rating = Math.max(
                        0,
                        Math.min(5, Number(testimonial.rating || 0))
                    );

                    return (
                        <SwiperSlide key={testimonial.id}>
                            <article className="testimonials__card white">
                                {rating ? (
                                    <div
                                        className="testimonials__rating"
                                        aria-label={`${rating} étoiles sur 5`}
                                    >
                                        {Array.from({ length: rating }).map((_, index) => (
                                            <svg
                                                key={index}
                                                width="22"
                                                height="21"
                                                viewBox="0 0 22 21"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M9.81193 0.459372C10.2055 -0.153391 11.1011 -0.153391 11.4947 0.459372L14.5337 5.19083C14.6692 5.40166 14.8788 5.55397 15.1212 5.61761L20.5602 7.0458C21.2645 7.23076 21.5413 8.08255 21.0802 8.64622L17.5194 12.9986C17.3607 13.1926 17.2806 13.439 17.295 13.6892L17.6175 19.3033C17.6592 20.0304 16.9347 20.5568 16.2561 20.2924L11.0164 18.2509C10.7829 18.1599 10.5238 18.1599 10.2903 18.2509L5.05057 20.2924C4.37199 20.5568 3.64741 20.0304 3.68917 19.3033L4.01163 13.6892C4.02599 13.439 3.94592 13.1926 3.78725 12.9986L0.226482 8.64622C-0.234667 8.08255 0.0420954 7.23076 0.74649 7.0458L6.18548 5.61761C6.42784 5.55397 6.63748 5.40166 6.7729 5.19083L9.81193 0.459372Z"
                                                    fill="#FFE500"
                                                />
                                            </svg>

                                        ))}
                                    </div>
                                ) : null}

                                {testimonial.content ? (
                                    <div className="testimonials__content txt">
                                        {parseSiteHtml(testimonial.content)}

                                    </div>
                                ) : null}

                                <div className="testimonials__author">
                                    {testimonial.photo ? (
                                        <Image
                                            src={testimonial.photo}
                                            alt={testimonial.author_name || ''}
                                            width={100}
                                            height={100}
                                            className="testimonials__photo"
                                        />
                                    ) : null}

                                    <div className="testimonials__author-info">
                                        <strong className="testimonials__name">
                                            {testimonial.author_name || 'Auteur'}
                                        </strong>

                                        {testimonial.author_role ? (
                                            <span className="testimonials__role">
                                                {testimonial.author_role}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {canSlide ? (
                <div className="testimonials__controls">
                    <SliderArrows
                        prevRef={prevRef}
                        nextRef={nextRef}
                        prevClassName="testimonials__prev"
                        nextClassName="testimonials__next"
                        prevLabel="Témoignage précédent"
                        nextLabel="Témoignage suivant"
                    />
                </div>
            ) : null}
        </div>
    );
}