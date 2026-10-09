// src/app/api/listings/count/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSiteBiensFiltered } from '@/lib/casaq';
import type { ListingFilters } from '@/lib/listing/listing-types';

function readNumber(value: string | null): number | undefined {
    if (!value) return undefined;

    const number = Number(value);

    return Number.isFinite(number) ? number : undefined;
}

function readBoolean(value: string | null): boolean | undefined {
    if (!value) return undefined;

    return ['1', 'true', 'yes', 'oui'].includes(value.toLowerCase());
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json(
            { total: 0, error: 'Domain manquant.' },
            { status: 400 }
        );
    }

    const filters: ListingFilters = {
        deal: searchParams.get('deal') as ListingFilters['deal'] || undefined,

        categoryParent: searchParams.get('category_parent') || undefined,

        locationLabel: searchParams.get('localite') || undefined,
        city: searchParams.get('city') || undefined,
        lat: readNumber(searchParams.get('lat')),
        lng: readNumber(searchParams.get('lng')),
        rayon: readNumber(searchParams.get('rayon')),

        prixMin: readNumber(searchParams.get('prix_min')),
        prixMax: readNumber(searchParams.get('prix_max')),
        piecesMin: readNumber(searchParams.get('pieces_min')),
        piecesMax: readNumber(searchParams.get('pieces_max')),
        surfaceMin: readNumber(searchParams.get('surface_min')),
        surfaceMax: readNumber(searchParams.get('surface_max')),


        terrainMin: readNumber(searchParams.get('terrain_min')),
        terrainMax: readNumber(searchParams.get('terrain_max')),

        chambresMin: readNumber(searchParams.get('bedroom_min')),
        chambresMax: readNumber(searchParams.get('bedroom_max')),

        sallesDeBainMin: readNumber(searchParams.get('bathroom_min')),
        sallesDeBainMax: readNumber(searchParams.get('bathroom_max')),

        etat: searchParams.get('etat') || undefined,

        balcon: searchParams.get('balcon') === '1',
        terrasse: searchParams.get('terrasse') === '1',
        parking: searchParams.get('parking') === '1',
        garage: searchParams.get('garage') === '1',
        piscine: searchParams.get('piscine') === '1',
        vue: searchParams.get('vue') === '1',
        ascenseur: searchParams.get('ascenseur') === '1',
        accesPmr: searchParams.get('acces_pmr') === '1',
        animauxAcceptes: searchParams.get('animaux_acceptes') === '1',
        colocation: searchParams.get('colocation') === '1',

        disponibleImmediatement:
            searchParams.get('disponible_immediatement') === '1',


        prestige: readBoolean(searchParams.get('prestige')),
        sort: searchParams.get('sort') as ListingFilters['sort'] || 'recent',
        page: 1,
    };

    const result = await getSiteBiensFiltered(domain, filters, {
        perPage: 1,
    });

    return NextResponse.json({
        total: result.meta.total,
    });
}