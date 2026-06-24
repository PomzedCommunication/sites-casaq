import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCurrentDomain } from '@/lib/domain';
import { getSiteConfig } from '@/lib/casaq';
import { SiteLayout } from '@/components/site/layout/SiteLayout';
import { SiteNotConfigured } from '@/components/site/SiteNotConfigured';
import { ResetPasswordFormClient } from '@/components/site/account/ResetPasswordFormClient';

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
        title: site ? `Nouveau mot de passe — ${site.agence.nom}` : 'Nouveau mot de passe',
        description: 'Choisissez un nouveau mot de passe.',
        icons: site?.config.favicon
            ? {
                icon: site.config.favicon,
                shortcut: site.config.favicon,
                apple: site.config.favicon,
            }
            : undefined,
    };
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
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
                <Suspense fallback={null}>
                    <ResetPasswordFormClient previewDomain={resolvedSearchParams?.site} />
                </Suspense>
            </main>
        </SiteLayout>
    );
}