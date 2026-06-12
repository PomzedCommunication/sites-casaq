import type { CasaqPage } from '@/lib/casaq';

const BIENS_BLOCK_TYPES = [
  'biens',
  'biens_listing',
  'featured_biens',
];

export function getPageDeal(page: CasaqPage): 'SALE' | 'RENT' | undefined {
  if (page.template === 'listing_sale') {
    return 'SALE';
  }

  if (page.template === 'listing_rent') {
    return 'RENT';
  }

  const biensBloc = page.blocs.find((bloc) =>
      ['biens', 'biens_listing', 'featured_biens'].includes(bloc.type),
  );

  const deal = biensBloc?.data?.deal;

  if (deal === 'SALE' || deal === 'RENT') {
    return deal;
  }

  return undefined;
}

export function getPageBiensLimit(page: CasaqPage): number {
  const biensBloc = page.blocs.find((bloc) =>
      ['biens', 'biens_listing', 'featured_biens'].includes(bloc.type),
  );

  const nb = Number(biensBloc?.data?.nb || 12);

  if (!Number.isFinite(nb)) {
    return 12;
  }

  return Math.min(24, Math.max(1, nb));
}

export function pageNeedsBiens(page: CasaqPage): boolean {
  return (
      page.template === 'listing_general' ||
      page.template === 'listing_sale' ||
      page.template === 'listing_rent' ||
      page.blocs.some((bloc) => BIENS_BLOCK_TYPES.includes(bloc.type))
  );
}