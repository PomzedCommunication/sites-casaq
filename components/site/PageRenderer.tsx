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
    return (
        <SiteLayout
            site={site}
            currentDomain={currentDomain}
            previewDomain={previewDomain}
        >
            <FavoritesProvider>
                <TemplateRegistry
                    site={site}
                    page={page}
                    biens={biens}
                    meta={biensMeta}
                    currentPath={currentPath}
                    currentDomain={currentDomain}
                    previewDomain={previewDomain}
                    initialFilters={initialFilters}
                    availableFilters={availableFilters}
                />
            </FavoritesProvider>
        </SiteLayout>
    );
}