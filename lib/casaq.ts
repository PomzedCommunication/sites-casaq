import type { ListingFilters } from '@/lib/listing/listing-types';
import { filtersToApiParams } from '@/lib/listing/listing-url';

export type CasaqPageTemplate =
    | 'default'
    | 'landing'
    | 'content'
    | 'contact'
    | 'listing_general'
    | 'listing_sale'
    | 'listing_rent'
    | 'news_listing'
    | 'news_detail';

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
    couleur_fond?: string;
    couleur_gris?: string;
    couleur_texte?: string;
    couleur_agence?: string;

    font?: string;
    logo?: string | null;
    favicon?: string | null;
    api_key_biens?: string;
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
    children?: Array<{
      label: string;
      url: string;
      ordre?: number;
    }>;
  }>;
  footer?: {
    logo?: string | null;
    description?: string | null;

    newsletter?: {
      enabled?: boolean;
      title?: string;
      placeholder?: string;
    };

    quick_links?: {
      title?: string;
    };

    hours?: {
      title?: string;
      items?: Array<{
        label?: string;
        day?: string;
        weekday?: number;
        closed?: boolean;
        slots?: Array<{
          start?: string; // "08:00"
          end?: string;   // "12:00"
        }>;
        value?: string; // fallback ancien format
        note?: string;
      }>;
    };
    holiday_closures?: Array<{
      date?: string;
      label?: string;
    }>;
    contact?: {
      title?: string;
      email?: string | null;
      telephone?: string | null;
      adresse?: string | null;
    };

    legal_links?: Array<{
      label?: string;
      url?: string;
    }>;

    socials?: {
      facebook?: string;
      linkedin?: string;
      twitter?: string;
      instagram?: string;
    };
  };
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
  data: Record<string, unknown>;
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
    adresse_substitution?: string | null;
    npa?: string | null;
    ville?: string | null;
    pays?: string | null;
    lat?: number | null;
    lng?: number | null;
    public_mode?: string | null;
    rayon_publication?: number | null;
  };
  caracteristiques?: {
    pieces?: string | number | null;
    chambres?: string | number | null;
    nb_bathrooms?: string | number | null;
    salles_bain?: string | number | null;
    surface_habitable?: string | number | null;
    surface_terrain?: string | number | null;
  };
  prix?: {
    valeur?: number | null;
    formatte?: string | null;
    devise?: string | null;
    sur_demande?: boolean;
  };
  contact_visite?: {
    type?: string | null;
    prenom?: string | null;
    nom?: string | null;
    nom_complet?: string | null;
    email?: string | null;
    telephone?: string | null;
    mobile?: string | null;
    image?: string | null;
  } | null;
  documents?: Array<{
    id?: number;
    label?: string | null;
    url?: string | null;
    extension?: string | null;
    mime_type?: string | null;
    size?: string | null;
    position?: number | null;
  }>;
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

const API_URL =
    process.env.NEXT_PUBLIC_CASAQ_API_URL ||
    process.env.CASAQ_API_URL;
export async function getSiteConfig(
    domain: string,
    preview = false,
): Promise<CasaqSiteConfig | null> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  if (preview) {
    search.set('preview', '1');
  }

  const url = `${API_URL}/api/v1/site-config?${search.toString()}`;

  const res = await fetch(
      url,
      preview
          ? { cache: 'no-store' }
          : {
            next: {
              revalidate: 60,
              tags: [`site-config:${domain}`],
            },
          },
  );

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
  extraParams?: URLSearchParams;
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

  const search = new URLSearchParams(params.extraParams || undefined);

  search.set('domain', domain);
  search.set('page', String(page));
  search.set('per_page', String(perPage));
  search.set('statut', 'ACTIVE');

  if (params.deal) {
    search.set('deal', params.deal);
  } else {
    search.delete('deal');
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
    preview = false,
): Promise<CasaqBien | null> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  if (preview) {
    search.set('preview', '1');
  }

  const url = `${API_URL}/api/v1/biens/${id}?${search.toString()}`;

  const res = await fetch(
      url,
      preview
          ? { cache: 'no-store' }
          : {
            next: {
              revalidate: 60,
              tags: [`site-bien:${domain}:${id}`],
            },
          },
  );

  if (!res.ok) {
    return null;
  }

  const json = await res.json();

  return json.data || null;
}


