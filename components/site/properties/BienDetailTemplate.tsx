'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Circle,
    GoogleMap,
    Marker,
    InfoWindow,
    useJsApiLoader,
} from '@react-google-maps/api';
import type { CasaqBien, CasaqSiteConfig } from '@/lib/casaq';
import { getBienSeoPath } from '@/lib/property-url';
import { PropertyContactForm } from '@/components/site/properties/PropertyContactForm';
import { PropertyGallerySlider } from '@/components/site/properties/PropertyGallerySlider';
import { FeaturedBiensSlider } from '@/components/site/blocks/FeaturedBiensSlider';
import { FavoriteButton } from '@/components/site/favorites/FavoriteButton';
import parse from 'html-react-parser';
import { SiteFloatingActions } from '@/components/site/SiteFloatingActions';
import { trackBienEvent } from '@/lib/casaq';

type Props = {
    site: CasaqSiteConfig;
    bien: CasaqBien;
    domain: string;
    similarBiens?: CasaqBien[];
};
const googleMapsLibraries: 'places'[] = ['places'];
export function BienDetailTemplate({
                                       site,
                                       bien,
                                       domain,
                                       similarBiens = [],
                                   }: Props) {
    const images = getImages(bien);
    const mainImage = getHeroImage(bien) || images[0] || null;

    const features = getMainFeatures(bien);
    const documents = getDocuments(bien);
    const contactAdresse = site.footer?.contact?.adresse || site.infos.adresse;
    const contactTelephone = site.footer?.contact?.telephone || site.infos.telephone;
    const contactEmail = site.footer?.contact?.email || site.infos.email;

    useEffect(() => {
        trackBienEvent(domain, bien.id, 'view');
    }, [domain, bien.id]);

    const contactClickTrackedRef = useRef(false);

    const trackContactClickOnce = () => {
        if (contactClickTrackedRef.current) {
            return;
        }

        contactClickTrackedRef.current = true;
        trackBienEvent(domain, bien.id, 'contact_click');
    };

    return (
        <main className="property-detail">
            <SiteFloatingActions type="property" bienId={bien.id} domain={domain} />
            {/* HERO */}
            <section className="site-hero site-hero--simple property-detail__hero ">
                {mainImage ? (
                    <Image
                        src={mainImage.src}
                        alt={mainImage.alt || bien.titre}
                        fill
                        priority
                        fetchPriority="high"
                        quality={95}
                        sizes="100vw"
                        className="property-detail__hero-image"
                    />
                ) : null}

                <div className="property-detail__hero-overlay"/>

                <div className="property-detail__hero-content">
                    <div className="property-detail__badges">
                        {bien.categorie ? (
                            <div className="site-btn btn-grey btn-sm">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.47059 13.2353C1.06618 13.2353 0.720098 13.0914 0.432353 12.8037C0.144608 12.5159 0.000490196 12.1696 0 11.7647V4.41176C0 4.00735 0.144118 3.66127 0.432353 3.37353C0.720588 3.08578 1.06667 2.94167 1.47059 2.94118H2.94118V1.47059C2.94118 1.06618 3.08529 0.720098 3.37353 0.432353C3.66176 0.144608 4.00784 0.000490196 4.41176 0H8.82353C9.22794 0 9.57426 0.144118 9.8625 0.432353C10.1507 0.720588 10.2946 1.06667 10.2941 1.47059V5.88235H11.7647C12.1691 5.88235 12.5154 6.02647 12.8037 6.31471C13.0919 6.60294 13.2358 6.94902 13.2353 7.35294V11.7647C13.2353 12.1691 13.0914 12.5154 12.8037 12.8037C12.5159 13.0919 12.1696 13.2358 11.7647 13.2353H7.35294V10.2941H5.88235V13.2353H1.47059ZM1.47059 11.7647H2.94118V10.2941H1.47059V11.7647ZM1.47059 8.82353H2.94118V7.35294H1.47059V8.82353ZM1.47059 5.88235H2.94118V4.41176H1.47059V5.88235ZM4.41176 8.82353H5.88235V7.35294H4.41176V8.82353ZM4.41176 5.88235H5.88235V4.41176H4.41176V5.88235ZM4.41176 2.94118H5.88235V1.47059H4.41176V2.94118ZM7.35294 8.82353H8.82353V7.35294H7.35294V8.82353ZM7.35294 5.88235H8.82353V4.41176H7.35294V5.88235ZM7.35294 2.94118H8.82353V1.47059H7.35294V2.94118ZM10.2941 11.7647H11.7647V10.2941H10.2941V11.7647ZM10.2941 8.82353H11.7647V7.35294H10.2941V8.82353Z"
                                        fill="white"/>
                                </svg>

                                {bien.categorie}
                            </div>
                        ) : null}

                        {bien.adresse?.ville ? (
                            <div className="site-btn btn-grey btn-sm">
                                <svg width="10" height="15" viewBox="0 0 10 15" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5 7.125C4.5264 7.125 4.0722 6.92746 3.73731 6.57583C3.40242 6.22419 3.21429 5.74728 3.21429 5.25C3.21429 4.75272 3.40242 4.27581 3.73731 3.92417C4.0722 3.57254 4.5264 3.375 5 3.375C5.4736 3.375 5.9278 3.57254 6.26269 3.92417C6.59758 4.27581 6.78571 4.75272 6.78571 5.25C6.78571 5.49623 6.73953 5.74005 6.64979 5.96753C6.56004 6.19502 6.42851 6.40172 6.26269 6.57583C6.09687 6.74994 5.90002 6.88805 5.68336 6.98227C5.46671 7.0765 5.2345 7.125 5 7.125ZM5 0C3.67392 0 2.40215 0.553123 1.46447 1.53769C0.526784 2.52226 0 3.85761 0 5.25C0 9.1875 5 15 5 15C5 15 10 9.1875 10 5.25C10 3.85761 9.47322 2.52226 8.53553 1.53769C7.59785 0.553123 6.32608 0 5 0Z"
                                        fill="white"/>
                                </svg>
                                {bien.adresse.ville}
                            </div>
                        ) : null}

                        {getAvailabilityLabel(bien) ? (
                            <div className="site-btn btn-sm">{getAvailabilityLabel(bien)}</div>
                        ) : null}
                        {/*<FavoriteButton bienId={bien.id}/>*/}
                    </div>

                    <h1 className='white'>{bien.titre}</h1>

                    <p className='white'>
                        {formatHeroPrice(bien)}
                        {getFullAddress(bien) ? ` — ${getFullAddress(bien)}` : ''}
                    </p>
                </div>
            </section>

            {/* RÉSUMÉ */}
            <section className="property-detail__summary pd-l-r">
                <div className="grid-details">
                    <div className="property-detail__summary-left">
                        <h2 className='h3' style={{whiteSpace: 'pre-line'}}>
                            {getSubtitle(bien) || bien.titre}
                        </h2>


                    </div>

                    {/*<aside className="property-detail__price-box">*/}
                    {/*    <span>{bien.deal === 'RENT' ? 'Prix net du loyer' : 'Prix de vente'}</span>*/}
                    {/*    <strong className='h3'>{formatPrice(bien)}</strong>*/}
                    {/*</aside>*/}

                    <aside className="property-detail__price-box">
                        <PropertyPriceBox bien={bien}/>
                    </aside>
                </div>


                <div className="property-detail__features-grid">
                    {features.map((feature) => (
                        <FeatureItem
                            key={feature.label}
                            label={feature.label}
                            value={feature.value}
                            type={feature.type}
                        />
                    ))}
                </div>


                {/*<details className="property-detail__all-features">*/}
                {/*    <summary>Toutes les caractéristiques*/}
                {/*        <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                {/*            <path d="M0 0L5 5L10 0H0Z" fill="#575757"/>*/}
                {/*        </svg>*/}
                {/*    </summary>*/}

                {/*    <div className="property-detail__characteristics-blocks">*/}
                {/*        {getCharacteristicBlocks(bien).map((block) => (*/}
                {/*            <div*/}
                {/*                key={block.title}*/}
                {/*                className="property-detail__characteristics-block"*/}
                {/*            >*/}
                {/*                <h3>{block.title}</h3>*/}

                {/*                <div className="property-detail__features-grid">*/}
                {/*                    {block.items.map((item) => (*/}
                {/*                        <FeatureItem*/}
                {/*                            key={`${block.title}-${item.label}`}*/}
                {/*                            label={item.label}*/}
                {/*                            value={item.value}*/}
                {/*                        />*/}
                {/*                    ))}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</details>*/}
                <SmoothDetails className="property-detail__all-features">
                    <summary>
                        Toutes les caractéristiques
                        <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0L5 5L10 0H0Z" fill="#575757"/>
                        </svg>
                    </summary>

                    <div className="property-detail__characteristics-blocks">
                        {/*{getCharacteristicBlocks(bien).map((block) => (*/}
                        {/*    <div*/}
                        {/*        key={block.title}*/}
                        {/*        className="property-detail__characteristics-block"*/}
                        {/*    >*/}
                        {/*        <h3>{block.title}</h3>*/}

                        {/*        <div className="property-detail__features-grid">*/}
                        {/*            {block.items.map((item) => (*/}
                        {/*                <FeatureItem*/}
                        {/*                    key={`${block.title}-${item.label}`}*/}
                        {/*                    label={item.label}*/}
                        {/*                    value={item.value}*/}
                        {/*                />*/}
                        {/*            ))}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*))}*/}

                        {getCharacteristicBlocks(bien).map((block) => (
                            <CharacteristicTableBlock
                                key={block.title}
                                title={block.title}
                                items={block.items}
                            />
                        ))}
                    </div>
                </SmoothDetails>
            </section>

            {/* GALERIE */}
            {/*<PropertyGallerySlider*/}
            {/*    images={images}*/}
            {/*    title={bien.titre}*/}
            {/*/>*/}
            <DeferredPropertyGallerySlider
                images={images}
                title={bien.titre}
            />
            {/* CONTENU PRINCIPAL + CONTACT */}
            <section className="property-detail__content pd-l-r">
                <div className="property-detail__main">
                    <section className="property-detail__description">
                        <h2>Descriptif</h2>

                        {getFullDescription(bien) ? (
                            <HtmlBlock value={getFullDescription(bien)}/>
                        ) : (
                            <p>Description à compléter dans CasaQ.</p>
                        )}
                    </section>

                    <div className="property-detail__accordions">
                        {getDescriptionBlocks(bien).map((block, index) => (
                            <SmoothAccordion
                                key={block.title}
                                title={block.title}
                                defaultOpen={index === 0}
                            >
                                {/*{block.items.map((item) => (*/}
                                {/*    <div*/}
                                {/*        key={`${block.title}-${item.label}`}*/}
                                {/*        className="property-detail__description-item"*/}
                                {/*    >*/}
                                {/*        <h3>{item.label}</h3>*/}
                                {/*        <TextBlock value={item.value}/>*/}
                                {/*    </div>*/}
                                {/*))}*/}

                                {block.items.map((item) => (
                                    <div
                                        key={`${block.title}-${item.label}`}
                                        className="property-detail__description-item"
                                    >
                                        <h3>{item.label}</h3>
                                        <HtmlBlock value={item.value} />
                                    </div>
                                ))}
                            </SmoothAccordion>
                        ))}
                        <SmoothAccordion title="Localisation">
                            <PropertyLocationMap bien={bien}/>
                        </SmoothAccordion>
                    </div>
                </div>

                {getVisitContact(bien) ? (
                    <aside>
                        <ContactCard bien={bien} domain={domain} />
                    </aside>
                ) : null}
            </section>

            {/* INTÉRÊT + DOCUMENTS + FORMULAIRE */}
            <section className="property-detail__lead pd-l-r">
                <h2>Ce bien vous intéresse?</h2>

                {/*{documents.length > 0 ? (*/}
                {/*    <div className="property-detail__documents">*/}
                {/*        {documents.map((document) => (*/}
                {/*            <a*/}
                {/*                key={document.url}*/}
                {/*                href={document.url}*/}
                {/*                target="_blank"*/}
                {/*                rel="noreferrer"*/}
                {/*                className="property-detail__document w"*/}
                {/*            >*/}
                {/*                <span className="h3">{document.label}</span>*/}

                {/*                <small>*/}
                {/*                    {document.extension*/}
                {/*                        ? `${document.extension.toUpperCase()} · Télécharger`*/}
                {/*                        : 'Télécharger'}*/}
                {/*                </small>*/}
                {/*            </a>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*) : null}*/}
                {documents.length > 0 ? (
                    <div className="property-detail__documents">
                        {documents.map((document) => (
                            <a
                                onClick={() => trackBienEvent(domain, bien.id, 'document_download')}
                                key={document.url}
                                href={document.url}
                                download={getDocumentDownloadName(document)}
                                className="property-detail__document white"
                            >
                                <svg
                                    className="icone-pdf"
                                    width="26"
                                    height="30"
                                    viewBox="0 0 26 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 16H4V14H5C5.26522 14 5.51957 14.1054 5.70711 14.2929C5.89464 14.4804 6 14.7348 6 15C6 15.2652 5.89464 15.5196 5.70711 15.7071C5.51957 15.8946 5.26522 16 5 16ZM12 20V14H13C13.2652 14 13.5196 14.1054 13.7071 14.2929C13.8946 14.4804 14 14.7348 14 15V19C14 19.2652 13.8946 19.5196 13.7071 19.7071C13.5196 19.8946 13.2652 20 13 20H12Z"
                                        fill="white"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0 3C0 2.20435 0.316071 1.44129 0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0L19.414 0L26 6.586V27C26 27.7956 25.6839 28.5587 25.1213 29.1213C24.5587 29.6839 23.7956 30 23 30H3C2.20435 30 1.44129 29.6839 0.87868 29.1213C0.316071 28.5587 0 27.7956 0 27V3ZM5 12H2V22H4V18H5C5.79565 18 6.55871 17.6839 7.12132 17.1213C7.68393 16.5587 8 15.7956 8 15C8 14.2044 7.68393 13.4413 7.12132 12.8787C6.55871 12.3161 5.79565 12 5 12ZM13 12H10V22H13C13.7956 22 14.5587 21.6839 15.1213 21.1213C15.6839 20.5587 16 19.7956 16 19V15C16 14.2044 15.6839 13.4413 15.1213 12.8787C14.5587 12.3161 13.7956 12 13 12ZM18 22V12H24V14H20V16H22V18H20V22H18Z"
                                        fill="white"
                                    />
                                </svg>

                                <svg
                                    className="icone-down"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 30 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M14.2969 21.5869C14.0781 21.5081 13.875 21.375 13.6875 21.1875L6.93749 14.4375C6.56249 14.0625 6.38249 13.625 6.3975 13.125C6.4125 12.625 6.59249 12.1875 6.93749 11.8125C7.31249 11.4375 7.75812 11.2425 8.27437 11.2275C8.79062 11.2125 9.23562 11.3919 9.60937 11.7656L13.125 15.2813V1.87501C13.125 1.34376 13.305 0.898756 13.665 0.540006C14.025 0.181257 14.47 0.00125646 15 6.46551e-06C15.53 -0.00124353 15.9756 0.178757 16.3369 0.540006C16.6981 0.901256 16.8775 1.34626 16.875 1.87501V15.2813L20.3906 11.7656C20.7656 11.3906 21.2112 11.2106 21.7275 11.2256C22.2437 11.2406 22.6887 11.4363 23.0625 11.8125C23.4062 12.1875 23.5862 12.625 23.6025 13.125C23.6187 13.625 23.4387 14.0625 23.0625 14.4375L16.3125 21.1875C16.125 21.375 15.9219 21.5081 15.7031 21.5869C15.4844 21.6656 15.25 21.7044 15 21.7031C14.75 21.7019 14.5156 21.6631 14.2969 21.5869ZM3.75 30C2.71875 30 1.83625 29.6331 1.1025 28.8994C0.368749 28.1656 0.00125 27.2825 0 26.25V22.5C0 21.9687 0.18 21.5237 0.54 21.165C0.899999 20.8062 1.345 20.6262 1.875 20.625C2.405 20.6237 2.85062 20.8037 3.21187 21.165C3.57312 21.5262 3.7525 21.9712 3.75 22.5V26.25H26.25V22.5C26.25 21.9687 26.43 21.5237 26.79 21.165C27.15 20.8062 27.595 20.6262 28.125 20.625C28.655 20.6237 29.1006 20.8037 29.4618 21.165C29.8231 21.5262 30.0025 21.9712 30 22.5V26.25C30 27.2812 29.6331 28.1644 28.8994 28.8994C28.1656 29.6344 27.2825 30.0012 26.25 30H3.75Z"
                                        fill="white"
                                    />
                                </svg>

                                <span className="h3">{document.label}</span>
                            </a>
                        ))}
                    </div>
                ) : null}
                <div className="property-detail__form-grid">
                    <div className="property-detail__agency-info">
                        <h2>Formulaire de contact</h2>

                        <p>
                            Remplissez le formulaire et notre équipe vous recontactera rapidement.
                        </p>

                        <div>
                            <strong className="p">{site.agence.nom}</strong>

                            {contactAdresse ? (
                                <div className="property-detail__agency-address">
                                    {splitLines(contactAdresse).map((line, index) => (
                                        <span className="p" key={`${line}-${index}`}>
                {line}
            </span>
                                    ))}
                                </div>
                            ) : null}

                            {contactTelephone ? (
                                <p>{contactTelephone}</p>
                            ) : null}

                            {contactEmail ? (
                                <p>{contactEmail}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="property-detail__form" onClick={trackContactClickOnce}>
                        <div className="property-detail__selected-property">
                            <label>Bien sélectionné</label>
                            <div>{bien.titre}</div>
                        </div>

                        <PropertyContactForm
                            domain={domain}
                            bienId={bien.id}
                        />
                    </div>
                </div>
            </section>


            <section className="section cta-banner white">
                <div className="container pd-l-r">
                    <div className="cta-banner__inner">
                        <div className="section-heading section-heading--with-action">
                            <div>
                                <h2>À votre écoute, pour votre confort</h2>

                                <div className="txt white">
                                    <p>
                                        Notre société forte d’une équipe jeune, motivée et dynamique est à même de
                                        vous satisfaire pleinement.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/contact"
                                className="site-btn btn-white "
                            >
                                Prendre contact
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {similarBiens.length > 0 ? (
                <section className="section pd-l-r featured-biens featured-biens--carousel">
                    <div className="container">
                        <div className="section-heading section-heading--with-action">
                            <div>
                                <h2>Biens similaires</h2>

                                <div className="txt">
                                    <p>
                                        Retrouvez une sélection de biens pouvant également vous intéresser.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/biens"
                                className="site-btn site-btn--primary"
                            >
                                Voir tous les biens
                            </Link>
                        </div>

                        <FeaturedBiensSlider
                            biens={similarBiens.map(serializeSimilarBien)}
                        />
                    </div>
                </section>
            ) : null}


        </main>
    );
}

function FeatureItem({
                         label,
                         value,
                         type,
                     }: {
    label: string;
    value?: string | number | null;
    type: MainFeatureType;
}) {
    if (!hasValue(value)) {
        return null;
    }

    return (
        <div className="property-detail__feature">
            <span className='p'>
                {getFeatureIcon(type)}
                {label}
            </span>
            <strong>{value}</strong>
        </div>
    );
}

function DeferredPropertyGallerySlider({
                                           images,
                                           title,
                                       }: {
    images: Array<{ src: string; alt?: string | null }>;
    title: string;
}) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const element = wrapperRef.current;

        if (!element || shouldRender) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldRender(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '900px 0px',
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [shouldRender]);

    return (
        <div ref={wrapperRef}>
            {shouldRender ? (
                <PropertyGallerySlider
                    images={images}
                    title={title}
                />
            ) : (
                <section className="property-detail__gallery pd-l-r">
                    <div className="property-detail__gallery-placeholder" />
                </section>
            )}
        </div>
    );
}


function getFeatureIcon(
    type: 'pieces' | 'bedrooms' | 'bathrooms' | 'kitchen' | 'balcony' | 'terrace' | 'surface' | 'parking'
) {
    switch (type) {
        case 'bedrooms':
            return (
                <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_365_4512)">
                        <path
                            d="M11.0119 15.4597C8.01369 15.4597 5.01627 15.4597 2.01806 15.4597C1.71493 15.4597 1.57479 15.5984 1.57479 15.8977C1.57479 15.9752 1.57872 16.0527 1.574 16.1295C1.5677 16.2225 1.55825 16.3155 1.54093 16.4062C1.47637 16.7372 1.15907 17.0023 0.779568 16.9984C0.398493 16.9946 0.0827672 16.7116 0.025291 16.3481C0.0119061 16.2628 0.00482004 16.1752 0.00482004 16.0891C0.00403269 14.3279 -0.00777748 12.5659 0.00875676 10.8046C0.0182049 9.77829 0.397705 8.88527 1.12521 8.14186C1.56691 7.69069 2.09207 7.36976 2.69282 7.16511C3.16522 7.00465 3.65338 6.95581 4.15098 6.95581C8.76246 6.95736 13.3739 6.95348 17.9854 6.95891C19.3365 6.96046 20.4309 7.4969 21.2419 8.56356C21.6403 9.08837 21.8781 9.68449 21.9592 10.3357C21.9867 10.555 21.9985 10.7783 21.9993 11C22.0025 12.7101 22.0017 14.4202 22.0009 16.1302C22.0009 16.3977 21.934 16.6411 21.7104 16.8178C21.4741 17.0046 21.2104 17.0535 20.9293 16.9395C20.66 16.8295 20.49 16.6271 20.4514 16.338C20.4317 16.1922 20.4341 16.0426 20.4301 15.8953C20.4238 15.6574 20.3238 15.5139 20.1239 15.4698C20.0798 15.4597 20.0333 15.4605 19.9876 15.4605C16.9965 15.4605 14.0054 15.4605 11.0135 15.4605L11.0119 15.4597Z"
                            fill="#575757"/>
                        <path
                            d="M10.9025 0C12.8472 0 14.7912 0 16.7351 0C17.3862 0 17.9949 0.143411 18.52 0.539535C19.1956 1.04884 19.59 1.71938 19.6231 2.56124C19.6514 3.27519 19.6388 3.9907 19.642 4.70543C19.6444 5.16589 19.642 5.62636 19.642 6.08682C19.642 6.12791 19.6396 6.17132 19.6286 6.21085C19.5948 6.33566 19.5263 6.38527 19.3971 6.36124C19.2562 6.33488 19.12 6.27829 18.979 6.26279C18.6476 6.22713 18.3153 6.20233 17.9823 6.18527C17.7602 6.17364 17.6917 6.13411 17.6602 5.91938C17.5595 5.23876 16.9194 4.62636 16.1005 4.63566C15.1872 4.64574 14.2739 4.63798 13.3613 4.63798C12.6819 4.63798 12.1016 5.03643 11.8709 5.66434C11.8378 5.75426 11.8252 5.85194 11.8079 5.94651C11.7756 6.11628 11.7119 6.17984 11.5402 6.18217C11.1804 6.18605 10.8198 6.18605 10.46 6.18217C10.2946 6.18062 10.2293 6.11628 10.1994 5.92791C10.1576 5.66357 10.0537 5.42791 9.88364 5.22093C9.57579 4.84574 9.17739 4.64186 8.68609 4.63953C7.74363 4.63488 6.80118 4.63721 5.85794 4.63876C5.06587 4.63953 4.44623 5.24884 4.34545 5.91783C4.31317 6.13411 4.24782 6.17209 4.02579 6.18605C3.6581 6.21008 3.29041 6.24419 2.92351 6.28295C2.81092 6.29457 2.70305 6.34264 2.59125 6.36124C2.47078 6.38062 2.41488 6.34031 2.38103 6.22403C2.36764 6.17829 2.36134 6.12946 2.36134 6.0814C2.36055 4.97674 2.3456 3.87209 2.36449 2.76744C2.38418 1.61163 2.92666 0.762016 3.988 0.248062C4.40844 0.0457364 4.86431 0 5.3257 0C7.18462 0 9.04354 0 10.9025 0Z"
                            fill="#575757"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_365_4512">
                            <rect width="22" height="17" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>

            );

        case 'bathrooms':
            return (
                <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_365_4521)">
                        <path
                            d="M1.26946 13.7615H11.11V15.5696H17.2615V13.7654H19.7054C19.8637 15.9157 19.8761 17.8303 17.6707 19.2896C17.6437 19.3074 17.6221 19.3317 17.5623 19.3849C17.8335 19.6101 18.1009 19.8328 18.3655 20.0528C18.0082 20.3943 17.7212 20.6689 17.3922 20.9841C17.1019 20.6846 16.7879 20.3372 16.4458 20.0206C16.3453 19.9274 16.1673 19.8893 16.0215 19.8801C15.7831 19.8656 15.5414 19.9044 15.301 19.905C12.1057 19.907 8.91048 19.9063 5.71457 19.9063C5.56154 19.9063 5.398 19.9359 5.25679 19.8932C4.83054 19.7651 4.55994 19.9628 4.30642 20.2682C4.09034 20.5283 3.84405 20.7628 3.61877 21.0005C3.31468 20.6807 3.03949 20.3917 2.73474 20.0705C2.939 19.8899 3.19843 19.66 3.49004 19.4013C3.28906 19.2574 3.13866 19.1576 2.99614 19.0473C1.92821 18.2243 1.3509 17.1327 1.27537 15.7922C1.23793 15.1282 1.2688 14.4603 1.2688 13.7615H1.26946Z"
                            fill="#575757"/>
                        <path
                            d="M1.27554 8.78721C1.27029 8.66834 1.26109 8.56128 1.26109 8.45423C1.26044 6.71375 1.25847 4.97393 1.26109 3.23345C1.26372 1.3209 2.59108 -0.0136865 4.50101 0.000105915C5.14203 0.0047034 5.80275 -0.00843228 6.41882 0.136717C7.5117 0.394833 8.20001 1.15276 8.53235 2.22069C8.59671 2.42824 8.68012 2.52872 8.90803 2.59046C10.194 2.93921 11.0964 4.14113 11.1128 5.48228C11.1155 5.69836 11.1128 5.91444 11.1128 6.14891H5.02578C4.73548 4.61401 5.56959 3.02985 7.31335 2.53529C7.15573 1.85027 6.48121 1.2723 5.7732 1.24734C5.23792 1.22829 4.70067 1.22632 4.16539 1.24734C3.24261 1.28346 2.50044 2.13071 2.4965 3.14676C2.48994 4.89774 2.49453 6.64938 2.49453 8.40037C2.49453 8.5199 2.49453 8.63944 2.49453 8.78656H1.27423L1.27554 8.78721Z"
                            fill="#575757"/>
                        <path
                            d="M11.0931 12.5328C10.9644 12.5328 10.8678 12.5328 10.7713 12.5328C7.64366 12.5328 4.5154 12.5335 1.38779 12.5321C0.714591 12.5321 0.230541 12.2136 0.0604342 11.6698C-0.195711 10.8514 0.384229 10.0633 1.26826 10.0515C2.20877 10.039 3.14929 10.0482 4.0898 10.0482C6.29922 10.0482 8.50799 10.0482 10.7174 10.0482C10.8356 10.0482 10.9538 10.0482 11.0931 10.0482V12.5321V12.5328Z"
                            fill="#575757"/>
                        <path
                            d="M16.0234 14.371H12.3632C12.3573 14.2554 12.3474 14.1503 12.3474 14.0452C12.3461 12.777 12.3461 11.5081 12.3474 10.2398C12.3481 9.3223 12.8492 8.81789 13.7628 8.81395C14.1017 8.81263 14.4406 8.80541 14.7795 8.81592C15.5407 8.84022 16.0379 9.35185 16.0399 10.115C16.0438 11.4385 16.0412 12.7612 16.0399 14.0846C16.0399 14.1707 16.0307 14.2561 16.0234 14.371Z"
                            fill="#575757"/>
                        <path
                            d="M17.2832 12.521V10.0482C17.8782 10.0482 18.4648 10.0462 19.0506 10.0489C19.356 10.0502 19.668 10.0252 19.9668 10.0745C20.619 10.1822 21.0433 10.7162 21.0164 11.3395C20.9901 11.9509 20.5389 12.4757 19.8985 12.5092C19.0394 12.5545 18.1764 12.5204 17.2839 12.5204L17.2832 12.521Z"
                            fill="#575757"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_365_4521">
                            <rect width="21.0171" height="21" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>

            );

        case 'surface':
            return (
                <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.83729 3.26484C1.61265 3.529 1.38735 3.7925 1.16798 4.05008C0.737154 3.6153 0.36166 3.23717 0 2.87287C0.916996 1.95456 1.85244 1.01846 2.77602 0.0942171C3.70026 1.02044 4.63505 1.95654 5.55072 2.87419C5.19302 3.2319 4.81489 3.60937 4.40382 4.02044C4.16601 3.75496 3.91041 3.46971 3.59025 3.11332V6.90318C5.31555 5.17524 7.08234 3.40713 8.8386 1.64824C8.37549 1.64824 7.85112 1.61596 7.33333 1.65812C6.88472 1.69435 6.57115 1.54679 6.27866 1.21609C5.92358 0.814902 5.51976 0.456536 5.08235 0.0263646C5.24769 0.0138482 5.33794 0.00133171 5.42885 0.00133171C9.82148 0.000672948 14.2141 -0.00130334 18.6067 0.00133171C20.0086 0.00199047 21.0079 0.978934 21.0099 2.37221C21.0171 6.78789 21.0125 11.2029 21.0125 15.6186C21.0125 15.6799 21.0059 15.7418 20.9209 15.8617C20.5231 15.4453 20.143 15.0099 19.72 14.6206C19.4453 14.3676 19.3347 14.1041 19.357 13.7326C19.3887 13.2128 19.365 12.6897 19.365 12.1733C17.6008 13.9394 15.8544 15.6871 14.112 17.4315H17.9091C17.554 17.1416 17.2615 16.9032 16.9743 16.6687C17.4453 16.2154 17.8287 15.8465 18.2016 15.4868C19.0837 16.3788 20.0152 17.3202 20.9401 18.255C20.0441 19.1443 19.1047 20.0771 18.1752 20.9994C17.8261 20.6436 17.4545 20.2655 17.0586 19.8623C17.2813 19.666 17.5349 19.442 17.7885 19.2181C17.7727 19.1792 17.7569 19.1403 17.7404 19.1021H17.3775C13.0507 19.1021 8.72398 19.1034 4.39723 19.1015C3.21278 19.1015 2.35903 18.527 2.03294 17.4822C1.94335 17.195 1.91765 16.8788 1.917 16.5751C1.90975 12.2694 1.91238 7.96378 1.91238 3.65812C1.91238 3.54218 1.91238 3.42557 1.91238 3.30963C1.88669 3.29448 1.861 3.27999 1.83531 3.26484H1.83729ZM3.56258 16.1818C8.40975 11.334 13.249 6.49343 18.0935 1.64824C17.4032 1.64824 16.6937 1.64231 15.9842 1.65548C15.8933 1.65746 15.7879 1.74046 15.7154 1.81293C11.7167 5.80766 7.72003 9.80502 3.72596 13.805C3.65415 13.8775 3.57115 13.9829 3.56917 14.0738C3.55599 14.7826 3.56192 15.4915 3.56192 16.1812L3.56258 16.1818ZM19.365 2.95654C14.5296 7.79053 9.69499 12.6245 4.86693 17.4513C5.52569 17.4513 6.22464 17.4572 6.92358 17.444C7.01449 17.442 7.11858 17.3557 7.19104 17.2826C11.1963 13.2813 15.1996 9.27735 19.1996 5.27142C19.2721 5.19896 19.3557 5.09356 19.357 5.00265C19.3702 4.30436 19.3643 3.60542 19.3643 2.95654H19.365ZM19.365 7.58631C16.0758 10.8729 12.7833 14.1627 9.49144 17.4513C10.1588 17.4513 10.857 17.4572 11.556 17.444C11.6462 17.442 11.749 17.3518 11.8221 17.2787C14.2846 14.8208 16.7444 12.3604 19.2016 9.89725C19.2734 9.82478 19.3557 9.71872 19.3577 9.62716C19.3709 8.92821 19.365 8.22926 19.365 7.58565V7.58631ZM3.56258 11.5218C6.861 8.22465 10.1462 4.94007 13.4387 1.64824C12.7793 1.64824 12.1028 1.64231 11.4262 1.65482C11.334 1.6568 11.2266 1.73387 11.1548 1.80502C8.67589 4.27867 6.20026 6.75495 3.72727 9.23387C3.65547 9.30634 3.5718 9.41108 3.56983 9.50265C3.55665 10.1805 3.56258 10.8584 3.56258 11.5218Z"
                        fill="#575757"/>
                </svg>

            );

        case 'parking':
            return (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16 1.46667C16 1.07768 16.158 0.70463 16.4393 0.429577C16.7206 0.154523 17.1022 0 17.5 0H20.5C20.8978 0 21.2794 0.154523 21.5607 0.429577C21.842 0.70463 22 1.07768 22 1.46667V5.86667C22 6.25565 21.842 6.6287 21.5607 6.90376C21.2794 7.17881 20.8978 7.33333 20.5 7.33333H19.75V21.2667C19.75 21.4612 19.671 21.6477 19.5303 21.7852C19.3897 21.9227 19.1989 22 19 22C18.8011 22 18.6103 21.9227 18.4697 21.7852C18.329 21.6477 18.25 21.4612 18.25 21.2667V7.33333H17.5C17.1022 7.33333 16.7206 7.17881 16.4393 6.90376C16.158 6.6287 16 6.25565 16 5.86667V1.46667ZM14.875 1.46667H6.55525C5.87267 1.46661 5.21048 1.69416 4.67801 2.11174C4.14554 2.52932 3.77462 3.11196 3.6265 3.76347L3.148 5.86667H2.5C2.30109 5.86667 2.11032 5.94393 1.96967 6.08146C1.82902 6.21898 1.75 6.40551 1.75 6.6C1.75 6.79449 1.82902 6.98102 1.96967 7.11855C2.11032 7.25607 2.30109 7.33333 2.5 7.33333H2.815L2.5675 8.42233C2.09322 8.67436 1.69727 9.04684 1.42139 9.5005C1.14552 9.95416 0.999936 10.4722 1 11V18.3333C1 18.9168 1.23705 19.4764 1.65901 19.889C2.08097 20.3015 2.65326 20.5333 3.25 20.5333H4C4.59674 20.5333 5.16903 20.3015 5.59099 19.889C6.01295 19.4764 6.25 18.9168 6.25 18.3333V17.6H15.25V18.3333C15.2498 18.8534 15.4381 19.3566 15.7813 19.7539C16.1245 20.1511 16.6006 20.4166 17.125 20.5033V18.9684C17.011 18.904 16.9163 18.8115 16.8505 18.7C16.7847 18.5885 16.75 18.4621 16.75 18.3333V17.6H17.125V8.40767C16.779 8.3588 16.4465 8.24287 16.147 8.06667H4.1845L5.0905 4.08173C5.16455 3.75604 5.34995 3.46477 5.61611 3.25598C5.88227 3.0472 6.21327 2.93339 6.5545 2.93333H14.875V1.46667ZM2.5 18.3333V17.6H4.75V18.3333C4.75 18.5278 4.67098 18.7144 4.53033 18.8519C4.38968 18.9894 4.19891 19.0667 4 19.0667H3.25C3.05109 19.0667 2.86032 18.9894 2.71967 18.8519C2.57902 18.7144 2.5 18.5278 2.5 18.3333ZM8.875 14.6667C8.67609 14.6667 8.48532 14.5894 8.34467 14.4519C8.20402 14.3144 8.125 14.1278 8.125 13.9333C8.125 13.7388 8.20402 13.5523 8.34467 13.4148C8.48532 13.2773 8.67609 13.2 8.875 13.2H12.625C12.8239 13.2 13.0147 13.2773 13.1553 13.4148C13.296 13.5523 13.375 13.7388 13.375 13.9333C13.375 14.1278 13.296 14.3144 13.1553 14.4519C13.0147 14.5894 12.8239 14.6667 12.625 14.6667H8.875ZM7 12.1C7 12.3917 6.88147 12.6715 6.6705 12.8778C6.45952 13.0841 6.17337 13.2 5.875 13.2C5.57663 13.2 5.29048 13.0841 5.0795 12.8778C4.86853 12.6715 4.75 12.3917 4.75 12.1C4.75 11.8083 4.86853 11.5285 5.0795 11.3222C5.29048 11.1159 5.57663 11 5.875 11C6.17337 11 6.45952 11.1159 6.6705 11.3222C6.88147 11.5285 7 11.8083 7 12.1ZM15.625 11C15.9234 11 16.2095 11.1159 16.4205 11.3222C16.6315 11.5285 16.75 11.8083 16.75 12.1C16.75 12.3917 16.6315 12.6715 16.4205 12.8778C16.2095 13.0841 15.9234 13.2 15.625 13.2C15.3266 13.2 15.0405 13.0841 14.8295 12.8778C14.6185 12.6715 14.5 12.3917 14.5 12.1C14.5 11.8083 14.6185 11.5285 14.8295 11.3222C15.0405 11.1159 15.3266 11 15.625 11Z"
                        fill="#575757"/>
                </svg>

            );

        case 'kitchen':
            return (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.5627 10.75C20.0752 10.75 23.1003 22 21.5878 22H0.412231C-1.10031 22 1.92477 10.75 3.43731 10.75H18.5627ZM16.672 12.625H5.32798C4.57171 12.625 2.3029 20.5 3.43731 20.5H18.5627C19.6971 20.5 17.4283 12.625 16.672 12.625ZM11 14.5C11.7563 14.5 12.5125 15.25 12.5125 16C12.5125 16.75 11.7563 17.5 11 17.5C10.2437 17.5 9.48746 16.75 9.48746 16C9.48746 15.25 10.2437 14.5 11 14.5ZM15.9158 13.375H6.08425C5.32798 13.375 3.43731 19.75 4.57171 19.75H17.4283C18.5627 19.75 16.672 13.375 15.9158 13.375ZM7.21865 7C7.59679 7 7.59679 8.125 7.21865 8.125V10C7.21865 10.75 5.70612 10.75 5.70612 10V8.125H4.19358C3.81544 8.125 3.81544 7 4.19358 7H7.21865ZM17.8064 7C18.1846 7 18.1846 8.125 17.8064 8.125H16.2939V10C16.2939 10.75 14.7813 10.75 14.7813 10V8.125C14.4032 8.125 14.4032 7 14.7813 7H17.8064ZM13.2688 1C11 1 10.2437 1.75 10.2437 4V10C10.2437 10.75 11.7563 10.75 11.7563 10V4.75C11.7563 3.25 11.7563 2.5 13.2688 2.5C14.0251 2.5 14.7813 2.875 14.7813 3.625C14.7813 4 16.2939 4 16.2939 3.625C16.2939 1.75 14.7813 1 13.2688 1Z"
                        fill="#575757"/>
                </svg>
            );

        case 'balcony':
        case 'terrace':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.02214 7.17735C6.20714 6.1599 8.40586 4.545 10.0283 2.9322C10.9878 1.9767 11.468 1.5 11.8333 1.5C12.1964 1.5 12.6722 1.97229 13.6228 2.91583L13.6393 2.9322C15.2606 4.54395 17.4594 6.1599 19.6433 7.17735C20.3864 7.52385 20.8403 7.95015 21.1992 8.78175C21.4736 9.417 21.3501 9.9 20.6018 9.9H11.8333H3.06475C2.31531 9.9 2.19286 9.417 2.46731 8.78175C2.8262 7.95015 3.28009 7.52385 4.02214 7.17735Z"
                        fill="#575757"/>
                    <path
                        d="M2.33325 14.1L3.38881 19.35M3.38881 19.35L2.33325 22.5M3.38881 19.35H6.1892C6.93231 19.35 7.10753 19.497 7.22997 20.2278L7.61103 22.5M21.3333 14.1L20.2777 19.35M20.2777 19.35L21.3333 22.5M20.2777 19.35H17.4773C16.7342 19.35 16.559 19.497 16.4365 20.2278L16.0555 22.5M11.8333 9.9V22.5M11.8333 9.9H20.6018M11.8333 9.9H3.06475M3.06475 9.9C2.31531 9.9 2.19286 9.417 2.46731 8.78175C2.8262 7.95015 3.28009 7.52385 4.02214 7.17735C6.20714 6.1599 8.40586 4.545 10.0283 2.9322C10.9878 1.9767 11.468 1.5 11.8333 1.5C12.1964 1.5 12.6722 1.97229 13.6228 2.91583C13.6283 2.92127 13.6338 2.92673 13.6393 2.9322C15.2606 4.54395 17.4594 6.1599 19.6433 7.17735C20.3864 7.52385 20.8403 7.95015 21.1992 8.78175C21.4736 9.417 21.3501 9.9 20.6018 9.9M13.6393 2.9322L13.6228 2.91583M20.6018 9.9H3.06475M10.7777 22.5H12.8888M8.66659 15.15H14.9999"
                        stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );

        case 'pieces':
        default:
            return (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_365_4504)">
                        <path
                            d="M11 13.1705L21.868 17.5409L21.956 17.5705H22L11 22L0 17.5705H0.0733333L0.132 17.5409L11 13.1705ZM11.3667 0L22 4.28188V16.8027L11.352 12.5208L11.3667 12.4617V0Z"
                            fill="#575757"/>
                        <path
                            d="M10.6333 0V12.4027L10.648 12.4913V12.5208L7.33333 13.8497L2.93333 15.6215L0 16.8027V4.28188L10.6333 0Z"
                            fill="#575757"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_365_4504">
                            <rect width="22" height="22" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>

            );
    }
}

