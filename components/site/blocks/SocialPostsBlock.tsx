'use client';

import { useEffect, useMemo } from 'react';
import type { CasaqBloc } from '@/lib/casaq';
import { blockData } from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';

type Props = {
    bloc: CasaqBloc;
    previewDomain?: string;
};

type Data = {
    titre?: string;
    texte?: string;
    embed_code?: string;
};

const ELFSIGHT_SCRIPT_SRC = 'https://static.elfsight.com/platform/platform.js';

export function SocialPostsBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);

    const embedCode = String(data.embed_code || '').trim();

    const elfsightAppId = useMemo(() => {
        const match = embedCode.match(/elfsight-app-([a-zA-Z0-9-]+)/);

        return match?.[1] || '';
    }, [embedCode]);

    useEffect(() => {
        if (!elfsightAppId) {
            return;
        }

        const alreadyLoaded = document.querySelector(
            `script[src="${ELFSIGHT_SCRIPT_SRC}"]`,
        );

        if (!alreadyLoaded) {
            const script = document.createElement('script');

            script.src = ELFSIGHT_SCRIPT_SRC;
            script.async = true;

            document.body.appendChild(script);
        }

        window.dispatchEvent(new Event('elfsight:load'));
    }, [elfsightAppId]);

    return (
        <section className={`section pd-l-r social-posts social-posts--${bloc.data.variant || 'cards'}`}>
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Nos réseaux sociaux'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>
                </div>

                {elfsightAppId ? (
                    <div className="social-posts__embed">
                        <div
                            className={`elfsight-app-${elfsightAppId}`}
                            data-elfsight-app-lazy
                        />
                    </div>
                ) : null}
            </div>
        </section>
    );
}