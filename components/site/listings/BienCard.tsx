'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import type { CasaqBien } from '@/lib/casaq';
import { getBienSeoPath } from '@/lib/property-url';
import { FavoriteButton } from '@/components/site/favorites/FavoriteButton';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
    bien: CasaqBien;
    previewDomain?: string;
};

export function BienCard({ bien, previewDomain }: Props) {
    const swiperRef = useRef<SwiperType | null>(null);

    const href = buildUrl(getBienSeoPath(bien), previewDomain);
    const photos = getBienPhotos(bien);
    const title = getCardTitle(bien);
    const location = getLocation(bien);
    const availability = getAvailability(bien);

    return (
        <article className="bien-card">
            <div className="bien-card__photo">
                {photos.length > 1 ? (
                    <>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            pagination={{clickable: true}}
                            loop
                            spaceBetween={1}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            className="bien-card__swiper"
                        >
                            {photos.slice(0, 5).map((photo, index) => (
                                <SwiperSlide key={`${photo.src}-${index}`}>
                                    <Link href={href} className="bien-card__photo-link">
                                        <Image
                                            src={photo.src}
                                            alt={photo.alt || `${bien.titre} - photo ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            quality={85}
                                            className="bien-card__img"
                                        />
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button
                            type="button"
                            className="bien-card__arrow bien-card__arrow--prev"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                swiperRef.current?.slidePrev();
                            }}
                            aria-label="Photo précédente"
                        >
                            <svg width="42" height="42" viewBox="0 0 42 42" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="21" cy="21" r="21" transform="matrix(-1 0 0 1 42 0)" fill="currentColor"/>
                                <path d="M23 14L16 21L23 28" stroke="white" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <button
                            type="button"
                            className="bien-card__arrow bien-card__arrow--next"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                swiperRef.current?.slideNext();
                            }}
                            aria-label="Photo suivante"
                        >
                            <svg width="42" height="42" viewBox="0 0 42 42" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="21" cy="21" r="21" fill="currentColor"/>
                                <path d="M18 14L25 21L18 28" stroke="white" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </>
                ) : photos.length === 1 ? (
                    <Link href={href} className="bien-card__photo-link">
                        <Image
                            src={photos[0].src}
                            alt={photos[0].alt || bien.titre}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            quality={85}
                            className="bien-card__img"
                        />
                    </Link>
                ) : (
                    <Link href={href} className="bien-card__photo-link bien-card__photo-link--empty">
                        <svg
                            width="54"
                            height="54"
                            viewBox="0 0 54 54"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                opacity="0.2"
                                d="M13.5894 13.1994L17.0758 7.62118H35.9849L41.894 17.0757H50.1667V44.2575H44.4041M33.2052 33.191C34.3739 31.5969 34.9333 29.637 34.782 27.6662C34.6307 25.6953 33.7787 23.8438 32.3802 22.4468C30.9818 21.0498 29.1294 20.1997 27.1584 20.0504C25.1874 19.9011 23.2281 20.4624 21.6352 21.6328M0.530273 0.530273L52.5303 52.5303M8.06555 17.0757H2.89391V44.2575H34.803M18.5648 26.0695C18.1672 27.4943 18.1586 28.9996 18.5399 30.4289C18.9211 31.8582 19.6783 33.1593 20.7327 34.1968C21.7871 35.2343 23.1002 35.9704 24.5355 36.3285C25.9707 36.6866 27.4757 36.6537 28.8939 36.2331"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>
                    </Link>
                )}

                {isNewBien(bien) ? (
                    <span className="bien-card__badge">
                        Nouveau
                    </span>
                ) : null}

                <div className="bien-card__favorite">
                    <FavoriteButton bienId={bien.id} previewDomain={previewDomain} />
                </div>
            </div>

            <Link href={href} className="bien-card__body">
                <h3 className="bien-card__titre">{title}</h3>


                <div className="bien-card__infos">
                    {bien.caracteristiques?.pieces ? (
                        <span>{bien.caracteristiques.pieces} pièces</span>
                    ) : null}

                    {bien.caracteristiques?.surface_habitable ? (
                        <span>
                            {formatSurface(bien.caracteristiques.surface_habitable)} habitable
                        </span>
                    ) : null}

                    {bien.caracteristiques?.surface_terrain ? (
                        <span>
                            {formatSurface(bien.caracteristiques.surface_terrain)} de terrain
                        </span>
                    ) : null}

                    {availability ? (
                        <span suppressHydrationWarning>{availability}</span>
                    ) : null}
                </div>

                <p className="bien-card__prix">
                    {bien.prix?.formatte || 'Prix sur demande'}
                </p>
            </Link>
        </article>
    );
}

// function getBienPhotos(bien: CasaqBien): Array<{ src: string; alt?: string | null }> {
//     return (bien.images || [])
//         .map((image) => ({
//             src:
//                 image.variants?.large ||
//                 image.variants?.medium ||
//                 image.variants?.xl ||
//                 image.url ||
//                 '',
//             alt: image.alt || bien.titre,
//         }))
//         .filter((image) => Boolean(image.src));
// }
function getBienPhotos(bien: CasaqBien): Array<{ src: string; alt?: string | null }> {
    const rawBien = bien as CasaqBien & {
        photos?: unknown[];
        medias?: unknown[];
        media?: unknown[];
        pictures?: unknown[];
    };

    const images =
        bien.images ||
        rawBien.photos ||
        rawBien.medias ||
        rawBien.media ||
        rawBien.pictures ||
        [];

    return images
        .map((image: any) => {
            if (typeof image === 'string') {
                return {
                    src: image,
                    alt: bien.titre,
                };
            }

            return {
                src:
                    image.variants?.large ||
                    image.variants?.medium ||
                    image.variants?.xl ||
                    image.large ||
                    image.medium ||
                    image.xl ||
                    image.url ||
                    image.src ||
                    '',
                alt: image.alt || bien.titre,
            };
        })
        .filter((image) => Boolean(image.src));
}
function getCardTitle(bien: CasaqBien): string {
    const parts = [
        bien.categorie,
        bien.adresse?.ville,
    ].filter(Boolean);

    return parts.length ? parts.join(' - ') : bien.titre;
}

function getLocation(bien: CasaqBien): string {
    return [bien.adresse?.npa, bien.adresse?.ville]
        .filter(Boolean)
        .join(' ');
}

function getAvailability(bien: CasaqBien): string | null {
    const caracteristiques = bien.caracteristiques as
        | {
        disponibilite?: {
            label?: string | null;
            date?: string | null;
        } | null;
    }
        | undefined;

    const disponibilite = caracteristiques?.disponibilite;

    if (!disponibilite) {
        return null;
    }

    if (disponibilite.date) {
        const date = new Date(disponibilite.date);

        if (!Number.isNaN(date.getTime())) {
            return `Disponible dès le ${date.toLocaleDateString('fr-CH')}`;
        }
    }

    if (disponibilite.label) {
        if (disponibilite.label === 'Immédiatement') {
            return 'Disponible de suite';
        }

        return disponibilite.label;
    }

    return null;
}

function isNewBien(bien: CasaqBien): boolean {
    const createdAt = (bien as CasaqBien & { created_at?: string | null }).created_at;

    if (!createdAt) {
        return false;
    }

    const createdDate = new Date(createdAt);

    if (Number.isNaN(createdDate.getTime())) {
        return false;
    }

    const diff = Date.now() - createdDate.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    return days <= 30;
}

function formatSurface(value: string | number): string {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return `${value} m²`;
    }

    return `${new Intl.NumberFormat('fr-CH').format(number)} m²`;
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}