type MainFeatureType =
    | 'pieces'
    | 'bedrooms'
    | 'bathrooms'
    | 'kitchen'
    | 'balcony'
    | 'terrace'
    | 'surface'
    | 'parking';

function getMainFeatures(bien: CasaqBien): Array<{
    label: string;
    value?: string | number | null;
    type: MainFeatureType;
}> {
    return [
        {
            type: 'pieces',
            label: 'Pièces',
            value: getFeatureValue(
                getFirstValue(bien, [
                    'caracteristiques.pieces',
                    'caracteristiques.nb_pieces',
                    'details.pieces',
                    'pieces',
                ])
            ),
        },
        {
            type: 'bedrooms',
            label: 'Chambres',
            value: getFeatureValue(
                getFirstValue(bien, [
                    'caracteristiques.chambres',
                    'caracteristiques.nb_bedrooms',
                    'details.nb_bedrooms',
                    'nb_bedrooms',
                ])
            ),
        },
        {
            type: 'bathrooms',
            label: 'Salles de bain',
            value: getFeatureValue(
                getFirstValue(bien, [
                    'caracteristiques.nb_bathrooms',
                    'caracteristiques.salles_bain',
                    'caracteristiques.salles_de_bains',
                    'caracteristiques.salle_de_bain',
                    'caracteristiques.bathrooms',
                    'details.nb_bathrooms',
                    'nb_bathrooms',
                ])
            ),
        },
        {
            type: 'kitchen',
            label: 'Cuisine',
            value: getFeatureValue(
                getFirstValue(bien, [
                    'caracteristiques.cuisine',
                    'caracteristiques.cuisines',
                    'amenagements.interieur.cuisines',
                    'details.kitchens',
                    'kitchens',
                ])
            ),
        },
        {
            type: 'balcony',
            label: 'Balcon',
            value: getFeatureValue(
                getFirstValue(bien, [
                    'caracteristiques.balcons',
                    'caracteristiques.balcon',
                    'details.balconies',
                    'balconies',
                ])
            ),
        },
        {
            type: 'terrace',
            label: 'Terrasse',
            value: getFeatureValue(
                getFirstValue(bien, [
                    'caracteristiques.terrasses',
                    'caracteristiques.terrasse',
                    'details.terrasses',
                    'terrasses',
                ])
            ),
        },
        {
            type: 'surface',
            label: 'Surface',
            value: formatSurface(
                getFirstValue(bien, [
                    'caracteristiques.surface_habitable',
                    'surfaces.surface_habitable',
                    'details.surface_living',
                    'surface_living',
                ])
            ),
        },
        {
            type: 'parking',
            label: 'Parking',
            value: getFeatureValue(
                getFirstValue(bien, [
                    'stationnement.total.nombre',
                    'caracteristiques.parking',
                    'caracteristiques.parking_interieur',
                    'caracteristiques.parking_exterieur',
                    'details.nb_parking_total',
                    'details.nb_parking_int',
                    'details.nb_parking_ext',
                    'nb_parking_total',
                    'nb_parking_int',
                    'nb_parking_ext',
                ])
            ),
        },
    ];
}
function getImages(bien: CasaqBien): Array<{ src: string; alt?: string | null }> {
    return (bien.images || [])
        .map((image) => ({
            src:
                image.variants?.original ||
                image.variants?.xl ||
                image.variants?.large ||
                image.url ||
                '',
            alt: image.alt || bien.titre,
        }))
        .filter((image) => Boolean(image.src));
}
function getDocuments(bien: CasaqBien): Array<{
    label: string;
    url: string;
    extension?: string | null;
    size?: string | null;
}> {
    const raw = getNestedValue(bien, 'documents');

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.flatMap((document) => {
        if (!document || typeof document !== 'object') {
            return [];
        }

        const item = document as Record<string, unknown>;

        const label =
            typeof item.label === 'string' && item.label.trim()
                ? item.label.trim()
                : typeof item.name === 'string' && item.name.trim()
                    ? item.name.trim()
                    : typeof item.titre === 'string' && item.titre.trim()
                        ? item.titre.trim()
                        : 'Document';

        const url =
            typeof item.url === 'string' && item.url.trim()
                ? item.url.trim()
                : typeof item.file === 'string' && item.file.trim()
                    ? item.file.trim()
                    : null;

        if (!url) {
            return [];
        }

        return [
            {
                label,
                url,
                extension:
                    typeof item.extension === 'string'
                        ? item.extension
                        : null,
                size:
                    typeof item.size === 'string'
                        ? item.size
                        : null,
            },
        ];
    });
}
function formatPrice(bien: CasaqBien): string {
    if (bien.prix?.sur_demande || !bien.prix?.formatte) {
        return 'Prix sur demande';
    }

    if (bien.deal === 'RENT') {
        return bien.prix.formatte.includes('/')
            ? bien.prix.formatte
            : `${bien.prix.formatte} / mois`;
    }

    return bien.prix.formatte;
}

