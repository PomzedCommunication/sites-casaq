// src/components/site/listings/ListingGoogleMap.tsx

'use client';

import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import type { CasaqBien } from '@/lib/casaq';
import { getBienSeoPath } from '@/lib/property-url';

const libraries: 'places'[] = ['places'];

type Props = {
    biens: CasaqBien[];
    previewDomain?: string;
};

export default function ListingGoogleMap({ biens, previewDomain }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

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
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
            }}
        >
            {markers.map(({ bien, lat, lng }) => (
                <Marker
                    key={bien.id}
                    position={{ lat, lng }}
                    onClick={() => setSelectedId(bien.id)}
                />
            ))}

            {markers.map(({ bien, lat, lng }) =>
                selectedId === bien.id ? (
                    <InfoWindow
                        key={`info-${bien.id}`}
                        position={{ lat, lng }}
                        onCloseClick={() => setSelectedId(null)}
                    >
                        <div className="listing-map-card">
                            <strong>{bien.titre}</strong>
                            <p>{bien.prix?.formatte || 'Prix sur demande'}</p>
                            <a href={buildUrl(getBienSeoPath(bien), previewDomain)}>
                                Voir le bien
                            </a>
                        </div>
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