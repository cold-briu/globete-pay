"use client";

import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { shortenAddress, formatTokenAmount, formatCOP } from '@/lib/utils';
import { TransactionItem } from '@/components/TransactionItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

export default function DashboardPage() {
    const router = useRouter();
    const { session, balances, transactions, transactionsLoading, disconnect } = useApp();

    // Public client for Celo mainnet
    const publicClient = useMemo(() => {
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
    }, []);

    // Minimal ERC20 ABI (balanceOf)
    const erc20Abi = [
        {
            type: 'function',
            name: 'balanceOf',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }]
        }
    ] as const;

    const [tokenBalances, setTokenBalances] = useState<{
        CELO: string;
        cCOP: string;
        cUSD: string;
        cREAL: string;
        cEUR: string;
    }>({
        CELO: '0',
        cCOP: '0',
        cUSD: '0',
        cREAL: '0',
        cEUR: '0'
    });

    const [balancesLoading, setBalancesLoading] = useState<boolean>(false);
    const [displayCurrency, setDisplayCurrency] = useState<'COP' | 'USD' | 'EUR'>('COP');

    useEffect(() => {
        let isMounted = true;
        const fetchBalances = async () => {
            if (!session?.walletAddress || !session?.isConnected) return;
            try {
                setBalancesLoading(true);
                const address = session.walletAddress as `0x${string}`;

                // Native CELO
                const celoBal = await publicClient.getBalance({ address });

                // ERC20 tokens
                const [cCOPBal, cUSDBal, cREALBal, cEURBal] = await Promise.all([
                    publicClient.readContract({
                        address: '0x8a567e2ae79ca692bd748ab832081c45de4041ea',
                        abi: erc20Abi,
                        functionName: 'balanceOf',
                        args: [address]
                    } as any),
                    publicClient.readContract({
                        address: '0x765de816845861e75a25fca122bb6898b8b1282a',
                        abi: erc20Abi,
                        functionName: 'balanceOf',
                        args: [address]
                    } as any),
                    publicClient.readContract({
                        address: '0xe8537a3d056da446677b9e9d6c5db704eaab4787',
                        abi: erc20Abi,
                        functionName: 'balanceOf',
                        args: [address]
                    } as any),
                    publicClient.readContract({
                        address: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
                        abi: erc20Abi,
                        functionName: 'balanceOf',
                        args: [address]
                    } as any)
                ]);

                if (!isMounted) return;
                setTokenBalances({
                    CELO: celoBal.toString(),
                    cCOP: (cCOPBal as bigint).toString(),
                    cUSD: (cUSDBal as bigint).toString(),
                    cREAL: (cREALBal as bigint).toString(),
                    cEUR: (cEURBal as bigint).toString()
                });
            } catch {
                if (!isMounted) return;
                setTokenBalances({
                    CELO: '0',
                    cCOP: '0',
                    cUSD: '0',
                    cREAL: '0',
                    cEUR: '0'
                });
            } finally {
                if (isMounted) setBalancesLoading(false);
            }
        };
        fetchBalances();
        return () => {
            isMounted = false;
        };
    }, [publicClient, session?.walletAddress, session?.isConnected]);

    // Human-readable amounts (18 decimals → 2 display decimals)
    const humanCELO = formatTokenAmount(tokenBalances.CELO, 18, 2);
    const humanCCOP = formatTokenAmount(tokenBalances.cCOP, 18, 2);
    const humanCUSD = formatTokenAmount(tokenBalances.cUSD, 18, 2);
    const humanCREAL = formatTokenAmount(tokenBalances.cREAL, 18, 2);
    const humanCEUR = formatTokenAmount(tokenBalances.cEUR, 18, 2);

    // Static prices and FX (placeholder values)
    const STATIC = {
        USD_PER_CELO: 0.75,
        USD_PER_COP: 0.00025,
        USD_PER_BRL: 0.20,
        USD_PER_EUR: 1.08
    };

    const amtCELO = parseFloat(humanCELO) || 0;
    const amtCCOP = parseFloat(humanCCOP) || 0;
    const amtCUSD = parseFloat(humanCUSD) || 0;
    const amtCREAL = parseFloat(humanCREAL) || 0;
    const amtCEUR = parseFloat(humanCEUR) || 0;

    // Convert each token to USD using static prices, then convert to selected currency
    const totalUSD =
        amtCELO * STATIC.USD_PER_CELO +
        amtCCOP * STATIC.USD_PER_COP +
        amtCUSD * 1 +
        amtCREAL * STATIC.USD_PER_BRL +
        amtCEUR * STATIC.USD_PER_EUR;

    const totalInSelected =
        displayCurrency === 'USD'
            ? totalUSD
            : displayCurrency === 'EUR'
                ? (STATIC.USD_PER_EUR > 0 ? totalUSD / STATIC.USD_PER_EUR : 0)
                : (STATIC.USD_PER_COP > 0 ? totalUSD / STATIC.USD_PER_COP : 0); // COP

    const formatFiat = (amount: number, currency: 'USD' | 'EUR') =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header with Network Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>{session.network.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {session.walletAddress && (
                                <div className="text-sm font-mono">
                                    {shortenAddress(session.walletAddress)}
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    try {
                                        localStorage.setItem('wallet_autoconnect_disabled', '1');
                                    } catch {
                                        // ignore
                                    }
                                    disconnect();
                                    router.replace('/main');
                                }}
                                className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                                aria-label="Disconnect Wallet"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to Globete Pay 🎈
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your instant crypto payment app for Colombia
                    </p>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="text-white/80 text-sm">Total Balance</div>
                        <div className="flex gap-1 bg-white/10 rounded-lg p-1 border border-white/20">
                            {(['COP', 'USD', 'EUR'] as const).map(cur => (
                                <button
                                    key={cur}
                                    onClick={() => setDisplayCurrency(cur)}
                                    className={`text-xs px-2 py-1 rounded-md transition-colors ${displayCurrency === cur
                                        ? 'bg-white text-gray-900'
                                        : 'text-white/80 hover:bg-white/20'
                                        }`}
                                    aria-label={`Show total in ${cur}`}
                                >
                                    {cur}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-white text-4xl sm:text-5xl font-bold mb-4">
                        {balancesLoading
                            ? '…'
                            : displayCurrency === 'COP'
                                ? formatCOP(totalInSelected)
                                : formatFiat(totalInSelected, displayCurrency)}
                    </div>
                    <div className="text-white/70 text-sm flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-full bg-white/15 border border-white/20">
                            CELO {balancesLoading ? '…' : humanCELO}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/15 border border-white/20">
                            cCOP {balancesLoading ? '…' : humanCCOP}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/15 border border-white/20">
                            cUSD {balancesLoading ? '…' : humanCUSD}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/15 border border-white/20">
                            cREAL {balancesLoading ? '…' : humanCREAL}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/15 border border-white/20">
                            cEUR {balancesLoading ? '…' : humanCEUR}
                        </span>
                    </div>

                    {/* Removed token selector placeholder; showing live balances as badges */}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link
                        href="/main/send"
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📤</div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Send</span>
                    </Link>
                    <Link
                        href="/main/receive"
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center group"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📥</div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Receive</span>
                    </Link>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Recent Transactions
                        </h2>
                        {transactions.length > 5 && (
                            <Link
                                href="/main/activity"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View All
                            </Link>
                        )}
                    </div>

                    {transactionsLoading ? (
                        /* Loader */
                        <div className="space-y-2 animate-pulse">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
                                            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
                                        </div>
                                    </div>
                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-500 dark:text-gray-400 mb-2">No transactions yet</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Start by sending or receiving payments
                            </p>
                        </div>
                    ) : (
                        /* Transaction List */
                        <div className="space-y-1">
                            {transactions.slice(0, 5).map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <Link
                        href="/main/activity"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        View All Activity
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <Link
                        href="/main/settings"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}

