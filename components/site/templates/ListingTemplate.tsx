// src/components/site/templates/ListingTemplate.tsx

import type {
    CasaqBiensMeta,
    CasaqBien,
    CasaqPage,
    CasaqSiteConfig,
} from '@/lib/casaq';
import { ListingProvider } from '@/components/site/listings/ListingProvider';
import { ListingSearchBar } from '@/components/site/listings/ListingSearchBar';
import { ListingSplitMap } from '@/components/site/listings/ListingSplitMap';
import type {
    ListingAvailableFilters,
    ListingFilters,
} from '@/lib/listing/listing-types';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    currentPath: string;
    previewDomain?: string;
    initialFilters: ListingFilters;
    availableFilters?: ListingAvailableFilters;
};

export function ListingTemplate({
                                    page,
                                    biens,
                                    meta,
                                    currentPath,
                                    previewDomain,
                                    initialFilters,
                                    availableFilters,
                                }: Props) {
    const forcedDeal =
        page.template === 'listing_sale'
            ? 'SALE'
            : page.template === 'listing_rent'
                ? 'RENT'
                : undefined;

    const safeInitialFilters: ListingFilters = {
        sort: 'recent',
        view: 'grid',
        page: 1,
        ...(initialFilters || {}),
        deal: forcedDeal || initialFilters?.deal,
    };

    const providerKey = JSON.stringify({
        deal: safeInitialFilters.deal,
        categoryParent: safeInitialFilters.categoryParent,
        city: safeInitialFilters.city,
        lat: safeInitialFilters.lat,
        lng: safeInitialFilters.lng,
        rayon: safeInitialFilters.rayon,
        prixMin: safeInitialFilters.prixMin,
        prixMax: safeInitialFilters.prixMax,
        piecesMin: safeInitialFilters.piecesMin,
        piecesMax: safeInitialFilters.piecesMax,
        surfaceMin: safeInitialFilters.surfaceMin,
        surfaceMax: safeInitialFilters.surfaceMax,
        prestige: safeInitialFilters.prestige,
        sort: safeInitialFilters.sort,
        page: safeInitialFilters.page,
    });
    //
    // const title =
    //     page.template === 'listing_sale'
    //         ? 'Biens à vendre'
    //         : page.template === 'listing_rent'
    //             ? 'Biens à louer'
    //             : page.titre || 'Nos biens';
    const title = buildListingTitle({
        total: meta.total,
        filters: safeInitialFilters,
        pageTitle: page.titre,
    });
    return (
        <ListingProvider
            key={providerKey}
            initialBiens={biens}
            initialMeta={meta}
            initialFilters={safeInitialFilters}
            availableFilters={availableFilters}
            previewDomain={previewDomain}
        >
            <section className="page-liste-bien pd-l-r">
                <ListingSearchBar
                    variant="large"
                    hideDealSelect={Boolean(forcedDeal)}
                />
                <div className="listing-heading">
                    <h1 className='h3'>{title}</h1>
                </div>

                <ListingSplitMap
                    currentPath={currentPath}
                    previewDomain={previewDomain}
                />
            </section>
        </ListingProvider>
    );
}
function buildListingTitle({
                               total,
                               filters,
                               pageTitle,
                               template,
                           }: {
    total: number;
    filters: ListingFilters;
    pageTitle?: string | null;
    template?: string | null;
}): string {
    const count = new Intl.NumberFormat('fr-CH').format(total);

    const isPlural = total !== 1;
    const type = getListingTypeLabel(filters, isPlural);
    const deal = getDealLabel(filters.deal, template);
    const location = getLocationLabel(filters);

    if (location) {
        return `${count} ${type} ${deal} à ${location}`;
    }

    return `${count} ${type} ${deal}`;
}

function getDealLabel(
    deal?: string | null,
    template?: string | null
): string {
    const resolvedDeal =
        deal ||
        (template === 'listing_sale'
            ? 'SALE'
            : template === 'listing_rent'
                ? 'RENT'
                : undefined);

    if (resolvedDeal === 'RENT') {
        return 'à louer';
    }

    if (resolvedDeal === 'SALE') {
        return 'à vendre';
    }

    return 'disponibles';
}
function getListingTypeLabel(
    filters: ListingFilters,
    plural = true
): string {
    const category =
        filters.category ||
        filters.categoryParent;

    if (!category) {
        return plural ? 'biens immobiliers' : 'bien immobilier';
    }

    const normalized = String(category)
        .replace(/-/g, ' ')
        .trim()
        .toLowerCase();

    const labels: Array<{
        match: string[];
        singular: string;
        plural: string;
    }> = [
        {
            match: ['appartement', 'appartements'],
            singular: 'appartement',
            plural: 'appartements',
        },
        {
            match: ['maison', 'maisons'],
            singular: 'maison',
            plural: 'maisons',
        },
        {
            match: ['villa', 'villas'],
            singular: 'villa',
            plural: 'villas',
        },
        {
            match: ['terrain', 'terrains'],
            singular: 'terrain',
            plural: 'terrains',
        },
        {
            match: ['immeuble', 'immeubles'],
            singular: 'immeuble',
            plural: 'immeubles',
        },
        {
            match: ['bureau', 'bureaux'],
            singular: 'bureau',
            plural: 'bureaux',
        },
        {
            match: [
                'commerce',
                'commerces',
                'local commercial',
                'locaux commerciaux',
                'local',
                'locaux',
            ],
            singular: 'local commercial',
            plural: 'locaux commerciaux',
        },
        {
            match: ['parking', 'parkings'],
            singular: 'parking',
            plural: 'parkings',
        },
    ];

    const found = labels.find((item) =>
        item.match.some((value) => normalized.includes(value))
    );

    if (found) {
        return plural ? found.plural : found.singular;
    }

    return plural ? pluralizeFallback(normalized) : singularizeFallback(normalized);
}
function pluralizeFallback(value: string): string {
    if (!value) {
        return 'biens immobiliers';
    }

    if (
        value.endsWith('s') ||
        value.endsWith('x')
    ) {
        return value;
    }

    if (value.endsWith('al')) {
        return value.slice(0, -2) + 'aux';
    }

    return `${value}s`;
}

function singularizeFallback(value: string): string {
    if (!value) {
        return 'bien immobilier';
    }

    if (value.endsWith('aux')) {
        return value.slice(0, -3) + 'al';
    }

    if (value.endsWith('s')) {
        return value.slice(0, -1);
    }

    return value;
}
function getLocationLabel(filters: ListingFilters): string | null {
    if (filters.city) {
        return formatLocation(filters.city);
    }

    return null;
}
function formatLocation(value: string): string {
    return value
        .replace(/-/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((word) => {
            if (word.length <= 2) {
                return word.toUpperCase();
            }

            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}