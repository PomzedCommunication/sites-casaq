import type { CasaqBiensMeta, CasaqBien, CasaqPage, CasaqSiteConfig } from '@/lib/casaq';
import { LandingTemplate } from '@/components/site/templates/LandingTemplate';
import { ContentTemplate } from '@/components/site/templates/ContentTemplate';
import { ContactTemplate } from '@/components/site/templates/ContactTemplate';
import { ListingTemplate } from '@/components/site/templates/ListingTemplate';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    currentPath: string;
    previewDomain?: string;
};

export function TemplateRegistry(props: Props) {
    switch (props.page.template) {
        case 'landing':
            return <LandingTemplate {...props} />;

        case 'content':
            return <ContentTemplate {...props} />;

        case 'contact':
            return <ContactTemplate {...props} />;

        case 'listing_general':
        case 'listing_sale':
        case 'listing_rent':
            return <ListingTemplate {...props} />;

        default:
            return <ContentTemplate {...props} />;
    }
}