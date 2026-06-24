// src/components/site/listings/ListingGoogleMap.tsx

'use client';

import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { CasaqBien } from '@/lib/casaq';
import { getBienSeoPath } from '@/lib/property-url';

const libraries: 'places'[] = ['places'];

type Props = {
    biens: CasaqBien[];
    previewDomain?: string;
    hoveredBienId?: number | null;
};

export default function ListingGoogleMap({
                                             biens,
                                             previewDomain,
                                             hoveredBienId,
                                         }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const [markerColors, setMarkerColors] = useState({
        agency: '#FF5000',
        grey: '#575757',
    });
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        const agency =
            getComputedStyle(root).getPropertyValue('--site-agency').trim() ||
            getComputedStyle(body).getPropertyValue('--site-agency').trim() ||
            '#FF5000';

        const grey =
            getComputedStyle(root).getPropertyValue('--site-grey').trim() ||
            getComputedStyle(body).getPropertyValue('--site-grey').trim() ||
            '#575757';

        setMarkerColors({
            agency,
            grey,
        });
    }, []);
    const markers = useMemo(
        () =>
            biens
                .filter((bien) => bien.adresse?.lat && bien.adresse?.lng)
                .map((bien) => ({
                    bien,
                    lat: Number(bien.adresse?.lat),
                    lng: Number(bien.adresse?.lng),
                })),
        [biens]
    );

    const center = useMemo(() => {
        if (markers[0]) {
            return {
                lat: markers[0].lat,
                lng: markers[0].lng,
            };
        }

        return {
            lat: 46.8182,
            lng: 8.2275,
        };
    }, [markers]);

    if (!isLoaded) {
        return <div className="listing-map-placeholder">Chargement de la carte…</div>;
    }


    return (
        <GoogleMap
            mapContainerClassName="listing-map"
            center={center}
            zoom={markers.length ? 11 : 8}
            options={{
                styles: wizardMapStyles,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                clickableIcons: false,
                gestureHandling: 'cooperative',
                backgroundColor: '#E8EFE7',
            }}
        >
            {markers.map(({ bien, lat, lng }) => {
                const isActive =
                    selectedId === bien.id ||
                    hoveredId === bien.id ||
                    hoveredBienId === bien.id;

                return (
                    <Marker
                        key={bien.id}
                        position={{ lat, lng }}
                        icon={buildMarkerIcon({
                            fill: isActive ? markerColors.agency : markerColors.grey,
                        })}
                        onClick={() => setSelectedId(bien.id)}
                        onMouseOver={() => setHoveredId(bien.id)}
                        onMouseOut={() => setHoveredId(null)}
                    />
                );
            })}
            {markers.map(({ bien, lat, lng }) =>
                selectedId === bien.id ? (
                    <InfoWindow
                        key={`info-${bien.id}`}
                        position={{ lat, lng }}
                        onCloseClick={() => setSelectedId(null)}
                    >
                        <Link
                            href={buildUrl(getBienSeoPath(bien), previewDomain)}
                            className="listing-map-card"
                        >
                            <div className="listing-map-card__image">
                                {getBienImage(bien) ? (
                                    <Image
                                        src={getBienImage(bien)!}
                                        alt={bien.titre}
                                        fill
                                        sizes="260px"
                                        className="listing-map-card__img"
                                    />
                                ) : (
                                    <div className="listing-map-card__placeholder">
                                        <svg
                                            width="34"
                                            height="34"
                                            viewBox="0 0 54 54"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                        >
                                            <path
                                                opacity="0.35"
                                                d="M13.5894 13.1994L17.0758 7.62118H35.9849L41.894 17.0757H50.1667V44.2575H44.4041M33.2052 33.191C34.3739 31.5969 34.9333 29.637 34.782 27.6662C34.6307 25.6953 33.7787 23.8438 32.3802 22.4468C30.9818 21.0498 29.1294 20.1997 27.1584 20.0504C25.1874 19.9011 23.2281 20.4624 21.6352 21.6328M0.530273 0.530273L52.5303 52.5303M8.06555 17.0757H2.89391V44.2575H34.803M18.5648 26.0695C18.1672 27.4943 18.1586 28.9996 18.5399 30.4289C18.9211 31.8582 19.6783 33.1593 20.7327 34.1968C21.7871 35.2343 23.1002 35.9704 24.5355 36.3285C25.9707 36.6866 27.4757 36.6537 28.8939 36.2331"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="listing-map-card__content">
                                <h3 className="listing-map-card__title">
                                    {getMapCardTitle(bien)}
                                </h3>

                                <div className="listing-map-card__location">
                                    {[bien.adresse?.npa, bien.adresse?.ville].filter(Boolean).join(' ')}
                                </div>

                                <div className="listing-map-card__meta">
                                    {bien.caracteristiques?.pieces ? (
                                        <span>{bien.caracteristiques.pieces} pièces</span>
                                    ) : null}

                                    {bien.caracteristiques?.surface_habitable ? (
                                        <span>{formatSurface(bien.caracteristiques.surface_habitable)}</span>
                                    ) : null}
                                </div>

                                <p className="listing-map-card__price">
                                    {bien.prix?.formatte || 'Prix sur demande'}
                                </p>
                            </div>
                        </Link>
                    </InfoWindow>
                ) : null
            )}
        </GoogleMap>
    );
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) return url;

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}
const wizardMapStyles: google.maps.MapTypeStyle[] = [
    {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#D6DED4' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#96BCBD' }],
    },
    {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#C4D8BE' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#B9D4B1' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#F3F0E9' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#575757' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#F3F0E9' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4F5F4F' }],
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4B4B4B' }],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#BACBBA' }],
    },
];
function buildMarkerIcon({ fill }: { fill: string }): google.maps.Icon {
    const svg = `
        <svg width="33" height="40" viewBox="0 0 33 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 16.8511C1 7.22448 8.25991 1 16.284 1C24.3081 1 31.568 7.22448 31.568 16.8511C31.568 22.7022 27.3281 29.5334 18.8627 37.3593C17.4056 38.7064 15.1625 38.7064 13.7053 37.3593C5.23993 29.5334 1 22.7022 1 16.8511Z" fill="${fill}" stroke="white" stroke-width="2"/>
            <path d="M16.2837 12.2125C18.4285 12.2125 20.1302 13.908 20.1304 15.9537C20.1304 17.9996 18.4286 19.6959 16.2837 19.6959C14.139 19.6957 12.438 17.9995 12.438 15.9537C12.4381 13.9081 14.1391 12.2128 16.2837 12.2125Z" fill="white" stroke="white" stroke-width="2"/>
        </svg>
    `;

    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(33, 40),
        anchor: new google.maps.Point(16.5, 40),
    };
}
function getBienImage(bien: CasaqBien): string | null {
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

    const firstImage = images[0] as any;

    if (!firstImage) {
        return null;
    }

    if (typeof firstImage === 'string') {
        return firstImage;
    }

    return (
        firstImage.variants?.medium ||
        firstImage.variants?.large ||
        firstImage.variants?.xl ||
        firstImage.medium ||
        firstImage.large ||
        firstImage.xl ||
        firstImage.url ||
        firstImage.src ||
        null
    );
}

function getMapCardTitle(bien: CasaqBien): string {
    const parts = [
        bien.categorie,
        bien.adresse?.ville,
    ].filter(Boolean);

    return parts.length ? parts.join(' - ') : bien.titre;
}

function formatSurface(value: string | number): string {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return `${value} m²`;
    }

    return `${new Intl.NumberFormat('fr-CH').format(number)} m²`;
}