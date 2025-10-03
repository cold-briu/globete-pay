"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { formatCOP, formatDateTime, formatTime, shortenAddress, copyToClipboard } from '@/lib/utils';
import { useState } from 'react';

export default function TransactionDetailPage() {
    const params = useParams();
    const { transactions } = useApp();
    const [copied, setCopied] = useState<string | null>(null);

    const transaction = transactions.find(tx => tx.id === params.id);

    if (!transaction) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Link
                            href="/main/dashboard"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                        >
                            <span>←</span> Back to Dashboard
                        </Link>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-200 dark:border-gray-700 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Transaction Not Found
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            The transaction you're looking for doesn't exist.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isSent = transaction.direction === 'sent';
    const displayName = transaction.counterparty.name || transaction.counterparty.alias || shortenAddress(transaction.counterparty.address);

    const handleCopy = async (text: string, label: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopied(label);
            setTimeout(() => setCopied(null), 2000);
        }
    };

    const getStatusColor = () => {
        switch (transaction.status) {
            case 'settled':
                return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
            case 'confirmed':
                return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
            case 'pending':
                return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
            case 'failed':
                return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
            default:
                return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
        }
    };

    const getStatusText = () => {
        return transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/main/dashboard"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                        <span>←</span> Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className={`p-6 ${isSent ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`text-5xl ${isSent ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                                {isSent ? '📤' : '📥'}
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor()}`}>
                                {getStatusText()}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {isSent ? '-' : '+'}{formatCOP(transaction.amountCOP)}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isSent ? 'Sent to' : 'Received from'} {displayName}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-6">
                        {/* Note */}
                        {transaction.note && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Note</h3>
                                <p className="text-gray-900 dark:text-white">{transaction.note}</p>
                            </div>
                        )}

                        {/* Counterparty */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                {isSent ? 'Recipient' : 'Sender'}
                            </h3>
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                <div>
                                    {transaction.counterparty.name && (
                                        <p className="font-medium text-gray-900 dark:text-white">{transaction.counterparty.name}</p>
                                    )}
                                    {transaction.counterparty.alias && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.counterparty.alias}</p>
                                    )}
                                    <p className="text-sm text-gray-500 dark:text-gray-500 font-mono mt-1">
                                        {transaction.counterparty.address}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleCopy(transaction.counterparty.address, 'address')}
                                    className="ml-4 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {copied === 'address' ? '✓' : '📋'}
                                </button>
                            </div>
                        </div>

                        {/* Amount Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Amount</h3>
                                <p className="text-gray-900 dark:text-white font-medium">{formatCOP(transaction.amountCOP)}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.token}</p>
                            </div>
                            {transaction.fee && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Fee</h3>
                                    <p className="text-gray-900 dark:text-white font-medium">~$0.01 COP</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Network fee</p>
                                </div>
                            )}
                        </div>

                        {/* Reference IDs */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Reference IDs</h3>
                            <div className="space-y-2">
                                {transaction.hashes.txHash && (
                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction Hash</p>
                                            <p className="text-sm text-gray-900 dark:text-white font-mono truncate">{transaction.hashes.txHash}</p>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(transaction.hashes.txHash || '', 'txHash')}
                                            className="ml-4 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                                        >
                                            {copied === 'txHash' ? '✓' : '📋'}
                                        </button>
                                    </div>
                                )}
                                {transaction.hashes.brebRef && (
                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bre-B Reference</p>
                                            <p className="text-sm text-gray-900 dark:text-white font-mono truncate">{transaction.hashes.brebRef}</p>
                                        </div>
                                        <button
                                            onClick={() => handleCopy(transaction.hashes.brebRef || '', 'brebRef')}
                                            className="ml-4 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                                        >
                                            {copied === 'brebRef' ? '✓' : '📋'}
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Internal Reference</p>
                                        <p className="text-sm text-gray-900 dark:text-white font-mono truncate">{transaction.hashes.internalRef}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(transaction.hashes.internalRef, 'internalRef')}
                                        className="ml-4 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                                    >
                                        {copied === 'internalRef' ? '✓' : '📋'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Timeline</h3>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        <div className="w-0.5 h-full bg-blue-200 dark:bg-blue-900"></div>
                                    </div>
                                    <div className="pb-4">
                                        <p className="font-medium text-gray-900 dark:text-white">Created</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(transaction.timestamp)}</p>
                                    </div>
                                </div>
                                {transaction.status !== 'pending' && (
                                    <>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                                                <div className="w-0.5 h-full bg-purple-200 dark:bg-purple-900"></div>
                                            </div>
                                            <div className="pb-4">
                                                <p className="font-medium text-gray-900 dark:text-white">Submitted</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatTime(new Date(new Date(transaction.timestamp).getTime() + 2000))}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full ${transaction.status === 'settled' ? 'bg-green-600' :
                                                        transaction.status === 'failed' ? 'bg-red-600' : 'bg-gray-400'
                                                    }`}></div>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {transaction.status === 'settled' ? 'Settled' :
                                                        transaction.status === 'failed' ? 'Failed' : 'Confirmed'}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {formatTime(new Date(new Date(transaction.timestamp).getTime() + 5000))}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

