'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CasaqSiteConfig } from '@/lib/casaq';
// import { NovimmobCss } from '@/components/site/styles/NovimmobCss';
// import type { ComponentType } from 'react';

import { SiteSocials } from '@/components/site/footer/SiteSocials';
import { NewsletterFooter } from '@/components/site/footer/NewsletterFooter';
import { LienRapideFooter } from '@/components/site/footer/LienRapideFooter';
import { ContactFooter } from '@/components/site/footer/ContactFooter';
import { LienCasaqTipiq } from '@/components/site/footer/LienCasaqTipiq';
import { Horaires } from '@/components/site/footer/Horaires';
import { OpenStatus } from '@/components/site/footer/OpenStatus';

type Props = {
    site: CasaqSiteConfig;
    previewDomain?: string;
};
// const SITE_CSS_BY_DOMAIN: Record<string, React.ComponentType> = {
//     'novimmob.pix-preview.ch': NovimmobCss,
// };

export function SiteFooter({ site, previewDomain }: Props) {
    const footer = site.footer || {};
    const newsletter = footer.newsletter || {};
    const quickLinks = footer.quick_links || {};
    const hours = footer.hours || {};
    const contact = footer.contact || {};
    const socials = footer.socials || {};
    const legalLinks = Array.isArray(footer.legal_links) ? footer.legal_links : [];
    const hourItems = Array.isArray(hours.items) ? hours.items : [];
    const holidayClosures = Array.isArray(footer.holiday_closures)
        ? footer.holiday_closures
        : [];
    // const activeDomain = normalizeDomain(previewDomain || site.domain);
    // const SiteCss = SITE_CSS_BY_DOMAIN[activeDomain] || null;

    const openStatus = getOpenStatus(hourItems, holidayClosures);
    const contactAdresse = contact.adresse || site.infos.adresse;
    const contactTelephone = contact.telephone_mobile || site.infos.telephone_mobile;
    const contactTelephoneFixe = contact.telephone_fixe || site.infos.telephone_fixe;
    const contactEmail = contact.email || site.infos.email;
    const footerLogoSrc =
        typeof footer.logo === 'string' && footer.logo.trim()
            ? footer.logo.trim()
            : site.config.logo;

    const template_key = site.template_key;

    // console.log('contact', contact);

    return (
        <>

            <OpenStatus
                openStatus={openStatus}
                className="mon-autre-classe"
            />

            <footer className={`site-footer white footer_${template_key}`}>
                <div className="site-footer__inner">
                    <div className="site-footer__top">
                        <div className="site-footer__brand">
                            {footerLogoSrc ? (
                                <Image
                                    src={footerLogoSrc}
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
                            {footer.description ? (
                                <p className="site-footer__description">
                                    {footer.description}
                                </p>
                            ) : null}





                            {template_key === 'template_1' && (
                                <NewsletterFooter
                                    newsletter={newsletter}
                                    className="header__newsletter"
                                />
                            )}


                        </div>


                        {template_key === 'template_1' && (
                            <LienRapideFooter
                                quickLinks={quickLinks}
                                menu={site.menu}
                                previewDomain={previewDomain}
                                enabled={quickLinks.enabled}
                            />
                        )}


                        {template_key === 'template_1' && (
                            <Horaires
                                hours={hours}
                                hourItems={hourItems}
                                isTodayHourItem={isTodayHourItem}
                                formatHourItem={formatHourItem}
                            />
                        )}


                        <ContactFooter
                            contact={contact}
                            agencyName={site.agence.nom}
                            contactAdresse={contactAdresse}
                            contactTelephone={contactTelephone}
                            contactTelephoneFixe={contactTelephoneFixe}
                            contactEmail={contactEmail}
                            splitLines={splitLines}
                            cleanPhone={cleanPhone}
                        />


                        {template_key === 'template_2' && (
                            <NewsletterFooter
                                newsletter={newsletter}
                                className="header__newsletter"
                            />
                        )}

                        {template_key === 'template_2' && (
                            <SiteSocials
                                socials={socials}
                                className="site-footer__socials"
                            />
                        )}

                    </div>


                    {template_key === 'template_1' && (
                        <SiteSocials
                            socials={socials}
                            className="site-footer__socials"
                        />
                    )}


                    <LienCasaqTipiq />


                    <div className="site-footer__bottom">
                        <p>
                            © {new Date().getFullYear()} {site.agence.nom}
                            {template_key === 'template_1' && (
                                <> | Réalisé sur mesure et avec passion</>
                            )}
                        </p>

                        {template_key === 'template_1' && (
                            <div className="site-footer__credit-logos">
                                <a href="https://pixlab.ch/agence-web-a-delemont/" target="_blank"
                                   aria-label='Agence web dans le Jura'>
                                    <svg width="53" height="14" viewBox="0 0 53 14" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">

                                        <g mask="url(#mask0_371_8097)">
                                            <path
                                                d="M0 13.8814V3.60506H2.29138V4.36782C2.61956 3.88968 3.45979 3.4248 4.56693 3.4248C6.81085 3.4248 8.1671 5.06985 8.1671 7.2993C8.1671 9.52874 6.63885 11.2022 4.47401 11.2022C3.47561 11.2022 2.72829 10.874 2.37046 10.4547V13.8795H0V13.8814ZM4.08256 5.474C3.16325 5.474 2.33684 6.07168 2.33684 7.31448C2.33684 8.55727 3.16325 9.17014 4.08256 9.17014C5.00187 9.17014 5.8441 8.55727 5.8441 7.31448C5.8441 6.07168 5.01769 5.474 4.08256 5.474Z"
                                                fill="white"/>
                                            <path
                                                d="M10.9033 -0.000488281C11.6823 -0.000488281 12.305 0.597193 12.305 1.33149C12.305 2.06577 11.6823 2.66346 10.9033 2.66346C10.1244 2.66346 9.53125 2.06577 9.53125 1.33149C9.53125 0.597193 10.154 -0.000488281 10.9033 -0.000488281ZM9.73488 11.0386V3.60457H12.1034V11.0386H9.73488Z"
                                                fill="white"/>
                                            <path d="M25.4941 11.0394V0.208984H27.8627V11.0375H25.4941V11.0394Z" fill="white"/>
                                            <path
                                                d="M31.6957 6.74582L33.5185 6.47638C33.9397 6.41567 34.08 6.22214 34.08 5.96789C34.08 5.53338 33.6905 5.15959 32.9433 5.15959C32.1168 5.15959 31.6641 5.69845 31.6187 6.2506L29.5605 5.84645C29.6535 4.78391 30.6835 3.37793 32.959 3.37793C35.4679 3.37793 36.3872 4.72319 36.3872 6.2506V9.88602C36.3872 10.4685 36.4643 10.9637 36.4802 11.0377H34.345C34.3291 10.977 34.2678 10.7095 34.2678 10.201C33.8626 10.829 33.1153 11.2484 32.0852 11.2484C30.3869 11.2484 29.4043 10.1706 29.4043 8.99044C29.4043 7.67364 30.4166 6.92607 31.6957 6.74582ZM34.08 8.12143V7.79318L32.6151 8.01708C32.1168 8.09108 31.7431 8.31686 31.7431 8.84055C31.7431 9.22952 32.0081 9.60331 32.6624 9.60331C33.3643 9.60331 34.08 9.27506 34.08 8.12334V8.12143Z"
                                                fill="white"/>
                                            <path
                                                d="M38.3818 11.0394V0.208984H40.7049V4.30736C41.033 3.8444 41.8892 3.42508 42.9488 3.42508C45.1928 3.42508 46.549 5.07013 46.549 7.29957C46.549 9.52902 45.0208 11.2025 42.8559 11.2025C41.8279 11.2025 41.0331 10.768 40.6733 10.2007V11.0375H38.3818V11.0394ZM42.4348 5.47427C41.5155 5.47427 40.6733 6.05678 40.6733 7.31475C40.6733 8.57273 41.5155 9.17041 42.4348 9.17041C43.3541 9.17041 44.1805 8.55755 44.1805 7.31475C44.1805 6.07196 43.3541 5.47427 42.4348 5.47427Z"
                                                fill="white"/>
                                            <path
                                                d="M24.1986 3.60547H21.5496L18.9854 7.32248L21.5496 11.0395H24.1986L21.6682 7.32248L24.1986 3.60547Z"
                                                fill="white"/>
                                            <path
                                                d="M13.2988 11.0395H15.9481L18.5123 7.32247L15.9481 3.60547H13.2988L15.8294 7.32247L13.2988 11.0395Z"
                                                fill="white"/>
                                            <path
                                                d="M47.5166 11.0395H50.1658L52.73 7.32247L50.1658 3.60547H47.5166L50.0472 7.32247L47.5166 11.0395Z"
                                                fill="white"/>
                                        </g>
                                    </svg>

                                </a>
                                <a href="https://pomzed.ch/" target="_blank" aria-label='Agence de communication dans le Jura'>
                                    <svg width="70" height="13" viewBox="0 0 70 13" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M50.3145 7.09088V5.35007C50.3145 2.73886 48.9805 1.79882 46.2425 1.764H43.1066C43.0697 1.76083 43.0326 1.76492 42.9972 1.77605C42.9619 1.78718 42.9292 1.80513 42.9009 1.82886C42.8727 1.85259 42.8494 1.88164 42.8325 1.91433C42.8156 1.94702 42.8054 1.9827 42.8024 2.01932V10.3752C42.7992 10.4133 42.8036 10.4517 42.8154 10.4881C42.8273 10.5245 42.8462 10.5583 42.8712 10.5874C42.8962 10.6165 42.9268 10.6405 42.9612 10.6578C42.9956 10.6752 43.0331 10.6856 43.0715 10.6886H46.2542C48.8401 10.6886 50.3262 9.78333 50.3262 7.09088H50.3145ZM48.688 7.09088C48.688 8.72724 48.0562 9.41196 46.2425 9.41196H44.4639V3.07541H46.3127C47.9509 3.07541 48.7582 3.60926 48.7582 5.39649V7.1373L48.688 7.09088ZM36.1094 10.6886H41.6908V9.36554H37.3497V6.96322H41.1175V5.60539H37.3497V3.07541H41.5738V1.7524H36.0626C36.0242 1.74922 35.9855 1.75362 35.9488 1.76534C35.912 1.77706 35.878 1.79586 35.8486 1.82067C35.8193 1.84548 35.7952 1.8758 35.7777 1.90989C35.7602 1.94399 35.7496 1.98118 35.7467 2.01932V10.3636C35.7435 10.4017 35.7479 10.4401 35.7597 10.4765C35.7715 10.5129 35.7905 10.5467 35.8155 10.5758C35.8405 10.6049 35.8711 10.6289 35.9055 10.6462C35.9398 10.6636 35.9773 10.674 36.0158 10.6769H36.1211L36.1094 10.6886ZM32.5991 3.07541L27.7315 9.4932V10.3752C27.728 10.4515 27.7538 10.5263 27.8038 10.5845C27.8537 10.6426 27.9241 10.6798 28.0006 10.6886H34.3894C34.4595 10.6894 34.5276 10.6653 34.5813 10.6206C34.635 10.5759 34.6707 10.5135 34.6819 10.4448V9.60925C34.6819 9.33072 34.3191 9.36554 34.3191 9.36554H29.6387L34.5532 2.95936V1.99611C34.5489 1.96094 34.5375 1.92697 34.5198 1.89618C34.5021 1.8654 34.4784 1.83842 34.4501 1.81681C34.4218 1.79521 34.3894 1.77941 34.3549 1.77034C34.3203 1.76128 34.2843 1.75912 34.2489 1.764H28.4335C28.3957 1.75917 28.3573 1.76202 28.3206 1.77239C28.284 1.78276 28.2498 1.80043 28.2202 1.82432C28.1907 1.84821 28.1663 1.87782 28.1487 1.91135C28.131 1.94487 28.1205 1.98161 28.1176 2.01932V2.76207C28.1109 2.79984 28.1124 2.83861 28.1221 2.87573C28.1319 2.91286 28.1495 2.94747 28.174 2.9772C28.1984 3.00694 28.229 3.03111 28.2637 3.04805C28.2984 3.065 28.3364 3.07433 28.375 3.07541H32.5523H32.5991ZM25.1455 10.6886H26.7837L26.0933 2.1934C26.0704 2.06531 26.0002 1.95029 25.8963 1.87087C25.7924 1.79144 25.6624 1.75334 25.5317 1.764H24.4669C24.3601 1.75487 24.253 1.77904 24.1608 1.83313C24.0685 1.88723 23.9955 1.96854 23.952 2.06574L21.6118 7.71757L19.2716 2.05414C19.2396 1.97465 19.1871 1.90491 19.1193 1.85194C19.0515 1.79897 18.9709 1.76464 18.8855 1.7524H17.7154C17.5738 1.74546 17.4349 1.79184 17.3264 1.88224C17.2179 1.97263 17.1479 2.10036 17.1303 2.23982L16.3815 10.6769H18.0313L18.5227 4.06187H18.5812L20.9215 9.56283H22.232L24.5722 3.86458L25.0519 10.6886H25.1455ZM15.5624 5.21081C15.5624 3.92261 15.4571 1.64795 11.5606 1.64795C7.66418 1.64795 7.55887 3.96903 7.55887 5.1992V7.24175C7.55887 8.54155 7.65248 10.793 11.5606 10.793C15.4688 10.793 15.5624 8.47192 15.5624 7.23014V5.21081ZM13.9476 7.23014C13.9476 8.93614 13.2924 9.48159 11.6074 9.48159C10.0746 9.48159 9.26722 9.08701 9.26722 7.24175V5.1992C9.26722 3.41197 10.0044 2.95936 11.6074 2.95936C13.2105 2.95936 13.9476 3.44679 13.9476 5.21081V7.23014ZM6.58769 4.64214C6.58769 2.15859 5.41758 1.82203 3.56882 1.82203H0.292526C0.22835 1.81666 0.164263 1.83333 0.111005 1.86925C0.0577477 1.90517 0.0185565 1.95815 0 2.01932L0 10.6886H1.61474V7.39262H3.56882C5.41758 7.39262 6.58769 7.06767 6.58769 4.58411V4.64214ZM4.96124 4.64214C4.96124 5.96516 4.43469 6.13924 3.56882 6.13924H1.61474V3.07541H3.56882C4.43469 3.07541 4.96124 3.24949 4.96124 4.58411V4.64214Z"
                                            fill="white"/>
                                        <path
                                            d="M67.9883 11.1182V1.41606C67.9946 1.04866 67.8542 0.693685 67.5978 0.42848C67.3413 0.163275 66.9896 0.00933427 66.6193 0.000200926H56.1702C55.7998 -0.00603679 55.4419 0.13318 55.1745 0.387516C54.9071 0.641852 54.7519 0.990694 54.7427 1.35803V11.1182C54.733 11.4768 54.8643 11.8251 55.1089 12.0893C55.3535 12.3536 55.6921 12.5131 56.0532 12.534H66.5842C66.9514 12.5371 67.3051 12.3962 67.5681 12.1419C67.8311 11.8875 67.9821 11.5405 67.9883 11.1762V11.1182ZM65.847 8.12398C65.8548 8.36328 65.815 8.60177 65.7298 8.8258C65.6446 9.04983 65.5157 9.25501 65.3506 9.42962C65.1854 9.60422 64.9871 9.74483 64.7671 9.84339C64.5471 9.94196 64.3097 9.99655 64.0684 10.0041H59.9029V8.12398H62.7813C62.9284 8.11969 63.0731 8.08586 63.2066 8.02453C63.3401 7.96319 63.4597 7.87564 63.5582 7.76716C63.6566 7.65867 63.7319 7.53152 63.7793 7.39337C63.8268 7.25523 63.8455 7.10897 63.8344 6.96344V5.50116C63.8456 5.35468 63.8265 5.20747 63.7783 5.06856C63.7301 4.92966 63.6538 4.80197 63.5541 4.69332C63.4545 4.58467 63.3335 4.49735 63.1986 4.4367C63.0637 4.37605 62.9177 4.34336 62.7696 4.34062H58.7327V10.0157H56.8372V2.49536H64.0684C64.3097 2.50286 64.5471 2.55745 64.7671 2.65602C64.9871 2.75458 65.1854 2.89519 65.3506 3.0698C65.5157 3.2444 65.6446 3.44958 65.7298 3.67362C65.815 3.89765 65.8548 4.13613 65.847 4.37544V8.12398Z"
                                            fill="white"/>
                                    </svg>

                                </a>
                            </div>
                        )}

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
                    </div>

                </div>
            </footer>
        </>
    );
}

type FooterHourItem = {
    label?: string;
    day?: string;
    weekday?: number | string | null;
    closed?: boolean;
    slots?: Array<{
        start?: string;
        end?: string;
    }>;
    value?: string;
    note?: string;
};
type HolidayClosure = {
    date?: string;
    label?: string;
};
function formatHourItem(item: FooterHourItem) {
    if (item.closed) {
        return item.note || 'Fermé';
    }

    const slots = Array.isArray(item.slots)
        ? item.slots.filter((slot) => slot.start && slot.end)
        : [];

    if (slots.length) {
        return slots
            .map((slot) => `${slot.start} – ${slot.end}`)
            .join(' et ');
    }

    if (item.value) {
        return item.value;
    }

    return item.note || '';
}

// function getOpenStatus(
//     items: FooterHourItem[],
//     holidayClosures: HolidayClosure[] = [],
// ) {
//     const now = new Date();
//
//     const todayIso = [
//         now.getFullYear(),
//         String(now.getMonth() + 1).padStart(2, '0'),
//         String(now.getDate()).padStart(2, '0'),
//     ].join('-');
//
//     const holidayClosure = holidayClosures.find((item) => {
//         return String(item.date || '').trim() === todayIso;
//     });
//
//     if (holidayClosure) {
//         return {
//             open: false,
//             todayLabel: holidayClosure.label || 'Jour férié',
//         };
//     }
//
//     const usableItems = items.filter((item) => Number(item.weekday));
//
//     if (!usableItems.length) {
//         return null;
//     }
//
//     const weekday = now.getDay() === 0 ? 7 : now.getDay();
//
//     const today = usableItems.find((item) => Number(item.weekday) === weekday);
//
//     if (!today) {
//         return null;
//     }
//
//     const todayLabel = formatHourItem(today);
//
//     if (today.closed) {
//         return {
//             open: false,
//             todayLabel,
//         };
//     }
//
//     const slots = Array.isArray(today.slots)
//         ? today.slots.filter((slot) => slot.start && slot.end)
//         : [];
//
//     if (!slots.length) {
//         return {
//             open: false,
//             todayLabel,
//         };
//     }
//
//     const currentMinutes = now.getHours() * 60 + now.getMinutes();
//
//     const open = slots.some((slot) => {
//         const start = timeToMinutes(slot.start || '');
//         const end = timeToMinutes(slot.end || '');
//
//         if (start === null || end === null) {
//             return false;
//         }
//
//         return currentMinutes >= start && currentMinutes < end;
//     });
//
//     return {
//         open,
//         todayLabel,
//     };
// }

function getOpenStatus(
    items: FooterHourItem[],
    holidayClosures: HolidayClosure[] = [],
) {
    const now = getSwissNow();

    const todayIso = [
        now.year,
        String(now.month).padStart(2, '0'),
        String(now.day).padStart(2, '0'),
    ].join('-');

    const holidayClosure = holidayClosures.find((item) => {
        return String(item.date || '').trim() === todayIso;
    });

    if (holidayClosure) {
        return {
            open: false,
            todayLabel: holidayClosure.label || 'Jour férié',
        };
    }

    const usableItems = items.filter((item) => Number(item.weekday));

    if (!usableItems.length) {
        return null;
    }

    const today = usableItems.find((item) => Number(item.weekday) === now.weekday);

    if (!today) {
        return null;
    }

    const todayLabel = formatHourItem(today);

    if (today.closed) {
        return {
            open: false,
            todayLabel,
        };
    }

    const slots = Array.isArray(today.slots)
        ? today.slots.filter((slot) => slot.start && slot.end)
        : [];

    if (!slots.length) {
        return {
            open: false,
            todayLabel,
        };
    }

    const currentMinutes = now.hours * 60 + now.minutes;

    const open = slots.some((slot) => {
        const start = timeToMinutes(slot.start || '');
        const end = timeToMinutes(slot.end || '');

        if (start === null || end === null) {
            return false;
        }

        return currentMinutes >= start && currentMinutes < end;
    });

    return {
        open,
        todayLabel,
    };
}

function timeToMinutes(value: string): number | null {
    const [hours, minutes] = value.split(':').map((part) => Number(part));

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null;
    }

    return hours * 60 + minutes;
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

function isTodayHourItem(item: FooterHourItem): boolean {
    const now = getSwissNow();

    return Number(item.weekday) === now.weekday;
}
function getSwissNow() {
    const parts = new Intl.DateTimeFormat('fr-CH', {
        timeZone: 'Europe/Zurich',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(new Date());

    const get = (type: string) => {
        return parts.find((part) => part.type === type)?.value || '';
    };

    const weekdayText = get('weekday').toLowerCase();

    const weekdayMap: Record<string, number> = {
        lun: 1,
        mar: 2,
        mer: 3,
        jeu: 4,
        ven: 5,
        sam: 6,
        dim: 7,
    };

    return {
        year: Number(get('year')),
        month: Number(get('month')),
        day: Number(get('day')),
        hours: Number(get('hour')),
        minutes: Number(get('minute')),
        weekday: weekdayMap[weekdayText.slice(0, 3)] || 1,
    };
}