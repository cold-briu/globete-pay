import { NextResponse } from 'next/server';

export async function POST(_req: Request) {
    // Simulate OAuth2 client credentials token
    return NextResponse.json({
        access_token: 'mock_access_token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'transfers action credentials'
    }, { status: 200 });
}


