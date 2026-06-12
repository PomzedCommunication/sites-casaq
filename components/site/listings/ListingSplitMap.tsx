// src/components/site/listings/ListingSplitMap.tsx

'use client';

import dynamic from 'next/dynamic';
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

export function ListingSplitMap({ currentPath, previewDomain }: Props) {
    const { biens, meta } = useListing();

    return (
        <div className="listing-split">
            <div className="listing-split__results">
                <div className="listing-toolbar">
                    <p>{meta.total} résultat{meta.total > 1 ? 's' : ''}</p>
                    <ListingSort />
                </div>

                <BiensGrid biens={biens} previewDomain={previewDomain} />

                <Pagination
                    meta={meta}
                    currentPath={currentPath}
                    previewDomain={previewDomain}
                />
            </div>

            <aside className="listing-split__map">
                <ListingGoogleMap biens={biens} previewDomain={previewDomain} />
            </aside>
        </div>
    );
}