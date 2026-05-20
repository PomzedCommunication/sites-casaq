export type CasaqSiteConfig = {
  id: number;
  domain: string;
  template: string;
  active: boolean;
  agence: {
    id: number;
    nom: string;
  };
  config: {
    couleur_primaire?: string;
    couleur_secondaire?: string;
    font?: string;
    logo?: string | null;
    favicon?: string | null;
  };
  infos: {
    slogan?: string | null;
    email?: string | null;
    telephone?: string | null;
    adresse?: string | null;
  };
  menu: Array<{
    label: string;
    url: string;
    ordre?: number;
  }>;
  seo: {
    meta_description?: string | null;
    google_analytics?: string | null;
    facebook_pixel?: string | null;
  };
  pages: Array<{
    id: number;
    slug: string;
    titre: string;
    meta_title?: string | null;
    meta_description?: string | null;
    blocs: Array<{
      type: string;
      ordre: number;
      actif: boolean;
      data: Record<string, string | number | boolean | null>;
    }>;
    ordre: number;
  }>;
};

const API_URL = process.env.CASAQ_API_URL;

export async function getSiteConfig(domain: string): Promise<CasaqSiteConfig> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const url = `${API_URL}/api/v1/site-config?domain=${encodeURIComponent(domain)}`;

  const res = await fetch(url, {
    next: {
      revalidate: 60,
      tags: [`site-config:${domain}`],
    },
  });

  if (!res.ok) {
    throw new Error(`Impossible de charger la config du site : ${domain}`);
  }

  const json = await res.json();

  return json.data;
}