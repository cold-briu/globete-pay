import type { Transaction } from '@/contexts/types';

export async function fetchTransactions(): Promise<Transaction[]> {
    try {
        const res = await fetch('/api/globete-api/transactions', {
            method: 'GET',
            headers: { 'accept': 'application/json' },
            cache: 'no-store'
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch transactions: ${res.status}`);
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.transactions;
        if (!Array.isArray(list)) return [];
        return list as Transaction[];
    } catch {
        return [];
    }
}


