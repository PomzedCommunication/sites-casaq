import type { CasaqBien } from '@/lib/casaq';

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
  newsletter_alert?: boolean;
  matching_alert?: boolean;
  price_alert?: boolean;
  contact_email?: boolean;
  contact_phone?: boolean;
  account_enabled?: boolean;
};

export type ContactAuthSession = {
  token: string;
  expires_at: string;
  contact: ContactAccount;
};

const TOKEN_KEY = 'casaq_contact_token';
function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_CASAQ_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_CASAQ_API_URL manquant dans .env.local');
  }

  return apiUrl;
}

export function getCurrentDomainFromBrowser(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const params = new URLSearchParams(window.location.search);
  const previewDomain = params.get('site');

  if (previewDomain) {
    return previewDomain;
  }

  return window.location.hostname;
}

export function saveContactToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
}

export function getContactToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function clearContactToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

export function buildPreviewUrl(path: string): string {
  if (typeof window === 'undefined') {
    return path;
  }

  const params = new URLSearchParams(window.location.search);
  const previewDomain = params.get('site');

  if (!previewDomain) {
    return path;
  }

  const separator = path.includes('?') ? '&' : '?';

  return `${path}${separator}site=${encodeURIComponent(previewDomain)}`;
}

export async function registerContactAccountClient(payload: {
  domain: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  gdpr_accepted: boolean;
}): Promise<{
  success: boolean;
  message?: string;
  data?: ContactAuthSession;
}> {
  const url = `${getApiUrl()}/api/v1/contact-auth/register`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      message: json?.message || (res.ok ? 'Compte créé.' : 'Impossible de créer le compte.'),
      data: json?.data,
    };
  } catch {
    return {
      success: false,
      message: 'Impossible de contacter le serveur. Vérifiez la configuration CORS de l’API.',
    };
  }
}

export async function loginContactAccountClient(payload: {
  domain: string;
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message?: string;
  data?: ContactAuthSession;
}> {
  const res = await fetch(`${getApiUrl()}/api/v1/contact-auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  return {
    success: res.ok,
    message: json?.message || (res.ok ? 'Connexion réussie.' : 'Identifiants invalides.'),
    data: json?.data,
  };
}

export async function logoutContactAccountClient(token?: string | null): Promise<void> {
  const currentToken = token || getContactToken();

  if (!currentToken) {
    clearContactToken();
    return;
  }

  await fetch(`${getApiUrl()}/api/v1/contact-auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
  }).catch(() => null);

  clearContactToken();
}

