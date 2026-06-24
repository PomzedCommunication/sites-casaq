'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    buildUrlWithPreviewDomain,
    clearContactToken,
    logoutContactAccountClient,
} from '@/lib/contact-auth-client';

type Props = {
    previewDomain?: string | null;
    contactName?: string | null;
    onLogout?: () => void;
    active?: 'dashboard' | 'criteres' | 'correspondances' | 'favoris' | 'informations' | 'notifications';
};
export function AccountSidebar({ previewDomain, contactName, onLogout, active }: Props) {
    const router = useRouter();
    const [displayName, setDisplayName] = useState<string | null>(contactName || null);

    useEffect(() => {
        if (contactName) {
            setDisplayName(contactName);
            localStorage.setItem('casaq_contact_name', contactName);
            return;
        }

        setDisplayName(localStorage.getItem('casaq_contact_name'));

        function handleContactNameChange() {
            setDisplayName(localStorage.getItem('casaq_contact_name'));
        }

        window.addEventListener('storage', handleContactNameChange);
        window.addEventListener('casaq-contact-name', handleContactNameChange);

        return () => {
            window.removeEventListener('storage', handleContactNameChange);
            window.removeEventListener('casaq-contact-name', handleContactNameChange);
        };
    }, [contactName]);

    async function handleLogout() {
        if (onLogout) {
            onLogout();
            return;
        }

        await logoutContactAccountClient();
        clearContactToken();

        localStorage.removeItem('casaq_contact_name');
        window.dispatchEvent(new Event('casaq-contact-name'));

        router.replace(buildUrlWithPreviewDomain('/login', previewDomain));
    }
    return (
        <aside className="account-sidebar">
            <div className="account-sidebar__head">
                <p>Espace client</p>
                <h2>{displayName || 'Mon compte'}</h2>
            </div>

            <nav className="account-menu">
                <AccountLink
                    href="/mon-compte"
                    label="Tableau de bord"
                    active={active === 'dashboard'}
                    previewDomain={previewDomain}
                />

                <AccountLink
                    href="/mon-compte/criteres"
                    label="Mes critères de recherche"
                    active={active === 'criteres'}
                    previewDomain={previewDomain}
                />

                <AccountLink
                    href="/mon-compte/correspondances"
                    label="Correspondances"
                    active={active === 'correspondances'}
                    previewDomain={previewDomain}
                />

                <AccountLink
                    href="/mon-compte/favoris"
                    label="Mes favoris"
                    active={active === 'favoris'}
                    previewDomain={previewDomain}
                />

                <AccountLink
                    href="/mon-compte/informations"
                    label="Informations personnelles"
                    active={active === 'informations'}
                    previewDomain={previewDomain}
                />

                <AccountLink
                    href="/mon-compte/notifications"
                    label="Paramètres et notifications"
                    active={active === 'notifications'}
                    previewDomain={previewDomain}
                />

                <button
                    type="button"
                    className="account-menu__link account-menu__link--logout"
                    onClick={handleLogout}
                >
                    Déconnexion
                </button>
            </nav>
        </aside>
    );
}

function AccountLink({
                         href,
                         label,
                         active,
                         previewDomain,
                     }: {
    href: string;
    label: string;
    active?: boolean;
    previewDomain?: string | null;
}) {
    return (
        <Link
            href={buildUrlWithPreviewDomain(href, previewDomain)}
            className={
                active
                    ? 'account-menu__link account-menu__link--active'
                    : 'account-menu__link'
            }
        >
            {label}
        </Link>
    );
}