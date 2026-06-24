// src/lib/listing/listing-url.ts

import type { ListingDeal, ListingFilters } from './listing-types';
import { slugify } from '@/lib/property-url';

const DEAL_SEGMENTS: Record<string, ListingDeal> = {
  acheter: 'SALE',
  louer: 'RENT',
};

const DEAL_PATHS: Record<ListingDeal, string> = {
  SALE: 'acheter',
  RENT: 'louer',
};

const CATEGORY_ALIASES: Record<string, string> = {
  // Catégories parentes réelles
  appartement: 'appartements',
  appartements: 'appartements',

  maison: 'maisons',
  maisons: 'maisons',

  terrain: 'terrains',
  terrains: 'terrains',

  'local-commercial': 'locaux-commerciaux',
  'locaux-commerciaux': 'locaux-commerciaux',
  local: 'locaux-commerciaux',
  locaux: 'locaux-commerciaux',

  hotellerie: 'hotellerie',
  hôtellerie: 'hotellerie',

  entreprise: 'entreprises',
  entreprises: 'entreprises',

  parking: 'parkings',
  parkings: 'parkings',

  'place-amarrage': 'places-amarrage',
  'places-amarrage': 'places-amarrage',
  'place-d-amarrage': 'places-amarrage',
  'places-d-amarrage': 'places-amarrage',

  immeuble: 'immeubles',
  immeubles: 'immeubles',

  'cle-en-main': 'cles-en-main',
  'cles-en-main': 'cles-en-main',
  'clé-en-main': 'cles-en-main',
  'clés-en-main': 'cles-en-main',

  'mobile-home': 'mobile-homes',
  'mobile-homes': 'mobile-homes',

  annexe: 'annexes',
  annexes: 'annexes',

  camping: 'campings',
  campings: 'campings',

  enseigne: 'enseignes',
  enseignes: 'enseignes',

  chambre: 'chambres',
  chambres: 'chambres',
};

function normalizeCategorySlug(value?: string): string | undefined {
  if (!value) return undefined;

  const slug = slugify(value);

  return CATEGORY_ALIASES[slug] ?? slug;
}

function isKnownCategorySegment(value?: string): boolean {
  if (!value) return false;

  return Boolean(CATEGORY_ALIASES[slugify(value)]);
}

