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

export interface AppContextType {
    session: Session;
    balances: Balance;
    transactions: Transaction[];
    transactionsLoading: boolean;
    setWalletAddress: (address: string) => void;
    setNetwork: (network: Network) => void;
    setCameraPermission: (permission: Session['cameraPermission']) => void;
    updateBalances: (balances: Partial<Balance>) => void;
    addTransaction: (transaction: Transaction) => void;
    disconnect: () => void;
}


