'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    buildUrlWithPreviewDomain,
    getContactAccountClient,
    logoutContactAccountClient,
    type ContactAccount,
} from '@/lib/contact-auth-client';
import { AccountShell } from '@/components/site/account/AccountShell';

type Props = {
    domain: string;
    previewDomain?: string | null;
};

export function MonCompteClient({ domain, previewDomain }: Props) {
    const router = useRouter();

    const [contact, setContact] = useState<ContactAccount | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loginUrl = useMemo(
        () => buildUrlWithPreviewDomain('/login', previewDomain),
        [previewDomain],
    );

    const criteresUrl = useMemo(
        () => buildUrlWithPreviewDomain('/mon-compte/criteres', previewDomain),
        [previewDomain],
    );

    const correspondancesUrl = useMemo(
        () => buildUrlWithPreviewDomain('/mon-compte/correspondances', previewDomain),
        [previewDomain],
    );

    const favorisUrl = useMemo(
        () => buildUrlWithPreviewDomain('/mon-compte/favoris', previewDomain),
        [previewDomain],
    );

    const informationsUrl = useMemo(
        () => buildUrlWithPreviewDomain('/mon-compte/informations', previewDomain),
        [previewDomain],
    );

    useEffect(() => {
        let mounted = true;

        async function loadContact() {
            setLoading(true);
            setError(null);

            const result = await getContactAccountClient(domain);

            if (!mounted) {
                return;
            }

            if (!result.success || !result.contact) {
                router.replace(loginUrl);
                return;
            }

            setContact(result.contact);
            localStorage.setItem('casaq_contact_name', getContactName(result.contact));
            window.dispatchEvent(new Event('casaq-contact-name'));

            setLoading(false);
        }

        loadContact();

        return () => {
            mounted = false;
        };
    }, [domain, loginUrl, router]);

    async function handleLogout() {
        await logoutContactAccountClient();
        router.replace(loginUrl);
    }

    return (
        <AccountShell
            previewDomain={previewDomain}
            active="dashboard"
            contactName={contact ? getContactName(contact) : null}
            onLogout={handleLogout}
        >
            <div className="account-heading">
                <div>
                    <p className="account-kicker">Mon espace</p>
                    <h1>Tableau de bord</h1>
                </div>

                {/*{!loading ? (*/}
                {/*    <button*/}
                {/*        type="button"*/}
                {/*        className="account-logout account-logout--top"*/}
                {/*        onClick={handleLogout}*/}
                {/*    >*/}
                {/*        Déconnexion*/}
                {/*    </button>*/}
                {/*) : null}*/}
            </div>

            {loading ? (
                <div className="account-panel">
                    <p>Chargement de votre espace...</p>
                </div>
            ) : null}

            {error ? (
                <div className="account-panel">
                    <p className="account-message account-message--error">
                        {error}
                    </p>
                </div>
            ) : null}

            {!loading && !error && contact ? (
                <>

                    <div className="account-dashboard-grid">
                        <Link href={criteresUrl} className="account-dashboard-card">
                            <span>01</span>
                            <h3>Mes critères de recherche</h3>
                            <p>Consultez et modifiez vos critères immobiliers.</p>
                        </Link>

                        <Link href={correspondancesUrl} className="account-dashboard-card">
                            <span>02</span>
                            <h3>Correspondances</h3>
                            <p>Retrouvez les biens qui correspondent à votre recherche.</p>
                        </Link>

                        <Link href={favorisUrl} className="account-dashboard-card">
                            <span>03</span>
                            <h3>Mes favoris</h3>
                            <p>Accédez rapidement aux biens sauvegardés.</p>
                        </Link>

                        <Link href={informationsUrl} className="account-dashboard-card">
                            <span>04</span>
                            <h3>Informations personnelles</h3>
                            <p>Mettez à jour vos coordonnées.</p>
                        </Link>
                    </div>
                </>
            ) : null}
        </AccountShell>
    );
}

function getContactName(contact: ContactAccount): string {
    const name = `${contact.firstname || ''} ${contact.lastname || ''}`.trim();

    if (name !== '') {
        return name;
    }

    if (contact.email) {
        return contact.email;
    }

    return 'dans votre espace';
}