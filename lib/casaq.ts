export type CasaqPageTemplate =
    | 'default'
    | 'landing'
    | 'content'
    | 'contact'
    | 'listing_general'
    | 'listing_sale'
    | 'listing_rent';

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
  pages: CasaqPage[];
};

export type CasaqPage = {
  id: number;
  slug: string;
  titre: string;
  template?: CasaqPageTemplate;
  meta_title?: string | null;
  meta_description?: string | null;
  blocs: CasaqBloc[];
  ordre: number;
};

export type CasaqBloc = {
  type: string;
  ordre: number;
  actif: boolean;
  data: Record<string, string | number | boolean | null>;
};

export type CasaqBien = {
  id: number;
  reference: string;
  deal?: string;
  statut?: string;
  prestige?: boolean;
  titre: string;
  resume?: string | null;
  categorie?: string | null;
  adresse?: {
    rue?: string | null;
    npa?: string | null;
    ville?: string | null;
    pays?: string | null;
  };
  caracteristiques?: {
    pieces?: string | number | null;
    chambres?: string | number | null;
    surface_habitable?: string | number | null;
    surface_terrain?: string | number | null;
  };
  prix?: {
    valeur?: number | null;
    formatte?: string | null;
    devise?: string | null;
    sur_demande?: boolean;
  };
  images?: Array<{
    url?: string | null;
    variants?: {
      small?: string | null;
      medium?: string | null;
      large?: string | null;
      xl?: string | null;
      original?: string | null;
    };
    alt?: string | null;
    caption?: string | null;
  }>;
};

const API_URL = process.env.CASAQ_API_URL;

export async function getSiteConfig(domain: string): Promise<CasaqSiteConfig | null> {
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
    return null;
  }

  const json = await res.json();

  return json.data || null;
}

export type CasaqBiensMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_more: boolean;
};

export type CasaqBiensResponse = {
  data: CasaqBien[];
  meta: CasaqBiensMeta;
};

type GetSiteBiensParams = {
  page?: number;
  perPage?: number;
  deal?: 'SALE' | 'RENT';
};

export async function getSiteBiens(
    domain: string,
    params: GetSiteBiensParams = {},
): Promise<CasaqBiensResponse> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const page = params.page || 1;
  const perPage = params.perPage || 12;

  const search = new URLSearchParams();

  search.set('domain', domain);
  search.set('page', String(page));
  search.set('per_page', String(perPage));
  search.set('statut', 'ACTIVE');

  if (params.deal) {
    search.set('deal', params.deal);
  }

  const url = `${API_URL}/api/v1/biens?${search.toString()}`;

  const res = await fetch(url, {
    next: {
      revalidate: 60,
      tags: [`site-biens:${domain}`],
    },
  });

  if (!res.ok) {
    return {
      data: [],
      meta: {
        total: 0,
        page,
        per_page: perPage,
        total_pages: 0,
        has_more: false,
      },
    };
  }

  const json = await res.json();

  return {
    data: json.data || [],
    meta: json.meta || {
      total: 0,
      page,
      per_page: perPage,
      total_pages: 0,
      has_more: false,
    },
  };
}

export async function getSiteBien(
    domain: string,
    id: string | number,
): Promise<CasaqBien | null> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  const url = `${API_URL}/api/v1/biens/${id}?${search.toString()}`;

  const res = await fetch(url, {
    next: {
      revalidate: 60,
      tags: [`site-bien:${domain}:${id}`],
    },
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();

  return json.data || null;
}


export type CreateDemandePayload = {
  bien_id: number;
  civilite?: '1' | '2' | '3' | '4';
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  message?: string;
  gdpr_accepted: boolean;
  intent?: 'visit' | 'contact_agent' | 'download_file' | 'callback' | 'question';
  page_url?: string;
};

export async function createSiteDemande(
    domain: string,
    payload: CreateDemandePayload,
): Promise<{
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const url = `${API_URL}/api/v1/demandes?domain=${encodeURIComponent(domain)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      success: false,
      message: json?.message || 'Impossible d’envoyer la demande.',
      errors: json?.errors,
    };
  }

  return {
    success: true,
    message: json?.message || 'Demande envoyée.',
  };
}
