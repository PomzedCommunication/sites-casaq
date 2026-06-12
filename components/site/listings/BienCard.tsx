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
                            pagination={{ clickable: true }}
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
                        />

                        <button
                            type="button"
                            className="bien-card__arrow bien-card__arrow--next"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                swiperRef.current?.slideNext();
                            }}
                            aria-label="Photo suivante"
                        />
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
                        <svg
                            width="11"
                            height="10"
                            viewBox="0 0 11 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M4.66846 0.345492C4.81813 -0.115163 5.46984 -0.115164 5.61951 0.345491L6.49107 3.02786C6.558 3.23387 6.74998 3.37335 6.9666 3.37335H9.78701C10.2714 3.37335 10.4728 3.99316 10.0809 4.27786L7.79914 5.93566C7.6239 6.06298 7.55057 6.28867 7.6175 6.49468L8.48906 9.17705C8.63874 9.6377 8.1115 10.0208 7.71964 9.73607L5.43788 8.07827C5.26263 7.95095 5.02533 7.95095 4.85009 8.07827L2.56833 9.73607C2.17647 10.0208 1.64923 9.63771 1.79891 9.17705L2.67046 6.49468C2.7374 6.28867 2.66407 6.06298 2.48883 5.93566L0.207066 4.27786C-0.184791 3.99316 0.0165963 3.37335 0.500958 3.37335H3.32137C3.53798 3.37335 3.72996 3.23387 3.7969 3.02786L4.66846 0.345492Z"
                                fill="currentColor"
                            />
                        </svg>
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

function getBienPhotos(bien: CasaqBien): Array<{ src: string; alt?: string | null }> {
    return (bien.images || [])
        .map((image) => ({
            src:
                image.variants?.large ||
                image.variants?.medium ||
                image.variants?.xl ||
                image.url ||
                '',
            alt: image.alt || bien.titre,
        }))
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
    const disponibilite = bien.caracteristiques?.disponibilite as
        | { label?: string | null; date?: string | null }
        | undefined;

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