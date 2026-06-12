import type { ReactNode } from 'react';
import { AccountSidebar } from '@/components/site/account/AccountSidebar';

type Props = {
    children: ReactNode;
    previewDomain?: string | null;
    active?: 'dashboard' | 'criteres' | 'correspondances' | 'favoris' | 'informations' | 'notifications';
};

export function AccountShell({ children, previewDomain, active }: Props) {
    return (
        <main className="account-shell">
            <AccountSidebar previewDomain={previewDomain} active={active} />

            <section className="account-content">
                {children}
            </section>
        </main>
    );
}