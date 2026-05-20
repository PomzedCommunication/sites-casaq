import { getSiteBiens, getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { PageRenderer } from '@/components/site/PageRenderer';
import { getPageBiensLimit, getPageDeal, pageNeedsBiens } from '@/lib/site-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type PageProps = {
    params: Promise<{
        slug: string[];
    }>;
    searchParams?: Promise<{
        site?: string;
        page?: string;
    }>;
};

const emptyBiensResponse = {
    data: [],
    meta: {
        total: 0,
        page: 1,
        per_page: 12,
        total_pages: 0,
        has_more: false,
    },
};

export async function generateMetadata({
                                           params,
                                           searchParams,
                                       }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const domain = await getCurrentDomain(resolvedSearchParams);
    const site = await getSiteConfig(domain);

    const slug = resolvedParams.slug.join('/');
    const page = site.pages.find((item) => item.slug === slug);

    return {
        title: page?.meta_title || page?.titre || `${site.agence.nom} — Immobilier`,
        description:
            page?.meta_description ||
            site.seo.meta_description ||
            `Site immobilier de ${site.agence.nom}`,
        icons: site.config.favicon
            ? {
                icon: site.config.favicon,
                shortcut: site.config.favicon,
                apple: site.config.favicon,
            }
            : undefined,
    };
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const domain = await getCurrentDomain(resolvedSearchParams);
    const site = await getSiteConfig(domain);

    const slug = resolvedParams.slug.join('/');
    const page = site.pages.find((item) => item.slug === slug);

    if (!page) {
        notFound();
    }

    const pageNumber = Number(resolvedSearchParams?.page || 1);

    const biensResponse = pageNeedsBiens(page)
        ? await getSiteBiens(domain, {
            page: pageNumber,
            perPage: getPageBiensLimit(page),
            deal: getPageDeal(page),
        })
        : emptyBiensResponse;

    return (
        <PageRenderer
            site={site}
            page={page}
            biens={biensResponse.data}
            biensMeta={biensResponse.meta}
            currentDomain={domain}
            currentPath={`/${slug}`}
            previewDomain={resolvedSearchParams?.site}
        />
    );
}