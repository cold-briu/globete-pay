import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    let body: any = null;
    try { body = await req.json(); } catch {}
    const llave = body?.llave ?? '+57-3000000000';
    return NextResponse.json({
        recipient: {
            llave,
            displayName: 'Mock Recipient',
            institution: { id: 'BANK_MOCK', name: 'Banco Mock' },
            account: { type: 'SAVINGS', maskedNumber: '****1234' },
            validations: { isPayable: true, limits: { maxPerTx: 11552000, institutionalMaxPerTx: 5000000 } }
        }
    }, { status: 200 });
}


