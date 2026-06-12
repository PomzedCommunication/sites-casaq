'use client';

import type { ListingSort as ListingSortValue } from '@/lib/listing/listing-types';
import { useListing } from './ListingProvider';

export function ListingSort() {
    const { filters, setSort, isPending } = useListing();

    return (
        <select
            value={filters.sort || 'recent'}
            onChange={(event) => setSort(event.target.value as ListingSortValue)}
            disabled={isPending}
        >
            <option value="recent">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="surface_desc">Surface décroissante</option>
            <option value="pieces_desc">Pièces décroissantes</option>
        </select>
    );
}