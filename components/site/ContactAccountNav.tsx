'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!menuRef.current) {
                return;
            }

            if (!menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    async function handleLogout() {
        await logoutContactAccountClient();
        clearContactToken();

        localStorage.removeItem('casaq_contact_name');
        window.dispatchEvent(new Event('casaq-contact-name'));

        window.location.href = buildUrl('/login', previewDomain);
    }

    if (!isConnected) {
        return (
            <Link
                href={buildUrl('/login', previewDomain)}
                className={`site-header__link_sup ${isActivePath(pathname, '/login') ? 'is-active' : ''}`}
                aria-label="Connexion"
            >
                <AccountIcon />
            </Link>
        );
    }

    return (
        <div className="contact-account-nav" ref={menuRef}>
            <Link
                href={buildUrl('/mon-compte/favoris', previewDomain)}
                className={`site-header__link_sup ${isActivePath(pathname, '/mon-compte/favoris') ? 'is-active' : ''}`}
                aria-label="Mes favoris"
            >
                <HeartIcon />
            </Link>

            {/* Desktop : lien normal vers mon compte */}
            <Link
                href={buildUrl('/mon-compte', previewDomain)}
                className={`site-header__link_sup contact-account-nav__desktop-account ${
                    isExactPath(pathname, '/mon-compte') ? 'is-active' : ''
                }`}
                aria-label="Mon compte"
            >
                <AccountIcon />
            </Link>

            {/* Mobile : bouton qui ouvre le sous-menu */}
            <button
                type="button"
                className={`site-header__link_sup contact-account-nav__mobile-toggle ${
                    isAccountPath(pathname) ? 'is-active' : ''
                }`}
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Ouvrir le menu du compte"
                aria-expanded={menuOpen}
            >
                <AccountIcon />
            </button>

            <div className={`contact-account-nav__menu ${menuOpen ? 'is-open' : ''}`}>
                <AccountMenuLink
                    href="/mon-compte"
                    label="Tableau de bord"
                    active={isExactPath(pathname, '/mon-compte')}
                    previewDomain={previewDomain}
                    onClick={() => setMenuOpen(false)}
                />

                <AccountMenuLink
                    href="/mon-compte/criteres"
                    label="Mes critères"
                    active={isActivePath(pathname, '/mon-compte/criteres')}
                    previewDomain={previewDomain}
                    onClick={() => setMenuOpen(false)}
                />

                <AccountMenuLink
                    href="/mon-compte/correspondances"
                    label="Correspondances"
                    active={isActivePath(pathname, '/mon-compte/correspondances')}
                    previewDomain={previewDomain}
                    onClick={() => setMenuOpen(false)}
                />

                <AccountMenuLink
                    href="/mon-compte/favoris"
                    label="Mes favoris"
                    active={isActivePath(pathname, '/mon-compte/favoris')}
                    previewDomain={previewDomain}
                    onClick={() => setMenuOpen(false)}
                />

                <AccountMenuLink
                    href="/mon-compte/informations"
                    label="Informations personnelles"
                    active={isActivePath(pathname, '/mon-compte/informations')}
                    previewDomain={previewDomain}
                    onClick={() => setMenuOpen(false)}
                />

                <AccountMenuLink
                    href="/mon-compte/notifications"
                    label="Notifications"
                    active={isActivePath(pathname, '/mon-compte/notifications')}
                    previewDomain={previewDomain}
                    onClick={() => setMenuOpen(false)}
                />

                <button
                    type="button"
                    className="contact-account-nav__menu-link contact-account-nav__menu-link--logout"
                    onClick={handleLogout}
                >
                    Déconnexion
                </button>
            </div>
        </div>
    );
}

function AccountMenuLink({
                             href,
                             label,
                             active,
                             previewDomain,
                             onClick,
                         }: {
    href: string;
    label: string;
    active?: boolean;
    previewDomain?: string;
    onClick?: () => void;
}) {
    return (
        <Link
            href={buildUrl(href, previewDomain)}
            className={
                active
                    ? 'contact-account-nav__menu-link is-active'
                    : 'contact-account-nav__menu-link'
            }
            onClick={onClick}
        >
            {label}
        </Link>
    );
}

function AccountIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 0C11.3261 0 12.5979 0.526784 13.5355 1.46447C14.4732 2.40215 15 3.67392 15 5C15 6.32608 14.4732 7.59785 13.5355 8.53553C12.5979 9.47322 11.3261 10 10 10C8.67392 10 7.40215 9.47322 6.46447 8.53553C5.52678 7.59785 5 6.32608 5 5C5 3.67392 5.52678 2.40215 6.46447 1.46447C7.40215 0.526784 8.67392 0 10 0ZM10 12.5C15.525 12.5 20 14.7375 20 17.5V20H0V17.5C0 14.7375 4.475 12.5 10 12.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.32444 2.875L9 3.8125L9.67556 2.875C10.4578 1.7875 11.6133 1 13 1C15.2133 1 17 2.88438 17 5.21875C17 6.09063 16.7511 6.89688 16.3244 7.5625C15.6044 8.69687 9 16 9 16C9 16 2.39556 8.69687 1.67556 7.5625C1.24889 6.89688 1 6.09063 1 5.21875C1 2.88438 2.78667 1 5 1C6.38667 1 7.54222 1.7875 8.32444 2.875Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}

function isActivePath(pathname: string, url: string): boolean {
    const cleanUrl = url.split('?')[0].replace(/\/+$/, '') || '/';
    const cleanPathname = pathname.replace(/\/+$/, '') || '/';

    if (cleanUrl === '/') {
        return cleanPathname === '/';
    }

    return cleanPathname === cleanUrl || cleanPathname.startsWith(`${cleanUrl}/`);
}

function isExactPath(pathname: string, url: string): boolean {
    const cleanUrl = url.split('?')[0].replace(/\/+$/, '') || '/';
    const cleanPathname = pathname.replace(/\/+$/, '') || '/';

    return cleanPathname === cleanUrl;
}

function isAccountPath(pathname: string): boolean {
    return isActivePath(pathname, '/mon-compte');
}