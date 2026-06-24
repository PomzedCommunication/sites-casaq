import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import { blockData, getLinkProps, siteAssetUrl, withPreviewUrl } from '@/lib/site-blocks';
import {parseSiteHtml} from "@/lib/site-html";

type Props = {
    bloc: CasaqBloc;
    previewDomain?: string;
};

type SocialPost = {
    image?: string;
    plateforme?: string;
    titre?: string;
    date?: string;
    likes?: number;
    comments?: number;
    link?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

type Data = {
    titre?: string;
    texte?: string;
    items?: SocialPost[];
};

export function SocialPostsBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];

    return (
        <section className={`section pd-l-r social-posts social-posts--${bloc.data.variant || 'cards'}`}>
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Nos actualités'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>

                </div>

            </div>
        </section>
    );
}