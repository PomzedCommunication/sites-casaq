// src/lib/listing/listing-types.ts

export type ListingDeal = 'SALE' | 'RENT';

export type ListingSort =
    | 'recent'
    | 'price_asc'
    | 'price_desc'
    | 'surface_desc'
    | 'pieces_desc'
    | 'random'
    | 'distance';

export type ListingView = 'grid' | 'map';

export type ListingFilters = {
  deal?: ListingDeal;

  category?: string;
  categoryParent?: string;

  locationLabel?: string;
  city?: string;
  lat?: number;
  lng?: number;
  rayon?: number;

  prixMin?: number;
  prixMax?: number;
  piecesMin?: number;
  piecesMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;

  prestige?: boolean;

  sort?: ListingSort;
  view?: ListingView;
  page?: number;
};

export type ListingFilterOption = {
  id: number | string;
  slug: string;
  label: string;
  count?: number;
};

export type ListingAvailableFilters = {
  categories: ListingFilterOption[];
  price: {
    min: number | null;
    max: number | null;
  };
  pieces: {
    min: number | null;
    max: number | null;
  };
  surface: {
    min: number | null;
    max: number | null;
  };
};