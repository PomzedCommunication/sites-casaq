import type { CasaqPage } from '@/lib/casaq';

const BIENS_BLOCK_TYPES = [
  'biens',
  'biens_listing',
  'featured_biens',
    'properties_list',
];

export function getPageDeal(page: CasaqPage): 'SALE' | 'RENT' | undefined {
  if (page.template === 'listing_sale') {
    return 'SALE';
  }

  if (page.template === 'listing_rent') {
    return 'RENT';
  }

  // const biensBloc = page.blocs.find((bloc) =>
  //     ['biens', 'biens_listing', 'featured_biens', 'properties_list'].includes(bloc.type),
  // );
  //
  // console.log('deal:', biensBloc?.data);
  //
  // const deal = biensBloc?.data?.deal;
  //
  // if (deal === 'SALE' || deal === 'RENT') {
  //   return deal;
  // }


  const deals = page.blocs
      .filter((bloc) =>
          ['biens', 'biens_listing', 'featured_biens', 'properties_list'].includes(
              bloc.type,
          ),
      )
      .map((bloc) => bloc.data?.deal)
      .filter(
          (deal): deal is 'SALE' | 'RENT' =>
              deal === 'SALE' || deal === 'RENT',
      );

  const uniqueDeals = [...new Set(deals)];

  if (uniqueDeals.length === 1) {
    return uniqueDeals[0];
  }

  return undefined;
}

export function getPageBiensLimit(page: CasaqPage): number {
  const biensBloc = page.blocs.find((bloc) =>
      ['biens', 'biens_listing', 'featured_biens', 'properties_list'].includes(bloc.type),
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