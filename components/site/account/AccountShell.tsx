import type { ReactNode } from 'react';
import { AccountSidebar } from '@/components/site/account/AccountSidebar';

type Props = {
    children: ReactNode;
    previewDomain?: string | null;
    contactName?: string | null;
    onLogout?: () => void;
    active?: 'dashboard' | 'criteres' | 'correspondances' | 'favoris' | 'informations' | 'notifications';
};

export function AccountShell({ children, previewDomain, contactName, onLogout, active }: Props) {
    return (
        <main className="account-shell">
            <AccountSidebar
                previewDomain={previewDomain}
                contactName={contactName}
                onLogout={onLogout}
                active={active}
            />

            <section className="account-content">
                {children}
            </section>
        </main>
    );
}