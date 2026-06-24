import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import {blockData, getLinkProps, withPreviewUrl} from '@/lib/site-blocks';
import {parseSiteHtml} from "@/lib/site-html";

type Props = {
    bloc: CasaqBloc;
};

type Data = {
    titre?: string;
    texte?: string;
    items?: Array<{
        value?: string;
        label?: string;
    }>;
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

export function StatsBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];
    const link = getLinkProps(data.cta);

    if (!data.titre && !items.length) {
        return null;
    }

    return (
        <section className="section pd-l-r stats-block">
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Coups de cœur'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>

                    {link ? (
                        <Link
                            href={link.href}
                            target={link.target}
                            rel={link.rel}
                            className="site-btn site-btn--primary"
                        >
                            {link.label || 'En savoir plus'}
                        </Link>
                    ) : null}
                </div>

                {items.length ? (
                    <div className="stats-grid">
                        {items.map((item, index) => (
                            <div className="stat-card" key={index}>
                                <strong>{item.value}</strong>
                                <span> {item.label}</span>
                            </div>
                        ))}
                    </div>
                ) : null}


            </div>
        </section>
    );
}