/**
 * Utility functions for Globete Pay
 */

// Format COP currency
export function formatCOP(amount: string | number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '$0 COP';

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}

// Format token amount (handles 18 decimals)
export function formatTokenAmount(amount: string, decimals: number = 18, displayDecimals: number = 2): string {
    try {
        const num = parseFloat(amount);
        if (isNaN(num)) return '0';

        // Convert from token units (wei) to human readable
        const divisor = Math.pow(10, decimals);
        const humanReadable = num / divisor;

        return humanReadable.toFixed(displayDecimals);
    } catch {
        return '0';
    }
}

// Shorten address for display
export function shortenAddress(address: string, chars: number = 4): string {
    if (!address || address.length < chars * 2 + 2) return address;
    return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

// Format date/time
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d);
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(d);
}

export function formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(d);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// Generate mock Celo address
export function generateMockAddress(): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}

// Validate Celo address
export function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Request camera permission
export async function requestCameraPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
        // Check if permissions API is available
        if (!navigator.permissions) {
            // Try to access camera directly
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
                return 'granted';
            } catch {
                return 'denied';
            }
        }

        // Use permissions API
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });

        if (result.state === 'granted') {
            return 'granted';
        } else if (result.state === 'denied') {
            return 'denied';
        } else {
            // Prompt state - try to access camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
                return 'granted';
            } catch {
                return 'denied';
            }
        }
    } catch {
        return 'prompt';
    }
}

// Convert COP to token units (wei)
export function copToTokenUnits(copAmount: string | number, decimals: number = 18): string {
    const num = typeof copAmount === 'string' ? parseFloat(copAmount) : copAmount;
    if (isNaN(num)) return '0';

    const multiplier = Math.pow(10, decimals);
    return (num * multiplier).toFixed(0);
}

// Convert token units (wei) to COP
export function tokenUnitsToCOP(tokenAmount: string, decimals: number = 18): number {
    try {
        const num = parseFloat(tokenAmount);
        if (isNaN(num)) return 0;

        const divisor = Math.pow(10, decimals);
        return num / divisor;
    } catch {
        return 0;
    }
}

