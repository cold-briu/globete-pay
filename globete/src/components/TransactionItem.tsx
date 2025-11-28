import Link from 'next/link';
import type { Transaction } from '@/contexts/types';
import { formatCOP, formatDateTime } from '@/lib/utils';

interface TransactionItemProps {
    transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
    const { direction, counterparty, amountCOP, status, timestamp, note } = transaction;

    const getStatusColor = () => {
        switch (status) {
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
        switch (status) {
            case 'settled':
                return 'Settled';
            case 'confirmed':
                return 'Confirmed';
            case 'pending':
                return 'Pending';
            case 'failed':
                return 'Failed';
            default:
                return status;
        }
    };

    const displayName = counterparty.name || counterparty.alias || counterparty.address.substring(0, 10) + '...';
    const isSent = direction === 'sent';

    return (
        <Link
            href={`/main/tx/${transaction.id}`}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
        >
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isSent
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                <span className="text-2xl">{isSent ? '📤' : '📥'}</span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {displayName}
                        </p>
                        {note && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {note}
                            </p>
                        )}
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className={`font-semibold ${isSent
                            ? 'text-gray-900 dark:text-white'
                            : 'text-green-600 dark:text-green-400'
                            }`}>
                            {isSent ? '-' : '+'}{formatCOP(amountCOP)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(timestamp)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor()}`}>
                        {getStatusText()}
                    </span>
                </div>
            </div>
        </Link>
    );
}

