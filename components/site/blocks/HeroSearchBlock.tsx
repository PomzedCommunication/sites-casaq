import Image from 'next/image';
import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';
import { cleanSiteText } from '@/lib/text';
import {
    blockData,
    getLinkProps,
    siteAssetUrl,
} from '@/lib/site-blocks';
import { ListingSearchBar } from '@/components/site/listings/ListingSearchBar';

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

export function HeroSearchBlock({ site, bloc }: Props) {
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

            <div className="site-hero__content ">
                <h1 className="white">{data.titre || site.agence.nom}</h1>

                {data.sous_titre ? (
                    <p className="white">{cleanSiteText(data.sous_titre)}</p>
                ) : null}

                {data.search_enabled !== false ? (
                    <div className="site-hero__search">
                        <ListingSearchBar variant="large" />
                    </div>
                ) : null}
            </div>
        </section>
    );
}