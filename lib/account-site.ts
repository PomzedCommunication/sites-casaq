import { getSiteConfig } from '@/lib/casaq';
import { getCurrentDomain } from '@/lib/domain';

export type AccountPageSearchParams = Promise<{
  site?: string;
}>;

export async function getAccountSite(searchParams?: AccountPageSearchParams) {
  const params = await searchParams;
  const domain = await getCurrentDomain(params);
  const site = await getSiteConfig(domain);

  return {
    params,
    domain,
    site,
    previewDomain: params?.site,
  };
}