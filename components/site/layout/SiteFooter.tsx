'use client';

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
    const holidayClosures = Array.isArray(footer.holiday_closures)
        ? footer.holiday_closures
        : [];
    const activeDomain = normalizeDomain(previewDomain || site.domain);
    const SiteCss = SITE_CSS_BY_DOMAIN[activeDomain] || null;

    const openStatus = getOpenStatus(hourItems, holidayClosures);
    const contactAdresse = contact.adresse || site.infos.adresse;
    const contactTelephone = contact.telephone || site.infos.telephone;
    const contactEmail = contact.email || site.infos.email;
    const footerLogoSrc =
        typeof footer.logo === 'string' && footer.logo.trim()
            ? footer.logo.trim()
            : site.config.logo;

    return (
        <>
            {SiteCss ? <SiteCss /> : null}
            {openStatus ? (
                <div
                    className={`site-open-fixed white ${
                        openStatus.open ? 'is-open' : 'is-closed'
                    }`}
                >
                    <svg className="site-open-fixed__icon" width="24" height="34" viewBox="0 0 24 34" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.4 1.06743L1.5 1L3.83333 29.6615H21.4667C21.8733 29.6615 22.2633 29.497 22.5509 29.2042C22.8384 28.9114 23 28.5144 23 28.1003V6.24441C23 4.87139 22.5154 3.5546 21.6527 2.58373C20.79 1.61286 19.62 1.06743 18.4 1.06743Z"
                            fill="#FF5000" stroke="white" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round"/>
                        <path
                            d="M10.7333 20.2947V17.1724C10.7333 16.3102 11.4198 15.6113 12.2667 15.6113C13.1135 15.6113 13.8 16.3102 13.8 17.1724V20.2947C13.8 21.1569 13.1135 21.8558 12.2667 21.8558C11.4198 21.8558 10.7333 21.1569 10.7333 20.2947ZM18.4 30.8796L18.3805 31.2242C18.343 31.5669 18.2507 31.902 18.105 32.2151C17.9109 32.6324 17.6277 33.0003 17.277 33.293C16.9262 33.5856 16.516 33.7956 16.076 33.9074C15.6362 34.0192 15.1775 34.0298 14.7329 33.9394L3.69857 31.6953C2.65548 31.483 1.71651 30.9092 1.04219 30.0716C0.367856 29.2339 -0.000420964 28.1834 3.6111e-07 27.1003L3.6111e-07 1.56105C3.6111e-07 1.09333 0.206251 0.650133 0.561524 0.353613C0.916769 0.0572303 1.38394 -0.0613226 1.83431 0.0304087L13.4691 2.39956C14.859 2.68246 16.11 3.4471 17.0089 4.56289C17.908 5.67897 18.3996 7.07871 18.4 8.52214V30.8796Z"
                            fill="white"/>
                        <path
                            d="M10.7333 20.2946V17.1724C10.7333 16.3102 11.4198 15.6112 12.2666 15.6112C13.1134 15.6112 13.7999 16.3102 13.7999 17.1724V20.2946C13.7999 21.1568 13.1134 21.8558 12.2666 21.8558C11.4198 21.8558 10.7333 21.1568 10.7333 20.2946Z"
                            fill="#FF5000"/>
                    </svg>


                    <div>
                        <strong>
                            {openStatus.open
                                ? 'Actuellement ouvert'
                                : 'Actuellement fermé'}
                        </strong>

                        {openStatus.todayLabel ? (
                            <span>{openStatus.todayLabel}</span>
                        ) : null}
                    </div>
                </div>
            ) : null}
            <footer className="site-footer white">
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


                            {newsletter.enabled !== false ? (
                                <div className="site-footer__newsletter">
                                    <h3>{newsletter.title || 'S’abonner à notre Newsletter'}</h3>

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

                        <div className="site-footer__column quicklink">
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
                                    {hourItems.map((item, index) => {
                                        const isToday = isTodayHourItem(item);

                                        return (
                                            <div
                                                key={index}
                                                className={`site-footer__hour-row ${isToday ? 'is-today' : ''}`}
                                            >
            <span className="site-footer__hour-day">
                {item.label || item.day}
            </span>

                                                <span className="site-footer__hour-value">
                {formatHourItem(item)}
            </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>

                        <div className="site-footer__column">
                            <h3>{contact.title || 'Nous contacter'}</h3>

                            <div className="site-footer__contact">
                                <strong>{site.agence.nom}</strong>

                                {contactAdresse ? (
                                    <div className="site-footer__address">
                                        {splitLines(contactAdresse).map((line, index) => (
                                                <span key={`${line}-${index}`}>
                                                    {line}
                                                </span>
                                        ))}
                                    </div>
                                ) : null}

                                {contactTelephone ? (
                                    <a href={`tel:${cleanPhone(contactTelephone)}`}>
                                        {contactTelephone}
                                    </a>
                                ) : null}

                                {contactEmail ? (
                                    <a href={`mailto:${contactEmail}`}>
                                        {contactEmail}
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="site-footer__socials">
                        {socials.facebook ? <a href={socials.facebook} target="_blank" rel="noreferrer">
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="52" height="52" rx="26" fill="white"/>
                                <path
                                    d="M29.7442 17.984H32.0002V14.168C30.9079 14.0545 29.8104 13.9984 28.7122 14C25.4482 14 23.2162 15.992 23.2162 19.64V22.784H19.5322V27.056H23.2162V38H27.6322V27.056H31.3042L31.8562 22.784H27.6322V20.06C27.6322 18.8 27.9682 17.984 29.7442 17.984Z"
                                    fill="#575757"/>
                            </svg>

                        </a> : null}
                        {socials.linkedin ? <a href={socials.linkedin} target="_blank" rel="noreferrer">
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="52" height="52" rx="26" fill="white"/>
                                <path
                                    d="M34.4696 16.0001H17.5296C17.3391 15.9975 17.1501 16.0324 16.9731 16.1028C16.7962 16.1733 16.6349 16.2779 16.4984 16.4107C16.3619 16.5434 16.2529 16.7018 16.1776 16.8767C16.1023 17.0517 16.0622 17.2397 16.0596 17.4301V34.5701C16.0622 34.7606 16.1023 34.9486 16.1776 35.1235C16.2529 35.2985 16.3619 35.4568 16.4984 35.5896C16.6349 35.7224 16.7962 35.827 16.9731 35.8975C17.1501 35.9679 17.3391 36.0028 17.5296 36.0001H34.4696C34.66 36.0028 34.8491 35.9679 35.026 35.8975C35.2029 35.827 35.3643 35.7224 35.5008 35.5896C35.6373 35.4568 35.7463 35.2985 35.8216 35.1235C35.8969 34.9486 35.937 34.7606 35.9396 34.5701V17.4301C35.937 17.2397 35.8969 17.0517 35.8216 16.8767C35.7463 16.7018 35.6373 16.5434 35.5008 16.4107C35.3643 16.2779 35.2029 16.1733 35.026 16.1028C34.8491 16.0324 34.66 15.9975 34.4696 16.0001ZM22.0896 32.7401H19.0896V23.7401H22.0896V32.7401ZM20.5896 22.4801C20.1758 22.4801 19.779 22.3158 19.4865 22.0232C19.1939 21.7307 19.0296 21.3339 19.0296 20.9201C19.0296 20.5064 19.1939 20.1096 19.4865 19.8171C19.779 19.5245 20.1758 19.3601 20.5896 19.3601C20.8093 19.3352 21.0317 19.357 21.2424 19.424C21.4531 19.4911 21.6473 19.6018 21.8122 19.7491C21.9771 19.8964 22.1091 20.0768 22.1994 20.2786C22.2898 20.4804 22.3365 20.699 22.3365 20.9201C22.3365 21.1412 22.2898 21.3599 22.1994 21.5617C22.1091 21.7635 21.9771 21.9439 21.8122 22.0912C21.6473 22.2385 21.4531 22.3492 21.2424 22.4163C21.0317 22.4833 20.8093 22.5051 20.5896 22.4801ZM32.9096 32.7401H29.9096V27.9101C29.9096 26.7001 29.4796 25.9101 28.3896 25.9101C28.0522 25.9126 27.7238 26.0184 27.4484 26.2133C27.1731 26.4082 26.9641 26.6828 26.8496 27.0001C26.7713 27.2352 26.7374 27.4827 26.7496 27.7301V32.7301H23.7496C23.7496 32.7301 23.7496 24.5501 23.7496 23.7301H26.7496V25.0001C27.0221 24.5272 27.4185 24.1377 27.896 23.8733C28.3735 23.609 28.9141 23.48 29.4596 23.5001C31.4596 23.5001 32.9096 24.7901 32.9096 27.5601V32.7401Z"
                                    fill="#575757"/>
                            </svg>
                        </a> : null}
                        {socials.twitter ? <a href={socials.twitter} target="_blank" rel="noreferrer">
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="52" height="52" rx="26" fill="white"/>
                                <path
                                    d="M36 19.8002C35.2483 20.1263 34.4534 20.3419 33.64 20.4402C34.4982 19.9275 35.1413 19.121 35.45 18.1702C34.6436 18.6503 33.7608 18.9885 32.84 19.1702C32.2245 18.5028 31.405 18.0585 30.5098 17.9071C29.6147 17.7556 28.6945 17.9056 27.8938 18.3334C27.093 18.7612 26.4569 19.4427 26.0852 20.271C25.7135 21.0994 25.6273 22.0276 25.84 22.9102C24.2094 22.8277 22.6144 22.4032 21.1587 21.6641C19.7029 20.925 18.4188 19.8879 17.39 18.6202C17.0291 19.2504 16.8395 19.964 16.84 20.6902C16.8387 21.3646 17.0042 22.0288 17.3218 22.6238C17.6393 23.2187 18.099 23.7259 18.66 24.1002C18.008 24.0825 17.3699 23.9075 16.8 23.5902V23.6402C16.8049 24.5851 17.136 25.4993 17.7373 26.2282C18.3386 26.957 19.1733 27.4559 20.1 27.6402C19.7433 27.7488 19.3729 27.806 19 27.8102C18.7419 27.8072 18.4844 27.7838 18.23 27.7402C18.4939 28.553 19.0046 29.2634 19.6911 29.7724C20.3775 30.2814 21.2056 30.5638 22.06 30.5802C20.6172 31.7155 18.8359 32.3351 17 32.3402C16.6657 32.3413 16.3317 32.3213 16 32.2802C17.8744 33.4905 20.0588 34.1329 22.29 34.1302C23.8297 34.1462 25.3571 33.8552 26.7831 33.2743C28.2091 32.6934 29.505 31.8341 30.5952 30.7467C31.6854 29.6593 32.548 28.3656 33.1326 26.9411C33.7172 25.5166 34.012 23.9899 34 22.4502C34 22.2802 34 22.1002 34 21.9202C34.7847 21.335 35.4615 20.6176 36 19.8002Z"
                                    fill="#575757"/>
                            </svg>

                        </a> : null}
                        {socials.instagram ? <a href={socials.instagram} target="_blank" rel="noreferrer">
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="52" height="52" rx="26" fill="white"/>
                                <path
                                    d="M25.9996 22.6714C24.1568 22.6714 22.6711 24.1714 22.6711 26C22.6711 27.8286 24.1711 29.3286 25.9996 29.3286C27.828 29.3286 29.328 27.8286 29.328 26C29.328 24.1714 27.828 22.6714 25.9996 22.6714ZM35.9991 26C35.9991 24.6143 35.9991 23.2571 35.9277 21.8714C35.8563 20.2714 35.4848 18.8429 34.3135 17.6857C33.1421 16.5143 31.7279 16.1429 30.1279 16.0714C28.7423 16 27.3852 16 25.9996 16C24.6139 16 23.2568 16 21.8712 16.0714C20.2712 16.1429 18.8427 16.5143 17.6856 17.6857C16.5143 18.8571 16.1429 20.2714 16.0714 21.8714C16 23.2571 16 24.6143 16 26C16 27.3857 16 28.7429 16.0714 30.1286C16.1429 31.7286 16.5143 33.1571 17.6856 34.3143C18.857 35.4857 20.2712 35.8571 21.8712 35.9286C23.2568 36 24.6139 36 25.9996 36C27.3852 36 28.7423 36 30.1279 35.9286C31.7279 35.8571 33.1564 35.4857 34.3135 34.3143C35.4848 33.1429 35.8563 31.7286 35.9277 30.1286C36.0134 28.7571 35.9991 27.3857 35.9991 26ZM25.9996 31.1286C23.1568 31.1286 20.8712 28.8429 20.8712 26C20.8712 23.1571 23.1568 20.8714 25.9996 20.8714C28.8423 20.8714 31.1279 23.1571 31.1279 26C31.1279 28.8429 28.8423 31.1286 25.9996 31.1286ZM31.3422 21.8571C30.6851 21.8571 30.1422 21.3286 30.1422 20.6571C30.1422 19.9857 30.6708 19.4571 31.3422 19.4571C32.0136 19.4571 32.5421 19.9857 32.5421 20.6571C32.5457 20.8136 32.5172 20.9692 32.4582 21.1142C32.3992 21.2592 32.3111 21.3905 32.1993 21.5C32.0898 21.6118 31.9584 21.7 31.8135 21.7589C31.6685 21.8179 31.5129 21.8465 31.3565 21.8429L31.3422 21.8571Z"
                                    fill="#575757"/>
                            </svg>
                        </a> : null}
                    </div>
                    <div className="casaq-tipiq">
                        <a href="https://pomzed.ch/" target="_blank" aria-label='Agence de communication dans le Jura'>
                            <svg width="50" height="15" viewBox="0 0 50 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8.78281 0.163086V3.03577H5.38537V7.29638C5.38537 8.75693 6.01162 9.33164 7.43286 9.33164C7.96345 9.33164 8.39659 9.25992 8.7819 9.11557V12.0125C8.25131 12.1801 7.6016 12.2761 6.68569 12.2761C4.13197 12.2761 2.08358 10.8639 2.08358 7.94372V3.03667H0V0.163086H8.78281Z"
                                    fill="white"/>
                                <path d="M11.4102 0.163086H14.711V12.1317H11.4102V0.163086Z" fill="white"/>
                                <path d="M31.793 0.163086H35.0939V12.1317H31.793V0.163086Z" fill="white"/>
                                <path
                                    d="M29.787 6.18828C29.787 2.8431 27.0573 0.130006 23.6906 0.130006C22.587 0.130006 21.5556 0.425882 20.6622 0.935147V0H17.3613V15H20.6622V11.4405C21.5547 11.9498 22.587 12.2457 23.6906 12.2457C27.0573 12.2457 29.787 9.53347 29.787 6.18828ZM26.8778 6.18828C26.8778 7.93754 25.4502 9.35595 23.6897 9.35595C21.9291 9.35595 20.5016 7.93754 20.5016 6.18828C20.5016 4.43903 21.9291 3.02062 23.6897 3.02062C25.4502 3.02062 26.8778 4.43903 26.8778 6.18828Z"
                                    fill="white"/>
                                <path
                                    d="M47.7749 10.4816C48.8587 9.37068 49.5282 7.85812 49.5282 6.18867C49.5291 2.77892 46.7471 0.015625 43.3154 0.015625C39.8837 0.015625 37.1025 2.77892 37.1025 6.18867C37.1025 9.59841 39.8846 12.3617 43.3154 12.3617C43.9913 12.3617 44.6401 12.2505 45.2501 12.0524L47.0232 14.9842L49.5761 13.46L47.7749 10.4816ZM46.6524 6.13129C46.6524 7.99351 45.1328 9.50337 43.2585 9.50337C41.3843 9.50337 39.8647 7.99351 39.8647 6.13129C39.8647 4.26906 41.3843 2.7592 43.2585 2.7592C45.1328 2.7592 46.6524 4.26906 46.6524 6.13129Z"
                                    fill="white"/>
                            </svg>


                        </a>
                        <a href="https://pomzed.ch/" target="_blank" aria-label='Agence de communication dans le Jura'>
                            <svg width="61" height="15" viewBox="0 0 61 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_371_8128)">
                                    <path
                                        d="M59.1998 10.4867C60.2821 9.37305 60.952 7.85913 60.952 6.18424C60.952 2.76704 58.1742 -0.00195312 54.7462 -0.00195312C51.3181 -0.00195312 48.5403 2.76704 48.5403 6.18424C48.5403 9.60144 51.3181 12.3704 54.7462 12.3704C55.4226 12.3704 56.0707 12.2595 56.6773 12.0616L58.447 15.0002L60.9978 13.4733L59.1976 10.4889L59.1998 10.4867ZM58.0804 6.12986C58.0804 7.99616 56.5638 9.51008 54.6894 9.51008C52.815 9.51008 51.3007 7.99616 51.3007 6.12986C51.3007 4.26356 52.8194 2.74964 54.6894 2.74964C56.5595 2.74964 58.0804 4.26139 58.0804 6.12986ZM46.5939 12.3944C47.1744 12.3944 47.6391 12.3596 48.1519 12.2312V9.70585C47.9315 9.74065 47.7221 9.75153 47.5235 9.75153C46.919 9.75153 46.7685 9.46223 46.7685 8.89451V5.43163C46.7685 3.25428 46.14 0.672351 41.6799 0.672351C38.8104 0.672351 36.8226 2.03836 36.6371 4.62247L39.6222 4.9705C39.7618 3.76545 40.423 3.19773 41.6908 3.19773C43.2597 3.19773 43.7245 4.12435 43.7245 5.399V5.85144C43.0611 5.74703 42.3651 5.69048 41.6101 5.69048C38.4613 5.69048 36.253 6.5823 36.253 8.99239C36.253 11.0305 37.6583 12.514 40.1568 12.514C42.0508 12.514 43.4343 11.8179 44.0605 10.5803C44.2351 11.9115 44.8854 12.3987 46.5939 12.3987V12.3944ZM43.7245 9.00109C43.2248 9.7189 42.2952 10.1474 41.2151 10.1474C40.135 10.1474 39.6113 9.7189 39.6113 8.87276C39.6113 8.02662 40.3794 7.61116 42.0399 7.61116C42.6334 7.61116 43.1681 7.65684 43.7245 7.76124V9.00109ZM28.3736 4.05475C28.3736 3.45222 28.8274 3.02371 29.9665 3.02371C31.1972 3.02371 31.9762 3.59143 32.1158 4.95744L34.9394 4.70295C34.7889 2.25805 33.3356 0.672351 29.9665 0.672351C27.3764 0.672351 25.4234 1.92308 25.4125 4.22876C25.4016 6.3365 26.761 7.22833 29.9556 7.88958C31.4656 8.19193 32.0591 8.41162 32.0591 9.1403C32.0591 9.81243 31.5594 10.1713 30.3854 10.1713C29.05 10.1713 28.1314 9.67322 27.9568 8.24848L25.0175 8.51603C25.227 11.3198 27.5269 12.5227 30.4094 12.5227C33.292 12.5227 35.0682 11.1436 35.0813 8.99022C35.0922 6.8716 33.652 6.10594 30.584 5.43381C28.8296 5.05098 28.3757 4.716 28.3757 4.05475H28.3736ZM22.7285 12.3944C23.309 12.3944 23.7737 12.3596 24.2865 12.2312V9.70585C24.0661 9.74065 23.8567 9.75153 23.6581 9.75153C23.0537 9.75153 22.9031 9.46223 22.9031 8.89451V5.43163C22.9031 3.25428 22.2747 0.672351 17.8145 0.672351C14.9451 0.672351 12.9572 2.03836 12.7717 4.62247L15.759 4.9705C15.8986 3.76545 16.5598 3.19773 17.8276 3.19773C19.3965 3.19773 19.8613 4.12435 19.8613 5.399V5.85144C19.1979 5.74703 18.5018 5.69048 17.7468 5.69048C14.5981 5.69048 12.3898 6.5823 12.3898 8.99239C12.3898 11.0305 13.7951 12.514 16.2936 12.514C18.1876 12.514 19.5711 11.8179 20.1973 10.5803C20.3719 11.9115 21.0221 12.3987 22.7307 12.3987L22.7285 12.3944ZM19.8569 9.00109C19.3572 9.7189 18.4277 10.1474 17.3475 10.1474C16.2674 10.1474 15.7437 9.7189 15.7437 8.87276C15.7437 8.02662 16.5096 7.61116 18.1723 7.61116C18.7659 7.61116 19.2983 7.65684 19.8569 7.76124V9.00109ZM3.12474 6.591C3.12474 4.64422 4.0783 3.33694 5.8196 3.33694C7.17904 3.33694 8.03878 4.05475 8.30499 5.40988L11.2683 5.12058C10.7336 1.947 8.63012 0.672351 5.78469 0.672351C2.16026 0.672351 0 3.15205 0 6.591C0 10.03 2.16026 12.5205 5.78687 12.5205C8.63448 12.5205 10.7358 11.2459 11.2704 8.07229L8.30717 7.77212C8.03878 9.13813 7.17904 9.85811 5.82178 9.85811C4.0783 9.85811 3.12692 8.54866 3.12692 6.591H3.12474Z"
                                        fill="white"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_371_8128">
                                        <rect width="61" height="15" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>


                        </a>
                    </div>

                    <div className="site-footer__bottom">
                        <p>© {new Date().getFullYear()} {site.agence.nom} | Réalisé sur mesure et avec passion - </p>
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