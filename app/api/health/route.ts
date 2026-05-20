import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const secret = request.headers.get('x-casaq-secret');

    if (!secret || secret !== process.env.CASAQ_REVALIDATE_SECRET) {
        return NextResponse.json(
            {
                ok: false,
                error: 'Unauthorized',
            },
            { status: 401 }
        );
    }

    const body = await request.json().catch(() => null);

    if (!body?.tag) {
        return NextResponse.json(
            {
                ok: false,
                error: 'Missing tag',
            },
            { status: 400 }
        );
    }

    const tag = String(body.tag);

    revalidateTag(tag, 'max');

    return NextResponse.json({
        ok: true,
        tag,
        revalidatedAt: new Date().toISOString(),
    });
}