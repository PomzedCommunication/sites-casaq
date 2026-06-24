'use client';

import type { RefObject } from 'react';

type Props = {
    prevRef: RefObject<HTMLButtonElement | null>;
    nextRef: RefObject<HTMLButtonElement | null>;
    className?: string;
    prevClassName?: string;
    nextClassName?: string;
    prevLabel?: string;
    nextLabel?: string;
};

export function SliderArrows({
                                 prevRef,
                                 nextRef,
                                 className = '',
                                 prevClassName = '',
                                 nextClassName = '',
                                 prevLabel = 'Précédent',
                                 nextLabel = 'Suivant',
                             }: Props) {
    return (
        <div className={`slider-arrows ${className}`}>
            <button
                ref={prevRef}
                type="button"
                className={`slider-arrows__btn slider-arrows__btn--prev ${prevClassName}`}
                aria-label={prevLabel}
            >

                <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M21 9C21 9.62132 20.4963 10.125 19.875 10.125L3.91812 10.125L10.1547 16.0641C10.6026 16.4947 10.6166 17.2069 10.1859 17.6548C9.75529 18.1026 9.04312 18.1166 8.59525 17.6859L0.345253 9.81094C0.124664 9.59883 -4.06779e-07 9.30602 -3.93403e-07 9C-3.80026e-07 8.69398 0.124664 8.40117 0.345253 8.18906L8.59525 0.314064C9.04312 -0.116579 9.75529 -0.102615 10.1859 0.345254C10.6166 0.793122 10.6026 1.5053 10.1547 1.93594L3.91812 7.875L19.875 7.875C20.4963 7.875 21 8.37868 21 9Z"
                          fill="#222222"/>
                </svg>

            </button>

            <button
                ref={nextRef}
                type="button"
                className={`slider-arrows__btn slider-arrows__btn--next ${nextClassName}`}
                aria-label={nextLabel}
            >
                <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M-3.93403e-07 9C-4.20561e-07 8.37868 0.503679 7.875 1.125 7.875L17.0819 7.875L10.8453 1.93593C10.3974 1.50529 10.3834 0.793119 10.8141 0.345249C11.2447 -0.102618 11.9569 -0.116583 12.4047 0.31406L20.6547 8.18906C20.8753 8.40116 21 8.69398 21 9C21 9.30602 20.8753 9.59883 20.6547 9.81093L12.4047 17.6859C11.9569 18.1166 11.2447 18.1026 10.8141 17.6547C10.3834 17.2069 10.3974 16.4947 10.8453 16.0641L17.0819 10.125L1.125 10.125C0.503679 10.125 -3.66244e-07 9.62132 -3.93403e-07 9Z"
                          fill="white"/>
                </svg>

            </button>
        </div>
    );
}