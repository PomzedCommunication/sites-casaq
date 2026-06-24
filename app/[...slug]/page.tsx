import {
    getSiteBiens,
    getSiteConfig,
    getSiteBiensFiltered,
    getSiteBiensAvailableFilters,
    getSitePost,
    getSitePostsListing,
} from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { PageRenderer } from '@/components/site/PageRenderer';
import { getPageBiensLimit, getPageDeal, pageNeedsBiens } from '@/lib/site-page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { CasaqPage, CasaqSiteConfig } from '@/lib/casaq';
import type { ListingFilters } from '@/lib/listing/listing-types';
import { parseListingPath } from '@/lib/listing/listing-url';
import { AgencyNewsSinglePage } from '@/components/site/templates/AgencyNewsSinglePage';
import { AgencyNewsListingPage } from '@/components/site/templates/AgencyNewsListingPage';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
type PageProps = {
    params: Promise<{
        slug?: string[];
    }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
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
function isNewsSinglePath(slugParts: string[]) {
    return slugParts[0] === 'actualites' && Boolean(slugParts[1]);
}
function isNewsListingPage(page: CasaqPage, slugParts: string[]) {
    return (
        page.template === 'news_listing' ||
        slugParts[0] === 'actualites'
    ) && !slugParts[1];
}

function resolvePage(site: CasaqSiteConfig, slugParts: string[]): CasaqPage | undefined {
    const slug = slugParts.join('/');
    const firstSegment = slugParts[0];

    // 1. Page exacte classique
    const exactPage = site.pages.find((item) => item.slug === slug);

    if (exactPage) {
        return exactPage;
    }

    // 2. URL /acheter ou /acheter/appartements/lausanne
    if (firstSegment === 'acheter') {
        return (
            site.pages.find((item) => item.template === 'listing_sale') ||
            site.pages.find((item) => item.slug === 'acheter') ||
            site.pages.find((item) => item.template === 'listing_general') ||
            site.pages.find((item) => item.slug === 'biens')
        );
    }

    // 3. URL /louer ou /louer/appartements/geneve
    if (firstSegment === 'louer') {
        return (
            site.pages.find((item) => item.template === 'listing_rent') ||
            site.pages.find((item) => item.slug === 'louer') ||
            site.pages.find((item) => item.template === 'listing_general') ||
            site.pages.find((item) => item.slug === 'biens')
        );
    }

    // 4. Ancienne URL /biens
    if (firstSegment === 'biens') {
        return (
            site.pages.find((item) => item.slug === 'biens') ||
            site.pages.find((item) => item.template === 'listing_general') ||
            site.pages.find((item) => item.template === 'listing_sale') ||
            site.pages.find((item) => item.template === 'listing_rent')
        );
    }
    if (firstSegment === 'actualites' && slugParts[1]) {
        return (
            site.pages.find((item) => item.slug === 'actualites') ||
            site.pages.find((item) => item.template === 'news_listing')
        );
    }
    return undefined;
}
function resolveListingDeal(page: CasaqPage, slugParts: string[]) {
    const firstSegment = slugParts[0];

    if (firstSegment === 'acheter') {
        return 'SALE' as const;
    }

    if (firstSegment === 'louer') {
        return 'RENT' as const;
    }

    if (firstSegment === 'biens') {
        return undefined;
    }

    return getPageDeal(page);
}
export async function generateMetadata({
                                           params,
                                           searchParams,
                                       }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const domain = await getCurrentDomain(resolvedSearchParams);
    const site = await getSiteConfig(domain);

    if (!site) {
        return {
            title: 'Site introuvable',
            description: 'Ce site immobilier est introuvable.',
        };
    }

    const slugParts = resolvedParams.slug || [];
    const page = resolvePage(site, slugParts);
    if (isNewsSinglePath(slugParts)) {
        const post = await getSitePost(domain, slugParts[1]);

        if (post) {
            return {
                title: post.seo?.title || post.title,
                description:
                    post.seo?.description ||
                    post.excerpt ||
                    site.seo.meta_description ||
                    `Actualité de ${site.agence.nom}`,
                icons: site.config.favicon
                    ? {
                        icon: site.config.favicon,
                        shortcut: site.config.favicon,
                        apple: site.config.favicon,
                    }
                    : undefined,
            };
        }
    }

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
    const previewDomain =
        typeof resolvedSearchParams?.site === 'string'
            ? resolvedSearchParams.site
            : undefined;


    if (!site) {
        notFound();
    }

    const slugParts = resolvedParams.slug || [];
    const slug = slugParts.join('/');

    const page = resolvePage(site, slugParts);

    if (!page) {
        notFound();
    }
    if (isNewsSinglePath(slugParts)) {
        const post = await getSitePost(domain, slugParts[1]);

        if (!post) {
            notFound();
        }

        return (
            <SiteLayout
                site={site}
                currentDomain={domain}
                previewDomain={previewDomain}
            >
                <AgencyNewsSinglePage
                    site={site}
                    page={page}
                    post={post}
                    currentDomain={domain}
                    previewDomain={previewDomain}
                />
            </SiteLayout>
        );
    }
    if (isNewsListingPage(page, slugParts)) {
        const pageNumber = Number(resolvedSearchParams?.page || 1);

        const category =
            typeof resolvedSearchParams?.category === 'string'
                ? resolvedSearchParams.category
                : undefined;

        const search =
            typeof resolvedSearchParams?.search === 'string'
                ? resolvedSearchParams.search
                : undefined;

        const postsResponse = await getSitePostsListing(domain, {
            page: pageNumber,
            perPage: 9,
            category,
            search,
        });

        const categoriesResponse = await getSitePostsListing(domain, {
            page: 1,
            perPage: 50,
        });

        const categories = Array.from(
            new Set(
                categoriesResponse.data
                    .map((post) => post.category)
                    .filter((item): item is string => Boolean(item))
            )
        );

        return (
            <SiteLayout
                site={site}
                currentDomain={domain}
                previewDomain={previewDomain}
            >
                <AgencyNewsListingPage
                    site={site}
                    page={page}
                    posts={postsResponse.data}
                    meta={postsResponse.meta}
                    currentPath={`/${slug || 'actualites'}`}
                    currentDomain={domain}
                    search={search}
                    category={category}
                    categories={categories}
                    previewDomain={previewDomain}
                />
            </SiteLayout>
        );
    }
    const pageNumber = Number(resolvedSearchParams?.page || 1);

    const listingSlugParts =
        slugParts[0] === 'biens'
            ? []
            : slugParts;

    const initialFilters = parseListingPath(listingSlugParts, resolvedSearchParams);

    const isListingPage = pageNeedsBiens(page);
    const listingDeal = resolveListingDeal(page, slugParts);

    const resolvedInitialFilters: ListingFilters = {
        ...initialFilters,
        page: pageNumber,
    };

    if (!resolvedInitialFilters.deal && listingDeal) {
        resolvedInitialFilters.deal = listingDeal;
    }

    const biensResponse = isListingPage
        ? await getSiteBiensFiltered(
            domain,
            resolvedInitialFilters,
            {
                perPage: getPageBiensLimit(page),
            },
        )
        : emptyBiensResponse;

    const availableFilters = isListingPage
        ? await getSiteBiensAvailableFilters(domain, resolvedInitialFilters)
        : undefined;

    return (
        <PageRenderer
            site={site}
            page={page}
            biens={biensResponse.data}
            biensMeta={biensResponse.meta}
            currentDomain={domain}
            currentPath={`/${slug}`}
            previewDomain={
                typeof resolvedSearchParams?.site === 'string'
                    ? resolvedSearchParams.site
                    : undefined
            }
            initialFilters={resolvedInitialFilters}
            availableFilters={availableFilters}
        />
    );
}