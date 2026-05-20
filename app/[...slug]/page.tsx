import { getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';
import { PageRenderer } from '@/components/site/PageRenderer';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{
        slug: string[];
    }>;
    searchParams?: Promise<{
        site?: string;
    }>;
};

export default async function DynamicPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const domain = await getCurrentDomain(resolvedSearchParams);
    const site = await getSiteConfig(domain);

    const slug = resolvedParams.slug.join('/');

    const page = site.pages.find((item) => item.slug === slug);

    if (!page) {
        notFound();
    }

    return (
        <PageRenderer
            site={site}
            page={page}
            currentDomain={domain}
            previewDomain={resolvedSearchParams?.site}
        />
    );

}