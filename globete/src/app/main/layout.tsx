import { AppProvider } from '@/contexts/AppContext';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    );
}

