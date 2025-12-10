"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { useApp, NETWORKS } from '@/contexts/AppContext';

export default function MainPage() {
    const { session, setWalletAddress, setNetwork } = useApp();
    const router = useRouter();
    const [rpcStatus, setRpcStatus] = useState<'idle' | 'ok' | 'error'>('idle');
    const [rpcChainId, setRpcChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
    const [connectError, setConnectError] = useState<string | null>(null);
    const [showWalletModal, setShowWalletModal] = useState(false);

    function shortenAddress(address: string) {
        return address.length > 10
            ? `${address.slice(0, 6)}…${address.slice(-4)}`
            : address;
    }

    // Public client for selected network (for status check)
    const publicClient = useMemo(() => {
        if (session.network.type === 'mainnet') {
            return createPublicClient({
                chain: {
                    ...celo,
                    id: 42220,
                    rpcUrls: {
                        default: { http: ['https://forno.celo.org'] },
                        public: { http: ['https://forno.celo.org'] }
                    }
                },
                transport: http('https://forno.celo.org')
            });
        }
        return createPublicClient({
            chain: {
                ...celoAlfajores,
                id: 11142220,
                rpcUrls: {
                    default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
                    public: { http: ['https://forno.celo-sepolia.celo-testnet.org'] }
                }
            },
            transport: http('https://forno.celo-sepolia.celo-testnet.org')
        });
    }, [session.network.type]);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const id = await publicClient.getChainId();
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
    }, [publicClient]);

    // If wallet already connected, send users to identity verification
    useEffect(() => {
        if (session?.isConnected && session.walletAddress) {
            router.replace('/main/identity-verification');
        }
    }, [session?.isConnected, session?.walletAddress, router]);

    async function connectWithInjected() {
        setIsConnecting(true);
        setConnectError(null);
        try {
            if (typeof window === 'undefined' || !(window as any).ethereum) {
                throw new Error('No injected wallet found');
            }

            const isMainnet = session.network.type === 'mainnet';
            const target = isMainnet
                ? {
                    chainId: 42220,
                    chainIdHex: '0xa4ec',
                    chainName: 'Celo Mainnet',
                    rpcUrl: 'https://forno.celo.org',
                    explorer: 'https://celoscan.io',
                    chain: celo
                }
                : {
                    chainId: 11142220,
                    chainIdHex: '0xaa044c',
                    chainName: 'Celo Sepolia',
                    rpcUrl: 'https://forno.celo-sepolia.celo-testnet.org',
                    explorer: 'https://celo-sepolia.blockscout.com',
                    chain: celoAlfajores
                };

            const walletClient = createWalletClient({
                chain: {
                    ...target.chain,
                    id: target.chainId,
                },
                transport: custom((window as any).ethereum)
            });

            // Ensure we're on the selected Celo network
            try {
                await (window as any).ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: target.chainIdHex }]
                });
            } catch (switchErr: any) {
                // If chain not added, try to add
                if (switchErr?.code === 4902) {
                    await (window as any).ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: target.chainIdHex,
                            chainName: target.chainName,
                            nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
                            rpcUrls: [target.rpcUrl],
                            blockExplorerUrls: [target.explorer]
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
                setNetwork(isMainnet ? NETWORKS.mainnet : NETWORKS.sepolia);
            }
            // Redirect to identity verification after connection (client-side to preserve context)
            if (accounts && accounts[0]) {
                router.push('/main/identity-verification');
            }
        } catch (err: any) {
            setConnectError(err?.message || 'Failed to connect');
        } finally {
            setIsConnecting(false);
        }
    }

    async function handleConnect() {
        setConnectError(null);
        // If user manually disconnected previously, prompt wallet selection
        try {
            const mustSelect = localStorage.getItem('wallet_autoconnect_disabled') === '1';
            if (mustSelect) {
                setShowWalletModal(true);
                return;
            }
        } catch {
            // ignore storage read errors and proceed
        }
        await connectWithInjected();
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
                    <span>{session.network.type === 'mainnet' ? 'Celo mainnet' : 'Celo Sepolia'}</span>
                    <span>•</span>
                    <span>chainId {rpcChainId ?? '…'}</span>
                    <span>•</span>
                    <span>{rpcStatus === 'ok' ? 'RPC connected' : rpcStatus === 'error' ? 'RPC error' : 'Checking RPC…'}</span>
                </div>
                <div className="mt-10 text-xs text-gray-500 dark:text-gray-400">
                    Powered by Celo • Bre-B • Mento
                </div>
            </div>
            {showWalletModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowWalletModal(false)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a wallet</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Choose how you want to connect.
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={async () => {
                                    setShowWalletModal(false);
                                    await connectWithInjected();
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="text-sm text-gray-900 dark:text-gray-100">Browser Wallet</span>
                                <span className="text-xs text-gray-500">Injected</span>
                            </button>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowWalletModal(false)}
                                className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

