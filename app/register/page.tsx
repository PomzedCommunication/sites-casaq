import type { Metadata } from 'next';
import { getCurrentDomain } from '@/lib/domain';
import { getSiteConfig } from '@/lib/casaq';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { SiteNotConfigured } from '@/components/site/SiteNotConfigured';
import { RegisterFormClient } from '@/components/site/account/RegisterFormClient';

type PageProps = {
    searchParams?: Promise<{
        site?: string;
    }>;
};

export async function generateMetadata({
                                           searchParams,
                                       }: PageProps): Promise<Metadata> {
    const resolvedSearchParams = await searchParams;
    const domain = await getCurrentDomain(resolvedSearchParams);
    const site = await getSiteConfig(domain);

    return {
        title: site ? `Créer un compte — ${site.agence.nom}` : 'Créer un compte',
        description: 'Créez votre espace personnel.',
        icons: site?.config.favicon
            ? {
                icon: site.config.favicon,
                shortcut: site.config.favicon,
                apple: site.config.favicon,
            }
            : undefined,
    };
}

export default async function RegisterPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const domain = await getCurrentDomain(resolvedSearchParams);
    const site = await getSiteConfig(domain);

    if (!site) {
        return <SiteNotConfigured domain={domain} />;
    }

    return (
        <SiteLayout
            site={site}
            currentDomain={domain}
            previewDomain={resolvedSearchParams?.site}
        >
            <main className="account-auth">
                <RegisterFormClient previewDomain={resolvedSearchParams?.site} />
            </main>
        </SiteLayout>
    );
}