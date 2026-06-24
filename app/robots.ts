import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

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

export default async function robots(): Promise<MetadataRoute.Robots> {
    const domain = await getCurrentHost();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `https://${domain}/sitemap.xml`,
    };
}