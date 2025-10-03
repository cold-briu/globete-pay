"use client";

import Link from 'next/link';

export default function SendPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/main/dashboard"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                        <span>←</span> Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-200 dark:border-gray-700 text-center">
                    <div className="text-6xl mb-4">🚧</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Send Payment
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        This feature is coming soon!
                    </p>
                </div>
            </div>
        </div>
    );
}

