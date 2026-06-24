import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { SiteNotConfigured } from '@/components/site/SiteNotConfigured';
import { FavoritesProvider } from '@/components/site/favorites/FavoritesProvider';
import { FavorisClient } from './FavorisClient';

type PageProps = {
    searchParams?: Promise<{
        site?: string;
    }>;
};

export async function generateMetadata({
                                           searchParams,
                                       }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const domain = await getCurrentDomain(params);
    const site = await getSiteConfig(domain);

    return {
        title: site ? `Mes favoris — ${site.agence.nom}` : 'Mes favoris',
        description: 'Retrouvez les biens que vous avez ajoutés à vos favoris.',
        icons: site?.config.favicon
            ? {
                icon: site.config.favicon,
                shortcut: site.config.favicon,
                apple: site.config.favicon,
            }
            : undefined,
    };
}

export default async function FavorisPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const domain = await getCurrentDomain(params);
    const site = await getSiteConfig(domain);

    if (!site) {
        return <SiteNotConfigured domain={domain} />;
    }

    return (
        <SiteLayout
            site={site}
            currentDomain={domain}
            previewDomain={params?.site}
        >
            <FavoritesProvider>
                <FavorisClient previewDomain={params?.site} />
            </FavoritesProvider>
        </SiteLayout>
    );
}