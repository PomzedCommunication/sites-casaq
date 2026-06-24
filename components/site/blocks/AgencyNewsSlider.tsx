'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { NavigationOptions } from 'swiper/types';

import { withPreviewUrl } from '@/lib/site-blocks';
import { SliderArrows } from '@/components/site/ui/SliderArrows';
import type { SerializedPost } from './AgencyNewsBlock';

import 'swiper/css';
import 'swiper/css/navigation';
import {parseSiteHtml} from "@/lib/site-html";

type Props = {
    posts: SerializedPost[];
    previewDomain?: string;
};

export function AgencyNewsSlider({ posts, previewDomain }: Props) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    const canSlide = posts.length > 3;

    const bindNavigation = (swiper: SwiperType) => {
        setTimeout(() => {
            if (!canSlide) {
                return;
            }

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
        <div className="agency-news__slider">
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
                    980: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1250: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                }}
                className="agency-news__swiper"
            >
                {posts.map((post) => (
                    <SwiperSlide key={post.id}>
                        <article className="agency-news__card">
                            <Link
                                href={withPreviewUrl(post.href, previewDomain)}
                                className="agency-news__link"
                            >
                                <div className="agency-news__image-wrap">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="agency-news__image"
                                        />
                                    ) : (
                                        <div className="agency-news__placeholder" />
                                    )}

                                    {post.category ? (
                                        <span className="agency-news__badge site-btn btn-sm white">
                                            {post.category}
                                        </span>
                                    ) : null}
                                </div>

                                <div className="agency-news__content">
                                    <div className="agency-news__meta">
                                        {post.publishedAt && post.publishedLabel ? (
                                            <time dateTime={post.publishedAt}>
                                                {post.publishedLabel}
                                            </time>
                                        ) : null}
                                    </div>

                                    <h3>{post.title}</h3>

                                    {post.excerpt ? (
                                        <div className="txt">
                                            {parseSiteHtml(post.excerpt)}
                                        </div>
                                    ) : null}
                                </div>
                            </Link>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>

            {canSlide ? (
                <div className="agency-news__controls">
                    <SliderArrows
                        prevRef={prevRef}
                        nextRef={nextRef}
                        prevClassName="agency-news__prev"
                        nextClassName="agency-news__next"
                        prevLabel="Actualité précédente"
                        nextLabel="Actualité suivante"
                    />
                </div>
            ) : null}
        </div>
    );
}