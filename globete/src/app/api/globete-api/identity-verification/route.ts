import { NextResponse } from 'next/server';
import { SelfBackendVerifier, AllIds, DefaultConfigStore } from '@selfxyz/core';

// FIXME: Unsupported number of inputs: 0 eslint

let selfBackendVerifier: SelfBackendVerifier | null = null;
function getVerifier() {
    if (!selfBackendVerifier) {
        selfBackendVerifier = new SelfBackendVerifier(
            'globete-pay-staging',
            // use ngrok to test the endpoint
            '/api/globete-api/identity-verification',
            true,
            AllIds,
            new DefaultConfigStore({ minimumAge: 18 }),
            'hex'
        );
    }
    return selfBackendVerifier;
}


export async function POST(req: Request) {
    try {
        const { attestationId, proof, publicSignals, userContextData } = await req.json();
        selfBackendVerifier = getVerifier();
        if (!selfBackendVerifier) {
            return NextResponse.json(
                {
                    message: 'Verifier not found',
                },
                { status: 200 }
            );
        }
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
    selfBackendVerifier = getVerifier();
    if (!selfBackendVerifier) {
        return NextResponse.json(
            {
                message: 'Verifier not found',
            },
            { status: 200 }
        );
    }
    return NextResponse.json({ ok: true, message: 'Identity verification endpoint', selfBackendVerifier: `${selfBackendVerifier ? selfBackendVerifier : 'no verifier'}` });
}