function getStringValue(item: unknown, path: string): string | null {
    const value = getNestedValue(item, path);

    if (typeof value !== 'string') {
        return null;
    }

    return value.trim() || null;
}

function getNestedValue(item: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
        if (!current || typeof current !== 'object') {
            return null;
        }

        return (current as Record<string, unknown>)[key];
    }, item);
}

function formatHeroPrice(bien: CasaqBien): string {
    if (bien.prix?.sur_demande || !bien.prix?.formatte) {
        return 'Prix sur demande';
    }

    if (bien.deal === 'RENT') {
        return bien.prix.formatte.includes('/')
            ? bien.prix.formatte
            : `${bien.prix.formatte} / mois`;
    }

    return bien.prix.formatte;
}

function getFullAddress(bien: CasaqBien): string {
    if (!canShowExactAddress(bien)) {
        return '';
    }

    return [
        bien.adresse?.rue,
        bien.adresse?.npa,
        bien.adresse?.ville,
    ]
        .filter(Boolean)
        .join(', ');
}
function canShowExactAddress(bien: CasaqBien): boolean {
    const publicMode = bien.adresse?.public_mode;
    const substitutionAddress = bien.adresse?.adresse_substitution;
    const street = bien.adresse?.rue;

    if (publicMode === 'radius') {
        return false;
    }

    if (substitutionAddress) {
        return false;
    }

    return Boolean(street);
}
function getAvailabilityLabel(bien: CasaqBien): string | null {
    const disponibilite = getNestedValue(bien, 'caracteristiques.disponibilite') as
        | {
        label?: string | null;
        date?: string | null;
    }
        | null
        | undefined;

    if (!disponibilite) {
        return null;
    }

    if (disponibilite.date) {
        const date = new Date(disponibilite.date);

        if (!Number.isNaN(date.getTime())) {
            return `Disponible dès le ${date.toLocaleDateString('fr-CH')}`;
        }
    }

    if (disponibilite.label) {
        return disponibilite.label === 'Immédiatement'
            ? 'Disponible de suite'
            : disponibilite.label;
    }

    return null;
}