export async function getContactAccountClient(domain: string): Promise<{
  success: boolean;
  contact?: ContactAccount;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
    };
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  const res = await fetch(`${getApiUrl()}/api/v1/contact/me?${search.toString()}`, {
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

export async function updateContactAccountClient(
    domain: string,
    payload: Partial<ContactAccount>,
): Promise<{
  success: boolean;
  message?: string;
  contact?: ContactAccount;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      message: 'Vous devez être connecté.',
    };
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  const res = await fetch(`${getApiUrl()}/api/v1/contact/me?${search.toString()}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  return {
    success: res.ok,
    message: json?.message || (res.ok ? 'Informations enregistrées.' : 'Impossible d’enregistrer.'),
    contact: json?.data?.contact,
  };
}

export function buildUrlWithPreviewDomain(path: string, previewDomain?: string | null): string {
  if (!previewDomain) {
    return path;
  }

  const separator = path.includes('?') ? '&' : '?';

  return `${path}${separator}site=${encodeURIComponent(previewDomain)}`;
}


export type ContactFavorite = {
  id: number;
  created_at: string;
  bien: CasaqBien;
};

export async function getContactFavoritesClient(domain: string): Promise<{
  success: boolean;
  favorites: ContactFavorite[];
  message?: string;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      favorites: [],
      message: 'Vous devez être connecté.',
    };
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/favorites?${search.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      favorites: json?.data || [],
      message: json?.message,
    };
  } catch {
    return {
      success: false,
      favorites: [],
      message: 'Impossible de charger les favoris.',
    };
  }
}

export async function addContactFavoriteClient(
    domain: string,
    bienId: number,
): Promise<{
  success: boolean;
  message?: string;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      message: 'CONNECT_REQUIRED',
    };
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/favorites?${search.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bien_id: bienId,
      }),
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      message: json?.message || (res.ok ? 'Bien ajouté aux favoris.' : 'Impossible d’ajouter le favori.'),
    };
  } catch {
    return {
      success: false,
      message: 'Impossible de contacter le serveur.',
    };
  }
}

export async function removeContactFavoriteClient(
    domain: string,
    bienId: number,
): Promise<{
  success: boolean;
  message?: string;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      message: 'CONNECT_REQUIRED',
    };
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/favorites/${bienId}?${search.toString()}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      message: json?.message || (res.ok ? 'Favori retiré.' : 'Impossible de retirer le favori.'),
    };
  } catch {
    return {
      success: false,
      message: 'Impossible de contacter le serveur.',
    };
  }
}

export type ContactSearchCriteria = {
  categories?: number[];
  npas?: string[] | string;
  price_min?: number | '';
  price_max?: number | '';
  rooms_min?: number | '';
  rooms_max?: number | '';
  surface_min?: number | '';
  surface_max?: number | '';
  keywords?: string;
  price_period?: 'MONTH' | 'YEAR' | '';
  orientations?: string[];
};

export type ContactSearchGeo = {
  include: Array<{
    name: string;
    lat?: number;
    lng?: number;
    radius_km?: number;
    place_id?: string | null;
  }>;
  exclude: Array<{
    name: string;
    lat?: number;
    lng?: number;
    radius_km?: number;
    place_id?: string | null;
  }>;
};

export type ContactSearch = {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  status_label: string;
  active: boolean;
  deal: 'SALE' | 'RENT';
  deal_label: string;
  summary: string;
  criteria: ContactSearchCriteria;
  geo: ContactSearchGeo;
  created_at: string;
  updated_at?: string | null;
};

export async function getContactSearchesClient(domain: string): Promise<{
  success: boolean;
  searches: ContactSearch[];
  message?: string;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      searches: [],
      message: 'Vous devez être connecté.',
    };
  }

  const search = new URLSearchParams();
  search.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/searches?${search.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      searches: json?.data || [],
      message: json?.message,
    };
  } catch {
    return {
      success: false,
      searches: [],
      message: 'Impossible de charger les critères.',
    };
  }
}

export async function createContactSearchClient(
    domain: string,
    payload: {
      name: string;
      status?: 'ACTIVE' | 'INACTIVE';
      deal: 'SALE' | 'RENT';
      criteria: ContactSearchCriteria;
      geo?: ContactSearchGeo;
    },
): Promise<{
  success: boolean;
  message?: string;
  search?: ContactSearch;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      message: 'Vous devez être connecté.',
    };
  }

  const params = new URLSearchParams();
  params.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/searches?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      message: json?.message || (res.ok ? 'Critère créé.' : 'Impossible de créer le critère.'),
      search: json?.data,
    };
  } catch {
    return {
      success: false,
      message: 'Impossible de contacter le serveur.',
    };
  }
}

export async function updateContactSearchClient(
    domain: string,
    id: number,
    payload: {
      name: string;
      status?: 'ACTIVE' | 'INACTIVE';
      deal: 'SALE' | 'RENT';
      criteria: ContactSearchCriteria;
      geo?: ContactSearchGeo;
    },
): Promise<{
  success: boolean;
  message?: string;
  search?: ContactSearch;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      message: 'Vous devez être connecté.',
    };
  }

  const params = new URLSearchParams();
  params.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/searches/${id}?${params.toString()}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      message: json?.message || (res.ok ? 'Critère enregistré.' : 'Impossible d’enregistrer.'),
      search: json?.data,
    };
  } catch {
    return {
      success: false,
      message: 'Impossible de contacter le serveur.',
    };
  }
}

export async function toggleContactSearchClient(
    domain: string,
    id: number,
): Promise<{
  success: boolean;
  message?: string;
  search?: ContactSearch;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      message: 'Vous devez être connecté.',
    };
  }

  const params = new URLSearchParams();
  params.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/searches/${id}/toggle?${params.toString()}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      message: json?.message,
      search: json?.data,
    };
  } catch {
    return {
      success: false,
      message: 'Impossible de contacter le serveur.',
    };
  }
}

export async function deleteContactSearchClient(
    domain: string,
    id: number,
): Promise<{
  success: boolean;
  message?: string;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      message: 'Vous devez être connecté.',
    };
  }

  const params = new URLSearchParams();
  params.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/searches/${id}?${params.toString()}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      message: json?.message || (res.ok ? 'Critère supprimé.' : 'Impossible de supprimer.'),
    };
  } catch {
    return {
      success: false,
      message: 'Impossible de contacter le serveur.',
    };
  }
}

export type ContactSearchCategoryGroup = {
  id: number;
  name: string;
  children: Array<{
    id: number;
    name: string;
  }>;
};

export async function getContactSearchCategoriesClient(domain: string): Promise<{
  success: boolean;
  categories: ContactSearchCategoryGroup[];
  message?: string;
}> {
  const token = getContactToken();

  if (!token) {
    return {
      success: false,
      categories: [],
      message: 'Vous devez être connecté.',
    };
  }

  const params = new URLSearchParams();
  params.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/search-categories?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      categories: json?.data || [],
      message: json?.message,
    };
  } catch {
    return {
      success: false,
      categories: [],
      message: 'Impossible de charger les catégories.',
    };
  }
}
export type ContactCorrespondanceMatch = {
  id: number;
  score: number;
  reasons: string[];
  trigger?: string | null;
  status: string;
  updated_at?: string | null;
  search: {
    id: number;
    name: string;
    summary?: string | null;
    deal: 'SALE' | 'RENT';
    deal_label: string;
  };
};

export type ContactCorrespondanceItem = {
  bien: CasaqBien;
  best_score: number;
  new: boolean;
  price_changed: boolean;
  matches: ContactCorrespondanceMatch[];
};

export type ContactCorrespondanceMeta = {
  biens: number;
  matches: number;
  new: number;
  price_changed: number;
};

export async function getContactCorrespondancesClient(domain: string): Promise<{
  success: boolean;
  items: ContactCorrespondanceItem[];
  meta: ContactCorrespondanceMeta;
  message?: string;
}> {
  const token = getContactToken();

  const emptyMeta = {
    biens: 0,
    matches: 0,
    new: 0,
    price_changed: 0,
  };

  if (!token) {
    return {
      success: false,
      items: [],
      meta: emptyMeta,
      message: 'Vous devez être connecté.',
    };
  }

  const params = new URLSearchParams();
  params.set('domain', domain);

  try {
    const res = await fetch(`${getApiUrl()}/api/v1/contact/correspondances?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const json = await res.json().catch(() => null);

    return {
      success: res.ok,
      items: Array.isArray(json?.data) ? json.data : [],
      meta: json?.meta || emptyMeta,
      message: json?.message,
    };
  } catch {
    return {
      success: false,
      items: [],
      meta: emptyMeta,
      message: 'Impossible de charger les correspondances.',
    };
  }
}