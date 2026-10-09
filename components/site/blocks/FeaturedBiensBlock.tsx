import Image from 'next/image';
import Link from 'next/link';
import type { CasaqBien, CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';
import { getSiteBiensByIds } from '@/lib/casaq';
import { blockData, getLinkProps, withPreviewUrl } from '@/lib/site-blocks';
import { getBienSeoPath } from '@/lib/property-url';
import { FavoriteButton } from '@/components/site/favorites/FavoriteButton';
import { parseSiteHtml } from '@/lib/site-html';
import { FeaturedBiensSlider } from './FeaturedBiensSlider';
import { FeaturedBiensSliderPoints } from './FeaturedBiensSliderPoints';

import { FeaturedBienCard  } from '@/components/site/listings/FeaturedBienCard';

type FeaturedBiensBloc = CasaqBloc & {
    variant?: string;
};

type Props = {
    bloc: FeaturedBiensBloc;
    site: CasaqSiteConfig;
    biens: CasaqBien[];
    currentDomain: string;
    previewDomain?: string;
};

type Data = {
    titre?: string;
    texte?: string;
    mode?: 'manual' | 'auto';
    bien_ids?: Array<number | string>;
    nb?: number;
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
    deal?: string;
};

export async function FeaturedBiensBlock({
                                             bloc,
                                             site,
                                             biens,
                                             currentDomain,
                                             previewDomain,
                                         }: Props) {
    const data       = blockData<Data>(bloc);
    const cta        = getLinkProps(data.cta);
    const variant    = bloc.variant || 'carousel';
    const isCarousel = variant === 'carousel';

    // console.log('carrousel', biens);
    // console.log('chat', serializeBien(biens[0]));
    // console.log('test bloc', bloc);

    const selectedBiens = await getFeaturedBiens({
        domain: currentDomain,
        pageBiens: biens,
        data,
        isCarousel,
    });


    if (!selectedBiens.length && !data.titre && !data.texte) return null;

    return (
        <section className={`section pd-l-r featured-biens featured-biens--${variant}`}>
            <div className="container">

                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Coups de cœur'}</h2>
                        {data.texte ? (
                            <div className="txt">{parseSiteHtml(data.texte)}</div>
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

                {selectedBiens.length ? (
                    (variant === 'carousel') ? (
                        <FeaturedBiensSlider
                            biens={selectedBiens.map(serializeBien)}
                            previewDomain={previewDomain}
                        />
                    ) : (variant === 'carousel_dots') ? (
                        <FeaturedBiensSliderPoints
                            site={site}
                            biens={selectedBiens.map(serializeBien)}
                            previewDomain={previewDomain}
                        />
                    ) : (
                        <div className="featured-biens__grid">
                            {selectedBiens.map((bien) => (
                                <FeaturedBienCard
                                    key={bien.id}
                                    bien={serializeBien(bien)}
                                    site={site}
                                    previewDomain={previewDomain}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="empty-state">Aucun bien sélectionné.</div>
                )}
            </div>
        </section>
    );
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function getFeaturedBiens({
                                    domain,
                                    pageBiens,
                                    data,
                                    isCarousel,
                                }: {
    domain: string;
    pageBiens: CasaqBien[];
    data: Data;
    isCarousel: boolean;
}): Promise<CasaqBien[]> {
    const limit = isCarousel
        ? 12
        : getLimit(data.nb, data.mode === 'manual' ? 12 : 6);

    let biens: CasaqBien[];

    if (data.mode === 'manual' && Array.isArray(data.bien_ids) && data.bien_ids.length) {
        const ids = data.bien_ids.map((id) => String(id));
        const fetched = await getSiteBiensByIds(domain, ids);
        return fetched
            .sort((a, b) => ids.indexOf(String(a.id)) - ids.indexOf(String(b.id)))
            .slice(0, limit);
    } else {
        biens = pageBiens;
    }

    // console.log("biens", pageBiens, data.deal);

    if (data.deal) {
        biens = biens.filter((bien) => bien.deal === data.deal);
    }

    return biens.slice(0, limit);

    // return pageBiens.slice(0, limit);
}

// ─── Type sérialisé pour le client component ──────────────────────────────────

export type SerializedBien = {
    id: string | number;
    href: string;
    image: string | null;
    imageAlt: string;
    category?: string | null;
    heading: string;
    titre: string;
    bedrooms: string | null;
    bathrooms: string | null;
    pieces: string | number | null;
    created_at?: string | null;
    surface_habitable: string | null;
    surface_terrain: string | null;
    ville: string | null;
    price: string;
};

function serializeBien(bien: CasaqBien): SerializedBien {
    const image =
        bien.images?.[0]?.variants?.large ||
        bien.images?.[0]?.url ||
        null;

    const locality = bien.adresse?.ville || '';
    const category = bien.categorie || '';

    // console.log('test', bien);

    return {
        id:        bien.id,
        href:      getBienSeoPath(bien),
        image,
        imageAlt:  bien.images?.[0]?.alt || bien.titre,
        category,
        heading:   [locality, category].filter(Boolean).join(' - '),
        titre:     bien.titre,
        bedrooms:  getNumberValue(bien, ['caracteristiques.chambres', 'chambres']),
        bathrooms: getNumberValue(bien, [
            'caracteristiques.nb_bathrooms',
            'caracteristiques.salles_bain',
            'caracteristiques.salles_de_bains',
            'caracteristiques.salle_de_bain',
            'caracteristiques.bathrooms',
            'details.nb_bathrooms',
            'nb_bathrooms',
        ]),
        created_at: bien.created_at,
        surface_habitable: bien.caracteristiques?.surface_habitable?.toString() ?? null,
        surface_terrain: bien.caracteristiques?.surface_terrain?.toString() ?? null,
        pieces: bien.caracteristiques?.pieces?.toString() ?? null,
        ville: bien.adresse?.ville?.toString() ?? null,
        price: formatBienPrice(bien),
    };
}


// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLimit(value: unknown, fallback: number): number {
    const nb = Number(value || fallback);
    if (!Number.isFinite(nb)) return fallback;
    return Math.max(1, Math.min(12, nb));
}

function formatBienPrice(bien: CasaqBien): string {
    if (bien.prix?.sur_demande || !bien.prix?.formatte) return 'Prix sur demande';
    if (bien.deal === 'RENT') {
        return bien.prix.formatte.includes('/') ? bien.prix.formatte : `${bien.prix.formatte}/mois`;
    }
    return bien.prix.formatte;
}

function getNumberValue(item: unknown, paths: string[]): string | null {
    for (const path of paths) {
        const value = getNestedValue(item, path);
        if (value !== null && value !== undefined && value !== '') return String(value);
    }
    return null;
}

function getNestedValue(item: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
        if (!current || typeof current !== 'object') return null;
        return (current as Record<string, unknown>)[key];
    }, item);
}