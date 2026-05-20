import type { CasaqBiensMeta, CasaqBien, CasaqPage, CasaqSiteConfig } from '@/lib/casaq';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { TemplateRegistry } from '@/components/site/templates/TemplateRegistry';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    biensMeta: CasaqBiensMeta;
    currentDomain: string;
    currentPath: string;
    previewDomain?: string;
};

export function PageRenderer({
                                 site,
                                 page,
                                 biens,
                                 biensMeta,
                                 currentDomain,
                                 currentPath,
                                 previewDomain,
                             }: Props) {
    return (
        <SiteLayout
            site={site}
            currentDomain={currentDomain}
            previewDomain={previewDomain}
        >
            <TemplateRegistry
                site={site}
                page={page}
                biens={biens}
                meta={biensMeta}
                currentPath={currentPath}
                previewDomain={previewDomain}
            />
        </SiteLayout>
    );
}