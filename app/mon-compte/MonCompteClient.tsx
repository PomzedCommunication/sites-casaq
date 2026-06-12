'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    buildUrlWithPreviewDomain,
    getContactAccountClient,
    getCurrentDomainFromBrowser,
    logoutContactAccountClient,
    type ContactAccount,
} from '@/lib/contact-auth-client';
import { AccountShell } from '@/components/site/account/AccountShell';

type Props = {
    previewDomain?: string | null;
};

export function MonCompteClient({ previewDomain }: Props) {
    const [contact, setContact] = useState<ContactAccount | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadContact() {
            const domain = getCurrentDomainFromBrowser();
            const result = await getContactAccountClient(domain);

            if (!result.success || !result.contact) {
                window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
                return;
            }

            setContact(result.contact);
            setLoading(false);
        }

        loadContact();
    }, [previewDomain]);

    async function handleLogout() {
        await logoutContactAccountClient();
        window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
    }

    return (
        <AccountShell previewDomain={previewDomain} active="dashboard">
            <div className="account-heading">
                <div>
                    <p className="account-kicker">Mon espace</p>
                    <h1>Tableau de bord</h1>
                </div>

                <button type="button" className="account-logout account-logout--top" onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>

            {loading ? (
                <div className="account-panel">
                    <p>Chargement...</p>
                </div>
            ) : (
                <>
                    <div className="account-welcome">
                        <p className="account-kicker">Bienvenue</p>
                        <h2>
                            {contact?.firstname || contact?.lastname
                                ? `${contact?.firstname || ''} ${contact?.lastname || ''}`.trim()
                                : 'dans votre espace'}
                        </h2>
                        <p>
                            Gérez vos favoris, vos critères de recherche, vos correspondances et vos informations personnelles.
                        </p>
                    </div>

                    <div className="account-dashboard-grid">
                        <Link href={buildUrlWithPreviewDomain('/mon-compte/criteres', previewDomain)} className="account-dashboard-card">
                            <span>01</span>
                            <h3>Mes critères de recherche</h3>
                            <p>Consultez et modifiez vos critères immobiliers.</p>
                        </Link>

                        <Link href={buildUrlWithPreviewDomain('/mon-compte/correspondances', previewDomain)} className="account-dashboard-card">
                            <span>02</span>
                            <h3>Correspondances</h3>
                            <p>Retrouvez les biens qui correspondent à votre recherche.</p>
                        </Link>

                        <Link href={buildUrlWithPreviewDomain('/mon-compte/favoris', previewDomain)} className="account-dashboard-card">
                            <span>03</span>
                            <h3>Mes favoris</h3>
                            <p>Accédez rapidement aux biens sauvegardés.</p>
                        </Link>

                        <Link href={buildUrlWithPreviewDomain('/mon-compte/informations', previewDomain)} className="account-dashboard-card">
                            <span>04</span>
                            <h3>Informations personnelles</h3>
                            <p>Mettez à jour vos coordonnées.</p>
                        </Link>
                    </div>
                </>
            )}
        </AccountShell>
    );
}