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

    const title =
        page.template === 'listing_sale'
            ? 'Biens à vendre'
            : page.template === 'listing_rent'
                ? 'Biens à louer'
                : page.titre || 'Nos biens';

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
                <ListingSplitMap
                    currentPath={currentPath}
                    previewDomain={previewDomain}
                />
            </section>
        </ListingProvider>
    );
}