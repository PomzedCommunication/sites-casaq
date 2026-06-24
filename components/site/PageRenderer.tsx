import type {
    CasaqBiensMeta,
    CasaqBien,
    CasaqPage,
    CasaqSiteConfig,
} from '@/lib/casaq';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { TemplateRegistry } from '@/components/site/templates/TemplateRegistry';
import { FavoritesProvider } from '@/components/site/favorites/FavoritesProvider';
import type {
    ListingAvailableFilters,
    ListingFilters,
} from '@/lib/listing/listing-types';
import type { CasaqPost } from '@/lib/casaq';
import { ListingProvider } from '@/components/site/listings/ListingProvider';
type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    biensMeta: CasaqBiensMeta;
    currentDomain: string;
    currentPath: string;
    previewDomain?: string;
    initialFilters?: ListingFilters;
    availableFilters?: ListingAvailableFilters;
    currentPost?: CasaqPost | null;
};

export function PageRenderer({
                                 site,
                                 page,
                                 biens,
                                 biensMeta,
                                 currentDomain,
                                 currentPath,
                                 previewDomain,
                                 initialFilters,
                                 availableFilters,
                                 currentPost,
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

    return (
        <SiteLayout
            site={site}
            currentDomain={currentDomain}
            previewDomain={previewDomain}
        >
            <FavoritesProvider>
                <ListingProvider
                    key={providerKey}
                    initialBiens={biens}
                    initialMeta={biensMeta}
                    initialFilters={safeInitialFilters}
                    availableFilters={availableFilters}
                    previewDomain={previewDomain}
                >
                    <TemplateRegistry
                        site={site}
                        page={page}
                        biens={biens}
                        meta={biensMeta}
                        currentPath={currentPath}
                        currentDomain={currentDomain}
                        previewDomain={previewDomain}
                        initialFilters={safeInitialFilters}
                        availableFilters={availableFilters}
                    />
                </ListingProvider>
            </FavoritesProvider>
        </SiteLayout>
    );
}