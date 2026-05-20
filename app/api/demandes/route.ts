import { createSiteDemande } from '@/lib/casaq';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);

    if (!body) {
        return NextResponse.json(
            {
                success: false,
                message: 'Payload invalide.',
            },
            { status: 400 },
        );
    }

    const domain = String(body.domain || '').trim();

    if (!domain) {
        return NextResponse.json(
            {
                success: false,
                message: 'Domaine manquant.',
            },
            { status: 400 },
        );
    }

    const result = await createSiteDemande(domain, {
        bien_id: Number(body.bien_id),
        civilite: body.civilite ? String(body.civilite) as '1' | '2' | '3' | '4' : undefined,
        firstname: String(body.firstname || ''),
        lastname: String(body.lastname || ''),
        email: body.email ? String(body.email) : undefined,
        phone: body.phone ? String(body.phone) : undefined,
        message: body.message ? String(body.message) : undefined,
        gdpr_accepted: Boolean(body.gdpr_accepted),
        intent: body.intent || 'contact_agent',
        page_url: body.page_url ? String(body.page_url) : undefined,
    });

    if (!result.success) {
        return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);
}