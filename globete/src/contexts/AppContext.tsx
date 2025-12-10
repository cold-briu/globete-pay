"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type {
    AppContextType,
    Balance,
    Network,
    NetworkType,
    Session,
    Transaction
} from '@/contexts/types';
import { fetchTransactions } from '@/services/transactions';

const NETWORKS: Record<NetworkType, Network> = {
    sepolia: {
        name: 'Celo Sepolia',
        chainId: 11142220,
        type: 'sepolia'
    },
    mainnet: {
        name: 'Celo Mainnet',
        chainId: 42220,
        type: 'mainnet'
    }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session>({
        walletAddress: null,
        isConnected: false,
        network: NETWORKS.sepolia, // Default to Sepolia for testing
        cameraPermission: 'unknown'
    });

    const [balances, setBalances] = useState<Balance>({
        cCOP: '0',
        cUSD: '0',
        cEUR: '0'
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);

    // Load persisted camera permission on mount (wallet address/network comes from provider)
    useEffect(() => {
        const savedPermission = localStorage.getItem('camera_permission') as Session['cameraPermission'] | null;
        if (savedPermission) {
            setSession(prev => ({
                ...prev,
                cameraPermission: savedPermission
            }));
        }
    }, []);

    // Load mocked transactions from API on mount
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                if (isMounted) setTransactionsLoading(true);
                const list = await fetchTransactions();
                if (isMounted) {
                    setTransactions(list);
                }
            } finally {
                if (isMounted) setTransactionsLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    const setWalletAddress = (address: string) => {
        // Clear manual disconnect flag on explicit connect
        try {
            localStorage.removeItem('wallet_autoconnect_disabled');
        } catch {
            // ignore
        }
        setSession(prev => ({
            ...prev,
            walletAddress: address,
            isConnected: true
        }));
    };

    const setNetwork = (network: Network) => {
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
        // Prevent automatic re-connection on mount unless user reconnects
        try {
            localStorage.setItem('wallet_autoconnect_disabled', '1');
        } catch {
            // ignore
        }
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

    // Sync with injected wallet provider (accounts/chain changes)
    useEffect(() => {
        if (typeof window === 'undefined' || !(window as any).ethereum) return;
        const ethereum = (window as any).ethereum;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts && accounts[0]) {
                setWalletAddress(accounts[0]);
            } else {
                disconnect();
            }
        };

        const handleChainChanged = (chainIdHex: string) => {
            try {
                const id = typeof chainIdHex === 'string' && chainIdHex.startsWith('0x')
                    ? parseInt(chainIdHex, 16)
                    : Number(chainIdHex);
                if (id === 42220) setNetwork(NETWORKS.mainnet);
                if (id === 11142220) setNetwork(NETWORKS.sepolia);
            } catch {
                // ignore
            }
        };

        // Initialize from provider on mount
        (async () => {
            try {
                // Respect manual disconnect preference
                const autoDisabled = (() => {
                    try {
                        return localStorage.getItem('wallet_autoconnect_disabled') === '1';
                    } catch {
                        return false;
                    }
                })();
                if (autoDisabled) return;
                const [accounts, chainIdHex] = await Promise.all([
                    ethereum.request({ method: 'eth_accounts' }),
                    ethereum.request({ method: 'eth_chainId' })
                ]);
                if (Array.isArray(accounts) && accounts[0]) {
                    setWalletAddress(accounts[0] as string);
                }
                if (typeof chainIdHex === 'string') {
                    handleChainChanged(chainIdHex);
                }
            } catch {
                // ignore init errors
            }
        })();

        ethereum.on?.('accountsChanged', handleAccountsChanged);
        ethereum.on?.('chainChanged', handleChainChanged);
        return () => {
            ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
            ethereum.removeListener?.('chainChanged', handleChainChanged);
        };
    }, []);

    return (
        <AppContext.Provider
            value={{
                session,
                balances,
                transactions,
                transactionsLoading,
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

