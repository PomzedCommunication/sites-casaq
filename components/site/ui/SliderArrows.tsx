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
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M25.5 15C25.5 15.6213 24.9963 16.125 24.375 16.125L8.41812 16.125L14.6547 22.0641C15.1026 22.4947 15.1166 23.2069 14.6859 23.6548C14.2553 24.1026 13.5431 24.1166 13.0953 23.6859L4.84525 15.8109C4.62466 15.5988 4.5 15.306 4.5 15C4.5 14.694 4.62466 14.4012 4.84525 14.1891L13.0953 6.31406C13.5431 5.88342 14.2553 5.89739 14.6859 6.34525C15.1166 6.79312 15.1026 7.5053 14.6547 7.93594L8.41812 13.875L24.375 13.875C24.9963 13.875 25.5 14.3787 25.5 15Z" fill="#222222"/>
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