function getSubtitle(bien: CasaqBien): string | null {
    return (
        getStringValue(bien, 'descriptif.subtitle') ||
        getStringValue(bien, 'descriptif.sous_titre') ||
        null
    );
}

// function getCharacteristicBlocks(bien: CasaqBien): Array<{
//     title: string;
//     items: Array<{
//         label: string;
//         value?: string | number | null;
//     }>;
// }> {
//     const blocks = [
//         {
//             title: 'Caractéristiques principales',
//             items: [
//                 { label: 'Type de bien', value: bien.categorie },
//                 { label: 'Prix', value: formatPrice(bien) },
//                 { label: 'Charges', value: getChargesCharacteristicValue(bien) },
//                 { label: 'Surface habitable', value: formatSurface(getNestedValue(bien, 'caracteristiques.surface_habitable')) },
//                 { label: 'Pièces', value: getNestedValue(bien, 'caracteristiques.pieces') },
//                 { label: 'Chambres', value: getNestedValue(bien, 'caracteristiques.chambres') },
//                 { label: 'Salles de bain', value: getNestedValue(bien, 'caracteristiques.salles_bain') || getNestedValue(bien, 'caracteristiques.salles_de_bains') },
//                 { label: 'Référence', value: bien.reference },
//                 { label: 'Disponibilité', value: getAvailabilityLabel(bien) },
//             ],
//         },
//         {
//             title: 'Surfaces',
//             items: [
//                 { label: 'Surface habitable', value: formatSurface(getNestedValue(bien, 'surfaces.surface_habitable')) },
//                 { label: 'Surface habitable totale', value: formatSurface(getNestedValue(bien, 'surfaces.surface_habitable_totale')) },
//                 { label: 'Surface totale', value: formatSurface(getNestedValue(bien, 'surfaces.surface_totale')) },
//                 { label: 'Surface terrain', value: formatSurface(getNestedValue(bien, 'surfaces.surface_terrain')) },
//                 { label: 'Surface utile', value: formatSurface(getNestedValue(bien, 'surfaces.surface_utile')) },
//                 { label: 'Surface balcon', value: formatSurface(getNestedValue(bien, 'surfaces.surface_balcon')) },
//                 { label: 'Surface terrasse', value: formatSurface(getNestedValue(bien, 'surfaces.surface_terrasse')) },
//                 { label: 'Surface jardin', value: formatSurface(getNestedValue(bien, 'surfaces.surface_jardin')) },
//                 { label: 'Surface cave', value: formatSurface(getNestedValue(bien, 'surfaces.surface_cave')) },
//                 { label: 'Volume', value: formatVolume(getNestedValue(bien, 'surfaces.volume')) },
//             ],
//         },
//         {
//             title: 'Bâtiment',
//             items: [
//                 { label: 'Année de construction', value: getNestedValue(bien, 'batiment.annee_construction') },
//                 { label: 'Année de rénovation', value: getNestedValue(bien, 'batiment.annee_renovation') },
//                 { label: 'Étage', value: getNestedValue(bien, 'batiment.etage') },
//                 { label: 'Nombre d’étages total', value: getNestedValue(bien, 'batiment.nombre_etages_total') },
//                 { label: 'Nombre de niveaux', value: getNestedValue(bien, 'batiment.nombre_niveaux') },
//                 { label: 'Orientation', value: getNestedValue(bien, 'batiment.orientation') },
//                 { label: 'Condition', value: getNestedValue(bien, 'batiment.condition') },
//             ],
//         },
//         {
//             title: 'Stationnement',
//             items: [
//                 { label: 'Parking disponible', value: getNestedValue(bien, 'stationnement.parking_available') },
//                 { label: 'Places intérieures', value: getNestedValue(bien, 'stationnement.interieur.nombre') },
//                 { label: 'Prix place intérieure', value: formatMoney(getNestedValue(bien, 'stationnement.interieur.prix_total')) },
//                 { label: 'Places extérieures', value: getNestedValue(bien, 'stationnement.exterieur.nombre') },
//                 { label: 'Prix place extérieure', value: formatMoney(getNestedValue(bien, 'stationnement.exterieur.prix_total')) },
//                 { label: 'Box', value: getNestedValue(bien, 'stationnement.box.nombre') },
//                 { label: 'Prix box', value: formatMoney(getNestedValue(bien, 'stationnement.box.prix_total')) },
//                 { label: 'Total places', value: getNestedValue(bien, 'stationnement.total.nombre') },
//             ],
//         },
//         {
//             title: 'Énergie',
//             items: [
//                 { label: 'Chauffage', value: getNestedValue(bien, 'energie.chauffage.type') },
//                 { label: 'Prix chauffage', value: formatMoney(getNestedValue(bien, 'energie.chauffage.prix')) },
//                 { label: 'Eau chaude', value: getNestedValue(bien, 'energie.eau_chaude') },
//                 { label: 'Efficacité énergétique', value: getNestedValue(bien, 'energie.efficacite_energetique') },
//                 { label: 'Enveloppe bâtiment', value: getNestedValue(bien, 'energie.enveloppe_batiment') },
//                 { label: 'Émissions CO₂', value: getNestedValue(bien, 'energie.emissions_co2') },
//             ],
//         },
//         {
//             title: 'Localisation',
//             items: [
//                 { label: 'Adresse', value: getFullAddress(bien) },
//                 { label: 'NPA', value: bien.adresse?.npa },
//                 { label: 'Ville', value: bien.adresse?.ville },
//                 { label: 'Pays', value: bien.adresse?.pays },
//             ],
//         },
//     ];
//
//     return blocks
//         .map((block) => ({
//             ...block,
//             items: block.items
//                 .map((item) => ({
//                     ...item,
//                     value: getFeatureValue(item.value),
//                 }))
//                 .filter(
//                     (item): item is {
//                         label: string;
//                         value: string | number;
//                     } => hasValue(item.value)
//                 ),
//         }))
//         .filter((block) => block.items.length > 0);
// }

