'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CasaqSiteConfig } from '@/lib/casaq';
import { ContactAccountNav } from '@/components/site/ContactAccountNav';

type Props = {
    site: CasaqSiteConfig;
    previewDomain?: string;
};

export function SiteHeader({ site, previewDomain }: Props) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [headerHidden, setHeaderHidden] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.classList.toggle('site-mobile-menu-open', menuOpen);

        return () => {
            document.body.classList.remove('site-mobile-menu-open');
        };
    }, [menuOpen]);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const currentScrollY = window.scrollY;
            const scrollingDown = currentScrollY > lastScrollY;
            const scrollingUp = currentScrollY < lastScrollY;

            if (menuOpen) {
                setHeaderHidden(false);
            } else if (currentScrollY < 80) {
                setHeaderHidden(false);
            } else if (scrollingDown && currentScrollY > 120) {
                setHeaderHidden(true);
            } else if (scrollingUp) {
                setHeaderHidden(false);
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        function handleScroll() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [menuOpen]);
    return (
        <>
            {menuOpen ? (
                <button
                    type="button"
                    className="site-header__mobile-overlay"
                    aria-label="Fermer le menu"
                    onClick={() => setMenuOpen(false)}
                />
            ) : null}

            <header
                className={`site-header ${menuOpen ? 'is-menu-open' : ''} ${
                    headerHidden ? 'is-hidden-on-scroll' : 'is-visible-on-scroll'
                }`}
            >
                <Link
                    href={buildUrl('/', previewDomain)}
                    className={`site-header__brand ${isActivePath(pathname, '/') ? 'is-active' : ''}`}
                >
                    {site.config.logo ? (
                        <Image
                            src={site.config.logo}
                            alt={site.agence.nom}
                            width={180}
                            height={42}
                            className="site-header__logo"
                        />
                    ) : (
                        <span>{site.agence.nom}</span>
                    )}
                </Link>
                <div className="sup-head sup-head--mobile">
                    <ContactAccountNav previewDomain={previewDomain}/>
                </div>

                <button
                    type="button"
                    className={`site-header__burger ${menuOpen ? 'is-open' : ''}`}
                    aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((current) => !current)}
                >
                    <span/>
                    <span/>
                    <span/>
                </button>
                <nav className={`site-header__nav ${menuOpen ? 'is-open' : ''}`}>
                    <div className="sup-head sup-head--desktop">
                        <ContactAccountNav previewDomain={previewDomain}/>
                    </div>

                    <div className="sub-head">
                        {site.menu.map((item) => {
                            const children = item.children || [];
                            const hasChildren = children.length > 0;

                            const active =
                                isActivePath(pathname, item.url) ||
                                children.some((child) => isActivePath(pathname, child.url));

                            return (
                                <div
                                    key={`${item.label}-${item.url}`}
                                    className={`site-header__item ${hasChildren ? 'has-submenu' : ''} ${active ? 'is-active' : ''}`}
                                >
                                    <Link
                                        href={buildUrl(item.url || '#', previewDomain)}
                                        className={`site-header__link ${active ? 'is-active' : ''}`}
                                    >
                                        {item.label}

                                        {hasChildren ? (
                                            <span className="site-header__chevron">
                                            <svg width="10" height="5" viewBox="0 0 10 5" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 0L5 5L10 0H0Z" fill="black"/>
                                            </svg>
                                        </span>
                                        ) : null}
                                    </Link>

                                    {hasChildren ? (
                                        <div className="site-header__submenu">
                                            {children.map((child) => {
                                                const childActive = isActivePath(pathname, child.url);

                                                return (
                                                    <Link
                                                        key={`${child.label}-${child.url}`}
                                                        href={buildUrl(child.url, previewDomain)}
                                                        className={`site-header__submenu-link ${childActive ? 'is-active' : ''}`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </header>
        </>
    );
}

// function buildUrl(url: string, previewDomain?: string): string {
//     if (!previewDomain) {
//         return url;
//     }
//
//     const separator = url.includes('?') ? '&' : '?';
//
//     return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
// }
            function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const [pathAndQuery, hash] = url.split('#');
    const separator = pathAndQuery.includes('?') ? '&' : '?';

    return `${pathAndQuery}${separator}site=${encodeURIComponent(previewDomain)}${hash ? `#${hash}` : ''}`;
}
function isActivePath(pathname: string, url: string): boolean {
    const cleanUrl = url.split('?')[0].replace(/\/+$/, '') || '/';
    const cleanPathname = pathname.replace(/\/+$/, '') || '/';

    if (cleanUrl === '/') {
        return cleanPathname === '/';
    }

    return cleanPathname === cleanUrl || cleanPathname.startsWith(`${cleanUrl}/`);
}