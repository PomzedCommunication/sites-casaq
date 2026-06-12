'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    clearContactToken,
    getContactToken,
    logoutContactAccountClient,
} from '@/lib/contact-auth-client';

type Props = {
    previewDomain?: string;
};

export function ContactAccountNav({ previewDomain }: Props) {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        setIsConnected(Boolean(getContactToken()));

        function onStorage() {
            setIsConnected(Boolean(getContactToken()));
        }

        window.addEventListener('storage', onStorage);

        return () => {
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    async function handleLogout() {
        await logoutContactAccountClient();
        clearContactToken();
        window.location.href = buildUrl('/login', previewDomain);
    }

    if (!isConnected) {
        return (
            <Link href={buildUrl('/login', previewDomain)} className="site-header__link_sup">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10 0C11.3261 0 12.5979 0.526784 13.5355 1.46447C14.4732 2.40215 15 3.67392 15 5C15 6.32608 14.4732 7.59785 13.5355 8.53553C12.5979 9.47322 11.3261 10 10 10C8.67392 10 7.40215 9.47322 6.46447 8.53553C5.52678 7.59785 5 6.32608 5 5C5 3.67392 5.52678 2.40215 6.46447 1.46447C7.40215 0.526784 8.67392 0 10 0ZM10 12.5C15.525 12.5 20 14.7375 20 17.5V20H0V17.5C0 14.7375 4.475 12.5 10 12.5Z"
                        fill="#222222"/>
                </svg>
            </Link>
        );
    }

    return (
        <>
            <Link href={buildUrl('/mon-compte', previewDomain)} className="site-header__link_sup">
                Mon compte
            </Link>

            <button type="button" className="site-header__link_sup site-header__button" onClick={handleLogout}>
                Déconnexion
            </button>
        </>
    );
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}