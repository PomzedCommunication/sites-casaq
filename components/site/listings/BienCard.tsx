import Image from 'next/image';
import Link from 'next/link';
import type { CasaqBien } from '@/lib/casaq';
import { getBienSeoPath } from '@/lib/property-url';
type Props = {
    bien: CasaqBien;
    previewDomain?: string;
};

export function BienCard({ bien, previewDomain }: Props) {
    const image =
        bien.images?.[0]?.variants?.medium ||
        bien.images?.[0]?.variants?.large ||
        bien.images?.[0]?.url ||
        null;

    return (
        <article className="bien-card">
            {image ? (
                <div className="bien-card__image-wrap">
                    <Image
                        src={image}
                        alt={bien.images?.[0]?.alt || bien.titre}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="bien-card__image"
                    />
                </div>
            ) : null}

            <div className="bien-card__body">
                <p className="bien-card__price">
                    {bien.prix?.formatte || 'Prix sur demande'}
                </p>

                <h3 className="bien-card__title">{bien.titre}</h3>

                <p className="bien-card__meta">
                    {bien.adresse?.npa} {bien.adresse?.ville}
                </p>

                <p className="bien-card__meta">
                    {bien.caracteristiques?.pieces
                        ? `${bien.caracteristiques.pieces} pièces`
                        : null}
                    {bien.caracteristiques?.surface_habitable
                        ? ` · ${bien.caracteristiques.surface_habitable} m²`
                        : null}
                </p>

                <Link href={buildUrl(getBienSeoPath(bien), previewDomain)}>
                    Voir le bien
                </Link>
            </div>
        </article>
    );
}

function buildUrl(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    return `${url}?site=${encodeURIComponent(previewDomain)}`;
}