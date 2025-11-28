import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ ref: string }> }
) {
    const { ref } = await context.params;
    return NextResponse.json({
        transferRef: ref,
        state: 'CREDITED',
        creditedAt: new Date().toISOString(),
        bank: { src: 'BANK_GLOBETE', dst: 'BANK_MOCK' }
    }, { status: 200 });
}


