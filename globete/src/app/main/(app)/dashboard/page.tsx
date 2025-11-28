"use client";

import { useApp } from '@/contexts/AppContext';
import { shortenAddress, formatCOP, formatTokenAmount } from '@/lib/utils';
import { TransactionItem } from '@/components/TransactionItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const { session, balances, transactions, transactionsLoading, disconnect } = useApp();

    const cCOPBalance = formatTokenAmount(balances.cCOP, 18, 2);
    const cCOPInCOP = parseFloat(cCOPBalance); // 1:1 ratio for cCOP to COP

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
                    <div className="text-white/80 text-sm mb-2">Total Balance</div>
                    <div className="text-white text-4xl sm:text-5xl font-bold mb-4">
                        {formatCOP(cCOPInCOP)}
                    </div>
                    <div className="text-white/70 text-sm">
                        {cCOPBalance} cCOP
                    </div>

                    {/* Token Selector Placeholder */}
                    <div className="mt-6 flex gap-2">
                        <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors border border-white/20">
                            cCOP
                        </button>
                        <button className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white/70 text-sm font-medium hover:bg-white/20 transition-colors">
                            cUSD
                        </button>
                        <button className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white/70 text-sm font-medium hover:bg-white/20 transition-colors">
                            cEUR
                        </button>
                    </div>
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

