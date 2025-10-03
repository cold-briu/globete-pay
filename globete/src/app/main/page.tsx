"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to init on first load
        router.push('/main/init');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="text-6xl mb-4">🎈</div>
                <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
            </div>
        </div>
    );
}

