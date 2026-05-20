import type { CasaqBien } from '@/lib/casaq';

export function getBienSeoPath(bien: CasaqBien): string {
  const deal = getDealSegment(bien);
  const category = slugifyPlural(bien.categorie || 'bien');
  const city = slugify(bien.adresse?.ville || 'suisse');
  const title = slugify(bien.titre || bien.reference || 'bien-immobilier');

  return `/${deal}/${category}/${city}/${title}-${bien.id}`;
}

export function extractBienIdFromSlug(slug: string): string | null {
  const match = slug.match(/-(\d+)$/);

  if (!match) {
    return null;
  }

  return match[1];
}

export function getDealSegment(bien: CasaqBien): 'acheter' | 'louer' {
  const deal = String(bien.deal || '').toUpperCase();

  if (['RENT', 'LOCATION', 'RENTAL', 'LOUER'].includes(deal)) {
    return 'louer';
  }

  return 'acheter';
}

export function slugify(value: string): string {
  return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' et ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
}

function slugifyPlural(value: string): string {
  const slug = slugify(value);

  const dictionary: Record<string, string> = {
    appartement: 'appartements',
    appartements: 'appartements',
    maison: 'maisons',
    maisons: 'maisons',
    villa: 'villas',
    villas: 'villas',
    terrain: 'terrains',
    terrains: 'terrains',
    immeuble: 'immeubles',
    immeubles: 'immeubles',
    commerce: 'commerces',
    commerces: 'commerces',
    bureau: 'bureaux',
    bureaux: 'bureaux',
    local: 'locaux',
    locaux: 'locaux',
    parking: 'parkings',
    parkings: 'parkings',
  };

  return dictionary[slug] || slug;
}