function getCharacteristicBlocks(bien: CasaqBien): Array<{
    title: string;
    items: Array<{
        label: string;
        value?: string | number | null;
    }>;
}> {
    const item = (
        label: string,
        paths: string | string[],
        formatter?: (value: unknown) => string | number | null
    ) => {
        const pathList = Array.isArray(paths) ? paths : [paths];
        const rawValue = getFirstValue(bien, pathList);
        const value = formatter ? formatter(rawValue) : rawValue;

        return {
            label,
            value,
        };
    };

    const directItem = (
        label: string,
        value: unknown
    ) => ({
        label,
        value,
    });

    const blocks = [
        {
            title: 'Général',
            items: [
                directItem('Type de bien', bien.categorie),
                item('Utilisation', [
                    'caracteristiques.utilisation',
                    'details.utilisation',
                    'utilisation',
                ]),
                directItem('Référence', bien.reference),
                directItem('Disponibilité', getAvailabilityCharacteristicValue(bien)),
            ],
        },
        {
            title: 'Prix',
            items: getPriceCharacteristicItems(bien),
        },
        {
            title: 'Aménagements intérieurs',
            items: [
                item('Nb pièces', [
                    'caracteristiques.pieces',
                    'caracteristiques.nb_pieces',
                    'details.pieces',
                    'pieces',
                ]),
                item('Nombre de pièces / chambres', [
                    'details.nb_rooms',
                    'nb_rooms',
                    'caracteristiques.nb_rooms',
                ]),
                item('Étage', [
                    'details.floor',
                    'floor',
                    'batiment.etage',
                    'caracteristiques.etage',
                ]),
                item('Chambre(s)', [
                    'caracteristiques.chambres',
                    'caracteristiques.nb_bedrooms',
                    'details.nb_bedrooms',
                    'nb_bedrooms',
                ]),
                item('SDB / Douches', [
                    'caracteristiques.salles_de_bains',
                    'caracteristiques.salles_bain',
                    'caracteristiques.salle_de_bain',
                    'caracteristiques.bathrooms',
                    'details.nb_bathrooms',
                    'nb_bathrooms',
                ]),
                item('WC séparés', [
                    'caracteristiques.wc',
                    'caracteristiques.nb_wc',
                    'details.nb_wc',
                    'nb_wc',
                ]),
                item('Nombre de niveaux du bien', [
                    'details.levels',
                    'levels',
                    'batiment.nombre_niveaux',
                    'caracteristiques.levels',
                ]),
                item('Nombre de sous-sol(s)', [
                    'details.soussol',
                    'soussol',
                    'batiment.nombre_sous_sols',
                    'caracteristiques.soussol',
                ]),
                item('Balcon(s)', [
                    'details.balconies',
                    'balconies',
                    'caracteristiques.balcons',
                    'caracteristiques.balcon',
                ]),
                item('Terrasse(s)', [
                    'details.terrasses',
                    'terrasses',
                    'caracteristiques.terrasses',
                    'caracteristiques.terrasse',
                ]),
                item('Cuisine(s)', [
                    'details.kitchens',
                    'kitchens',
                    'caracteristiques.cuisine',
                ]),
                item('Ascenseur(s)', [
                    'details.elevators',
                    'elevators',
                    'caracteristiques.ascenseur',
                ]),
                item('Meublé', [
                    'details.furnished',
                    'furnished',
                    'caracteristiques.meuble',
                ]),
            ],
        },
        {
            title: 'Surfaces',
            items: [
                item('Surface habitable', [
                    'caracteristiques.surface_habitable',
                    'surfaces.surface_habitable',
                    'details.surface_living',
                    'surface_living',
                ], formatSurface),
                item('Surface habitable totale', [
                    'surfaces.surface_habitable_totale',
                    'details.surface_living_total',
                    'surface_living_total',
                ], formatSurface),
                item('Surface totale', [
                    'surfaces.surface_totale',
                    'details.surface_total',
                    'surface_total',
                ], formatSurface),
                item('Surface terrain', [
                    'caracteristiques.surface_terrain',
                    'surfaces.surface_terrain',
                    'details.surface_terrain',
                    'surface_terrain',
                ], formatSurface),
                item('Surface utile', [
                    'surfaces.surface_utile',
                    'details.surface_useful',
                    'surface_useful',
                ], formatSurface),
                item('Surface constructible', [
                    'surfaces.surface_constructible',
                    'details.surface_constructible',
                    'surface_constructible',
                ], formatSurface),
                item('Surface balcon', [
                    'surfaces.surface_balcon',
                    'details.surface_balcony',
                    'surface_balcony',
                ], formatSurface),
                item('Surface terrasse', [
                    'surfaces.surface_terrasse',
                    'details.surface_terrasse',
                    'surface_terrasse',
                ], formatSurface),
                item('Surface véranda / jardin d’hiver', [
                    'details.surface_veranda',
                    'surface_veranda',
                ], formatSurface),
                item('Surface loggia', [
                    'details.surface_loggia',
                    'surface_loggia',
                ], formatSurface),
                item('Surface jardin', [
                    'surfaces.surface_jardin',
                    'details.surface_garden',
                    'surface_garden',
                ], formatSurface),
                item('Surface bâtie', [
                    'details.surface_built',
                    'surface_built',
                ], formatSurface),
                item('Surface non-bâtie', [
                    'details.surface_non_built',
                    'surface_non_built',
                ], formatSurface),
                item('Surface sous-sol', [
                    'details.surface_underground',
                    'surface_underground',
                ], formatSurface),
                item('Surface sur sol du bâtiment', [
                    'details.surface_on_building',
                    'surface_on_building',
                ], formatSurface),
                item('Surface cave', [
                    'surfaces.surface_cave',
                    'details.surface_cave',
                    'surface_cave',
                ], formatSurface),
                item('Surface galetas', [
                    'details.surface_galetas',
                    'surface_galetas',
                ], formatSurface),
                item('Hauteur plafond', [
                    'details.ceiling_height',
                    'ceiling_height',
                ], formatLength),
                item('Volume', [
                    'surfaces.volume',
                    'details.volume',
                    'volume',
                ], formatVolume),
                item('Densité', [
                    'details.densite',
                    'densite',
                ]),
            ],
        },
        {
            title: 'Bâtiment',
            items: [
                item('Année construction', [
                    'details.year_built',
                    'year_built',
                    'batiment.annee_construction',
                ]),
                item('Année rénovation', [
                    'details.year_renovated',
                    'year_renovated',
                    'batiment.annee_renovation',
                ]),
                item('Condition', [
                    'details.condition',
                    'condition',
                    'batiment.condition',
                ], formatConditionValue),
                item('Nb. étages total', [
                    'details.floors_total',
                    'floors_total',
                    'batiment.nombre_etages_total',
                ]),
                item('No d’assurance incendie', [
                    'details.num_AI',
                    'num_AI',
                ]),
                item('Évacuation eaux usées', [
                    'details.used_water',
                    'used_water',
                ], formatUsedWaterValue),
                item('Standing', [
                    'details.standing',
                    'standing',
                    'batiment.standing',
                ]),
                item('État', [
                    'details.etat',
                    'etat',
                    'batiment.etat',
                ]),
            ],
        },
        {
            title: 'Localisation',
            items: [
                // directItem('Adresse', getFullAddress(bien)),

                directItem('NPA', bien.adresse?.npa),
                directItem('Ville', bien.adresse?.ville),
                directItem('Pays', bien.adresse?.pays),
                item('Orientation', [
                    'details.orientation',
                    'orientation',
                    'batiment.orientation',
                    'localisation.orientation',
                ]),
                item('Altitude', [
                    'details.altitude',
                    'altitude',
                    'localisation.altitude',
                ], formatLength),
            ],
        },
        {
            title: 'Stationnement',
            items: [
                item('Parking intérieur', [
                    'details.nb_parking_int',
                    'nb_parking_int',
                    'stationnement.interieur.nombre',
                    'parking_interieur',
                ]),
                item('Parking extérieur', [
                    'details.nb_parking_ext',
                    'nb_parking_ext',
                    'stationnement.exterieur.nombre',
                    'parking_exterieur',
                ]),
                item('Box / Garage', [
                    'details.nb_box',
                    'nb_box',
                    'stationnement.box.nombre',
                ]),
                item('Parking intérieur inclus', [
                    'stationnement.interieur.inclus',
                    'details.parking_included',
                    'parking_included',
                    'interieur.inclus',
                ], formatYesNoValue),
                item('Prix place intérieure', [
                    'stationnement.interieur.prix_total',
                    'details.parking_int_price',
                    'parking_int_price',
                ], formatMoney),
                item('Prix place extérieure', [
                    'stationnement.exterieur.prix_total',
                    'details.parking_ext_price',
                    'parking_ext_price',
                ], formatMoney),
                item('Prix box / garage', [
                    'stationnement.box.prix_total',
                    'details.box_price',
                    'box_price',
                ], formatMoney),
            ],
        },
        {
            title: 'Terrain & parcelle',
            items: [
                item('Nombre de parcelles', [
                    'details.parcelles',
                    'parcelles',
                ]),
                item('Équipé', [
                    'details.equiped',
                    'equiped',
                ], formatEquippedValue),
                item('Indice d’utilisation du sol', [
                    'details.indice',
                    'indice',
                ]),
                item('Coefficient d’occupation du sol', [
                    'details.cos',
                    'cos',
                ]),
                item('Coefficient construction', [
                    'details.construction_coefficient',
                    'construction_coefficient',
                ]),
            ],
        },
        {
            title: 'Annexes',
            items: [
                item('Cave', [
                    'annexes.cave',
                    'details.cave',
                    'cave',
                ]),
                item('Grenier', [
                    'annexes.grenier',
                    'details.grenier',
                    'grenier',
                ]),
                item('Dépôt', [
                    'annexes.depot',
                    'details.depot',
                    'depot',
                ]),
                item('Local à vélos', [
                    'annexes.local_velos',
                    'details.local_velos',
                    'local_velos',
                ]),
                item('Local poussettes', [
                    'annexes.local_poussettes',
                    'details.local_poussettes',
                    'local_poussettes',
                ]),
            ],
        },
        {
            title: 'Énergie & techniques du bâtiment',
            items: [
                item('Type de chauffage', [
                    'energie.chauffage.type',
                    'details.heating_type',
                    'heating_type',
                ]),
                item('Eau chaude sanitaire', [
                    'energie.eau_chaude',
                    'details.hot_water',
                    'hot_water',
                ]),
                item('Coûts de chauffage', [
                    'energie.chauffage.prix',
                    'details.heating_price',
                    'heating_price',
                ], formatMoney),
                item('Période chauffage', [
                    'details.heating_price_period_id',
                    'heating_price_period_id',
                ], formatPeriodValue),
                item('Chauffage compris', [
                    'details.heating_included',
                    'heating_included',
                ], formatIncludedValue),
                item('Efficacité globale', [
                    'energie.efficacite_energetique',
                    'details.energy_letter',
                    'energy_letter',
                ]),
                item('Enveloppe du bâtiment', [
                    'energie.enveloppe_batiment',
                    'details.envelope_efficiency',
                    'envelope_efficiency',
                ]),
                item('Émissions directes de CO₂', [
                    'energie.emissions_co2',
                    'details.direct_co2_emissions',
                    'direct_co2_emissions',
                ]),
            ],
        },
        {
            title: 'Technique / industriel',
            items: [
                item('Charge maximum sur la dalle', ['details.max_weightkg', 'max_weightkg'], formatWeight),
                item('Nombre de portes sectionnelles', ['details.nb_sectional_doors', 'nb_sectional_doors']),
                item('Ampérage', ['details.amperage', 'amperage'], formatAmperage),
                item('Nombre de palans', ['details.nb_hoists', 'nb_hoists']),
                item('Charge max monte-charge', ['details.max_load_freight_elevator', 'max_load_freight_elevator'], formatWeight),
                item('Charge max mezzanine', ['details.mezzanine_max_load', 'mezzanine_max_load'], formatWeight),
                item('Charge max ascenseur', ['details.max_load_elevator', 'max_load_elevator'], formatWeight),
                item('Ascenseurs', ['details.elevators', 'elevators']),
                item('Portes d’accès', ['details.access_doors', 'access_doors']),
                item('Quais de chargement', ['details.loading_dock', 'loading_dock']),
                item('Plaques de levage', ['details.lifting_plates', 'lifting_plates']),
                item('Ponts roulants', ['details.overhead_crane', 'overhead_crane']),
                item('Charge max pont roulant', ['details.max_load_overhead_crane', 'max_load_overhead_crane'], formatWeight),
                item('Charge max palans', ['details.max_load_hoists', 'max_load_hoists'], formatWeight),
                item('Nombre de monte-charge', ['details.nb_goods_lift', 'nb_goods_lift']),
                item('Vestiaires', ['details.locker_rooms', 'locker_rooms']),
                item('Douches', ['details.showers', 'showers']),
                item('Cafétérias', ['details.cafeterias', 'cafeterias']),
                item('Accès de plain-pied', ['details.access_ground_level', 'access_ground_level'], formatYesNoValue),
                item('Réseau d’air comprimé', ['details.air_network', 'air_network'], formatYesNoValue),
                item('Bâtiment individuel', ['details.individual_building', 'individual_building'], formatYesNoValue),
                item('Occupation', ['details.occupancy', 'occupancy'], formatOccupancyValue),
                item('Local ouvert / fermé', ['details.open_closed_area', 'open_closed_area'], formatOpenClosedValue),
            ],
        },
        {
            title: 'Immeuble & rendement',
            items: [
                item('Nombre de logements', ['details.flats', 'flats']),
                item('Nombre de bâtiments', ['details.buildings_number', 'buildings_number']),
                item('Nombre d’unités', ['details.rent_objects_number', 'rent_objects_number']),
                item('Surface brute plancher', ['details.surface_brute', 'surface_brute'], formatSurface),
                item('Surface nette plancher', ['details.surface_nette', 'surface_nette'], formatSurface),
                item('Surface locative', ['details.surface_locative', 'surface_locative'], formatSurface),
                item('Surface logements', ['details.surface_logements', 'surface_logements'], formatSurface),
                item('Surface commerces', ['details.surface_commerces', 'surface_commerces', 'surface_commerces_imm'], formatSurface),
                item('Surface dépôts', ['details.surface_depots', 'surface_depots'], formatSurface),
                item('Surface locaux administratifs', ['details.surface_locaux_admin', 'surface_locaux_admin'], formatSurface),
            ],
        },
    ];

    return blocks
        .map((block) => ({
            ...block,
            items: block.items
                .map((item) => ({
                    ...item,
                    value: getFeatureValue(item.value),
                }))
                .filter(
                    (item): item is {
                        label: string;
                        value: string | number;
                    } => hasValue(item.value)
                ),
        }))
        .filter((block) => block.items.length > 0);
}



