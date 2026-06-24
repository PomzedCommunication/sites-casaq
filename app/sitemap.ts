import type { MetadataRoute } from 'next';
import {
    getSiteConfig,
    getSiteBiensFiltered,
    getSitePostsListing,
} from '@/lib/casaq';
import { getBienSeoPath } from '@/lib/property-url';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

function normalizeDomain(domain?: string | null): string {
    return (domain || '')
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
}

async function getCurrentHost(): Promise<string> {
    const headersList = await headers();

    return normalizeDomain(
        headersList.get('x-forwarded-host') ||
        headersList.get('host') ||
        ''
    );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const domain = await getCurrentHost();
    const baseUrl = `https://${domain}`;

    const site = await getSiteConfig(domain);

    if (!site) {
        return [];
    }

    const urls: MetadataRoute.Sitemap = [];

    urls.push({
        url: baseUrl,
        changeFrequency: 'daily',
        priority: 1,
    });

    site.pages
        .filter((page) => page.slug && page.slug !== 'accueil')
        .forEach((page) => {
            urls.push({
                url: `${baseUrl}/${page.slug}`,
                changeFrequency: 'weekly',
                priority: page.slug === 'biens' ? 0.9 : 0.8,
            });
        });

    let biensPage = 1;
    let hasMoreBiens = true;

    while (hasMoreBiens && biensPage <= 50) {
        const response = await getSiteBiensFiltered(
            domain,
            {
                page: biensPage,
                sort: 'recent',
                view: 'grid',
            },
            {
                perPage: 100,
            }
        );

        response.data.forEach((bien) => {
            urls.push({
                url: `${baseUrl}${getBienSeoPath(bien)}`,
                changeFrequency: 'daily',
                priority: 0.9,
            });
        });

        hasMoreBiens = response.meta.has_more;
        biensPage += 1;
    }

    let postsPage = 1;
    let hasMorePosts = true;

    while (hasMorePosts && postsPage <= 20) {
        const response = await getSitePostsListing(domain, {
            page: postsPage,
            perPage: 50,
        });

        response.data.forEach((post) => {
            urls.push({
                url: `${baseUrl}${post.url}`,
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });

        hasMorePosts = response.meta.has_more;
        postsPage += 1;
    }

    return urls;
}