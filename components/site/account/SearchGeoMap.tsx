'use client';

import { useEffect, useRef, useState } from 'react';
import type { ContactSearchGeo } from '@/lib/contact-auth-client';

type Props = {
    value: ContactSearchGeo;
    onChange: (geo: ContactSearchGeo) => void;
};

declare global {
    interface Window {
        __casaqGoogleMapsLoading?: boolean;
        __casaqGoogleMapsLoaded?: boolean;
        __casaqGoogleMapsCallbacks?: Array<() => void>;
    }
}

const defaultGeo: ContactSearchGeo = {
    include: [],
    exclude: [],
};

export function SearchGeoMap({ value, onChange }: Props) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const includeInputRef = useRef<HTMLInputElement | null>(null);
    const excludeInputRef = useRef<HTMLInputElement | null>(null);

    const mapInstanceRef = useRef<any>(null);
    const includeAutocompleteRef = useRef<any>(null);
    const excludeAutocompleteRef = useRef<any>(null);
    const circlesRef = useRef<any[]>([]);

    const [includeRadius, setIncludeRadius] = useState('10');
    const [excludeRadius, setExcludeRadius] = useState('5');
    const [mapReady, setMapReady] = useState(false);

    const geo = normalizeGeo(value);

    useEffect(() => {
        loadGoogleMaps(() => {
            setMapReady(true);
        });
    }, []);

    useEffect(() => {
        if (!mapReady || !mapRef.current || !window.google?.maps) {
            return;
        }

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: 46.818, lng: 8.228 },
                zoom: 8,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
            });

            setupAutocomplete();
        }

        drawCircles();
    }, [mapReady, value]);

    function setupAutocomplete() {
        if (!window.google?.maps?.places) {
            return;
        }

        const options = {
            componentRestrictions: { country: ['ch', 'fr', 'de', 'it', 'at'] },
            types: ['(cities)'],
            fields: ['place_id', 'geometry.location', 'name', 'formatted_address'],
        };

        if (includeInputRef.current && !includeAutocompleteRef.current) {
            includeAutocompleteRef.current = new window.google.maps.places.Autocomplete(
                includeInputRef.current,
                options,
            );
        }

        if (excludeInputRef.current && !excludeAutocompleteRef.current) {
            excludeAutocompleteRef.current = new window.google.maps.places.Autocomplete(
                excludeInputRef.current,
                options,
            );
        }
    }

    function drawCircles() {
        if (!mapInstanceRef.current || !window.google?.maps) {
            return;
        }

        circlesRef.current.forEach((circle) => circle.setMap(null));
        circlesRef.current = [];

        geo.include.forEach((zone) => {
            if (!isValidZone(zone)) {
                return;
            }

            circlesRef.current.push(
                new window.google.maps.Circle({
                    strokeColor: '#2e7d32',
                    strokeOpacity: 0.9,
                    strokeWeight: 1.5,
                    fillColor: '#66bb6a',
                    fillOpacity: 0.18,
                    map: mapInstanceRef.current,
                    center: { lat: zone.lat, lng: zone.lng },
                    radius: kmToMeters(zone.radius_km || 10),
                }),
            );
        });

        geo.exclude.forEach((zone) => {
            if (!isValidZone(zone)) {
                return;
            }

            circlesRef.current.push(
                new window.google.maps.Circle({
                    strokeColor: '#c62828',
                    strokeOpacity: 0.9,
                    strokeWeight: 1.5,
                    fillColor: '#ef5350',
                    fillOpacity: 0.22,
                    map: mapInstanceRef.current,
                    center: { lat: zone.lat, lng: zone.lng },
                    radius: kmToMeters(zone.radius_km || 5),
                }),
            );
        });
    }

    function addPlace(kind: 'include' | 'exclude') {
        const autocomplete =
            kind === 'include'
                ? includeAutocompleteRef.current
                : excludeAutocompleteRef.current;

        const input =
            kind === 'include'
                ? includeInputRef.current
                : excludeInputRef.current;

        const radius =
            kind === 'include'
                ? Number(includeRadius || 10)
                : Number(excludeRadius || 5);

        const place = autocomplete?.getPlace?.();

        if (!place?.geometry?.location) {
            return;
        }

        const zone = {
            name: place.formatted_address || place.name || input?.value || 'Zone',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            radius_km: Math.max(1, radius),
            place_id: place.place_id || null,
        };

        const current = normalizeGeo(value);
        const list = current[kind];

        if (isDuplicate(list, zone)) {
            if (input) {
                input.value = '';
            }
            return;
        }

        const next = {
            ...current,
            [kind]: [...list, zone],
        };

        if (input) {
            input.value = '';
        }

        onChange(next);
    }

    function removeZone(kind: 'include' | 'exclude', index: number) {
        const current = normalizeGeo(value);

        onChange({
            ...current,
            [kind]: current[kind].filter((_, itemIndex) => itemIndex !== index),
        });
    }

    return (
        <div className="search-map-block">
            <div ref={mapRef} className="search-map" />

            <div className="search-map-controls">
                <div className="search-map-control">
                    <div className="search-map-title search-map-title--include">
                        Zones à inclure
                    </div>

                    <div className="search-map-row">
                        <input
                            ref={includeInputRef}
                            type="text"
                            placeholder="Genève, Lausanne..."
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                }
                            }}
                        />

                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={includeRadius}
                            onChange={(event) => setIncludeRadius(event.target.value)}
                        />

                        <span>km</span>

                        <button type="button" className='site-btn btn-sm' onClick={() => addPlace('include')}>
                            Ajouter
                        </button>
                    </div>

                    <ZoneChips
                        kind="include"
                        zones={geo.include}
                        onRemove={(index) => removeZone('include', index)}
                    />
                </div>

                <div className="search-map-control">
                    <div className="search-map-title search-map-title--exclude">
                        Zones à exclure
                    </div>

                    <div className="search-map-row">
                        <input
                            ref={excludeInputRef}
                            type="text"
                            placeholder="Porrentruy, Meyrin..."
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                }
                            }}
                        />

                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={excludeRadius}
                            onChange={(event) => setExcludeRadius(event.target.value)}
                        />

                        <span>km</span>

                        <button type="button" className='site-btn btn-sm' onClick={() => addPlace('exclude')}>
                            Ajouter
                        </button>
                    </div>

                    <ZoneChips
                        kind="exclude"
                        zones={geo.exclude}
                        onRemove={(index) => removeZone('exclude', index)}
                    />
                </div>
            </div>
        </div>
    );
}

