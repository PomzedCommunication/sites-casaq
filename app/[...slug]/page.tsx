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
    const isPreview = resolvedSearchParams?.preview === '1';
    const site = await getSiteConfig(domain, isPreview);

    if (!site) {
        return {
            title: 'Site introuvable',
            description: 'Ce site immobilier est introuvable.',
        };
    }

    const slugParts = resolvedParams.slug || [];
    const page = resolvePage(site, slugParts);
    if (isNewsSinglePath(slugParts)) {
        // const isPreview = resolvedSearchParams?.preview === '1';
        const post = await getSitePost(domain, slugParts[1], isPreview);

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



    const isListingPage = page ? pageNeedsBiens(page) : false;

    if (page && isListingPage) {
        const hasListingFilters =
            slugParts.length > 1 ||
            Boolean(resolvedSearchParams?.category) ||
            Boolean(resolvedSearchParams?.categoryParent) ||
            Boolean(resolvedSearchParams?.city) ||
            Boolean(resolvedSearchParams?.prixMin) ||
            Boolean(resolvedSearchParams?.prixMax) ||
            Boolean(resolvedSearchParams?.piecesMin) ||
            Boolean(resolvedSearchParams?.piecesMax) ||
            Boolean(resolvedSearchParams?.surfaceMin) ||
            Boolean(resolvedSearchParams?.surfaceMax) ||
            Boolean(resolvedSearchParams?.prestige);

        if (!hasListingFilters) {
            return {
                title: page.meta_title || page.titre || `${site.agence.nom} — Immobilier`,
                description:
                    page.meta_description ||
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

        // SEO dynamique ici seulement si filtre

        const listingSlugParts =
            slugParts[0] === 'biens'
                ? []
                : slugParts;

        const initialFilters = parseListingPath(
            listingSlugParts,
            resolvedSearchParams
        );

        const listingDeal = resolveListingDeal(page, slugParts);

        const resolvedFilters: ListingFilters = {
            ...initialFilters,
            deal: initialFilters.deal || listingDeal,
        };

        const seo = buildListingMetadata({
            filters: resolvedFilters,
            page,
            siteName: site.agence.nom,
        });

        return {
            title: seo.title,
            description: seo.description,
            icons: site.config.favicon
                ? {
                    icon: site.config.favicon,
                    shortcut: site.config.favicon,
                    apple: site.config.favicon,
                }
                : undefined,
        };
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
    const isPreview = resolvedSearchParams?.preview === '1';
    const site = await getSiteConfig(domain, isPreview);
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
        // const isPreview = resolvedSearchParams?.preview === '1';
        const post = await getSitePost(domain, slugParts[1], isPreview);


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

function buildListingMetadata({
                                  filters,
                                  page,
                                  siteName,
                              }: {
    filters: ListingFilters;
    page: CasaqPage;
    siteName: string;
}) {
    const dealLabel =
        filters.deal === 'RENT'
            ? 'à louer'
            : filters.deal === 'SALE'
                ? 'à vendre'
                : 'immobiliers';

    const type = getSeoTypeLabel(filters);
    const location = filters.city
        ? ` à ${formatSeoLocation(filters.city)}`
        : ' dans le Jura bernois';

    const title = `${type} ${dealLabel}${location} | ${siteName}`;

    const description =
        filters.deal === 'RENT'
            ? `Trouvez votre ${type.toLowerCase()} ${dealLabel}${location} avec ${siteName}. Découvrez nos biens disponibles et contactez notre agence immobilière.`
            : `Découvrez nos ${type.toLowerCase()} ${dealLabel}${location} avec ${siteName}. Une agence immobilière locale pour vendre ou acheter sereinement.`;

    return {
        title: limitText(title, 60),
        description: limitText(description, 160),
    };
}

function getSeoTypeLabel(filters: ListingFilters): string {
    const category = filters.category || filters.categoryParent;

    if (!category) return 'Biens immobiliers';

    const value = String(category).replace(/-/g, ' ').toLowerCase();

    if (value.includes('appartement')) return 'Appartements';
    if (value.includes('maison')) return 'Maisons';
    if (value.includes('villa')) return 'Villas';
    if (value.includes('terrain')) return 'Terrains';
    if (value.includes('immeuble')) return 'Immeubles';
    if (value.includes('bureau')) return 'Bureaux';
    if (value.includes('commerce') || value.includes('local')) return 'Locaux commerciaux';
    if (value.includes('parking')) return 'Parkings';

    return 'Biens immobiliers';
}

function formatSeoLocation(value: string): string {
    return value
        .replace(/-/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function limitText(value: string, max: number): string {
    if (value.length <= max) return value;
    return value.slice(0, max - 1).trim();
}