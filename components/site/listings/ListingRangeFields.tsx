// src/components/site/listings/ListingRangeFields.tsx

'use client';

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

function toNumber(value: string): number | undefined {
    if (!value) return undefined;

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
}

export function ListingRangeFields({
                                       minValue,
                                       maxValue,
                                       minPlaceholder,
                                       maxPlaceholder,
                                       step = 1,
                                       min,
                                       max,
                                       suffix,
                                       onChange,
                                   }: Props) {
    return (
        <div className="listing-range-fields">
            <label>
                <span>Min</span>
                <input
                    type="number"
                    value={minValue ?? ''}
                    placeholder={minPlaceholder}
                    step={step}
                    min={min}
                    max={max}
                    onChange={(event) =>
                        onChange({
                            min: toNumber(event.target.value),
                            max: maxValue,
                        })
                    }
                />
            </label>

            <label>
                <span>Max</span>
                <input
                    type="number"
                    value={maxValue ?? ''}
                    placeholder={maxPlaceholder}
                    step={step}
                    min={min}
                    max={max}
                    onChange={(event) =>
                        onChange({
                            min: minValue,
                            max: toNumber(event.target.value),
                        })
                    }
                />
            </label>

            {suffix ? (
                <p className="listing-range-fields__suffix">{suffix}</p>
            ) : null}
        </div>
    );
}