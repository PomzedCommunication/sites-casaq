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
                slidesPerView={3}
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
                    980: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1250: {
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
                                            </div>
                                        )}

                                        {bien.category ? (
                                            <span className="featured-bien-card__badge white">
                                                {bien.category}
                                            </span>
                                        ) : null}
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
                                                    <span
                                                        className="featured-bien-card__feature site-btn btn-grey btn-sm">

                                                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <g clipPath="url(#clip0_365_5936)">
                                                            <path
                                                                d="M7.50806 10.9128C5.46382 10.9128 3.42012 10.9128 1.37589 10.9128C1.16921 10.9128 1.07366 11.0107 1.07366 11.2219C1.07366 11.2767 1.07634 11.3314 1.07312 11.3855C1.06883 11.4512 1.06238 11.5169 1.05057 11.5809C1.00655 11.8145 0.790213 12.0017 0.531462 11.999C0.271638 11.9962 0.0563712 11.7965 0.0171828 11.5399C0.00805679 11.4797 0.00322535 11.4178 0.00322535 11.3571C0.00268853 10.1139 -0.00536387 8.87009 0.00590949 7.62686C0.0123514 6.90237 0.271102 6.272 0.767129 5.74724C1.06829 5.42878 1.42635 5.20224 1.83595 5.05778C2.15805 4.94451 2.49088 4.91003 2.83015 4.91003C5.97434 4.91113 9.11854 4.90839 12.2627 4.91222C13.1839 4.91332 13.9301 5.29198 14.483 6.04492C14.7547 6.41537 14.9168 6.83616 14.9721 7.29581C14.9909 7.45066 14.9989 7.60826 14.9995 7.76475C15.0016 8.97187 15.0011 10.179 15.0005 11.3861C15.0005 11.5749 14.9549 11.7467 14.8025 11.8715C14.6414 12.0033 14.4616 12.0378 14.2699 11.9574C14.0863 11.8797 13.9704 11.7368 13.9441 11.5327C13.9306 11.4299 13.9323 11.3243 13.9296 11.2203C13.9253 11.0523 13.8571 10.9511 13.7207 10.9199C13.6907 10.9128 13.659 10.9133 13.6279 10.9133C11.5885 10.9133 9.54907 10.9133 7.50913 10.9133L7.50806 10.9128Z"
                                                                fill="white"/>
                                                            <path
                                                                d="M7.43342 0C8.75938 0 10.0848 0 11.4102 0C11.8542 0 12.2692 0.101231 12.6272 0.380848C13.0878 0.740356 13.3568 1.21368 13.3793 1.80793C13.3986 2.3119 13.39 2.81696 13.3922 3.32148C13.3938 3.64651 13.3922 3.97155 13.3922 4.29658C13.3922 4.32558 13.3906 4.35622 13.3831 4.38413C13.36 4.47223 13.3133 4.50725 13.2252 4.49029C13.1291 4.47168 13.0363 4.43174 12.9402 4.42079C12.7142 4.39562 12.4876 4.37811 12.2606 4.36607C12.1092 4.35787 12.0625 4.32996 12.041 4.17839C11.9723 3.69795 11.5358 3.26566 10.9775 3.27223C10.3548 3.27934 9.73211 3.27387 9.10993 3.27387C8.64665 3.27387 8.25101 3.55513 8.09372 3.99836C8.07117 4.06183 8.06258 4.13078 8.05077 4.19754C8.02876 4.31737 7.98528 4.36224 7.86825 4.36388C7.62292 4.36662 7.37705 4.36662 7.13172 4.36388C7.01899 4.36279 6.97443 4.31737 6.95403 4.1844C6.92558 3.99781 6.85472 3.83146 6.73877 3.68536C6.52887 3.42052 6.25723 3.27661 5.92225 3.27497C5.27967 3.27168 4.63709 3.27332 3.99397 3.27442C3.45393 3.27497 3.03144 3.70506 2.96273 4.17729C2.94072 4.32996 2.89616 4.35677 2.74478 4.36662C2.49408 4.38358 2.24338 4.40766 1.99322 4.43502C1.91646 4.44323 1.84291 4.47715 1.76668 4.49029C1.68455 4.50397 1.64643 4.47551 1.62335 4.39343C1.61422 4.36115 1.60993 4.32668 1.60993 4.29275C1.60939 3.513 1.59919 2.73324 1.61208 1.95349C1.6255 1.13762 1.99537 0.537893 2.71901 0.175103C3.00568 0.0322846 3.3165 0 3.63108 0C4.89853 0 6.16597 0 7.43342 0Z"
                                                                fill="white"/>
                                                            </g>
                                                            <defs>
                                                            <clipPath id="clip0_365_5936">
                                                            <rect width="15" height="12" fill="white"/>
                                                            </clipPath>
                                                            </defs>
                                                            </svg>

                                                        {bien.bedrooms}{' '}
                                                        {Number(bien.bedrooms) > 1
                                                            ? 'Chambres'
                                                            : 'Chambre'}
                                                    </span>
                                                ) : null}

                                                {bien.bathrooms ? (
                                                    <span
                                                        className="featured-bien-card__feature site-btn btn-grey btn-sm">
                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_365_5970)">
<path
    d="M0.906101 9.82971H7.92938V11.1212H12.3197V9.83253H14.0639C14.1769 11.3685 14.1858 12.736 12.6117 13.7784C12.5925 13.7911 12.577 13.8084 12.5344 13.8464C12.728 14.0073 12.9188 14.1664 13.1077 14.3235C12.8527 14.5675 12.6478 14.7636 12.413 14.9887C12.2058 14.7748 11.9817 14.5267 11.7375 14.3005C11.6658 14.2339 11.5388 14.2067 11.4347 14.2001C11.2645 14.1898 11.092 14.2175 10.9205 14.218C8.64001 14.2194 6.35954 14.2189 4.0786 14.2189C3.96938 14.2189 3.85266 14.24 3.75188 14.2095C3.44766 14.118 3.25454 14.2592 3.0736 14.4774C2.91938 14.6632 2.7436 14.8307 2.58282 15.0005C2.36579 14.772 2.16938 14.5656 1.95188 14.3362C2.09766 14.2072 2.28282 14.043 2.49094 13.8581C2.34751 13.7554 2.24016 13.6841 2.13844 13.6053C1.37626 13.0175 0.964226 12.2378 0.91032 11.2803C0.883601 10.806 0.905632 10.3289 0.905632 9.82971H0.906101Z"
    fill="white"/>
<path
    d="M0.910308 6.27646C0.906558 6.19155 0.899995 6.11508 0.899995 6.03861C0.899527 4.79541 0.89812 3.55268 0.899995 2.30949C0.90187 0.943376 1.84921 -0.00989817 3.21234 -4.64168e-05C3.66984 0.0032375 4.1414 -0.00614513 4.58109 0.0975329C5.36109 0.281901 5.85234 0.823279 6.08953 1.58609C6.13546 1.73433 6.19499 1.80611 6.35765 1.85021C7.27546 2.09932 7.91953 2.95783 7.93124 3.91579C7.93312 4.07014 7.93124 4.22448 7.93124 4.39196H3.58687C3.37968 3.2956 3.975 2.16406 5.21953 1.8108C5.10703 1.3215 4.62562 0.908661 4.12031 0.890834C3.73828 0.877229 3.35484 0.875821 2.97281 0.890834C2.31421 0.916636 1.78453 1.52182 1.78171 2.24756C1.77703 3.49827 1.78031 4.74944 1.78031 6.00014C1.78031 6.08552 1.78031 6.17091 1.78031 6.27599H0.90937L0.910308 6.27646Z"
    fill="white"/>
<path
    d="M7.91718 8.95198C7.8253 8.95198 7.7564 8.95198 7.68749 8.95198C5.4553 8.95198 3.22265 8.95245 0.990458 8.95151C0.50999 8.95151 0.164521 8.72398 0.0431145 8.33554C-0.139698 7.751 0.274208 7.18805 0.905146 7.1796C1.5764 7.17069 2.24765 7.17726 2.9189 7.17726C4.49577 7.17726 6.07218 7.17726 7.64905 7.17726C7.73343 7.17726 7.8178 7.17726 7.91718 7.17726V8.95151V8.95198Z"
    fill="white"/>
<path
    d="M11.4361 10.265H8.82372C8.8195 10.1824 8.81247 10.1074 8.81247 10.0323C8.81153 9.12643 8.81153 8.22007 8.81247 7.31418C8.81294 6.6588 9.1706 6.29851 9.82263 6.29569C10.0645 6.29475 10.3064 6.28959 10.5483 6.2971C11.0915 6.31446 11.4464 6.67991 11.4478 7.22504C11.4506 8.17034 11.4487 9.11517 11.4478 10.0605C11.4478 10.1219 11.4412 10.1829 11.4361 10.265Z"
    fill="white"/>
<path
    d="M12.3352 8.94358V7.1773C12.7599 7.1773 13.1785 7.17589 13.5966 7.17777C13.8146 7.17871 14.0372 7.16088 14.2505 7.19606C14.716 7.273 15.0188 7.6544 14.9996 8.09961C14.9808 8.53637 14.6588 8.91121 14.2018 8.93513C13.5886 8.9675 12.9727 8.94311 12.3357 8.94311L12.3352 8.94358Z"
    fill="white"/>
</g>
<defs>
<clipPath id="clip0_365_5970">
<rect width="15" height="15" fill="white"/>
</clipPath>
</defs>
</svg>


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