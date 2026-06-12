import Link from 'next/link';

type Props = {
    previewDomain?: string | null;
    active?: 'dashboard' | 'criteres' | 'correspondances' | 'favoris' | 'informations' | 'notifications';
};

export function AccountSidebar({ previewDomain, active }: Props) {
    return (
        <aside className="account-sidebar">
            <div className="account-sidebar__head">
                <p>Espace client</p>
                <h2>Mon compte</h2>
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
            href={buildUrl(href, previewDomain)}
            className={active ? 'account-menu__link account-menu__link--active' : 'account-menu__link'}
        >
            {label}
        </Link>
    );
}

function buildUrl(url: string, previewDomain?: string | null): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}