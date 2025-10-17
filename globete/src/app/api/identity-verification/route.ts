import { NextResponse } from 'next/server';
import { SelfBackendVerifier, AllIds, DefaultConfigStore } from '@selfxyz/core';

// Reuse a single verifier instance
const selfBackendVerifier = new SelfBackendVerifier(
    'self-playground',
    'https://playground.self.xyz/api/verify',
    false, // mockPassport: false = mainnet, true = staging/testnet
    AllIds,
    new DefaultConfigStore({
        minimumAge: 18,
        ofac: true,
    }),
    'uuid' // userIdentifierType
);

export async function POST(req: Request) {
    try {
        const { attestationId, proof, publicSignals, userContextData } = await req.json();

        if (!proof || !publicSignals || !attestationId || !userContextData) {
            return NextResponse.json(
                {
                    message: 'Proof, publicSignals, attestationId and userContextData are required',
                },
                { status: 200 }
            );
        }

        const result = await selfBackendVerifier.verify(
            attestationId,
            proof,
            publicSignals,
            userContextData
        );

        if (result.isValidDetails.isValid) {
            return NextResponse.json({
                status: 'success',
                result: true,
                credentialSubject: result.discloseOutput,
            });
        } else {
            return NextResponse.json(
                {
                    status: 'error',
                    result: false,
                    reason: 'Verification failed',
                    error_code: 'VERIFICATION_FAILED',
                    details: result.isValidDetails,
                },
                { status: 200 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 'error',
                result: false,
                reason: error instanceof Error ? error.message : 'Unknown error',
                error_code: 'UNKNOWN_ERROR',
            },
            { status: 200 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, message: 'Identity verification endpoint' });
}