export function parseListingPath(
    slug: string[],
    searchParams?: Record<string, string | string[] | undefined>
): ListingFilters {
  const [firstSegment, secondSegment, thirdSegment] = slug;

  const deal = firstSegment ? DEAL_SEGMENTS[firstSegment] : undefined;



  let categoryParent: string | undefined = readString(searchParams?.category_parent);
  let city: string | undefined;

  if (deal && secondSegment) {
    if (isKnownCategorySegment(secondSegment)) {
      categoryParent = normalizeCategorySlug(secondSegment);

      if (thirdSegment) {
        city = thirdSegment;
      }
    } else {
      city = secondSegment;
    }
  }

  return {
    deal,
    categoryParent,
    city: city ? city.replace(/-/g, ' ') : undefined,

    locationLabel:
        readString(searchParams?.localite) ||
        prettyCityFromSlug(city),
    lat: readNumber(searchParams?.lat),
    lng: readNumber(searchParams?.lng),
    rayon: readNumber(searchParams?.rayon),

    prixMin: readNumber(searchParams?.prix_min),
    prixMax: readNumber(searchParams?.prix_max),
    piecesMin: readNumber(searchParams?.pieces_min),
    piecesMax: readNumber(searchParams?.pieces_max),
    surfaceMin: readNumber(searchParams?.surface_min),
    surfaceMax: readNumber(searchParams?.surface_max),

    prestige: readBoolean(searchParams?.prestige),
    sort: (readString(searchParams?.sort) as ListingFilters['sort']) || 'recent',
    view: (readString(searchParams?.view) as ListingFilters['view']) || 'grid',
    page: readNumber(searchParams?.page) || 1,
  };
}
function prettyCityFromSlug(value?: string): string | undefined {
  if (!value) return undefined;

  const slug = slugify(value);

  const map: Record<string, string> = {
    delemont: 'Delémont',
    porrentruy: 'Porrentruy',
    bienne: 'Bienne',
    neuchatel: 'Neuchâtel',
    'la-chaux-de-fonds': 'La Chaux-de-Fonds',
    moutier: 'Moutier',
    bassecourt: 'Bassecourt',
    courroux: 'Courroux',
    courrendlin: 'Courrendlin',
    develier: 'Develier',
  };

  if (map[slug]) {
    return map[slug];
  }

  return value
      .replace(/-/g, ' ')
      .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
}
export function buildListingPath(filters: ListingFilters): string {
  let pathname = '/biens';

  if (filters.deal) {
    pathname = `/${DEAL_PATHS[filters.deal]}`;
  }

  const categorySlug = normalizeCategorySlug(filters.categoryParent);

  if (categorySlug && filters.deal) {
    pathname += `/${categorySlug}`;
  }

  if (filters.city && filters.deal) {
    pathname += `/${slugify(filters.city)}`;
  }

  const query = new URLSearchParams();

  if (filters.categoryParent && !filters.deal) {
    query.set('category_parent', normalizeCategorySlug(filters.categoryParent) || filters.categoryParent);
  }

  if (filters.lat !== undefined) query.set('lat', String(filters.lat));
  if (filters.lng !== undefined) query.set('lng', String(filters.lng));
  if (filters.rayon !== undefined) query.set('rayon', String(filters.rayon));

  if (filters.prixMin !== undefined) query.set('prix_min', String(filters.prixMin));
  if (filters.prixMax !== undefined) query.set('prix_max', String(filters.prixMax));
  if (filters.piecesMin !== undefined) query.set('pieces_min', String(filters.piecesMin));
  if (filters.piecesMax !== undefined) query.set('pieces_max', String(filters.piecesMax));
  if (filters.surfaceMin !== undefined) query.set('surface_min', String(filters.surfaceMin));
  if (filters.surfaceMax !== undefined) query.set('surface_max', String(filters.surfaceMax));

  if (filters.prestige) query.set('prestige', '1');
  if (filters.sort && filters.sort !== 'recent') query.set('sort', filters.sort);
  if (filters.view && filters.view !== 'grid') query.set('view', filters.view);
  if (filters.page && filters.page > 1) query.set('page', String(filters.page));

  const qs = query.toString();

  return `${pathname}${qs ? `?${qs}` : ''}`;
}

export function filtersToApiParams(filters: ListingFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.deal) params.set('deal', filters.deal);

  const categorySlug = normalizeCategorySlug(filters.categoryParent);

  if (categorySlug) {
    params.set('category_parent', categorySlug);
  }

  if (filters.city && (!filters.lat || !filters.lng)) {
    params.set('city', filters.city);
  }

  if (filters.locationLabel) params.set('localite', filters.locationLabel);
  if (filters.lat !== undefined) params.set('lat', String(filters.lat));
  if (filters.lng !== undefined) params.set('lng', String(filters.lng));
  if (filters.rayon !== undefined) params.set('rayon', String(filters.rayon));

  if (filters.prixMin !== undefined) params.set('prix_min', String(filters.prixMin));
  if (filters.prixMax !== undefined) params.set('prix_max', String(filters.prixMax));
  if (filters.piecesMin !== undefined) params.set('pieces_min', String(filters.piecesMin));
  if (filters.piecesMax !== undefined) params.set('pieces_max', String(filters.piecesMax));
  if (filters.surfaceMin !== undefined) params.set('surface_min', String(filters.surfaceMin));
  if (filters.surfaceMax !== undefined) params.set('surface_max', String(filters.surfaceMax));

  if (filters.prestige) params.set('prestige', '1');
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', String(filters.page));

  return params;
}

function readString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

function readNumber(value: string | string[] | undefined): number | undefined {
  const raw = readString(value);
  if (!raw) return undefined;

  const number = Number(raw);

  return Number.isFinite(number) ? number : undefined;
}

function readBoolean(value: string | string[] | undefined): boolean | undefined {
  const raw = readString(value);

  if (!raw) return undefined;

  return ['1', 'true', 'yes', 'oui'].includes(raw.toLowerCase());
}