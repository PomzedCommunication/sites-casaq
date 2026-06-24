'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useRef, useState } from 'react';
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
    const mainImage = images[0] || null;

    const features = getMainFeatures(bien);
    const documents = getDocuments(bien);
    return (
        <main className="property-detail">
            {/* HERO */}
            <section className="site-hero site-hero--simple property-detail__hero ">
                {mainImage ? (
                    <Image
                        src={mainImage.src}
                        alt={mainImage.alt || bien.titre}
                        fill
                        priority
                        sizes="100vw"
                        className="property-detail__hero-image"
                    />
                ) : null}

                <div className="property-detail__hero-overlay"/>

                <div className="property-detail__hero-content">
                    <div className="property-detail__badges">
                        {bien.categorie ? (
                            <div className="site-btn btn-grey btn-sm">{bien.categorie}</div>
                        ) : null}

                        {bien.adresse?.ville ? (
                            <div className="site-btn btn-grey btn-sm">{bien.adresse.ville}</div>
                        ) : null}

                        {getAvailabilityLabel(bien) ? (
                            <div className="site-btn btn-sm">{getAvailabilityLabel(bien)}</div>
                        ) : null}
                        <FavoriteButton bienId={bien.id} />
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
                        {getCharacteristicBlocks(bien).map((block) => (
                            <div
                                key={block.title}
                                className="property-detail__characteristics-block"
                            >
                                <h3>{block.title}</h3>

                                <div className="property-detail__features-grid">
                                    {block.items.map((item) => (
                                        <FeatureItem
                                            key={`${block.title}-${item.label}`}
                                            label={item.label}
                                            value={item.value}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </SmoothDetails>
            </section>

            {/* GALERIE */}
            <PropertyGallerySlider
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
                        <ContactCard bien={bien} />
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
                                key={document.url}
                                href={document.url}
                                target="_blank"
                                rel="noreferrer"
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
                            <strong>{site.agence.nom}</strong>

                            {site.infos.adresse ? (
                                <p>{site.infos.adresse}</p>
                            ) : null}

                            {site.infos.telephone ? (
                                <p>{site.infos.telephone}</p>
                            ) : null}

                            {site.infos.email ? (
                                <p>{site.infos.email}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="property-detail__form">
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
                     }: {
    label: string;
    value?: string | number | null;
}) {
    if (!value) {
        return null;
    }

    return (
        <div className="property-detail__feature">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function getImages(bien: CasaqBien): Array<{ src: string; alt?: string | null }> {
    return (bien.images || [])
        .map((image) => ({
            src:
                image.variants?.xl ||
                image.variants?.large ||
                image.variants?.medium ||
                image.url ||
                '',
            alt: image.alt || bien.titre,
        }))
        .filter((image) => Boolean(image.src));
}

function getMainFeatures(bien: CasaqBien): Array<{
    label: string;
    value?: string | number | null;
}> {
    const caracteristiques = bien.caracteristiques || {};

    return [
        {
            label: 'Pièces',
            value: getFeatureValue(caracteristiques.pieces),
        },
        {
            label: 'Chambres',
            value: getFeatureValue(caracteristiques.chambres),
        },
        {
            label: 'Salles de bain',
            value: getFeatureValue(
                getNestedValue(bien, 'caracteristiques.salles_de_bains')
                || getNestedValue(bien, 'caracteristiques.salle_de_bain')
                || getNestedValue(bien, 'caracteristiques.bathrooms')
            ),
        },
        {
            label: 'Cuisine',
            value: getFeatureValue(getNestedValue(bien, 'caracteristiques.cuisine')),
        },
        {
            label: 'Balcon',
            value: getFeatureValue(getNestedValue(bien, 'caracteristiques.balcon')),
        },
        {
            label: 'Terrasse',
            value: getFeatureValue(getNestedValue(bien, 'caracteristiques.terrasse')),
        },
        {
            label: 'Surface',
            value: caracteristiques.surface_habitable
                ? `${caracteristiques.surface_habitable} m²`
                : null,
        },
        {
            label: 'Parking',
            value: getFeatureValue(getNestedValue(bien, 'caracteristiques.parking')),
        },
    ];
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
    const localisationAddress =
        getStringValue(bien, 'localisation.adresse_affichee') ||
        getStringValue(bien, 'localisation.adresse_complete');

    if (localisationAddress) {
        return localisationAddress;
    }

    return [
        bien.adresse?.rue,
        bien.adresse?.npa,
        bien.adresse?.ville,
    ]
        .filter(Boolean)
        .join(', ');
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

function getCharacteristicBlocks(bien: CasaqBien): Array<{
    title: string;
    items: Array<{
        label: string;
        value?: string | number | null;
    }>;
}> {
    const blocks = [
        {
            title: 'Caractéristiques principales',
            items: [
                { label: 'Type de bien', value: bien.categorie },
                { label: 'Prix', value: formatPrice(bien) },
                { label: 'Charges', value: getChargesCharacteristicValue(bien) },
                { label: 'Surface habitable', value: formatSurface(getNestedValue(bien, 'caracteristiques.surface_habitable')) },
                { label: 'Pièces', value: getNestedValue(bien, 'caracteristiques.pieces') },
                { label: 'Chambres', value: getNestedValue(bien, 'caracteristiques.chambres') },
                { label: 'Salles de bain', value: getNestedValue(bien, 'caracteristiques.salles_bain') || getNestedValue(bien, 'caracteristiques.salles_de_bains') },
                { label: 'Référence', value: bien.reference },
                { label: 'Disponibilité', value: getAvailabilityLabel(bien) },
            ],
        },
        {
            title: 'Surfaces',
            items: [
                { label: 'Surface habitable', value: formatSurface(getNestedValue(bien, 'surfaces.surface_habitable')) },
                { label: 'Surface habitable totale', value: formatSurface(getNestedValue(bien, 'surfaces.surface_habitable_totale')) },
                { label: 'Surface totale', value: formatSurface(getNestedValue(bien, 'surfaces.surface_totale')) },
                { label: 'Surface terrain', value: formatSurface(getNestedValue(bien, 'surfaces.surface_terrain')) },
                { label: 'Surface utile', value: formatSurface(getNestedValue(bien, 'surfaces.surface_utile')) },
                { label: 'Surface balcon', value: formatSurface(getNestedValue(bien, 'surfaces.surface_balcon')) },
                { label: 'Surface terrasse', value: formatSurface(getNestedValue(bien, 'surfaces.surface_terrasse')) },
                { label: 'Surface jardin', value: formatSurface(getNestedValue(bien, 'surfaces.surface_jardin')) },
                { label: 'Surface cave', value: formatSurface(getNestedValue(bien, 'surfaces.surface_cave')) },
                { label: 'Volume', value: formatVolume(getNestedValue(bien, 'surfaces.volume')) },
            ],
        },
        {
            title: 'Bâtiment',
            items: [
                { label: 'Année de construction', value: getNestedValue(bien, 'batiment.annee_construction') },
                { label: 'Année de rénovation', value: getNestedValue(bien, 'batiment.annee_renovation') },
                { label: 'Étage', value: getNestedValue(bien, 'batiment.etage') },
                { label: 'Nombre d’étages total', value: getNestedValue(bien, 'batiment.nombre_etages_total') },
                { label: 'Nombre de niveaux', value: getNestedValue(bien, 'batiment.nombre_niveaux') },
                { label: 'Orientation', value: getNestedValue(bien, 'batiment.orientation') },
                { label: 'Condition', value: getNestedValue(bien, 'batiment.condition') },
            ],
        },
        {
            title: 'Stationnement',
            items: [
                { label: 'Parking disponible', value: getNestedValue(bien, 'stationnement.parking_available') },
                { label: 'Places intérieures', value: getNestedValue(bien, 'stationnement.interieur.nombre') },
                { label: 'Prix place intérieure', value: formatMoney(getNestedValue(bien, 'stationnement.interieur.prix_total')) },
                { label: 'Places extérieures', value: getNestedValue(bien, 'stationnement.exterieur.nombre') },
                { label: 'Prix place extérieure', value: formatMoney(getNestedValue(bien, 'stationnement.exterieur.prix_total')) },
                { label: 'Box', value: getNestedValue(bien, 'stationnement.box.nombre') },
                { label: 'Prix box', value: formatMoney(getNestedValue(bien, 'stationnement.box.prix_total')) },
                { label: 'Total places', value: getNestedValue(bien, 'stationnement.total.nombre') },
            ],
        },
        {
            title: 'Énergie',
            items: [
                { label: 'Chauffage', value: getNestedValue(bien, 'energie.chauffage.type') },
                { label: 'Prix chauffage', value: formatMoney(getNestedValue(bien, 'energie.chauffage.prix')) },
                { label: 'Eau chaude', value: getNestedValue(bien, 'energie.eau_chaude') },
                { label: 'Efficacité énergétique', value: getNestedValue(bien, 'energie.efficacite_energetique') },
                { label: 'Enveloppe bâtiment', value: getNestedValue(bien, 'energie.enveloppe_batiment') },
                { label: 'Émissions CO₂', value: getNestedValue(bien, 'energie.emissions_co2') },
            ],
        },
        {
            title: 'Localisation',
            items: [
                { label: 'Adresse', value: getFullAddress(bien) },
                { label: 'NPA', value: bien.adresse?.npa },
                { label: 'Ville', value: bien.adresse?.ville },
                { label: 'Pays', value: bien.adresse?.pays },
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
        bien.images?.[0]?.variants?.medium ||
        bien.images?.[0]?.variants?.large ||
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
    const parts = [
        getStringValue(bien, 'descriptif.description'),
        getStringValue(bien, 'descriptif.descriptif'),
        getStringValue(bien, 'descriptif.long'),
        getStringValue(bien, 'descriptif.full'),
        getStringValue(bien, 'descriptif.short'),
        typeof bien.resume === 'string' ? bien.resume : null,
    ].filter((value): value is string => Boolean(value));

    if (parts.length === 0) {
        return null;
    }

    return parts.join('<br><br>');
}
function HtmlBlock({ value }: { value?: string | null }) {
    if (!value) {
        return null;
    }

    return (
        <div className="property-detail__html-content">
            {parse(value)}
        </div>
    );
}

function ContactCard({ bien }: { bien: CasaqBien }) {
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
                        <a href={`mailto:${contact.email}`}>
                            <svg width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.6 21C1.885 21 1.27313 20.7432 0.7644 20.2296C0.255667 19.7159 0.000866667 19.0977 0 18.375V2.625C0 1.90312 0.2548 1.28537 0.7644 0.77175C1.274 0.258125 1.88587 0.000875 2.6 0H23.4C24.115 0 24.7273 0.25725 25.2369 0.77175C25.7465 1.28625 26.0009 1.904 26 2.625V18.375C26 19.0969 25.7456 19.7151 25.2369 20.2296C24.7282 20.7441 24.1159 21.0009 23.4 21H2.6ZM13 11.8125L23.4 5.25V2.625L13 9.1875L2.6 2.625V5.25L13 11.8125Z" fill="white"/>
                            </svg>

                        </a>
                    ) : null}

                    {contact.phone ? (
                        <a href={`tel:${cleanPhoneHref(contact.phone)}`}>
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

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value);
    }

    const periodLabels: Record<string, string> = {
        '1': 'an',
        '2': 'mois',
        '3': 'semaine',
        '4': 'jour',
        '5': 'semestre',
        '6': 'trimestre',
    };

    const period = periodLabels[String(periodId || 2)] || 'mois';

    return `CHF ${new Intl.NumberFormat('fr-CH').format(number)}.- / ${period}`;
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