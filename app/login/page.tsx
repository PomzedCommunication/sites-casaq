import type { Metadata } from 'next';
import { getCurrentDomain } from '@/lib/domain';
import { getSiteConfig } from '@/lib/casaq';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { SiteNotConfigured } from '@/components/site/SiteNotConfigured';
import { LoginFormClient } from '@/components/site/account/LoginFormClient';

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
        title: site ? `Connexion — ${site.agence.nom}` : 'Connexion',
        description: 'Connectez-vous à votre espace personnel.',
        icons: site?.config.favicon
            ? {
                icon: site.config.favicon,
                shortcut: site.config.favicon,
                apple: site.config.favicon,
            }
            : undefined,
    };
}

export default async function LoginPage({ searchParams }: PageProps) {
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
                <LoginFormClient previewDomain={resolvedSearchParams?.site} />
            </main>
        </SiteLayout>
    );
}