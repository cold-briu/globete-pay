import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        let body: any = null;
        try { body = await req.json(); } catch { }
        return NextResponse.json({ received: true, receivedAt: new Date().toISOString(), payload: body ?? null }, { status: 200 });
    } catch {
        return NextResponse.json({ received: true, receivedAt: new Date().toISOString() }, { status: 200 });
    }
}


