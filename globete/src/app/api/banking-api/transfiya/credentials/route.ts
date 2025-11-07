import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    let body: any = null;
    try { body = await req.json(); } catch { }
    return NextResponse.json({
        credentialId: 'cred_mock_001',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        received: body ?? null
    }, { status: 200 });
}


