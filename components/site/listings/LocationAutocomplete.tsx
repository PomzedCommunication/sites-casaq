'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
    value?: string;
    onSelect: (location: {
        label: string;
        city?: string;
        lat: number;
        lng: number;
    }) => void;
};

declare global {
    interface Window {
        google?: typeof google;
    }
}

export function LocationAutocomplete({ value, onSelect }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputValue, setInputValue] = useState(value || '');

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    useEffect(() => {
        if (!inputRef.current || !window.google?.maps?.places) {
            return;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'ch' },
            fields: ['formatted_address', 'geometry', 'name', 'address_components'],
            types: ['geocode'],
        });

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();

            if (!lat || !lng) {
                return;
            }

            const city =
                place.address_components?.find((component) =>
                    component.types.includes('locality')
                )?.long_name ||
                place.address_components?.find((component) =>
                    component.types.includes('postal_town')
                )?.long_name ||
                place.name;

            const label = place.formatted_address || place.name || city || '';

            setInputValue(label);

            onSelect({
                label,
                city,
                lat,
                lng,
            });
        });

        return () => {
            window.google?.maps.event.removeListener(listener);
        };
    }, [onSelect]);

    return (
        <input
            ref={inputRef}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Localité"
            className="listing-filter-input"
        />
    );
}