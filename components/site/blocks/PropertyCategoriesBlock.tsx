import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import { getSitePropertyCategoriesByIds } from '@/lib/casaq';
import { blockData, getLinkProps, withPreviewUrl } from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';
import { PropertyCategoriesSlider } from './PropertyCategoriesSlider';

type Props = {
    bloc: CasaqBloc;
    currentDomain: string;
    previewDomain?: string;
};

type Data = {
    titre?: string;
    texte?: string;
    categories?: Array<string | number>;
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

export async function PropertyCategoriesBlock({
                                                  bloc,
                                                  currentDomain,
                                                  previewDomain,
                                              }: Props) {
    const data = blockData<Data>(bloc);
    const cta = getLinkProps(data.cta);

    const selectedCategoryIds = Array.isArray(data.categories)
        ? data.categories
        : [];

    const categories = await getSitePropertyCategoriesByIds(
        currentDomain,
        selectedCategoryIds
    );

    return (
        <section
            className={`section pd-l-r property-categories property-categories--${bloc.variant || 'cards'}`}
        >
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Coups de cœur'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>

                    {cta ? (
                        <Link
                            href={withPreviewUrl(cta.href, previewDomain)}
                            target={cta.target}
                            rel={cta.rel}
                            className="site-btn site-btn--primary"
                        >
                            {cta.label || 'Voir tous les biens'}
                        </Link>
                    ) : null}
                </div>

                {categories.length ? (
                    <PropertyCategoriesSlider
                        categories={categories}
                        previewDomain={previewDomain}
                    />
                ) : (
                    <div className="property-categories__empty">
                        Aucune catégorie disponible.
                    </div>
                )}
            </div>
        </section>
    );
}