function getPriceCharacteristicItems(
    bien: CasaqBien
): Array<{
    label: string;
    value?: string | number | null;
}> {
    const finance = bien.prix as typeof bien.prix & {
        price?: number | string | null;
        valeur?: number | string | null;
        comparable?: number | string | null;
        montant?: number | string | null;
        net?: number | string | null;
        total?: number | string | null;
        formatte?: string | null;
        devise?: string | null;

        price_on_demand?: boolean | string | number | null;
        sur_demande?: boolean | string | number | null;

        price_starting_at?: boolean | string | number | null;
        prix_des?: boolean | string | number | null;

        price_period_id?: number | string | null;
        periode_prix_id?: number | string | null;

        charges?: number | string | null;
        charges_inclusives?: string | null;
        charges_period_id?: number | string | null;

        garantie?: number | string | null;
        garantie_loyer?: number | string | null;
    };

    const isPriceOnDemand =
        isTruthy(finance?.price_on_demand) ||
        isTruthy(finance?.sur_demande) ||
        formatPrice(bien).toLowerCase().includes('sur demande');

    if (isPriceOnDemand) {
        return [
            {
                label: bien.deal === 'RENT' ? 'Loyer' : 'Prix',
                value: 'Prix sur demande',
            },
        ];
    }

    const isStartingAt =
        isTruthy(finance?.price_starting_at) ||
        isTruthy(finance?.prix_des);

    const pricePeriodId = normalizePeriodId(
        finance?.price_period_id ??
        finance?.periode_prix_id ??
        getNestedValue(bien, 'prix.price_period_id') ??
        getNestedValue(bien, 'prix.periode_prix_id'),
        2
    );

    const netRent =
        finance?.net ??
        finance?.montant ??
        finance?.price ??
        finance?.valeur ??
        getNestedValue(bien, 'prix.price') ??
        getNestedValue(bien, 'prix.loyer_net') ??
        getNestedValue(bien, 'prix.loyer_mensuel') ??
        getNestedValue(bien, 'details.price') ??
        getNestedValue(bien, 'details.rent_monthly');

    const chargesRaw =
        finance?.charges ??
        getNestedValue(bien, 'prix.charges') ??
        getNestedValue(bien, 'prix.acompte_charges') ??
        getNestedValue(bien, 'details.charges');

    const chargesMode = finance?.charges_inclusives ?? null;
    const chargesPeriodId = normalizePeriodId(finance?.charges_period_id, 2);
    const totalRent = getRentTotalValue({
        rent: netRent,
        rentPeriodId: pricePeriodId,
        charges: chargesRaw,
        chargesMode,
        chargesPeriodId,
    });

    const guarantee =
        finance?.garantie_loyer ??
        finance?.garantie ??
        getNestedValue(bien, 'prix.garantie_loyer') ??
        getNestedValue(bien, 'prix.garantie');

    if (bien.deal !== 'RENT') {
        return [
            {
                label: isStartingAt ? 'Prix de vente dès' : 'Prix de vente',
                value: formatMoneyOrFallback(netRent, formatPrice(bien)),
            },
        ];
    }

    return [
        {
            label: isStartingAt ? 'Loyer net dès' : 'Loyer net',
            value: formatMoneyOrFallback(netRent, formatPrice(bien), pricePeriodId || 2),
        },
        {
            label: getChargesTableLabel(chargesMode),
            value: getChargesDisplayValue(chargesRaw, chargesMode, chargesPeriodId || 2),
        },
        {
            label: 'Loyer total',
            value: formatMoneyOrFallback(totalRent, null, 2),
        },
        {
            label: 'Garantie de loyer',
            value: formatMoneyOrFallback(guarantee, null),
        },
    ];
}


function getChargesCharacteristicValue(bien: CasaqBien): string | null {
    if (bien.deal !== 'RENT') {
        return null;
    }

    const finance = bien.prix as typeof bien.prix & {
        charges?: number | string | null;
        charges_inclusives?: string | null;
        charges_period_id?: number | string | null;
    };

    const charges = formatCharges(finance?.charges, finance?.charges_period_id);
    const status = getChargesStatus(finance?.charges_inclusives, Boolean(charges));

    if (!status && !charges) {
        return null;
    }

    if (status && charges) {
        return `${status} : ${charges}`;
    }

    return status || charges;
}
function hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
}

function formatSurface(value: unknown): string | null {
    if (!hasValue(value)) {
        return null;
    }

    return `${value} m²`;
}

function formatVolume(value: unknown): string | null {
    if (!hasValue(value)) {
        return null;
    }

    return `${value} m³`;
}

function formatMoney(value: unknown): string | null {
    if (!hasValue(value)) {
        return null;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value);
    }

    return `CHF ${new Intl.NumberFormat('fr-CH').format(number)}.-`;
}
function htmlToText(value?: string | null): string | null {
    if (!value) {
        return null;
    }

    return value
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}
function TextBlock({ value }: { value?: string | null }) {
    const text = htmlToText(value);

    if (!text) {
        return null;
    }

    return (
        <p style={{ whiteSpace: 'pre-line' }}>
            {text}
        </p>
    );
}

