import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        let body: any = null;
        try { body = await req.json(); } catch { }
        return NextResponse.json({
            debitRef: 'BANK-DEBIT-MOCK',
            state: 'DEBITED',
            received: body ?? null
        }, { status: 200 });
    } catch {
        return NextResponse.json({ debitRef: 'BANK-DEBIT-MOCK', state: 'DEBITED' }, { status: 200 });
    }
}


