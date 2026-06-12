import Image from 'next/image';
import Link from 'next/link';
import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';
import { cleanSiteText } from '@/lib/text';
import {
    blockData,
    getLinkProps,
    siteAssetUrl,
    withPreviewUrl,
} from '@/lib/site-blocks';

type Props = {
    site: CasaqSiteConfig;
    bloc: CasaqBloc;
    previewDomain?: string;
};

type Data = {
    titre?: string;
    sous_titre?: string;
    image?: string;
    search_enabled?: boolean;
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

export function HeroSearchBlock({ site, bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const image = siteAssetUrl(data.image);
    const cta = getLinkProps(data.cta);

    return (
        <section className="site-hero site-hero--search">
            {image ? (
                <>
                    <Image
                        src={image}
                        alt={data.titre || site.agence.nom}
                        fill
                        priority
                        sizes="100vw"
                        className="site-hero__image"
                    />
                    <div className="site-hero__overlay" />
                </>
            ) : null}

                <div className="site-hero__content white">
                    <h1>{data.titre || site.agence.nom}</h1>

                    {data.sous_titre ? (
                        <p>{cleanSiteText(data.sous_titre)}</p>
                    ) : null}
                    {/*{data.search_enabled !== false ? (*/}
                    {/*    <form*/}
                    {/*        className="site-search"*/}
                    {/*        action={withPreviewUrl('/biens', previewDomain)}*/}
                    {/*    >*/}
                    {/*        <input name="q" placeholder="Rechercher un bien..." />*/}
                    {/*        <button type="submit">Rechercher</button>*/}
                    {/*    </form>*/}
                    {/*) : null}*/}

                    {/*{cta ? (*/}
                    {/*    <Link*/}
                    {/*        href={withPreviewUrl(cta.href, previewDomain)}*/}
                    {/*        target={cta.target}*/}
                    {/*        rel={cta.rel}*/}
                    {/*        className="site-btn site-btn--primary"*/}
                    {/*    >*/}
                    {/*        {cta.label || 'Voir les biens'}*/}
                    {/*    </Link>*/}
                    {/*) : null}*/}
                </div>

        </section>
    );
}