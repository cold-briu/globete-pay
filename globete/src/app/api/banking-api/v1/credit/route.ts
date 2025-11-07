import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        let body: any = null;
        try { body = await req.json(); } catch { }
        return NextResponse.json({
            creditRef: 'BANK-CREDIT-MOCK',
            state: 'CREDITED',
            received: body ?? null
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ creditRef: 'BANK-CREDIT-MOCK', state: 'CREDITED' }, { status: 200 });
    }
}


