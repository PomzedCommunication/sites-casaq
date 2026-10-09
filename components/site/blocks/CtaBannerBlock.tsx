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
    phone_text?: string;
    phone_link?: string;
    texte_court?: string;
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

    if (!data.titre && !link) {
        return null;
    }

    const phoneText = data.phone_text?.trim();
    const phoneLink = data.phone_link?.trim();

    let phoneHref = '';

    if (phoneText && phoneLink) {
        const isUrl =
            phoneLink.startsWith('http://') ||
            phoneLink.startsWith('https://') ||
            phoneLink.startsWith('/')
        if (isUrl) {
            phoneHref = phoneLink;
        } else {
            phoneHref = `tel:${phoneLink.replace(/[^\d+]/g, '')}`;
        }
    }

    return (
        <section className="section cta-banner white">
            <div className="container pd-l-r">
                <div className="cta-banner__inner">
                    <div className="section-heading section-heading--with-action">
                        <div>

                            {data.texte_court ? (
                                <div className="txt white cta-top-txt">
                                    {parseSiteHtml(data.texte_court)}
                                </div>
                            ) : null}

                            <h2>{data.titre || 'Coups de cœur'}</h2>

                            {data.texte ? (
                                <div className="txt white">
                                    {parseSiteHtml(data.texte)}
                                </div>
                            ) : null}
                        </div>

                        {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}

                        <div className="super-pose-btn">

                            {link ? (
                                <Link
                                    href={link.href}
                                    target={link.target}
                                    rel={link.rel}
                                    className="site-btn btn-white "
                                >
                                    {link.label || 'En savoir plus'}
                                </Link>
                            ) : null}

                            {phoneHref ? (
                                <Link
                                    href={phoneHref}
                                    className="site-btn btn-white"
                                >
                                    {phoneText}
                                </Link>
                            ) : null}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}