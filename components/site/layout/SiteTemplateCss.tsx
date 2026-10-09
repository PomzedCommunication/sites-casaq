'use client';

import dynamic from 'next/dynamic';

const Template2Css = dynamic(
    () =>
        import('@/components/site/styles/Templates/Template2Css').then(
            (mod) => mod.Template2Css,
        ),
    // {
    //     ssr: false,
    // },
);


const SiteCssByTemplate: Record<string, React.ComponentType> = {
    'template_2': Template2Css,
};

type Props = {
    currentTemplate?: string;
};

export function SiteTemplateCss({
                                  currentTemplate
                              }: Props) {
    if (!currentTemplate) {
        return null;
    }

    const CssComponent = SiteCssByTemplate[currentTemplate];

    if (!CssComponent) {
        return null;
    }

    return <CssComponent />;

}
//
// function normalizeDomain(domain?: string | null): string {
//     return String(domain || '')
//         .toLowerCase()
//         .trim()
//         .replace(/^https?:\/\//, '')
//         .replace(/^www\./, '')
//         .replace(/\/$/, '');
// }
//
// const SiteCssByTemplate: Record<string, React.ComponentType> = {
//     'template_2': NovimmobCss,
//     'services.pix-preview.ch': ServicesImmobilierCss,
// };
//
// type Props = {
//     currentDomain?: string;
//     previewDomain?: string;
//     siteDomain?: string;
// };
//
// export function SiteDomainCss({
//                                   currentDomain,
//                                   previewDomain,
//                                   siteDomain,
//                               }: Props) {
//     const activeDomain = normalizeDomain(
//         previewDomain || currentDomain || siteDomain,
//     );
//
//     const CssComponent = SiteCssByDomain[activeDomain];
//
//     if (!CssComponent) {
//         return null;
//     }
//
//     return <CssComponent />;
//
//     // if (activeDomain !== 'novimmob.ch') {
//     //     return null;
//     // }
//     //
//     // return <NovimmobCss />;
// }
//
// function normalizeDomain(domain?: string | null): string {
//     return String(domain || '')
//         .toLowerCase()
//         .trim()
//         .replace(/^https?:\/\//, '')
//         .replace(/^www\./, '')
//         .replace(/\/$/, '');
// }