"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { TransactionItem } from '@/components/TransactionItem';

export default function ActivityPage() {
    const { transactions } = useApp();
    const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'settled' | 'pending' | 'failed'>('all');

    const filteredTransactions = transactions.filter(tx => {
        if (filter !== 'all' && tx.direction !== filter) return false;
        if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/main/dashboard"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                        <span>←</span> Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Activity History
                    </h1>

                    {/* Filters */}
                    <div className="mb-6 flex flex-wrap gap-3">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('sent')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'sent'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Sent
                            </button>
                            <button
                                onClick={() => setFilter('received')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'received'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Received
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'all'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                All Status
                            </button>
                            <button
                                onClick={() => setStatusFilter('settled')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'settled'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Settled
                            </button>
                            <button
                                onClick={() => setStatusFilter('pending')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'pending'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Pending
                            </button>
                        </div>
                    </div>

                    {/* Transaction List */}
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-500 dark:text-gray-400 mb-2">No transactions found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                Try adjusting your filters
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredTransactions.map((transaction) => (
                                <TransactionItem key={transaction.id} transaction={transaction} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

