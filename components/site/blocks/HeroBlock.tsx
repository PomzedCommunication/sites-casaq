import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';

type Props = {
    site: CasaqSiteConfig;
    bloc: CasaqBloc;
    previewDomain?: string;
};

export function HeroBlock({ site, bloc, previewDomain }: Props) {
    const data = bloc.data || {};

    return (
        <section className="hero">
            <h1 className="hero__title">
                {String(data.titre || `Bienvenue chez ${site.agence.nom}`)}
            </h1>

            {data.sous_titre ? (
                <p className="hero__subtitle">{String(data.sous_titre)}</p>
            ) : null}

            {data.cta_label ? (
                <a
                    href={buildUrl(String(data.cta_url || '/biens'), previewDomain)}
                    className="button"
                >
                    {String(data.cta_label)}
                </a>
            ) : null}
        </section>
    );
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}