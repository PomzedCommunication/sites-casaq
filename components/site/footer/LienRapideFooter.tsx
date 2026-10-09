import Link from 'next/link';

type QuickLink = {
    title?: string;
};

type MenuItem = {
    label: string;
    url: string;
};

type Props = {
    quickLinks: QuickLink;
    menu: MenuItem[];
    previewDomain?: string;
    enabled?: boolean;
    className?: string;
};

export function LienRapideFooter({
                                     quickLinks,
                                     menu,
                                     previewDomain,
                                     enabled = false,
                                     className = ''
                                 }: Props) {

    if (!enabled){
        return null
    }

    return (
        <div className={`site-footer__column quicklink ${className}`}>
            <h3>
                {quickLinks.title || 'Liens rapides'}
            </h3>

            <nav className="site-footer__links">
                {menu.map((item) => (
                    <Link
                        key={`${item.label}-${item.url}`}
                        href={buildUrl(item.url, previewDomain)}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}