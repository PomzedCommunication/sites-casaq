import Image from 'next/image';
import Link from 'next/link';
import type { CasaqBien, CasaqBloc } from '@/lib/casaq';
import { getSiteBiensByIds } from '@/lib/casaq';
import { blockData, getLinkProps, withPreviewUrl } from '@/lib/site-blocks';
import { getBienSeoPath } from '@/lib/property-url';
import { FavoriteButton } from '@/components/site/favorites/FavoriteButton';
import { parseSiteHtml } from '@/lib/site-html';
import { FeaturedBiensSlider } from './FeaturedBiensSlider';

type Props = {
    bloc: CasaqBloc;
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
};

export async function FeaturedBiensBlock({
                                             bloc,
                                             biens,
                                             currentDomain,
                                             previewDomain,
                                         }: Props) {
    const data       = blockData<Data>(bloc);
    const cta        = getLinkProps(data.cta);
    const variant    = bloc.data.variant || 'grid';
    const isCarousel = variant === 'carousel';

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
                    isCarousel ? (
                        <FeaturedBiensSlider
                            biens={selectedBiens.map(serializeBien)}
                            previewDomain={previewDomain}
                        />
                    ) : (
                        <div className="featured-biens__grid">
                            {selectedBiens.map((bien) => (
                                <FeaturedBienCard
                                    key={bien.id}
                                    bien={bien}
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

    if (data.mode === 'manual' && Array.isArray(data.bien_ids) && data.bien_ids.length) {
        const ids = data.bien_ids.map((id) => String(id));
        const fetched = await getSiteBiensByIds(domain, ids);
        return fetched
            .sort((a, b) => ids.indexOf(String(a.id)) - ids.indexOf(String(b.id)))
            .slice(0, limit);
    }

    return pageBiens.slice(0, limit);
}

// ─── Type sérialisé pour le client component ──────────────────────────────────

export type SerializedBien = {
    id: string | number;
    href: string;
    image: string | null;
    imageAlt: string;
    category: string;
    heading: string;
    titre: string;
    bedrooms: string | null;
    bathrooms: string | null;
    price: string;
};

function serializeBien(bien: CasaqBien): SerializedBien {
    const image =
        bien.images?.[0]?.variants?.medium ||
        bien.images?.[0]?.variants?.large ||
        bien.images?.[0]?.url ||
        null;

    const locality = bien.adresse?.ville || '';
    const category = bien.categorie || '';

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
            'caracteristiques.salles_de_bains',
            'caracteristiques.salle_de_bain',
            'caracteristiques.bathrooms',
            'salles_de_bains',
            'salle_de_bain',
            'bathrooms',
        ]),
        price: formatBienPrice(bien),
    };
}

// ─── Card (server, utilisée en mode grid) ────────────────────────────────────

export function FeaturedBienCard({
                                     bien,
                                     previewDomain,
                                 }: {
    bien: CasaqBien;
    previewDomain?: string;
}) {
    const s    = serializeBien(bien);
    const href = withPreviewUrl(s.href, previewDomain);

    return (
        <article className="featured-bien-card">
            <Link href={href} className="featured-bien-card__link-full">
                <div className="featured-bien-card__image-wrap">
                    {s.image ? (
                        <Image
                            src={s.image}
                            alt={s.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="featured-bien-card__image"
                        />
                    ) : (
                        <div className="featured-bien-card__placeholder">Aucun visuel</div>
                    )}
                    {s.category ? (
                        <span className="featured-bien-card__badge white">{s.category}</span>
                    ) : null}
                </div>

                <div className="featured-bien-card__body">
                    {s.heading ? <h3 className="featured-bien-card__title">{s.heading}</h3> : null}
                    {s.titre   ? <p  className="featured-bien-card__text">{s.titre}</p>    : null}

                    {(s.bedrooms || s.bathrooms) ? (
                        <div className="featured-bien-card__features">
                            {s.bedrooms ? (
                                <span className="featured-bien-card__feature site-btn btn-grey btn-sm">
                                    {s.bedrooms} {Number(s.bedrooms) > 1 ? 'Chambres' : 'Chambre'}
                                </span>
                            ) : null}
                            {s.bathrooms ? (
                                <span className="featured-bien-card__feature site-btn btn-grey btn-sm">
                                    {s.bathrooms} {Number(s.bathrooms) > 1 ? 'Salles de bains' : 'Salle de bain'}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    <div className="featured-bien-card__bottom">
                        <p className="featured-bien-card__price h3">{s.price}</p>
                        <span className="featured-bien-card__arrow" aria-hidden="true">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M1 21L21 1M21 16V1L6 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </Link>

            <div className="featured-bien-card__favorite">
                <FavoriteButton bienId={bien.id} previewDomain={previewDomain} />
            </div>
        </article>
    );
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