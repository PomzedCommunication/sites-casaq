'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
    clearContactToken,
    getContactToken,
    logoutContactAccountClient,
} from '@/lib/contact-auth-client';
import {SiteIcon} from "@/components/site/icons/SiteIcon";

type Props = {
    previewDomain?: string;
};

export function ContactAccountNav({ previewDomain }: Props) {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function refreshConnectedState() {
            setIsConnected(Boolean(getContactToken()));
        }

        refreshConnectedState();

        window.addEventListener('storage', refreshConnectedState);
        window.addEventListener('casaq-contact-auth', refreshConnectedState);

        return () => {
            window.removeEventListener('storage', refreshConnectedState);
            window.removeEventListener('casaq-contact-auth', refreshConnectedState);
        };
    }, []);

    useEffect(() => {
        if (isConnected !== false) {
            return;
        }

        if (!isAccountPath(pathname)) {
            return;
        }

        router.replace(buildUrl('/login', previewDomain));
    }, [isConnected, pathname, previewDomain, router]);

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
        window.dispatchEvent(new Event('casaq-contact-auth'));

        router.replace(buildUrl('/login', previewDomain));
    }

    if (isConnected === null) {
        return null;
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

            <Link
                href={buildUrl('/mon-compte', previewDomain)}
                className={`site-header__link_sup contact-account-nav__desktop-account ${
                    isExactPath(pathname, '/mon-compte') ? 'is-active' : ''
                }`}
                aria-label="Mon compte"
            >
                <AccountIcon />
            </Link>

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
        <SiteIcon name="compte" />
    );
}

function HeartIcon() {
    return (
        <SiteIcon name="favoris" />
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