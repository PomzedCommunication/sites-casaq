'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import type { CasaqBloc } from '@/lib/casaq';
import {blockData, withPreviewUrl} from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';
import { SliderArrows } from '@/components/site/ui/SliderArrows';

import 'swiper/css';
import 'swiper/css/navigation';
import Link from "next/link";

type Props = {
    bloc: CasaqBloc;
};

type TimelineItem = {
    annee?: string;
    titre?: string;
    texte?: string;
};

type Data = {
    titre?: string;
    texte?: string;
    items?: TimelineItem[];
};

export function TimelineHistoryBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];

    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    const canLoop = items.length > 3;

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
        <section className={`section pd-l-r timeline-history timeline-history--${bloc.data.variant || 'dots'}`}>
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Nos actualités'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>


                </div>

                {items.length ? (
                    <div className="timeline-history__slider">
                        <Swiper
                            modules={[Navigation, A11y]}
                            slidesPerView={3}
                            centeredSlides
                            spaceBetween={40}
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            loop={canLoop}
                            grabCursor
                            watchOverflow
                            onSwiper={bindNavigation}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                    spaceBetween: 16,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 32,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                },
                            }}
                            className="timeline-history__swiper"
                        >
                            {items.map((item, index) => (
                                <SwiperSlide key={`${item.annee}-${index}`}>
                                    {({isActive}) => (
                                        <article
                                            className={`timeline-history__item ${
                                                isActive ? 'is-active' : ''
                                            }`}
                                        >
                                            <div className="timeline-history__dot"/>

                                            {item.titre ? (
                                                <div className="timeline-history__item-title">
                                                    {item.titre}
                                                </div>
                                            ) : null}

                                            {item.annee ? (
                                                <h3 className="timeline-history__year">
                                                    {item.annee}
                                                </h3>
                                            ) : null}

                                        </article>
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="timeline-history__controls">
                            <SliderArrows
                                prevRef={prevRef}
                                nextRef={nextRef}
                                prevClassName="timeline-history__prev"
                                nextClassName="timeline-history__next"
                                prevLabel="Date précédente"
                                nextLabel="Date suivante"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="timeline-history__empty">
                        Aucune date disponible.
                    </div>
                )}
            </div>
        </section>
    );
}