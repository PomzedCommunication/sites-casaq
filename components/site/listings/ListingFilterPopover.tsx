// src/components/site/listings/ListingFilterPopover.tsx

'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
    label: string;
    value?: string;
    disabled?: boolean;
    children: ReactNode;
};

export function ListingFilterPopover({
                                         label,
                                         value,
                                         disabled = false,
                                         children,
                                     }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

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

    return (
        <div ref={ref} className="listing-filter-popover">
            <button
                type="button"
                className="listing-filter-popover__trigger"
                disabled={disabled}
                onClick={() => setOpen((current) => !current)}
            >
                <span>{label}</span>
                {value ? (
                    <strong>{value}</strong>
                ) : null}
                <span className="listing-filter-popover__chevron">⌄</span>
            </button>

            {open ? (
                <div className="listing-filter-popover__panel">
                    {children}
                </div>
            ) : null}
        </div>
    );
}