import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    let body: any = null;
    try { body = await req.json(); } catch { }
    return NextResponse.json({
        signature: 'mock_signature',
        algorithm: 'RS256',
        signedAt: new Date().toISOString(),
        received: body ?? null
    }, { status: 200 });
}