function getDescriptionBlocks(bien: CasaqBien): Array<{
    title: string;
    items: Array<{
        label: string;
        value: string;
    }>;
}> {
    const blocks = [
        {
            title: 'Situation & environnement',
            items: [
                { label: 'Situation', value: getStringValue(bien, 'descriptif.situation') },
                { label: 'Commune', value: getStringValue(bien, 'descriptif.commune') },
                { label: 'Accès', value: getStringValue(bien, 'descriptif.acces') },
                { label: 'Commerces', value: getStringValue(bien, 'descriptif.commerces') },
                { label: 'Transports', value: getStringValue(bien, 'descriptif.transports') },
                { label: 'Loisirs', value: getStringValue(bien, 'descriptif.loisirs') },
            ],
        },
        {
            title: 'Construction & niveaux',
            items: [
                { label: 'Construction', value: getStringValue(bien, 'descriptif.construction') },
                { label: 'Sous-sol', value: getStringValue(bien, 'descriptif.sous_sol') },
                { label: 'Rez-de-chaussée', value: getStringValue(bien, 'descriptif.rdc') },
                { label: '1er niveau', value: getStringValue(bien, 'descriptif.niv1') },
                { label: '2ème niveau', value: getStringValue(bien, 'descriptif.niv2') },
                { label: '3ème niveau', value: getStringValue(bien, 'descriptif.niv3') },
                { label: '4ème niveau', value: getStringValue(bien, 'descriptif.niv4') },
                { label: 'Combles', value: getStringValue(bien, 'descriptif.combles') },
                { label: 'Toiture', value: getStringValue(bien, 'descriptif.toiture') },
            ],
        },
        {
            title: 'Annexes & extérieurs',
            items: [
                { label: 'Annexe(s)', value: getStringValue(bien, 'descriptif.annexes') },
                { label: 'Aménagements extérieurs', value: getStringValue(bien, 'descriptif.amen_ext') },
                { label: 'Particularités', value: getStringValue(bien, 'descriptif.particularites') },
                { label: 'Remarques', value: getStringValue(bien, 'descriptif.remarques') },
            ],
        },
    ];

    return blocks
        .map((block) => ({
            ...block,
            items: block.items.filter(
                (item): item is { label: string; value: string } => Boolean(item.value)
            ),
        }))
        .filter((block) => block.items.length > 0);
}
function SmoothAccordion({
                             title,
                             children,
                             defaultOpen = false,
                         }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    defaultOpen = false
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className={`property-detail__accordion ${isOpen ? 'is-open' : ''}`}>
            <button
                type="button"
                className="h3 accordion-title"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
            >
                {title}

                <svg
                    width="26"
                    height="14"
                    viewBox="0 0 26 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1 0.999998L11.6654 12.4095C12.019 12.7876 12.4985 13 12.9985 13C13.4985 13 13.9781 12.7876 14.3317 12.4095L25 1.00315"
                        stroke="#575757"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>

            <div
                className="property-detail__accordion-panel"
                style={{
                    maxHeight: isOpen
                        ? `${contentRef.current?.scrollHeight || 0}px`
                        : '0px',
                }}
            >
                <div
                    ref={contentRef}
                    className="property-detail__accordion-content"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
function getAvailabilityCharacteristicValue(bien: CasaqBien): string | null {
    const value =
        getNestedValue(bien, 'caracteristiques.disponibilite.value') ||
        getNestedValue(bien, 'details.disponibility') ||
        getNestedValue(bien, 'disponibility') ||
        getNestedValue(bien, 'disponibilite.value');

    const label =
        getNestedValue(bien, 'caracteristiques.disponibilite.label') ||
        getNestedValue(bien, 'disponibilite.label');

    const date =
        getNestedValue(bien, 'caracteristiques.disponibilite.date') ||
        getNestedValue(bien, 'details.dispo_date') ||
        getNestedValue(bien, 'dispo_date') ||
        getNestedValue(bien, 'disponibilite.date');

    if (hasValue(date)) {
        const formattedDate = formatDateValue(date);

        if (formattedDate) {
            if (value === 'DATE') {
                return `Disponible dès le ${formattedDate}`;
            }

            if (label) {
                return `${label} - ${formattedDate}`;
            }

            return `Disponible dès le ${formattedDate}`;
        }
    }

    if (label) {
        return String(label);
    }

    if (hasValue(value)) {
        return String(formatAvailabilityValue(value));
    }

    return null;
}

function formatDateValue(value: unknown): string | null {
    if (!hasValue(value)) {
        return null;
    }

    const date = new Date(String(value));

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString('fr-CH');
}
function SmoothDetails({
                           children,
                           className,
                       }: {
    children: React.ReactNode;
    className?: string;
}) {
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDetails = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        const details = detailsRef.current;
        const content = contentRef.current;

        if (!details || !content) {
            return;
        }

        if (isOpen) {
            const height = content.scrollHeight;

            content.style.maxHeight = `${height}px`;

            requestAnimationFrame(() => {
                content.style.maxHeight = '0px';
            });

            window.setTimeout(() => {
                details.open = false;
                setIsOpen(false);
            }, 450);

            return;
        }

        details.open = true;
        setIsOpen(true);

        content.style.maxHeight = '0px';

        requestAnimationFrame(() => {
            content.style.maxHeight = `${content.scrollHeight}px`;
        });
    };

    const childrenArray = React.Children.toArray(children);
    const summary = childrenArray[0];
    const content = childrenArray.slice(1);

    return (
        <details
            ref={detailsRef}
            className={className}
        >
            {React.isValidElement<React.HTMLAttributes<HTMLElement>>(summary)
                ? React.cloneElement(summary, {
                    onClick: toggleDetails,
                })
                : summary}

            <div
                ref={contentRef}
                className="property-detail__smooth-details-content"
            >
                {content}
            </div>
        </details>
    );
}
function serializeSimilarBien(bien: CasaqBien) {
    const image =
        bien.images?.[0]?.variants?.original ||
        bien.images?.[0]?.variants?.xl ||
        bien.images?.[0]?.variants?.large ||
        bien.images?.[0]?.variants?.medium ||
        bien.images?.[0]?.url ||
        null;

    const locality = bien.adresse?.ville || '';
    const category = bien.categorie || '';

    return {
        id: bien.id,
        href: getBienSeoPath(bien),
        image,
        imageAlt: bien.images?.[0]?.alt || bien.titre,
        category,
        heading: [locality, category].filter(Boolean).join(' - '),
        titre: bien.titre,
        bedrooms: bien.caracteristiques?.chambres
            ? String(bien.caracteristiques.chambres)
            : null,
        bathrooms: getSimilarNumberValue(bien, [
            'caracteristiques.salles_de_bains',
            'caracteristiques.salle_de_bain',
            'caracteristiques.bathrooms',
            'caracteristiques.salles_bain',
        ]),
        price: formatPrice(bien),
    };
}

function getSimilarNumberValue(item: unknown, paths: string[]): string | null {
    for (const path of paths) {
        const value = getNestedValue(item, path);

        if (value !== null && value !== undefined && value !== '') {
            return String(value);
        }
    }

    return null;
}

function PropertyLocationMap({ bien }: { bien: CasaqBien }) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [activeCategory, setActiveCategory] = useState<PlaceCategory | null>(null);
    const [places, setPlaces] = useState<NearbyPlace[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
    const lat = Number(bien.adresse?.lat);
    const lng = Number(bien.adresse?.lng);

    const isRadius = bien.adresse?.public_mode === 'radius';
    const radius = Number(bien.adresse?.rayon_publication || 0);

    const center = useMemo(
        () => ({
            lat,
            lng,
        }),
        [lat, lng]
    );

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: googleMapsLibraries,
    });

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return (
            <div className="property-detail__map-empty">
                Localisation non disponible pour ce bien.
            </div>
        );
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="property-detail__map-empty">
                Clé Google Maps manquante.
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="property-detail__map-empty">
                Chargement de la carte…
            </div>
        );
    }

    const searchNearbyPlaces = (map: google.maps.Map, category: PlaceCategory) => {
        const service = new google.maps.places.PlacesService(map);

        service.nearbySearch(
            {
                location: center,
                radius: 3000,
                type: category,
            },
            (results, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
                    setPlaces([]);
                    return;
                }

                const nextPlaces = results
                    .slice(0, 12)
                    .map((place) => ({
                        id: place.place_id || place.name || String(Math.random()),
                        name: place.name || '',
                        address: place.vicinity || '',
                        lat: place.geometry?.location?.lat() || null,
                        lng: place.geometry?.location?.lng() || null,
                        type: category,
                    }))
                    .filter((place): place is NearbyPlace => {
                        return place.lat !== null && place.lng !== null;
                    });

                setPlaces(nextPlaces);

                const bounds = new google.maps.LatLngBounds();

                bounds.extend(center);

                nextPlaces.forEach((place) => {
                    bounds.extend({
                        lat: place.lat,
                        lng: place.lng,
                    });
                });

                if (nextPlaces.length > 0) {
                    map.fitBounds(bounds);
                } else {
                    map.setCenter(center);
                    map.setZoom(isRadius ? 13 : 15);
                }
            }
        );
    };

    const handleCategoryClick = (category: PlaceCategory) => {
        if (activeCategory === category) {
            setActiveCategory(null);
            setPlaces([]);
            setSelectedPlace(null);
            if (mapRef.current) {
                mapRef.current.setCenter(center);
                mapRef.current.setZoom(isRadius ? 13 : 15);
            }

            return;
        }

        setActiveCategory(category);
        setPlaces([]);
        setSelectedPlace(null);
        if (mapRef.current) {
            searchNearbyPlaces(mapRef.current, category);
        }
    };

    return (
        <div className="property-detail__map">
            <GoogleMap
                mapContainerClassName="property-detail__google-map"
                center={center}
                zoom={isRadius ? 13 : 15}
                options={{
                    styles: wizardMapStyles,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    streetViewControl: false,
                    clickableIcons: false,
                    gestureHandling: 'cooperative',
                    backgroundColor: '#E8EFE7',
                }}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            >
                {isRadius && radius ? (
                    <Circle
                        center={center}
                        radius={radius}
                        options={{
                            fillColor: '#C98A4B',
                            fillOpacity: 0.26,
                            strokeColor: '#B97500',
                            strokeOpacity: 0.7,
                            strokeWeight: 1,
                            clickable: false,
                        }}
                    />
                ) : (
                    <Marker
                        position={center}
                        clickable={false}
                    />
                )}

                {places.map((place) => (
                    <Marker
                        key={place.id}
                        position={{
                            lat: place.lat,
                            lng: place.lng,
                        }}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 7,
                            fillColor: '#FF6B00',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2,
                        }}
                        onClick={() => setSelectedPlace(place)}
                    />
                ))}
                {selectedPlace ? (
                    <InfoWindow
                        position={{
                            lat: selectedPlace.lat,
                            lng: selectedPlace.lng,
                        }}
                        onCloseClick={() => setSelectedPlace(null)}
                    >
                        <div className="property-detail__map-card-inner">
                            <strong>{selectedPlace.name}</strong>

                            {/*{selectedPlace.address ? (*/}
                            {/*    <p>{selectedPlace.address}</p>*/}
                            {/*) : null}*/}

                            <small>
                                {getPlaceCategoryLabel(selectedPlace.type)}
                            </small>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>

            <div className="property-detail__map-tabs">
                {placeCategories.map((category) => (
                    <button
                        key={category.type}
                        type="button"
                        className={activeCategory === category.type ? 'is-active' : ''}
                        onClick={() => handleCategoryClick(category.type)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

type PlaceCategory =
    | 'school'
    | 'store'
    | 'transit_station'
    | 'doctor'
    | 'parking'
    | 'restaurant';

type NearbyPlace = {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    type: PlaceCategory;
};
function getPlaceCategoryLabel(type: PlaceCategory): string {
    return placeCategories.find((category) => category.type === type)?.label || '';
}

const placeCategories: Array<{
    label: string;
    type: PlaceCategory;
}> = [
    { label: 'Écoles', type: 'school' },
    { label: 'Commerces', type: 'store' },
    { label: 'Transports', type: 'transit_station' },
    { label: 'Santé', type: 'doctor' },
    { label: 'Parkings', type: 'parking' },
    { label: 'Restaurants', type: 'restaurant' },
];

const wizardMapStyles: google.maps.MapTypeStyle[] = [
    {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#E8EFE7' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#B8D8D8' }],
    },
    {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#D9EFD3' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#CDEBC5' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#FFFFFF' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#777777' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#5F6F5F' }],
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6D6D6D' }],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#D6E6D6' }],
    },
];

function getFullDescription(bien: CasaqBien): string | null {
    const values = [
        getStringValue(bien, 'descriptif.description'),
        getStringValue(bien, 'descriptif.descriptif'),
        getStringValue(bien, 'descriptif.long'),
        getStringValue(bien, 'descriptif.full'),
        getStringValue(bien, 'descriptif.short'),
        typeof bien.resume === 'string' ? bien.resume : null,
    ];

    for (const value of values) {
        if (value && value.trim()) {
            return value.trim();
        }
    }

    return null;
}
function HtmlBlock({ value }: { value?: string | null }) {
    if (!value) {
        return null;
    }

    return (
        <div className="property-detail__html-content txt p">
            {parse(value)}
        </div>
    );
}

function ContactCard({ bien, domain }: { bien: CasaqBien; domain: string }) {
    const contact = getVisitContact(bien);

    if (!contact) {
        return null;
    }

    return (
        <div className="property-detail__contact-card">
            <h3>Contact de visite</h3>

            <div className="property-detail__contact-person">
                {contact.image && (
                    <div className="property-detail__contact-avatar">
                        <Image
                            src={contact.image}
                            alt={contact.name}
                            fill
                            sizes="400px"
                            className="property-detail__contact-avatar-img"
                        />

                </div>
                )}

                <div className="property-detail__contact-info">
                    <span className='label_avatar'>{getVisitContactTypeLabel(contact.type)}</span>

                    <strong className="h3">{contact.name}</strong>
                    <div className="property-detail__phone">

                    {contact.email ? (
                        <a href={`mailto:${contact.email}`} onClick={() => trackBienEvent(domain, bien.id, 'email_click')}>
                            <svg width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.6 21C1.885 21 1.27313 20.7432 0.7644 20.2296C0.255667 19.7159 0.000866667 19.0977 0 18.375V2.625C0 1.90312 0.2548 1.28537 0.7644 0.77175C1.274 0.258125 1.88587 0.000875 2.6 0H23.4C24.115 0 24.7273 0.25725 25.2369 0.77175C25.7465 1.28625 26.0009 1.904 26 2.625V18.375C26 19.0969 25.7456 19.7151 25.2369 20.2296C24.7282 20.7441 24.1159 21.0009 23.4 21H2.6ZM13 11.8125L23.4 5.25V2.625L13 9.1875L2.6 2.625V5.25L13 11.8125Z" fill="white"/>
                            </svg>

                        </a>
                    ) : null}

                    {contact.phone ? (
                        <a href={`tel:${cleanPhoneHref(contact.phone)}`} onClick={() => trackBienEvent(domain, bien.id, 'phone_click')}>
                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.22333 9.08833C5.90333 12.39 8.61 15.085 11.9117 16.7767L14.4783 14.21C14.7933 13.895 15.26 13.79 15.6683 13.93C16.975 14.3617 18.3867 14.595 19.8333 14.595C20.475 14.595 21 15.12 21 15.7617V19.8333C21 20.475 20.475 21 19.8333 21C8.87833 21 0 12.1217 0 1.16667C0 0.525 0.525 0 1.16667 0H5.25C5.89167 0 6.41667 0.525 6.41667 1.16667C6.41667 2.625 6.65 4.025 7.08167 5.33167C7.21 5.74 7.11667 6.195 6.79 6.52167L4.22333 9.08833Z" fill="white"/>
                            </svg>

                        </a>
                    ) : null}
                </div>
                </div>
            </div>
        </div>
    );
}

function getVisitContact(bien: CasaqBien): {
    type?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
} | null {
    const contact = (bien as CasaqBien & {
        contact_visite?: {
            type?: string | null;
            prenom?: string | null;
            nom?: string | null;
            nom_complet?: string | null;
            email?: string | null;
            telephone?: string | null;
            mobile?: string | null;
            image?: string | null;
        } | null;
    }).contact_visite;

    if (!contact) {
        return null;
    }

    const name =
        contact.nom_complet ||
        [contact.prenom, contact.nom].filter(Boolean).join(' ');

    const phone = contact.mobile || contact.telephone || null;

    if (!name && !contact.email && !phone && !contact.image) {
        return null;
    }

    return {
        type: contact.type,
        name: name || 'Contact de visite',
        email: contact.email || null,
        phone,
        image: contact.image || null,
    };
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'C';
}

function cleanPhoneHref(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
}

function getVisitContactTypeLabel(type?: string | null): string {
    switch (type) {
        case 'admin':
            return 'Responsable';
        case 'concierge':
            return 'Concierge';
        case 'tenant':
            return 'Locataire actuel';
        case 'owner':
            return 'Propriétaire';
        case 'agency':
            return 'Agence';
        default:
            return 'Contact de visite';
    }
}

function PropertyPriceBox({ bien }: { bien: CasaqBien }) {
    const price = getPriceDisplay(bien);

    if (bien.deal !== 'RENT') {
        return (
            <>
                <span>Prix de vente</span>
                <strong className="h3">{price.main}</strong>
            </>
        );
    }

    return (
        <>
            <span>Loyer net</span>
            <strong className="h3">{price.main}</strong>

            {price.chargesStatus ? (
                <div className="property-detail__charges-line">
                    <span>{price.chargesStatus}</span>

                    {price.charges ? (
                        <strong>{price.charges}</strong>
                    ) : null}
                </div>
            ) : null}
        </>
    );
}
function getPriceDisplay(bien: CasaqBien): {
    main: string;
    charges?: string | null;
    chargesStatus?: string | null;
} {
    const isRent = bien.deal === 'RENT';

    const priceText = formatPrice(bien);
    const lowerPrice = priceText.toLowerCase();

    const isPriceOnDemand =
        bien.prix?.sur_demande ||
        !bien.prix?.formatte ||
        lowerPrice.includes('sur demande');

    if (!isRent || isPriceOnDemand) {
        return {
            main: priceText,
        };
    }

    const finance = bien.prix as typeof bien.prix & {
        charges?: number | string | null;
        charges_inclusives?: string | null;
        charges_period_id?: number | string | null;
    };

    const chargesRaw = finance?.charges ?? null;
    const chargesMode = finance?.charges_inclusives ?? null;
    const chargesPeriod = finance?.charges_period_id ?? null;

    const charges = formatCharges(chargesRaw, chargesPeriod);
    const chargesStatus = getChargesStatus(chargesMode, Boolean(charges));

    return {
        main: priceText,
        charges,
        chargesStatus,
    };
}
function getChargesStatus(
    mode?: string | null,
    hasAmount = false
): string | null {
    switch (mode) {
        case 'yes':
            return 'Charges comprises';

        case 'no':
            return 'Charges non comprises';

        case 'individual':
            return 'Charges individuelles';

        case 'instalment':
            return hasAmount ? 'Acomptes de charges' : 'Charges en acompte';

        case 'estimated':
            return hasAmount ? 'Forfait de charges' : 'Charges forfaitaires';

        default:
            return hasAmount ? 'Charges' : null;
    }
}
function formatCharges(
    value?: number | string | null,
    periodId?: number | string | null
): string | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    return formatMoneyWithPeriod(value, periodId || 2);
}
function getFeatureValue(value: unknown): string | number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return value;
    }

    if (typeof value === 'boolean') {
        return value ? 'Oui' : 'Non';
    }

    return null;
}

function CharacteristicTableBlock({
                                      title,
                                      items,
                                  }: {
    title: string;
    items: Array<{
        label: string;
        value?: string | number | null;
    }>;
}) {
    if (!items.length) {
        return null;
    }

    return (
        <div className="property-detail__characteristics-block">
            <h3>{title}</h3>

            <div className="property-detail__characteristics-table">
                {items.map((item) => (
                    <div
                        key={`${title}-${item.label}`}
                        className="property-detail__characteristics-row"
                    >
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatMoneyOrFallback(
    value: unknown,
    fallback?: string | null,
    periodId?: number | string | null
): string | null {
    if (value === null || value === undefined || value === '') {
        return fallback || null;
    }

    const formatted = formatMoney(value);

    if (!formatted) {
        return fallback || null;
    }

    const period = getPeriodSuffix(periodId);

    return period ? `${formatted} / ${period}` : formatted;
}
function getPeriodSuffix(periodId?: number | string | null): string {
    const labels: Record<string, string> = {
        '1': 'an',
        '2': 'mois',
        '3': 'semaine',
        '4': 'jour',
        '5': 'semestre',
        '6': 'trimestre',
    };

    return labels[String(periodId || 2)] || 'mois';
}

function formatMoneyWithPeriod(
    value: unknown,
    periodId?: number | string | null
): string | null {
    const money = formatMoney(value);

    if (!money) {
        return null;
    }

    return `${money} / ${getPeriodSuffix(periodId)}`;
}
function getChargesTableLabel(mode?: string | null): string {
    switch (mode) {
        case 'instalment':
            return 'Acompte de charges';

        case 'estimated':
            return 'Forfait de charges';

        case 'yes':
            return 'Charges';

        case 'no':
            return 'Charges non comprises';

        case 'individual':
            return 'Charges individuelles';

        default:
            return 'Charges';
    }
}
function getHeatingValue(bien: CasaqBien): string | null {
    const type = getNestedValue(bien, 'energie.chauffage.type');
    const distribution = getNestedValue(bien, 'energie.chauffage.distribution');

    return [type, distribution]
        .filter(Boolean)
        .join(' / ') || null;
}

function getFirstValue(item: unknown, paths: string[]): unknown {
    for (const path of paths) {
        const value = getNestedValue(item, path);

        if (hasValue(value)) {
            return value;
        }
    }

    return null;
}

function markUsedPaths(usedPaths: Set<string>, paths: string[]) {
    paths.forEach((path) => usedPaths.add(path));
}

function formatConditionValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        new: 'Neuf',
        very_good: 'Très bon',
        good: 'Bon',
        to_restore: 'À rénover',
    };

    return labels[String(value)] || String(value);
}

function formatAvailabilityValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        IMMEDIATE: 'Immédiatement',
        DATE: 'À une date',
        DISCUSS: 'À convenir',
        DELIVERED: 'À la livraison',
    };

    return labels[String(value)] || String(value);
}

function formatExclusivityValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        NON_EXCLUSIF: 'Non exclusif',
        EXCLUSIF: 'Exclusif',
        CO_EXCLUSIF: 'Co-exclusif',
    };

    return labels[String(value)] || String(value);
}


