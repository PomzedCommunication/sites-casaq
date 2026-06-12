import Image from 'next/image';
import Link from 'next/link';
import type { CasaqSiteConfig } from '@/lib/casaq';
import { NovimmobCss } from '@/components/site/styles/NovimmobCss';
import type { ComponentType } from 'react';

type Props = {
    site: CasaqSiteConfig;
    previewDomain?: string;
};
const SITE_CSS_BY_DOMAIN: Record<string, React.ComponentType> = {
    'exemple.ch': NovimmobCss,
};

export function SiteFooter({ site, previewDomain }: Props) {
    const footer = site.footer || {};
    const newsletter = footer.newsletter || {};
    const quickLinks = footer.quick_links || {};
    const hours = footer.hours || {};
    const contact = footer.contact || {};
    const socials = footer.socials || {};
    const legalLinks = Array.isArray(footer.legal_links) ? footer.legal_links : [];
    const hourItems = Array.isArray(hours.items) ? hours.items : [];

    const activeDomain = normalizeDomain(previewDomain || site.domain);
    const SiteCss = SITE_CSS_BY_DOMAIN[activeDomain] || null;
    return (
        <>
            {SiteCss ? <SiteCss /> : null}

        <footer className="site-footer">
            <div className="site-footer__inner">
                <div className="site-footer__top">
                    <div className="site-footer__brand">
                        {site.config.logo ? (
                            <Image
                                src={site.config.logo}
                                alt={site.agence.nom}
                                width={160}
                                height={70}
                                className="site-footer__logo"
                            />
                        ) : (
                            <strong className="site-footer__agency-name">
                                {site.agence.nom}
                            </strong>
                        )}

                        {site.infos.slogan ? (
                            <p className="site-footer__slogan">
                                {site.infos.slogan}
                            </p>
                        ) : null}

                        {newsletter.enabled !== false ? (
                            <div className="site-footer__newsletter">
                                <h3>
                                    {newsletter.title || 'S’abonner à notre Newsletter'}
                                </h3>

                                <form className="site-footer__newsletter-form">
                                    <span className="site-footer__newsletter-icon">✉</span>

                                    <input
                                        type="email"
                                        placeholder={newsletter.placeholder || 'Votre adresse e-mail'}
                                    />

                                    <button type="submit" aria-label="S’abonner">
                                        ➤
                                    </button>
                                </form>
                            </div>
                        ) : null}
                    </div>

                    <div className="site-footer__column">
                        <h3>{quickLinks.title || 'Liens rapides'}</h3>

                        <nav className="site-footer__links">
                            {site.menu.map((item) => (
                                <Link
                                    key={`${item.label}-${item.url}`}
                                    href={buildUrl(item.url, previewDomain)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="site-footer__column">
                        <h3>{hours.title || 'Horaires'}</h3>

                        {hourItems.length ? (
                            <div className="site-footer__hours">
                                {hourItems.map((item, index) => (
                                    <div key={index} className="site-footer__hour-row">
                                        <span className="site-footer__hour-day">
                                            {item.day || item.label}
                                        </span>

                                        <span className="site-footer__hour-value">
                                            {formatHourItem(item)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="site-footer__column">
                        <h3>{contact.title || 'Nous contacter'}</h3>

                        <address className="site-footer__contact">
                            <strong>{site.agence.nom}</strong>

                            {site.infos.adresse ? (
                                <div className="site-footer__address">
                                    {splitLines(site.infos.adresse).map((line, index) => (
                                        <span key={`${line}-${index}`}>
                                {line}
                            </span>
                                    ))}
                                </div>
                            ) : null}
                            {site.infos.telephone ? (
                                <a href={`tel:${cleanPhone(site.infos.telephone)}`}>
                                    {site.infos.telephone}
                                </a>
                            ) : null}

                            {site.infos.email ? (
                                <a href={`mailto:${site.infos.email}`}>
                                    {site.infos.email}
                                </a>
                            ) : null}
                        </address>
                    </div>
                </div>

                <div className="site-footer__bottom">
                    <p>
                        © {new Date().getFullYear()} {site.agence.nom}
                    </p>

                    {legalLinks.length ? (
                        <nav className="site-footer__legal">
                            {legalLinks.map((item) => (
                                item.label && item.url ? (
                                    <Link
                                        key={`${item.label}-${item.url}`}
                                        href={buildUrl(item.url, previewDomain)}
                                    >
                                        {item.label}
                                    </Link>
                                ) : null
                            ))}
                        </nav>
                    ) : null}

                    <div className="site-footer__socials">
                        {socials.facebook ? (
                            <a href={socials.facebook} target="_blank" rel="noreferrer">
                                f
                            </a>
                        ) : null}

                        {socials.linkedin ? (
                            <a href={socials.linkedin} target="_blank" rel="noreferrer">
                                in
                            </a>
                        ) : null}

                        {socials.twitter ? (
                            <a href={socials.twitter} target="_blank" rel="noreferrer">
                                x
                            </a>
                        ) : null}

                        {socials.instagram ? (
                            <a href={socials.instagram} target="_blank" rel="noreferrer">
                                ig
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        </footer>

        </>
    );
}

function formatHourItem(item: {
    value?: string;
    morning?: string;
    afternoon?: string;
    note?: string;
}) {
    if (item.value) {
        return item.value;
    }

    const parts = [item.morning, item.afternoon].filter(Boolean);

    if (parts.length) {
        return parts.join(' et ');
    }

    return item.note || '';
}

function cleanPhone(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}
function normalizeDomain(domain?: string | null): string {
    return (domain || '')
        .toLowerCase()
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
}
function splitLines(value?: string | null): string[] {
    return String(value || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}