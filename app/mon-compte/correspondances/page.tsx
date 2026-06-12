import { getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { SiteNotConfigured } from '@/components/site/SiteNotConfigured';
import { FavoritesProvider } from '@/components/site/favorites/FavoritesProvider';
import { CorrespondancesClient } from './CorrespondancesClient';

type PageProps = {
    searchParams?: Promise<{
        site?: string;
    }>;
};

export default async function CorrespondancesPage({ searchParams }: PageProps) {
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
                <CorrespondancesClient previewDomain={params?.site} />
            </FavoritesProvider>
        </SiteLayout>
    );
}