function formatLength(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    return `${value} m`;
}

function formatWeight(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    return `${value} kg`;
}

function formatAmperage(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    return `${value} A`;
}

function formatYesNoValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        yes: 'Oui',
        no: 'Non',
        true: 'Oui',
        false: 'Non',
    };

    return labels[String(value)] || String(value);
}

function formatIncludedValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        yes: 'Compris',
        no: 'Non compris',
        estimated: 'Forfait',
        instalment: 'Acompte',
        individual: 'Individuel',
    };

    return labels[String(value)] || String(value);
}

function formatEquippedValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        yes: 'Oui',
        no: 'Non',
        partially: 'Partiellement',
        individual: 'Personnalisé',
    };

    return labels[String(value)] || String(value);
}

function formatUsedWaterValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        '1': 'Fosse septique',
        '2': 'Séparatif',
        '3': 'Unitaire',
        '4': 'Raccordement à la STEP',
    };

    return labels[String(value)] || String(value);
}

function formatPeriodValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        '1': 'An',
        '2': 'Mois',
        '3': 'Semaine',
        '4': 'Jour',
        '5': 'Semestre',
        '6': 'Trimestre',
    };

    return labels[String(value)] || String(value);
}

function formatOccupancyValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        empty: 'Vide',
        occupied: 'Occupé',
        partially_occupied: 'Partiellement occupé',
    };

    return labels[String(value)] || String(value);
}

function formatOpenClosedValue(value: unknown): string | number | null {
    if (!hasValue(value)) {
        return null;
    }

    const labels: Record<string, string> = {
        open: 'Local ouvert',
        closed: 'Local fermé',
    };

    return labels[String(value)] || String(value);
}
function isTruthy(value: unknown): boolean {
    return (
        value === true ||
        value === 1 ||
        value === '1' ||
        value === 'true' ||
        value === 'yes'
    );
}

function getRentTotalValue({
                               rent,
                               rentPeriodId,
                               charges,
                               chargesMode,
                               chargesPeriodId,
                           }: {
    rent: unknown;
    rentPeriodId?: number | string | null;
    charges: unknown;
    chargesMode?: string | null;
    chargesPeriodId?: number | string | null;
}): number | null {
    const rentMonthly = normalizeAmountToMonthly(rent, rentPeriodId || 2);

    if (rentMonthly === null) {
        return null;
    }

    if (chargesMode === 'yes') {
        return rentMonthly;
    }

    if (chargesMode === 'individual') {
        return null;
    }

    const chargesMonthly = normalizeAmountToMonthly(charges, chargesPeriodId || 2);

    if (chargesMonthly === null) {
        return null;
    }

    if (
        chargesMode === 'no' ||
        chargesMode === 'estimated' ||
        chargesMode === 'instalment' ||
        !chargesMode
    ) {
        return rentMonthly + chargesMonthly;
    }

    return null;
}

function normalizeAmountToMonthly(
    value: unknown,
    periodId?: number | string | null
): number | null {
    if (!hasValue(value)) {
        return null;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return null;
    }

    switch (String(periodId || 2)) {
        case '1':
            return number / 12;

        case '2':
            return number;

        case '3':
            return (number * 52) / 12;

        case '4':
            return (number * 365) / 12;

        case '5':
            return number / 6;

        case '6':
            return number / 3;

        default:
            return number;
    }
}

function getChargesDisplayValue(
    value: unknown,
    mode?: string | null,
    periodId?: number | string | null
): string | null {
    if (mode === 'yes') {
        return 'Comprises';
    }

    if (mode === 'individual') {
        return 'Individuelles';
    }

    const amount = formatCharges(value as number | string | null, periodId || 2);

    if (amount) {
        return amount;
    }

    if (mode === 'no') {
        return 'Non comprises';
    }

    if (mode === 'estimated') {
        return 'Forfait';
    }

    if (mode === 'instalment') {
        return 'Acompte';
    }

    return null;
}
function splitLines(value?: string | null): string[] {
    if (!value) {
        return [];
    }

    return value
        .split(/\r?\n|<br\s*\/?>/i)
        .map((line) => line.trim())
        .filter(Boolean);
}

function normalizePeriodId(value: unknown, fallback: number | string = 2): number | string {
    if (typeof value === 'number' || typeof value === 'string') {
        return value;
    }

    return fallback;
}

function getDocumentDownloadName(document: {
    label: string;
    extension?: string | null;
}): string {
    const cleanLabel = document.label
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9À-ÿ]+/gi, '-')
        .replace(/^-+|-+$/g, '');

    const extension = document.extension
        ? document.extension.replace('.', '').toLowerCase()
        : 'pdf';

    return `${cleanLabel || 'document'}.${extension}`;
}

function getHeroImage(bien: CasaqBien): { src: string; alt?: string | null } | null {
    const image = bien.images?.[0];

    if (!image) {
        return null;
    }

    const src =
        image.variants?.original ||
        image.variants?.xl ||
        image.variants?.large ||
        image.variants?.medium ||
        image.url ||
        '';

    if (!src) {
        return null;
    }

    return {
        src,
        alt: image.alt || bien.titre,
    };
}