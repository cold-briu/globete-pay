import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    let body: any = null;
    try { body = await req.json(); } catch { }
    return NextResponse.json({
        transferRef: 'TFY-MOCK-REF',
        state: 'SUBMITTED',
        received: body ?? null
    }, { status: 200 });
}


