import type { CasaqBiensMeta, CasaqBien, CasaqPage, CasaqSiteConfig } from '@/lib/casaq';
import { BiensGrid } from '@/components/site/listings/BiensGrid';
import { Pagination } from '@/components/site/listings/Pagination';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    currentPath: string;
    previewDomain?: string;
};

export function ListingTemplate({
                                    page,
                                    biens,
                                    meta,
                                    currentPath,
                                    previewDomain,
                                }: Props) {
    const title =
        page.template === 'listing_sale'
            ? 'Biens à vendre'
            : page.template === 'listing_rent'
                ? 'Biens à louer'
                : page.titre || 'Nos biens';

    return (
        <>
            <section className="page-hero">
                <p className="page-hero__eyebrow">Immobilier</p>
                <h1 className="page-hero__title">{title}</h1>
            </section>

            <section className="section">
                <BiensGrid biens={biens} previewDomain={previewDomain} />

                <Pagination
                    meta={meta}
                    currentPath={currentPath}
                    previewDomain={previewDomain}
                />
            </section>
        </>
    );
}