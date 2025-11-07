import { NextResponse } from 'next/server';

export async function GET(
    _req: Request,
    { params }: { params: { ref: string } }
) {
    const { ref } = params;
    return NextResponse.json({
        transferRef: ref,
        state: 'CREDITED',
        creditedAt: new Date().toISOString(),
        bank: { src: 'BANK_GLOBETE', dst: 'BANK_MOCK' }
    }, { status: 200 });
}


