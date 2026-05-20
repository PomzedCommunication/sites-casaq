import type { CasaqPage } from '@/lib/casaq';

export function getPageDeal(page: CasaqPage): 'SALE' | 'RENT' | undefined {
  if (page.template === 'listing_sale') {
    return 'SALE';
  }

  if (page.template === 'listing_rent') {
    return 'RENT';
  }

  const biensBloc = page.blocs.find((bloc) => bloc.type === 'biens');

  const deal = biensBloc?.data?.deal;

  if (deal === 'SALE' || deal === 'RENT') {
    return deal;
  }

  return undefined;
}

export function getPageBiensLimit(page: CasaqPage): number {
  const biensBloc = page.blocs.find((bloc) => bloc.type === 'biens');

  const nb = Number(biensBloc?.data?.nb || 6);

  if (!Number.isFinite(nb)) {
    return 6;
  }

  return Math.min(24, Math.max(1, nb));
}

export function pageNeedsBiens(page: CasaqPage): boolean {
  return (
      page.template === 'listing_general' ||
      page.template === 'listing_sale' ||
      page.template === 'listing_rent' ||
      page.blocs.some((bloc) => bloc.type === 'biens')
  );
}