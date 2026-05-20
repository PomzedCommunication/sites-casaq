import Image from 'next/image';
import type { CasaqBien, CasaqSiteConfig } from '@/lib/casaq';
import { PropertyContactForm } from '@/components/site/properties/PropertyContactForm';
type Props = {
    site: CasaqSiteConfig;
    bien: CasaqBien;
    domain: string;
};

export function BienDetailTemplate({ site, bien, domain }: Props) {
    const images = bien.images || [];
    const mainImage =
        images[0]?.variants?.large ||
        images[0]?.variants?.xl ||
        images[0]?.url ||
        null;

    return (
        <>
            <section className="property-hero">
                <div>
                    <p className="property-hero__eyebrow">
                        {bien.categorie || 'Bien immobilier'} · {bien.reference}
                    </p>

                    <h1 className="property-hero__title">{bien.titre}</h1>

                    <p className="property-hero__location">
                        {bien.adresse?.npa} {bien.adresse?.ville}
                    </p>
                </div>

                <div className="property-hero__price">
                    {bien.prix?.formatte || 'Prix sur demande'}
                </div>
            </section>

            {mainImage ? (
                <section className="property-gallery">
                    <div className="property-gallery__main">
                        <Image
                            src={mainImage}
                            alt={images[0]?.alt || bien.titre}
                            fill
                            priority
                            sizes="100vw"
                            className="property-gallery__image"
                        />
                    </div>

                    {images.length > 1 ? (
                        <div className="property-gallery__thumbs">
                            {images.slice(1, 5).map((image, index) => {
                                const src =
                                    image.variants?.medium ||
                                    image.variants?.large ||
                                    image.url;

                                if (!src) {
                                    return null;
                                }

                                return (
                                    <div className="property-gallery__thumb" key={`${src}-${index}`}>
                                        <Image
                                            src={src}
                                            alt={image.alt || bien.titre}
                                            fill
                                            sizes="25vw"
                                            className="property-gallery__image"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </section>
            ) : null}

            <section className="property-content">
                <div className="property-main">
                    <h2>Description</h2>

                    {bien.resume ? (
                        <p className="property-description">{bien.resume}</p>
                    ) : (
                        <p className="property-description">
                            Description à compléter dans CasaQ.
                        </p>
                    )}

                    <h2>Caractéristiques</h2>

                    <div className="property-features">
                        <Feature label="Pièces" value={bien.caracteristiques?.pieces} />
                        <Feature label="Chambres" value={bien.caracteristiques?.chambres} />
                        <Feature
                            label="Surface habitable"
                            value={
                                bien.caracteristiques?.surface_habitable
                                    ? `${bien.caracteristiques.surface_habitable} m²`
                                    : null
                            }
                        />
                        <Feature
                            label="Surface terrain"
                            value={
                                bien.caracteristiques?.surface_terrain
                                    ? `${bien.caracteristiques.surface_terrain} m²`
                                    : null
                            }
                        />
                    </div>
                </div>

                <aside className="property-sidebar">
                    <h3>Contact</h3>

                    <p>{site.agence.nom}</p>

                    {site.infos.telephone ? <p>{site.infos.telephone}</p> : null}
                    {site.infos.email ? <p>{site.infos.email}</p> : null}

                    <PropertyContactForm domain={domain} bienId={bien.id} />
                </aside>
            </section>
        </>
    );
}

function Feature({
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
        <div className="property-feature">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}