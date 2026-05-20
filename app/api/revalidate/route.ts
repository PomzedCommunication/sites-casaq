import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'sites-casaq',
    timestamp: new Date().toISOString(),
  });
}