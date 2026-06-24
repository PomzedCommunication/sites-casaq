import Image from 'next/image';
import type { CasaqBloc } from '@/lib/casaq';
import { blockData, siteAssetUrl, withPreviewUrl } from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';
import Link from 'next/link';

type Props = {
    bloc: CasaqBloc;
    previewDomain?: string;
};

type Pillar = {
    icone?: string;
    titre?: string;
    texte?: string;
};

type LinkField = {
    label?: string;
    url?: string;
    href?: string;
    target_blank?: boolean;
    target?: string;
    rel?: string;
};

type Data = {
    titre?: string;
    texte?: string;
    items?: Pillar[];
    cta?: LinkField;
};

export function PillarsBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];

    const cta = data.cta;
    const ctaHref = cta?.href || cta?.url;
    const hasCta = Boolean(ctaHref && cta?.label);
    const ctaLabel = cta?.label;

    return (
        <section className={`section pd-l-r pillars pillars--${bloc.data.variant || 'three_columns'}`}>
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Nos trois piliers'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>

                    {hasCta ? (
                        <Link
                            href={withPreviewUrl(ctaHref!, previewDomain)}
                            target={cta?.target_blank ? '_blank' : cta?.target}
                            rel={cta?.target_blank ? 'noopener noreferrer' : cta?.rel}
                            className="site-btn site-btn--primary"
                        >
                            {ctaLabel}
                        </Link>
                    ) : null}
                </div>

                <div className="pillars__grid">
                    {items.map((item, index) => {
                        const icon = getPillarImage(item.icone);

                        return (
                            <article key={index} className="pillars__card">
                                {icon ? (
                                    <div className="pillars__icon">
                                        <Image
                                            src={icon}
                                            alt={item.titre || ''}
                                            width={72}
                                            height={72}
                                            className="pillars__icon-image"
                                        />
                                    </div>
                                ) : null}

                                <h3 className="pillars__title">
                                    {item.titre || 'Titre à compléter'}
                                </h3>

                                {item.texte ? (
                                    <div className="pillars__text txt">
                                        {parseSiteHtml(item.texte)}
                                    </div>
                                ) : null}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function getPillarImage(value?: string): string | null {
    const cleanValue = String(value || '').trim();

    if (!cleanValue) {
        return null;
    }

    /**
     * Anciennes valeurs texte du bloc :
     * star, comments, bolt, etc.
     * On les ignore car ce ne sont pas des images.
     */
    const looksLikeImage =
        cleanValue.startsWith('http://') ||
        cleanValue.startsWith('https://') ||
        cleanValue.startsWith('/') ||
        cleanValue.includes('/') ||
        /\.(png|jpe?g|webp|svg|gif)$/i.test(cleanValue);

    if (!looksLikeImage) {
        return null;
    }

    return siteAssetUrl(cleanValue) || null;
}