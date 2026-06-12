import type { ReactNode } from 'react';
import { getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { SiteNotConfigured } from '@/components/site/SiteNotConfigured';
import { FavoritesProvider } from '@/components/site/favorites/FavoritesProvider';

type SearchParams = {
    site?: string;
};

type Props = {
    searchParams?: Promise<SearchParams>;
    children: (props: {
        domain: string;
        previewDomain?: string;
    }) => ReactNode;
};

export async function AccountSitePage({ searchParams, children }: Props) {
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
                {children({
                    domain,
                    previewDomain: params?.site,
                })}
            </FavoritesProvider>
        </SiteLayout>
    );
}