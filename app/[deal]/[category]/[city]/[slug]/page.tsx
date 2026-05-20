import { getSiteBien, getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { BienDetailTemplate } from '@/components/site/properties/BienDetailTemplate';
import { extractBienIdFromSlug, getBienSeoPath } from '@/lib/property-url';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteNotConfigured } from '@/components/site/SiteNotConfigured';
type PageProps = {
    params: Promise<{
        deal: string;
        category: string;
        city: string;
        slug: string;
    }>;
    searchParams?: Promise<{
        site?: string;
    }>;
};

export async function generateMetadata({
                                           params,
                                           searchParams,
                                       }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const id = extractBienIdFromSlug(resolvedParams.slug);

    const domain = await getCurrentDomain(resolvedSearchParams);
    const site = await getSiteConfig(domain);
    if (!site) {
        return {
            title: 'Site non configuré — CasaQ',
            description: `Aucun site CasaQ actif pour ${domain}`,
        };
    }
    if (!id) {
        return {
            title: `${site.agence.nom} — Bien introuvable`,
        };
    }

    const bien = await getSiteBien(domain, id);

    if (!bien) {
        return {
            title: `${site.agence.nom} — Bien introuvable`,
        };
    }

    const image =
        bien.images?.[0]?.variants?.large ||
        bien.images?.[0]?.variants?.xl ||
        bien.images?.[0]?.url ||
        undefined;

    return {
        title: bien.titre,
        description:
            bien.resume ||
            `${bien.titre} — ${bien.adresse?.npa || ''} ${bien.adresse?.ville || ''}`,
        icons: site.config.favicon
            ? {
                icon: site.config.favicon,
                shortcut: site.config.favicon,
                apple: site.config.favicon,
            }
            : undefined,
        openGraph: {
            title: bien.titre,
            description: bien.resume || undefined,
            images: image ? [image] : undefined,
            type: 'website',
        },
    };
}

export default async function BienSeoPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const id = extractBienIdFromSlug(resolvedParams.slug);

    if (!id) {
        notFound();
    }

    const domain = await getCurrentDomain(resolvedSearchParams);
    const site = await getSiteConfig(domain);

    if (!site) {
        return <SiteNotConfigured domain={domain} />;
    }
    const bien = await getSiteBien(domain, id);

    if (!bien) {
        notFound();
    }

    const canonicalPath = getBienSeoPath(bien);
    const currentPath = `/${resolvedParams.deal}/${resolvedParams.category}/${resolvedParams.city}/${resolvedParams.slug}`;

    if (canonicalPath !== currentPath) {
        const previewQuery = resolvedSearchParams?.site
            ? `?site=${encodeURIComponent(resolvedSearchParams.site)}`
            : '';

        redirect(`${canonicalPath}${previewQuery}`);
    }

    return (
        <SiteLayout
            site={site}
            currentDomain={domain}
            previewDomain={resolvedSearchParams?.site}
        >
            <BienDetailTemplate site={site} bien={bien} domain={domain} />
        </SiteLayout>
    );
}