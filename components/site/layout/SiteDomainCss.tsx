'use client';

import dynamic from 'next/dynamic';

const NovimmobCss = dynamic(
    () =>
        import('@/components/site/styles/NovimmobCss').then(
            (mod) => mod.NovimmobCss,
        ),
    {
        ssr: false,
    },
);

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

    if (activeDomain !== 'novimmob.ch') {
        return null;
    } 

    return <NovimmobCss />;
}

function normalizeDomain(domain?: string | null): string {
    return String(domain || '')
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
}