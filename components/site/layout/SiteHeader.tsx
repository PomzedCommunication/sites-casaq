import Image from 'next/image';
import Link from 'next/link';
import type { CasaqSiteConfig } from '@/lib/casaq';
import { ContactAccountNav } from '@/components/site/ContactAccountNav';

type Props = {
    site: CasaqSiteConfig;
    previewDomain?: string;
};

export function SiteHeader({ site, previewDomain }: Props) {
    return (
        <header className="site-header">
            <Link href={buildUrl('/', previewDomain)} className="site-header__brand">
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

            <nav className="site-header__nav">
                <div className="sup-head">
                    <ContactAccountNav previewDomain={previewDomain}/>

                </div>
                <div className="sub-head">

                    {site.menu.map((item) => (
                        <Link
                            key={`${item.label}-${item.url}`}
                            href={buildUrl(item.url, previewDomain)}
                            className="site-header__link"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

            </nav>
        </header>
);
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}