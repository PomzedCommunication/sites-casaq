import type { CasaqBiensMeta, CasaqBien, CasaqPage, CasaqSiteConfig } from '@/lib/casaq';
import { LandingTemplate } from '@/components/site/templates/LandingTemplate';
import { ContentTemplate } from '@/components/site/templates/ContentTemplate';
import { ContactTemplate } from '@/components/site/templates/ContactTemplate';
import { ListingTemplate } from '@/components/site/templates/ListingTemplate';
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
    currentDomain: string;
    previewDomain?: string;
    initialFilters?: ListingFilters;
    availableFilters?: ListingAvailableFilters;
};

export function TemplateRegistry(props: Props) {
    switch (props.page.template) {
        case 'landing':
            return <LandingTemplate {...props} />;

        case 'content':
        case 'news_listing':
            return <ContentTemplate {...props} />;

        case 'contact':
            return <ContactTemplate {...props} />;

        case 'listing_general':
        case 'listing_sale':
        case 'listing_rent':
            return (
                <ListingTemplate
                    {...props}
                    initialFilters={props.initialFilters || {}}
                    availableFilters={props.availableFilters}
                />
            );

        default:
            return <ContentTemplate {...props} />;
    }
}