export type CreateDemandePayload = {
  bien_id?: number | null;
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
export type ContactAccount = {
  id: number;
  civilite?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  company?: string | null;
  address?: string | null;
  address2?: string | null;
  npa?: string | null;
  city?: string | null;
  country?: string | null;
};

export type ContactAuthSession = {
  token: string;
  expires_at: string;
  contact: ContactAccount;
};

export async function registerContactAccount(
    domain: string,
    payload: {
      firstname: string;
      lastname: string;
      email: string;
      phone?: string;
      password: string;
      password_confirmation: string;
      gdpr_accepted: boolean;
    },
): Promise<{
  success: boolean;
  message?: string;
  data?: ContactAuthSession;
}> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const res = await fetch(`${API_URL}/api/v1/contact-auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain,
      ...payload,
    }),
  });

  const json = await res.json().catch(() => null);

  return {
    success: res.ok,
    message: json?.message,
    data: json?.data,
  };
}

export async function loginContactAccount(
    domain: string,
    payload: {
      email: string;
      password: string;
    },
): Promise<{
  success: boolean;
  message?: string;
  data?: ContactAuthSession;
}> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const res = await fetch(`${API_URL}/api/v1/contact-auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain,
      ...payload,
    }),
  });

  const json = await res.json().catch(() => null);

  return {
    success: res.ok,
    message: json?.message,
    data: json?.data,
  };
}

