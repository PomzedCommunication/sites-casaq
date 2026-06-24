// src/components/site/listings/ListingSplitMap.tsx

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { BiensGrid } from './BiensGrid';
import { ListingSort } from './ListingSort';
import { Pagination } from './Pagination';
import { useListing } from './ListingProvider';

const ListingGoogleMap = dynamic(() => import('./ListingGoogleMap'), {
    ssr: false,
});

type Props = {
    currentPath: string;
    previewDomain?: string;
};

const MAP_VISIBLE_STORAGE_KEY = 'listing_map_visible';
const MOBILE_BREAKPOINT = 980;

export function ListingSplitMap({ currentPath, previewDomain }: Props) {
    const { biens, meta } = useListing();

    const [hoveredBienId, setHoveredBienId] = useState<number | null>(null);
    const [mapVisible, setMapVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setMapVisible(false);
            return;
        }

        const savedValue = sessionStorage.getItem(MAP_VISIBLE_STORAGE_KEY);

        if (savedValue === '0') {
            setMapVisible(false);
        }

        if (savedValue === '1') {
            setMapVisible(true);
        }
    }, [isMobile]);

    function toggleMapVisible() {
        if (isMobile) {
            return;
        }

        setMapVisible((value) => {
            const nextValue = !value;

            sessionStorage.setItem(
                MAP_VISIBLE_STORAGE_KEY,
                nextValue ? '1' : '0'
            );

            return nextValue;
        });
    }

    const showMap = !isMobile && mapVisible;

    return (
        <div
            className={`listing-split ${
                showMap ? 'listing-split--with-map' : 'listing-split--no-map'
            }`}
        >
            <div className="listing-split__results">
                <div className="listing-toolbar listing-toolbar--split white">
                    <ListingSort />

                    {!isMobile ? (
                        <>
                            <div className="sep-listing" />

                            <button
                                type="button"
                                className="listing-map-toggle"
                                onClick={toggleMapVisible}
                            >
                                {mapVisible ? 'Masquer la carte' : 'Afficher la carte'}

                                {mapVisible ? (
                                    <svg
                                        width="17"
                                        height="10"
                                        viewBox="0 0 17 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15.7502 0.750145C15.7502 0.750145 13.3814 5.11349 8.25024 5.11349C3.11909 5.11349 0.750244 0.751208 0.750244 0.751208M8.20871 5.05506V8.75014M11.901 4.00858L13.641 7.46887M4.50024 4.26781L2.87101 7.46887"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </>
                    ) : null}
                </div>

                <BiensGrid
                    biens={biens}
                    previewDomain={previewDomain}
                    onBienHover={setHoveredBienId}
                />

                <Pagination
                    meta={meta}
                    currentPath={currentPath}
                    previewDomain={previewDomain}
                />
            </div>

            {showMap ? (
                <aside className="listing-split__map">
                    <ListingGoogleMap
                        biens={biens}
                        previewDomain={previewDomain}
                        hoveredBienId={hoveredBienId}
                    />
                </aside>
            ) : null}
        </div>
    );
}