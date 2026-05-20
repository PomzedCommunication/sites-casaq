import type { CasaqBiensMeta, CasaqBien, CasaqPage, CasaqSiteConfig } from '@/lib/casaq';
import { BlocksRenderer } from '@/components/site/blocks/BlocksRenderer';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    previewDomain?: string;
};

export function ContentTemplate({ site, page, biens, meta, previewDomain }: Props) {
    return (
        <BlocksRenderer
            site={site}
            page={page}
            biens={biens}
            meta={meta}
            previewDomain={previewDomain}
        />
    );
}