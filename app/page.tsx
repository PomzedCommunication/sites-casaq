import { getSiteBiens, getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { PageRenderer } from '@/components/site/PageRenderer';
import { getPageBiensLimit, getPageDeal, pageNeedsBiens } from '@/lib/site-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type PageProps = {
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

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const domain = await getCurrentDomain(params);
    const site = await getSiteConfig(domain);

    const page = site.pages.find((item) => item.slug === 'accueil');

    return {
        title: page?.meta_title || `${site.agence.nom} — Immobilier`,
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

export default async function HomePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const domain = await getCurrentDomain(params);
    const site = await getSiteConfig(domain);

    const page = site.pages.find((item) => item.slug === 'accueil');

    if (!page) {
        notFound();
    }

    const pageNumber = Number(params?.page || 1);

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
            currentPath="/"
            previewDomain={params?.site}
        />
    );
}