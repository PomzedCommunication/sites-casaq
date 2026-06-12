import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';
import { blockData, siteAssetUrl } from '@/lib/site-blocks';

type Props = {
    site: CasaqSiteConfig;
    bloc: CasaqBloc;
};

type Data = {
    titre?: string;
    texte?: string;
    image?: string;
};

export function HeroSimpleBlock({ site, bloc }: Props) {
    const data = blockData<Data>(bloc);
    const image = siteAssetUrl(data.image);

    return (
        <section
            className="site-hero site-hero--simple"
            style={
                image
                    ? {
                        backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${image})`,
                    }
                    : undefined
            }
        >
            <div className="container">
                <div className="site-hero__content">
                    <h1>{data.titre || site.agence.nom}</h1>

                    {data.texte ? (
                        <p>{data.texte}</p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}