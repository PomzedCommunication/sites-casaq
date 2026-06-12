import type { CasaqBiensMeta, CasaqBien, CasaqPage, CasaqSiteConfig } from '@/lib/casaq';
import { BlocksRenderer } from '@/components/site/blocks/BlocksRenderer';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    currentDomain: string;
    previewDomain?: string;
};

export function ContactTemplate({
                                    site,
                                    page,
                                    biens,
                                    meta,
                                    currentDomain,
                                    previewDomain,
                                }: Props) {
    return (
        <BlocksRenderer
            site={site}
            page={page}
            biens={biens}
            meta={meta}
            currentDomain={currentDomain}
            previewDomain={previewDomain}
        />
    );
}