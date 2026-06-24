// src/components/site/listings/ListingCustomSelect.tsx

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type ListingCustomSelectOption = {
    value: string;
    label: string;
    count?: number;
};

type Props = {
    value?: string;
    placeholder: string;
    options: ListingCustomSelectOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
};

export function ListingCustomSelect({
                                        value,
                                        placeholder,
                                        options,
                                        onChange,
                                        disabled = false,
                                        className,
                                    }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const selectedOption = useMemo(
        () => options.find((option) => option.value === value),
        [options, value]
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!ref.current) return;

            if (!ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    function selectValue(nextValue: string) {
        onChange(nextValue);
        setOpen(false);
    }

    return (
        <div
            ref={ref}
            className={`listing-custom-select ${className || ''}`}
        >
            <button
                type="button"
                className="listing-custom-select__trigger"
                disabled={disabled}
                onClick={() => setOpen((current) => !current)}
            >
                <span className={selectedOption ? '' : 'is-placeholder'}>
                    {selectedOption?.label || placeholder}
                </span>


                <span className="listing-custom-select__chevron">
                    <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.1006 7.5L0.00010171 1.38009e-07L8.2011 8.95112e-07L4.1006 7.5Z" fill="#FF5000"/>
                    </svg>
                </span>
            </button>

            {open ? (
                <div className="listing-custom-select__menu">
                    {options.map((option) => {
                        const active = option.value === value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`listing-custom-select__option ${
                                    active ? 'is-active' : ''
                                }`}
                                onClick={() => selectValue(option.value)}
                            >
                                <span>{option.label}</span>


                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}