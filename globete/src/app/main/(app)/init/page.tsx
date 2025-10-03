"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { generateMockAddress, requestCameraPermission } from '@/lib/utils';

export default function InitPage() {
    const router = useRouter();
    const { session, setWalletAddress, setCameraPermission, updateBalances } = useApp();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'initializing' | 'connecting' | 'permissions' | 'ready'>('initializing');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Step 1: Initialize (show branding)
                setStatus('initializing');
                setProgress(10);
                await new Promise(resolve => setTimeout(resolve, 800));

                // Step 2: Simulate wallet connection
                setStatus('connecting');
                setProgress(40);
                await new Promise(resolve => setTimeout(resolve, 600));

                // Generate or retrieve mock wallet address
                let walletAddr = session.walletAddress;
                if (!walletAddr) {
                    walletAddr = generateMockAddress();
                    setWalletAddress(walletAddr);

                    // Mock some balances
                    updateBalances({
                        cCOP: '500000000000000000000', // 500 cCOP in wei (18 decimals)
                        cUSD: '100000000000000000000', // 100 cUSD
                        cEUR: '80000000000000000000'   // 80 cEUR
                    });
                }

                setProgress(70);
                await new Promise(resolve => setTimeout(resolve, 400));

                // Step 3: Check/request camera permission
                setStatus('permissions');
                setProgress(85);

                if (session.cameraPermission === 'unknown' || session.cameraPermission === 'prompt') {
                    const permission = await requestCameraPermission();
                    setCameraPermission(permission);
                }

                await new Promise(resolve => setTimeout(resolve, 400));

                // Step 4: Ready to go
                setStatus('ready');
                setProgress(100);
                await new Promise(resolve => setTimeout(resolve, 600));

                // Redirect to dashboard
                router.push('/main/dashboard');
            } catch (err) {
                setError('Failed to initialize app. Please refresh and try again.');
                console.error('Initialization error:', err);
            }
        };

        initializeApp();
    }, []);

    const getStatusText = () => {
        switch (status) {
            case 'initializing':
                return 'Initializing Globete Pay...';
            case 'connecting':
                return 'Connecting to Celo network...';
            case 'permissions':
                return 'Checking permissions...';
            case 'ready':
                return 'Ready to go!';
            default:
                return 'Loading...';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
            <div className="text-center max-w-md w-full">
                {/* Logo/Brand */}
                <div className="mb-8 animate-bounce">
                    <span className="text-8xl">🎈</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                    Globete Pay
                </h1>

                <p className="text-blue-100 text-lg mb-8">
                    Instant crypto payments for Colombia
                </p>

                {/* Network Badge */}
                <div className="mb-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-white text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>{session.network.name}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Status Text */}
                <p className="text-white/90 text-sm font-medium mb-4">
                    {getStatusText()}
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 bg-red-500/20 border border-red-300/30 backdrop-blur-lg text-white px-4 py-3 rounded-lg">
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-sm underline hover:no-underline"
                        >
                            Refresh page
                        </button>
                    </div>
                )}

                {/* Loading Dots */}
                {!error && (
                    <div className="flex justify-center gap-2 mt-4">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 text-white/60 text-xs">
                    <p>Powered by Celo • Bre-B • Mento</p>
                </div>
            </div>
        </div>
    );
}

