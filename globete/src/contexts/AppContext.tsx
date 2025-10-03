"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type NetworkType = 'alfajores' | 'mainnet';
export type TransactionStatus = 'pending' | 'confirmed' | 'settled' | 'failed';
export type TransactionDirection = 'sent' | 'received';
export type TokenType = 'cCOP' | 'cUSD' | 'cEUR';

export interface Network {
    name: string;
    chainId: number;
    type: NetworkType;
}

export interface Session {
    walletAddress: string | null;
    isConnected: boolean;
    network: Network;
    cameraPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export interface Balance {
    cCOP: string;
    cUSD: string;
    cEUR: string;
}

export interface Transaction {
    id: string;
    direction: TransactionDirection;
    amount: string; // in token units (wei)
    amountCOP: number; // display amount in COP
    token: TokenType;
    counterparty: {
        address: string;
        name?: string;
        alias?: string;
    };
    status: TransactionStatus;
    timestamp: string; // ISO string
    note?: string;
    hashes: {
        txHash?: string;
        brebRef?: string;
        internalRef: string;
    };
    fee?: string; // in token units
}

interface AppContextType {
    session: Session;
    balances: Balance;
    transactions: Transaction[];
    setWalletAddress: (address: string) => void;
    setNetwork: (network: Network) => void;
    setCameraPermission: (permission: Session['cameraPermission']) => void;
    updateBalances: (balances: Partial<Balance>) => void;
    addTransaction: (transaction: Transaction) => void;
    disconnect: () => void;
}

const NETWORKS: Record<NetworkType, Network> = {
    alfajores: {
        name: 'Celo Alfajores',
        chainId: 44787,
        type: 'alfajores'
    },
    mainnet: {
        name: 'Celo Mainnet',
        chainId: 42220,
        type: 'mainnet'
    }
};

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx-001',
        direction: 'sent',
        amount: '50000000000000000000', // 50 cCOP
        amountCOP: 50000,
        token: 'cCOP',
        counterparty: {
            address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
            name: 'Maria García',
            alias: '@mariag'
        },
        status: 'settled',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        note: 'Pago almuerzo 🍕',
        hashes: {
            txHash: '0x1234...5678',
            brebRef: 'BREB-2025-001234',
            internalRef: 'INT-001'
        },
        fee: '100000000000000' // 0.0001 cCOP
    },
    {
        id: 'tx-002',
        direction: 'received',
        amount: '150000000000000000000', // 150 cCOP
        amountCOP: 150000,
        token: 'cCOP',
        counterparty: {
            address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
            name: 'Carlos Rodríguez',
            alias: '@carlosr'
        },
        status: 'settled',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        note: 'Pago por servicio',
        hashes: {
            txHash: '0x9876...4321',
            brebRef: 'BREB-2025-001233',
            internalRef: 'INT-002'
        }
    },
    {
        id: 'tx-003',
        direction: 'sent',
        amount: '25000000000000000000', // 25 cCOP
        amountCOP: 25000,
        token: 'cCOP',
        counterparty: {
            address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            alias: '@tienda_local'
        },
        status: 'settled',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        hashes: {
            txHash: '0xabcd...ef01',
            brebRef: 'BREB-2025-001230',
            internalRef: 'INT-003'
        },
        fee: '100000000000000'
    },
    {
        id: 'tx-004',
        direction: 'received',
        amount: '200000000000000000000', // 200 cCOP
        amountCOP: 200000,
        token: 'cCOP',
        counterparty: {
            address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
            name: 'Ana Martínez'
        },
        status: 'settled',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        note: 'Reembolso',
        hashes: {
            txHash: '0xdef0...1234',
            brebRef: 'BREB-2025-001225',
            internalRef: 'INT-004'
        }
    },
    {
        id: 'tx-005',
        direction: 'sent',
        amount: '75000000000000000000', // 75 cCOP
        amountCOP: 75000,
        token: 'cCOP',
        counterparty: {
            address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
            name: 'Supermercado El Ahorro'
        },
        status: 'settled',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        note: 'Compras del mes',
        hashes: {
            txHash: '0x5678...abcd',
            brebRef: 'BREB-2025-001220',
            internalRef: 'INT-005'
        },
        fee: '100000000000000'
    },
    {
        id: 'tx-006',
        direction: 'sent',
        amount: '10000000000000000000', // 10 cCOP
        amountCOP: 10000,
        token: 'cCOP',
        counterparty: {
            address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
            alias: '@cafe_central'
        },
        status: 'pending',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        note: 'Café ☕',
        hashes: {
            txHash: '0x1111...2222',
            internalRef: 'INT-006'
        },
        fee: '100000000000000'
    }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session>({
        walletAddress: null,
        isConnected: false,
        network: NETWORKS.alfajores, // Default to Alfajores for testing
        cameraPermission: 'unknown'
    });

    const [balances, setBalances] = useState<Balance>({
        cCOP: '0',
        cUSD: '0',
        cEUR: '0'
    });

    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

    // Load from localStorage on mount
    useEffect(() => {
        const savedAddress = localStorage.getItem('wallet_address');
        const savedNetwork = localStorage.getItem('network');
        const savedPermission = localStorage.getItem('camera_permission') as Session['cameraPermission'] | null;

        if (savedAddress) {
            setSession(prev => ({
                ...prev,
                walletAddress: savedAddress,
                isConnected: true
            }));
        }

        if (savedNetwork && (savedNetwork === 'alfajores' || savedNetwork === 'mainnet')) {
            setSession(prev => ({
                ...prev,
                network: NETWORKS[savedNetwork as NetworkType]
            }));
        }

        if (savedPermission) {
            setSession(prev => ({
                ...prev,
                cameraPermission: savedPermission
            }));
        }
    }, []);

    const setWalletAddress = (address: string) => {
        localStorage.setItem('wallet_address', address);
        setSession(prev => ({
            ...prev,
            walletAddress: address,
            isConnected: true
        }));
    };

    const setNetwork = (network: Network) => {
        localStorage.setItem('network', network.type);
        setSession(prev => ({
            ...prev,
            network
        }));
    };

    const setCameraPermission = (permission: Session['cameraPermission']) => {
        localStorage.setItem('camera_permission', permission);
        setSession(prev => ({
            ...prev,
            cameraPermission: permission
        }));
    };

    const updateBalances = (newBalances: Partial<Balance>) => {
        setBalances(prev => ({
            ...prev,
            ...newBalances
        }));
    };

    const addTransaction = (transaction: Transaction) => {
        setTransactions(prev => [transaction, ...prev]);
    };

    const disconnect = () => {
        localStorage.removeItem('wallet_address');
        setSession(prev => ({
            ...prev,
            walletAddress: null,
            isConnected: false
        }));
        setBalances({
            cCOP: '0',
            cUSD: '0',
            cEUR: '0'
        });
        setTransactions([]); // Clear transactions on disconnect
    };

    return (
        <AppContext.Provider
            value={{
                session,
                balances,
                transactions,
                setWalletAddress,
                setNetwork,
                setCameraPermission,
                updateBalances,
                addTransaction,
                disconnect
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export { NETWORKS };

