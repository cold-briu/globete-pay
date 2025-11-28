import { NextResponse } from 'next/server';
import type { Transaction } from '@/contexts/types';
import rawMockTransactions from '@/contexts/mockTransactions.json';

// Prepare mock transactions from JSON (fill missing timestamps)
const MOCK_TRANSACTIONS: Transaction[] = (rawMockTransactions as unknown as Transaction[]).map(t => ({
    ...t,
    timestamp: t.timestamp && t.timestamp.length > 0 ? t.timestamp : new Date().toISOString()
}));

export async function GET() {
    try {
        return NextResponse.json({ transactions: MOCK_TRANSACTIONS }, { status: 200 });
    } catch {
        return NextResponse.json({ transactions: [] }, { status: 200 });
    }
}


