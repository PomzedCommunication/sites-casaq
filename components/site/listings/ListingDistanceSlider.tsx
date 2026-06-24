// src/components/site/listings/ListingDistanceSlider.tsx

'use client';

type Props = {
    value?: number;
    disabled?: boolean;
    onChange: (value: number) => void;
};

const MIN_DISTANCE = 1;
const MAX_DISTANCE = 100;

export function ListingDistanceSlider({
                                          value = 10,
                                          disabled = false,
                                          onChange,
                                      }: Props) {
    const percent =
        ((value - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE)) * 100;

    return (
        <div
            className={[
                'listing-range-slider',
                'listing-distance-slider',
                disabled ? 'listing-range-slider--disabled' : '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className="listing-range-slider__top">
                <div>
                    <p className="listing-range-slider__label">
                        Distance
                    </p>

                    <p className="listing-range-slider__value">
                        {value} km
                    </p>
                </div>
            </div>

            <div className="listing-range-slider__track-wrap">
                <div className="listing-range-slider__track" />

                <div
                    className="listing-range-slider__range"
                    style={{
                        left: 0,
                        right: `${100 - percent}%`,
                    }}
                />

                <input
                    type="range"
                    min={MIN_DISTANCE}
                    max={MAX_DISTANCE}
                    step={1}
                    value={value}
                    disabled={disabled}
                    onChange={(event) => onChange(Number(event.target.value))}
                    className="listing-range-slider__input"
                    aria-label="Distance"
                />
            </div>

            <div className="listing-range-slider__limits">
                <span>{MIN_DISTANCE} km</span>
                <span>{MAX_DISTANCE} km</span>
            </div>

            {disabled ? (
                <p className="listing-filter-help">
                    Sélectionne d’abord une localité.
                </p>
            ) : null}
        </div>
    );
}