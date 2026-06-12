import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import { blockData, getLinkProps } from '@/lib/site-blocks';
import {parseSiteHtml} from "@/lib/site-html";

type Props = {
    bloc: CasaqBloc;
};

type Data = {
    titre?: string;
    texte?: string;
    button?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

export function CtaBannerBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);
    const link = getLinkProps(data.button || data.cta);

    if (!data.titre && !data.texte && !link) {
        return null;
    }

    return (
        <section className="section cta-banner white">
            <div className="container pd-l-r">
                <div className="cta-banner__inner">
                    <div className="section-heading section-heading--with-action">
                        <div>
                            <h2>{data.titre || 'Coups de cœur'}</h2>

                            {data.texte ? (
                                <div className="txt white">
                                    {parseSiteHtml(data.texte)}
                                </div>
                            ) : null}
                        </div>

                        {link ? (
                            <Link
                                href={link.href}
                                target={link.target}
                                rel={link.rel}
                                className="site-btn btn-white site-btn--secondary"
                            >
                                {link.label || 'En savoir plus'}
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}