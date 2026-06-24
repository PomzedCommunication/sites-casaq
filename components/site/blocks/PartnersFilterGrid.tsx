'use client';

import { useMemo, useState } from 'react';
import type { CasaqPartner } from '@/lib/casaq';
import { siteAssetUrl } from '@/lib/site-blocks';
import {parseSiteHtml} from "@/lib/site-html";

type Props = {
    partners: CasaqPartner[];
};

export function PartnersFilterGrid({ partners }: Props) {
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const categories = useMemo(() => {
        const map = new Map<string, string>();

        partners.forEach((partner) => {
            if (!partner.category) {
                return;
            }

            const key = String(partner.category_id || partner.category);
            map.set(key, partner.category);
        });

        return Array.from(map.entries()).map(([id, label]) => ({
            id,
            label,
        }));
    }, [partners]);

    const filteredPartners = useMemo(() => {
        if (activeCategory === 'all') {
            return partners;
        }

        return partners.filter((partner) => {
            const key = String(partner.category_id || partner.category || '');
            return key === activeCategory;
        });
    }, [partners, activeCategory]);

    if (!partners.length) {
        return (
            <div className="partners__empty">
                Aucun partenaire disponible.
            </div>
        );
    }

    return (
        <>
            {categories.length ? (
                <div className="partners__filters" aria-label="Filtrer par catégorie">
                    <button
                        type="button"
                        className={`partners__filter site-btn btn-white ${activeCategory === 'all' ? 'is-active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        Tous
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            className={`partners__filter  site-btn btn-white ${activeCategory === category.id ? 'is-active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            ) : null}

            <div className="partners__grid">
                {filteredPartners.map((partner) => {
                    const logo = siteAssetUrl(partner.logo_image);

                    return (
                        <article key={partner.id} className="partners__card">
                            {logo ? (
                                <div className="partners__logo-wrap">
                                    <img
                                        src={logo}
                                        alt={partner.name || ''}
                                        className="partners__logo"
                                    />
                                </div>
                            ) : null}

                            {/*{partner.category ? (*/}
                            {/*    <div className="partners__category">*/}
                            {/*        {partner.category}*/}
                            {/*    </div>*/}
                            {/*) : null}*/}
                            {partner.city ? (
                                <p className="partners__city">
                                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5 0C2.24315 0 5.09024e-05 2.1534 5.09024e-05 4.797C-0.0180739 8.664 4.81 11.8704 5 12C5 12 10.0181 8.664 9.99995 4.8C9.99995 2.1534 7.75685 0 5 0ZM5 7.2C3.61876 7.2 2.50003 6.126 2.50003 4.8C2.50003 3.474 3.61876 2.4 5 2.4C6.38124 2.4 7.49998 3.474 7.49998 4.8C7.49998 6.126 6.38124 7.2 5 7.2Z"
                                            fill="#575757"/>
                                    </svg>

                                    {partner.city}
                                </p>
                            ) : null}
                            <h3>{partner.name}</h3>

                            {partner.description ?
                                <div className="txt">{parseSiteHtml(partner.description)}</div> : null}

                            <div className="partners__actions">
                                {partner.email ? (
                                    <a href={`mailto:${partner.email}`} aria-label="Email">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_365_608)">
                                                <path d="M2.33301 17.5C1.81738 17.5 1.37613 17.3166 1.00926 16.9497C0.642383 16.5828 0.458633 16.1412 0.458008 15.625V4.375C0.458008 3.85937 0.641758 3.41812 1.00926 3.05125C1.37676 2.68437 1.81801 2.50062 2.33301 2.5H17.333C17.8486 2.5 18.2902 2.68375 18.6577 3.05125C19.0252 3.41875 19.2086 3.86 19.208 4.375V15.625C19.208 16.1406 19.0246 16.5822 18.6577 16.9497C18.2908 17.3172 17.8493 17.5006 17.333 17.5H2.33301ZM9.83301 10.9375L17.333 6.25V4.375L9.83301 9.0625L2.33301 4.375V6.25L9.83301 10.9375Z" fill="white"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_365_608">
                                                    <rect width="20" height="20" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </a>
                                ) : null}

                                {partner.phone ? (
                                    <a href={`tel:${partner.phone.replace(/[^\d+]/g, '')}`} aria-label="Téléphone">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.85523 8.65556C5.45523 11.8 8.03301 14.3667 11.1775 15.9778L13.6219 13.5333C13.9219 13.2333 14.3663 13.1333 14.7552 13.2667C15.9997 13.6778 17.3441 13.9 18.7219 13.9C19.333 13.9 19.833 14.4 19.833 15.0111V18.8889C19.833 19.5 19.333 20 18.7219 20C8.28856 20 -0.166992 11.5444 -0.166992 1.11111C-0.166992 0.5 0.333008 0 0.944119 0H4.83301C5.44412 0 5.94412 0.5 5.94412 1.11111C5.94412 2.5 6.16634 3.83333 6.57745 5.07778C6.69967 5.46667 6.61079 5.9 6.29967 6.21111L3.85523 8.65556Z" fill="white"/>
                                        </svg>

                                    </a>
                                ) : null}

                                {partner.website ? (
                                    <a href={partner.website} target="_blank" rel="noreferrer" aria-label="Site web">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.66667 10C6.66667 10.8444 6.70444 11.6631 6.77467 12.4444H13.2253C13.2956 11.6631 13.3333 10.8444 13.3333 10C13.3333 9.15556 13.2956 8.33689 13.2249 7.55556H6.77556C6.70444 8.33689 6.66667 9.15556 6.66667 10ZM5.43689 7.55556C5.36733 8.36851 5.33278 9.18408 5.33333 10C5.33333 10.8382 5.36889 11.6564 5.43644 12.4444H0.300889C0.104444 11.6622 0 10.8431 0 10C0 9.15689 0.104444 8.33778 0.300889 7.55556H5.43689ZM6.93289 6.22222H13.0667C12.8693 4.87689 12.5707 3.67733 12.2004 2.692C11.8542 1.77067 11.4587 1.07067 11.0538 0.613778C10.648 0.155111 10.2898 0 10 0C9.71022 0 9.352 0.155556 8.94578 0.613333C8.54089 1.07111 8.14533 1.77067 7.79911 2.692C7.42889 3.67733 7.13022 4.87689 6.93244 6.22222M14.5631 7.55556C14.6311 8.34356 14.6667 9.16178 14.6667 10C14.6667 10.8382 14.6311 11.6564 14.5636 12.4444H19.6991C19.8956 11.6622 20 10.8431 20 10C20 9.15689 19.8956 8.33778 19.6991 7.55556H14.5631ZM19.2622 6.22222H14.4138C14.2049 4.71644 13.8742 3.35556 13.4489 2.22311C13.1773 1.50044 12.8609 0.853333 12.5004 0.315111C15.576 1.10711 18.0782 3.32533 19.2613 6.22222M5.58578 6.22222H0.738222C1.92089 3.32533 4.42356 1.10711 7.49911 0.315556C7.13911 0.853333 6.82222 1.50044 6.55067 2.22311C6.12533 3.35556 5.79511 4.71644 5.58622 6.22222M5.58489 13.7778H0.738222C1.92044 16.6733 4.42089 18.8907 7.49378 19.6836C7.13378 19.1458 6.81822 18.4987 6.54711 17.7769C6.12267 16.6436 5.79289 15.2836 5.58489 13.7778ZM12.2044 17.3084C12.5733 16.3231 12.8711 15.1236 13.0684 13.7778H6.93156C7.12844 15.1236 7.42622 16.3231 7.79556 17.3084C8.14133 18.2298 8.53644 18.9293 8.94222 19.3862C9.34756 19.844 9.70667 20 10 20C10.2933 20 10.6524 19.844 11.0578 19.3862C11.4636 18.9293 11.8587 18.2298 12.2044 17.3084ZM13.4529 17.7764C13.8773 16.644 14.2071 15.2831 14.4151 13.7778H19.2618C18.0796 16.6733 15.5791 18.8907 12.5062 19.6836C12.8662 19.1458 13.1818 18.4982 13.4529 17.7764Z" fill="white"/>
                                        </svg>

                                    </a>
                                ) : null}
                            </div>
                        </article>
                    );
                })}
            </div>
        </>
    );
}