import { getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { SiteNotConfigured } from '@/components/site/SiteNotConfigured';
import { FavoritesProvider } from '@/components/site/favorites/FavoritesProvider';
import { CorrespondancesClient } from './CorrespondancesClient';
import type { Metadata } from 'next';

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
        title: site ? `Correspondances — ${site.agence.nom}` : 'Correspondances',
        description: 'Consultez les biens qui correspondent à vos critères de recherche.',
        icons: site?.config.favicon
            ? {
                icon: site.config.favicon,
                shortcut: site.config.favicon,
                apple: site.config.favicon,
            }
            : undefined,
    };
}
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