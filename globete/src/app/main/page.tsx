"use client";

import { useEffect, useState } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { celo } from 'viem/chains';
import { useApp, NETWORKS } from '@/contexts/AppContext';

// Create a viem public client for Celo mainnet using Forno RPC
const celoPublicClient = createPublicClient({
    chain: {
        ...celo,
        id: 42220, // ensure mainnet id
        rpcUrls: {
            default: { http: ['https://forno.celo.org'] },
            public: { http: ['https://forno.celo.org'] }
        }
    },
    transport: http('https://forno.celo.org')
});

export default function MainPage() {
    const { setWalletAddress, setNetwork } = useApp();
    const [rpcStatus, setRpcStatus] = useState<'idle' | 'ok' | 'error'>('idle');
    const [rpcChainId, setRpcChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
    const [connectError, setConnectError] = useState<string | null>(null);

    function shortenAddress(address: string) {
        return address.length > 10
            ? `${address.slice(0, 6)}…${address.slice(-4)}`
            : address;
    }

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const id = await celoPublicClient.getChainId();
                if (!isMounted) return;
                setRpcChainId(id);
                setRpcStatus('ok');
            } catch {
                if (!isMounted) return;
                setRpcStatus('error');
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    async function handleConnect() {
        setIsConnecting(true);
        setConnectError(null);
        try {
            if (typeof window === 'undefined' || !(window as any).ethereum) {
                throw new Error('No injected wallet found');
            }

            const walletClient = createWalletClient({
                chain: {
                    ...celo,
                    id: 42220,
                },
                transport: custom((window as any).ethereum)
            });

            // Ensure we're on Celo mainnet
            try {
                await (window as any).ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xa4ec' }]
                });
            } catch (switchErr: any) {
                // If chain not added, try to add
                if (switchErr?.code === 4902) {
                    await (window as any).ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0xa4ec',
                            chainName: 'Celo Mainnet',
                            nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
                            rpcUrls: ['https://forno.celo.org'],
                            blockExplorerUrls: ['https://celoscan.io']
                        }]
                    });
                } else {
                    throw switchErr;
                }
            }

            const accounts = await walletClient.requestAddresses();
            const primary = accounts?.[0] ?? null;
            setConnectedAddress(primary);
            if (primary) {
                setWalletAddress(primary);
                setNetwork(NETWORKS.mainnet);
            }
            // Redirect to identity verification after connection
            if (accounts && accounts[0]) {
                window.location.href = '/main/identity-verification';
            }
        } catch (err: any) {
            setConnectError(err?.message || 'Failed to connect');
        } finally {
            setIsConnecting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-4">
            <div className="w-full max-w-md text-center">
                <div className="mb-6">
                    <span className="text-7xl">🎈</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    Connect a wallet to continue
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Connect your wallet to proceed.
                </p>
                <div className="space-y-3">
                    <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
                        aria-label="Connect Wallet"
                    >
                        {isConnecting ? 'Connecting…' : connectedAddress ? 'Connected' : 'Connect Wallet'}
                    </button>
                    {connectedAddress && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Connected: <span className="font-mono">{shortenAddress(connectedAddress)}</span>
                        </div>
                    )}
                    {connectError && (
                        <div className="text-sm text-red-600 dark:text-red-400">
                            {connectError}
                        </div>
                    )}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: rpcStatus === 'ok' ? '#22c55e' : rpcStatus === 'error' ? '#ef4444' : '#a3a3a3' }}
                    />
                    <span>Celo mainnet</span>
                    <span>•</span>
                    <span>chainId {rpcChainId ?? '…'}</span>
                    <span>•</span>
                    <span>{rpcStatus === 'ok' ? 'RPC connected' : rpcStatus === 'error' ? 'RPC error' : 'Checking RPC…'}</span>
                </div>
                <div className="mt-10 text-xs text-gray-500 dark:text-gray-400">
                    Powered by Celo • Bre-B • Mento
                </div>
            </div>
        </div>
    );
}

