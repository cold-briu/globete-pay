"use client";

import React, { useEffect, useState } from 'react';
import { getUniversalLink } from "@selfxyz/core";
import { SelfQRcodeWrapper, SelfAppBuilder, type SelfApp } from "@selfxyz/qrcode";
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';

export default function IdentityVerificationPage() {
    const { session } = useApp();
    const walletAddress = session.walletAddress;
    const router = useRouter();

    const [universalLink, setUniversalLink] = useState("");

    const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!walletAddress) {
            router.replace('/main');
            return;
        }
        setError(null);
        setSelfApp(null);
        try {
            const app = new SelfAppBuilder({
                version: 2,
                appName: "Globete Pay",
                scope: "globete-pay",
                endpoint: '/api/identity-verification',
                logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
                userId: walletAddress,
                devMode: false,
                endpointType: "staging_https",
                userIdType: "hex",
                userDefinedData: "Hello World",
                disclosures: {
                    //check the API reference for more disclose attributes!
                    minimumAge: 18,
                }
            }).build();
            // Optional: universal link available if needed
            setUniversalLink(getUniversalLink(app));
            setSelfApp(app);
            console.log("selfApp built:", app);

        } catch (e: any) {
            setError(e?.message || 'Failed to initialize Self app');
        }
    }, [walletAddress, router]);

    const handleSuccessfulVerification = () => {
        router.replace('/main/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Identity Verification
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Scan this QR code with the Self app
                </p>

                {!walletAddress && (
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Connect your wallet first on the main page.
                    </div>
                )}

                {walletAddress && !selfApp && !error && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Loading QR Code...
                    </div>
                )}

                {error && (
                    <div className="text-sm text-red-600 dark:text-red-400">
                        {error}
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                            >
                                try again
                            </button>
                        </div>
                    </div>
                )}

                {walletAddress && selfApp && error === null && (
                    <div className="mx-auto max-w-[280px] sm:max-w-[320px]">
                        <SelfQRcodeWrapper
                            selfApp={selfApp}
                            onSuccess={handleSuccessfulVerification}
                            onError={() => {
                                console.log("onError");
                                setError('Error: Failed to verify identity');
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}