export async function getContactAccount(
    domain: string,
    token: string,
): Promise<{
  success: boolean;
  contact?: ContactAccount;
}> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  const res = await fetch(`${API_URL}/api/v1/contact/me?${search.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    contact: json?.data?.contact,
  };
}



export async function getSiteBiensFiltered(
    domain: string,
    filters: ListingFilters,
    options?: {
      perPage?: number;
    }
) {
  const params = filtersToApiParams(filters);

  params.set('page', String(filters.page || 1));
  params.set('per_page', String(options?.perPage || 12));

  return getSiteBiens(domain, {
    page: filters.page || 1,
    perPage: options?.perPage || 12,
    deal: filters.deal,
    extraParams: params,
  });
}

export async function getSiteBiensAvailableFilters(
    domain: string,
    filters: ListingFilters
) {
  const params = filtersToApiParams(filters);

  params.set('domain', domain);

  const url = `${process.env.CASAQ_API_URL}/api/v1/biens/filters?${params.toString()}`;

  const response = await fetch(url, {
    next: {
      revalidate: 60,
      tags: [`site-biens-filters:${domain}`],
    },
  });

  if (!response.ok) {
    return undefined;
  }

  const json = await response.json();

  return json.data || undefined;
}


export async function getSiteBiensByIds(
    domain: string,
    ids: Array<string | number>,
): Promise<CasaqBien[]> {
  const cleanIds = ids
      .map((id) => String(id).trim())
      .filter(Boolean);

  if (!cleanIds.length) {
    return [];
  }

  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/biens/by-ids', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('ids', cleanIds.join(','));
  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    console.error('Erreur getSiteBiensByIds', await response.text());
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}

export type CasaqPropertyCategory = {
  id: number;
  label: string;
  slug: string;
  count: number;
};

export async function getSitePropertyCategoriesByIds(
    domain: string,
    ids: Array<string | number>,
): Promise<CasaqPropertyCategory[]> {
  const cleanIds = ids
      .map((id) => String(id).trim())
      .filter(Boolean);

  if (!cleanIds.length) {
    return [];
  }

  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/biens/categories/by-ids', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('ids', cleanIds.join(','));

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-property-categories:${domain}:${cleanIds.join(',')}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}



export async function getSitePosts(
    domain: string,
    options?: {
      limit?: number;
      category?: string;
    },
): Promise<CasaqPost[]> {
  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/posts', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('limit', String(options?.limit || 6));

  if (options?.category) {
    url.searchParams.set('category', options.category);
  }

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-posts:${domain}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}

export async function getSitePostsByIds(
    domain: string,
    ids: Array<string | number>,
): Promise<CasaqPost[]> {
  const cleanIds = ids
      .map((id) => String(id).trim())
      .filter(Boolean);

  if (!cleanIds.length) {
    return [];
  }

  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/posts/by-ids', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('ids', cleanIds.join(','));

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-posts-by-ids:${domain}:${cleanIds.join(',')}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}
export type CasaqPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image?: string | null;
  category?: string | null;
  published_at?: string | null;
  url: string;
  content?: string | null;
  blocks?: CasaqBloc[];
  seo?: {
    title?: string | null;
    description?: string | null;
  };
};

export async function getSitePost(
    domain: string,
    slug: string,
    preview = false,
): Promise<CasaqPost | null> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const search = new URLSearchParams();
  // search.set('domain', domain);
  search.set('domain', domain);

  if (preview) {
    search.set('preview', '1');
  }
  const url = `${API_URL}/api/v1/posts/${encodeURIComponent(slug)}?${search.toString()}`;

  // const res = await fetch(url, {
  //   next: {
  //     revalidate: 60,
  //     tags: [`site-post:${domain}:${slug}`],
  //   },
  // });
  const res = await fetch(url, preview
      ? { cache: 'no-store' }
      : {
        next: {
          revalidate: 60,
          tags: [`site-post:${domain}:${slug}`],
        },
      }
  );
  if (!res.ok) {
    return null;
  }

  const json = await res.json();

  return json.data || null;
}


export type CasaqPostsMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_more: boolean;
};

export type CasaqPostsResponse = {
  data: CasaqPost[];
  meta: CasaqPostsMeta;
};

export async function getSitePostsListing(
    domain: string,
    params: {
      page?: number;
      perPage?: number;
      category?: string;
      search?: string;
    } = {},
): Promise<CasaqPostsResponse> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const page = params.page || 1;
  const perPage = params.perPage || 9;

  const search = new URLSearchParams();

  search.set('domain', domain);
  search.set('page', String(page));
  search.set('limit', String(perPage));

  if (params.category) {
    search.set('category', params.category);
  }
  if (params.search) {
    search.set('search', params.search);
  }
  const url = `${API_URL}/api/v1/posts?${search.toString()}`;

  const res = await fetch(url, {
    next: {
      revalidate: 60,
      tags: [`site-posts-listing:${domain}`],
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
    data: Array.isArray(json.data) ? json.data : [],
    meta: json.meta || {
      total: 0,
      page,
      per_page: perPage,
      total_pages: 0,
      has_more: false,
    },
  };
}



export type CasaqTeamMember = {
  id: number;
  name: string;
  job_title?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  photo?: string | null;
  category?: string | null;
};

export async function getSiteTeamMembers(
    domain: string,
    options?: {
      limit?: number;
    },
): Promise<CasaqTeamMember[]> {
  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/team-members', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('limit', String(options?.limit || 24));

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-team-members:${domain}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}

export async function getSiteTeamMembersByIds(
    domain: string,
    ids: Array<string | number>,
): Promise<CasaqTeamMember[]> {
  const cleanIds = ids.map((id) => String(id).trim()).filter(Boolean);

  if (!cleanIds.length) {
    return [];
  }

  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/team-members/by-ids', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('ids', cleanIds.join(','));

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-team-members-by-ids:${domain}:${cleanIds.join(',')}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}

export type CasaqTestimonial = {
  id: number;
  author_name: string;
  author_role?: string | null;
  content?: string | null;
  rating?: number | null;
  photo?: string | null;
  category?: string | null;
  category_id?: number | null;
};

export async function getSiteTestimonials(
    domain: string,
    options?: {
      limit?: number;
      categoryId?: string | number | null;
    },
): Promise<CasaqTestimonial[]> {
  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/testimonials', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('limit', String(options?.limit || 24));

  if (options?.categoryId) {
    url.searchParams.set('category_id', String(options.categoryId));
  }

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-testimonials:${domain}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}

export async function getSiteTestimonialsByIds(
    domain: string,
    ids: Array<string | number>,
): Promise<CasaqTestimonial[]> {
  const cleanIds = ids.map((id) => String(id).trim()).filter(Boolean);

  if (!cleanIds.length) {
    return [];
  }

  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/testimonials/by-ids', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('ids', cleanIds.join(','));

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-testimonials-by-ids:${domain}:${cleanIds.join(',')}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}

export type CasaqPartner = {
  id: number;
  name: string;
  slug?: string | null;
  trade?: string | null;
  city?: string | null;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  logo_image?: string | null;
  category?: string | null;
  category_id?: number | null;
};

export async function getSitePartners(
    domain: string,
    options?: {
      limit?: number;
      categoryId?: string | number | null;
    },
): Promise<CasaqPartner[]> {
  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/partners', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('limit', String(options?.limit || 24));

  if (options?.categoryId) {
    url.searchParams.set('category_id', String(options.categoryId));
  }

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-partners:${domain}:${options?.categoryId || 'all'}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}
export async function getSitePartnersByIds(
    domain: string,
    ids: Array<string | number>,
): Promise<CasaqPartner[]> {
  const cleanIds = ids.map((id) => String(id).trim()).filter(Boolean);

  if (!cleanIds.length) {
    return [];
  }

  const baseUrl =
      process.env.CASAQ_API_URL ||
      process.env.NEXT_PUBLIC_CASAQ_API_URL ||
      'https://app.casaq.ch';

  const url = new URL('/api/v1/partners/by-ids', baseUrl);

  url.searchParams.set('domain', domain);
  url.searchParams.set('ids', cleanIds.join(','));

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 60,
      tags: [`site-partners-by-ids:${domain}:${cleanIds.join(',')}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return Array.isArray(json.data) ? json.data : [];
}


