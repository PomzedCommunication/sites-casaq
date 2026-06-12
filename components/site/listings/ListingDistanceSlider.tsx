// src/components/site/listings/ListingDistanceSlider.tsx

'use client';

type Props = {
    value?: number;
    disabled?: boolean;
    onChange: (value: number) => void;
};

export function ListingDistanceSlider({
                                          value = 10,
                                          disabled = false,
                                          onChange,
                                      }: Props) {
    return (
        <div className="listing-distance-slider">
            <div className="listing-distance-slider__header">
                <span>Distance</span>
                <strong>{value} km</strong>
            </div>

            <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(Number(event.target.value))}
            />

            <div className="listing-distance-slider__marks">
                <span>1 km</span>
                <span>100 km</span>
            </div>

            {disabled ? (
                <p className="listing-filter-help">
                    Sélectionne d’abord une localité.
                </p>
            ) : null}
        </div>
    );
}