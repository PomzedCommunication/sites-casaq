'use client';

import dynamic from 'next/dynamic';

const NovimmobCss = dynamic(
    () =>
        import('@/components/site/styles/NovimmobCss').then(
            (mod) => mod.NovimmobCss,
        ),
    // {
    //     ssr: false,
    // },
);

const ServicesImmobilierCss = dynamic(
    () =>
        import('@/components/site/styles/ServicesImmobilierCss').then(
            (mod) => mod.ServicesImmobilierCss,
        ),
    // {
    //     ssr: false,
    // },
);


const SiteCssByDomain: Record<string, React.ComponentType> = {
    'novimmob.ch': NovimmobCss,
    'services.pix-preview.ch': ServicesImmobilierCss,
};

type Props = {
    currentDomain?: string;
    previewDomain?: string;
    siteDomain?: string;
};

export function SiteDomainCss({
                                  currentDomain,
                                  previewDomain,
                                  siteDomain,
                              }: Props) {
    const activeDomain = normalizeDomain(
        previewDomain || currentDomain || siteDomain,
    );

    const CssComponent = SiteCssByDomain[activeDomain];

    if (!CssComponent) {
        return null;
    }

    return <CssComponent />;

    // if (activeDomain !== 'novimmob.ch') {
    //     return null;
    // }
    //
    // return <NovimmobCss />;
}

function normalizeDomain(domain?: string | null): string {
    return String(domain || '')
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
}