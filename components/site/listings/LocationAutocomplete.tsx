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

type Suggestion = google.maps.places.AutocompletePrediction;

function cleanSuggestionLabel(prediction: Suggestion) {
    return prediction.description
        .replace(/,\s*Suisse$/i, '')
        .replace(/,\s*Switzerland$/i, '');
}

function getComponent(
    place: google.maps.places.PlaceResult,
    type: string
): string | undefined {
    return place.address_components?.find((component) =>
        component.types.includes(type)
    )?.long_name;
}

export function LocationAutocomplete({ value, onSelect }: Props) {
    const [inputValue, setInputValue] = useState(value || '');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    const placesDivRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    useEffect(() => {
        if (!window.google?.maps?.places || !placesDivRef.current) {
            return;
        }

        serviceRef.current = new window.google.maps.places.AutocompleteService();
        placesServiceRef.current = new window.google.maps.places.PlacesService(
            placesDivRef.current
        );
    }, []);

    function handleChange(nextValue: string) {
        setInputValue(nextValue);

        if (!nextValue.trim() || !serviceRef.current) {
            setSuggestions([]);
            return;
        }

        serviceRef.current.getPlacePredictions(
            {
                input: nextValue,
                componentRestrictions: { country: 'ch' },
                types: ['(regions)'],
            },
            (predictions) => {
                setSuggestions(predictions || []);
            }
        );
    }

    function selectSuggestion(prediction: Suggestion) {
        if (!placesServiceRef.current) {
            return;
        }

        placesServiceRef.current.getDetails(
            {
                placeId: prediction.place_id,
                fields: ['geometry', 'name', 'address_components'],
            },
            (place) => {
                if (!place) return;

                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();

                if (lat == null || lng == null) {
                    return;
                }

                const postalCode = getComponent(place, 'postal_code');

                const city =
                    getComponent(place, 'locality') ||
                    getComponent(place, 'postal_town') ||
                    getComponent(place, 'administrative_area_level_3') ||
                    getComponent(place, 'administrative_area_level_2') ||
                    place.name;

                const label =
                    postalCode && city
                        ? `${postalCode} ${city}`
                        : city || cleanSuggestionLabel(prediction);

                setInputValue(label);
                setSuggestions([]);

                onSelect({
                    label,
                    city,
                    lat,
                    lng,
                });
            }
        );
    }

    return (
        <div className="location-autocomplete">
            <input
                value={inputValue}
                onChange={(event) => handleChange(event.target.value)}
                placeholder="NPA ou localité"
                className="listing-filter-input"
            />

            {suggestions.length > 0 ? (
                <div className="location-autocomplete__suggestions">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.place_id}
                            type="button"
                            className="location-autocomplete__suggestion"
                            onClick={() => selectSuggestion(suggestion)}
                        >
                            {cleanSuggestionLabel(suggestion)}
                        </button>
                    ))}
                </div>
            ) : null}

            <div ref={placesDivRef} style={{ display: 'none' }} />
        </div>
    );
}