function ZoneChips({
                       kind,
                       zones,
                       onRemove,
                   }: {
    kind: 'include' | 'exclude';
    zones: ContactSearchGeo['include'];
    onRemove: (index: number) => void;
}) {
    if (zones.length === 0) {
        return <p className="search-map-empty">Aucune zone définie.</p>;
    }

    return (
        <div className="search-map-chips">
            {zones.map((zone, index) => (
                <span
                    key={`${zone.name}-${index}`}
                    className={
                        kind === 'include'
                            ? 'search-map-chip search-map-chip--include'
                            : 'search-map-chip search-map-chip--exclude'
                    }
                >
          {zone.name?.split(',')[0]}
                    <small>{zone.radius_km || 0} km</small>

          <button type="button" onClick={() => onRemove(index)}>
            ×
          </button>
        </span>
            ))}
        </div>
    );
}

function normalizeGeo(value?: ContactSearchGeo): ContactSearchGeo {
    return {
        include: Array.isArray(value?.include) ? value.include : [],
        exclude: Array.isArray(value?.exclude) ? value.exclude : [],
    };
}

function isValidZone(zone: ContactSearchGeo['include'][number]): zone is {
    name: string;
    lat: number;
    lng: number;
    radius_km: number;
    place_id?: string | null;
} {
    return typeof zone.lat === 'number' && typeof zone.lng === 'number';
}

function isDuplicate(
    zones: ContactSearchGeo['include'],
    zone: ContactSearchGeo['include'][number],
): boolean {
    return zones.some((item) => {
        if (zone.place_id && item.place_id === zone.place_id) {
            return true;
        }

        if (typeof item.lat !== 'number' || typeof item.lng !== 'number') {
            return false;
        }

        if (typeof zone.lat !== 'number' || typeof zone.lng !== 'number') {
            return false;
        }

        return (
            Math.round(item.lat * 100000) === Math.round(zone.lat * 100000) &&
            Math.round(item.lng * 100000) === Math.round(zone.lng * 100000)
        );
    });
}

function kmToMeters(km: number): number {
    return Math.max(1, Number(km) || 1) * 1000;
}

function loadGoogleMaps(callback: () => void) {
    if (typeof window === 'undefined') {
        return;
    }

    if (window.__casaqGoogleMapsLoaded || window.google?.maps?.places) {
        callback();
        return;
    }

    window.__casaqGoogleMapsCallbacks = window.__casaqGoogleMapsCallbacks || [];
    window.__casaqGoogleMapsCallbacks.push(callback);

    if (window.__casaqGoogleMapsLoading) {
        return;
    }

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!key) {
        console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY manquant dans .env.local');
        return;
    }

    window.__casaqGoogleMapsLoading = true;

    const callbackName = '__casaqInitGoogleMaps';

    (window as any)[callbackName] = () => {
        window.__casaqGoogleMapsLoaded = true;
        window.__casaqGoogleMapsLoading = false;

        const callbacks = window.__casaqGoogleMapsCallbacks || [];
        window.__casaqGoogleMapsCallbacks = [];

        callbacks.forEach((item) => item());
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        key,
    )}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
}