export async function getSiteSimilarBiens(
    domain: string,
    id: string | number,
    limit = 4,
): Promise<CasaqBien[]> {
  if (!API_URL) {
    throw new Error('CASAQ_API_URL manquant dans .env.local');
  }

  const search = new URLSearchParams();

  search.set('domain', domain);
  search.set('limit', String(limit));

  const url = `${API_URL}/api/v1/biens/${id}/similaires?${search.toString()}`;

  const res = await fetch(url, {
    next: {
      revalidate: 60,
      tags: [`site-bien-similaires:${domain}:${id}`],
    },
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();

  return Array.isArray(json.data) ? json.data : [];
}



export type TrackBienEventType =
    | 'view'
    | 'contact_click'
    | 'favorite'
    | 'document_download'
    | 'share'
    | 'phone_click'
    | 'email_click';

function getContactToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const possibleKeys = [
    'casaq_contact_token',
    'contact_token',
    'casaq_auth_token',
    'auth_token',
  ];

  for (const key of possibleKeys) {
    const value = window.localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return null;
}

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const key = 'casaq_visitor_id';
  let value = window.localStorage.getItem(key);

  if (!value) {
    value = crypto.randomUUID();
    window.localStorage.setItem(key, value);
  }

  return value;
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const key = 'casaq_session_id';
  let value = window.sessionStorage.getItem(key);

  if (!value) {
    value = crypto.randomUUID();
    window.sessionStorage.setItem(key, value);
  }

  return value;
}

export async function trackBienEvent(
    domain: string,
    bienId: number,
    type: TrackBienEventType,
    meta: Record<string, unknown> = {},
): Promise<void> {
  if (!API_URL || typeof window === 'undefined') {
    return;
  }
  console.log('[CasaQ tracking] sending', {
    apiUrl: API_URL,
    domain,
    bienId,
    type,
  });
  const token = getContactToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    await fetch(`${API_URL}/api/v1/track?domain=${encodeURIComponent(domain)}`, {
      method: 'POST',
      headers,
      keepalive: true,
      body: JSON.stringify({
        bien_id: bienId,
        type,
        page_url: window.location.href,
        referrer: document.referrer || null,
        visitor_id: getOrCreateVisitorId(),
        session_id: getOrCreateSessionId(),
        source: 'site',
        meta,
      }),
    });
  } catch {
    // Ne jamais bloquer l’utilisateur pour une stat.
  }
}