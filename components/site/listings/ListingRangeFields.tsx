// src/components/site/listings/ListingRangeFields.tsx

'use client';

import { useMemo } from 'react';

type Props = {
    minValue?: number;
    maxValue?: number;
    minPlaceholder: string;
    maxPlaceholder: string;
    step?: number;
    min?: number;
    max?: number;
    suffix?: string;
    onChange: (values: { min?: number; max?: number }) => void;
};

function formatValue(value?: number): string {
    if (value === undefined || value === null) {
        return '';
    }

    return new Intl.NumberFormat('fr-CH', {
        maximumFractionDigits: 1,
    }).format(value);
}

export function ListingRangeFields({
                                       minValue,
                                       maxValue,
                                       minPlaceholder,
                                       maxPlaceholder,
                                       step = 1,
                                       min = 0,
                                       max = 100,
                                       suffix,
                                       onChange,
                                   }: Props) {
    const currentMin = minValue ?? min;
    const currentMax = maxValue ?? max;

    const minPercent = useMemo(() => {
        return ((currentMin - min) / (max - min)) * 100;
    }, [currentMin, min, max]);

    const maxPercent = useMemo(() => {
        return ((currentMax - min) / (max - min)) * 100;
    }, [currentMax, min, max]);

    function handleMinChange(value: string) {
        const nextMin = Number(value);

        if (!Number.isFinite(nextMin)) {
            return;
        }

        onChange({
            min: Math.min(nextMin, currentMax),
            max: maxValue,
        });
    }

    function handleMaxChange(value: string) {
        const nextMax = Number(value);

        if (!Number.isFinite(nextMax)) {
            return;
        }

        onChange({
            min: minValue,
            max: Math.max(nextMax, currentMin),
        });
    }

    function resetRange() {
        onChange({
            min: undefined,
            max: undefined,
        });
    }

    const hasCustomValue = minValue !== undefined || maxValue !== undefined;

    return (
        <div className="listing-range-slider">
            <div className="listing-range-slider__top">
                <div>
                    {suffix ? (
                        <p className="listing-range-slider__label">{suffix}</p>
                    ) : null}

                    <p className="listing-range-slider__value">
                        {hasCustomValue ? (
                            <>
                                {minValue !== undefined
                                    ? formatValue(currentMin)
                                    : minPlaceholder}
                                {' – '}
                                {maxValue !== undefined
                                    ? formatValue(currentMax)
                                    : maxPlaceholder}
                            </>
                        ) : (
                            <>
                                {minPlaceholder} – {maxPlaceholder}
                            </>
                        )}
                    </p>
                </div>

                {hasCustomValue ? (
                    <button
                        type="button"
                        className="listing-range-slider__reset"
                        onClick={resetRange}
                    >
                        Effacer
                    </button>
                ) : null}
            </div>

            <div className="listing-range-slider__track-wrap">
                <div className="listing-range-slider__track" />

                <div
                    className="listing-range-slider__range"
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={currentMin}
                    onChange={(event) => handleMinChange(event.target.value)}
                    className="listing-range-slider__input listing-range-slider__input--min"
                    aria-label="Valeur minimum"
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={currentMax}
                    onChange={(event) => handleMaxChange(event.target.value)}
                    className="listing-range-slider__input listing-range-slider__input--max"
                    aria-label="Valeur maximum"
                />
            </div>

            <div className="listing-range-slider__limits">
                <span>{formatValue(min)}</span>
                <span>{formatValue(max)}</span>
            </div>
        </div>
    );
}