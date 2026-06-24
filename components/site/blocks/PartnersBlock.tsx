import type { CasaqBloc } from '@/lib/casaq';
import {
    getSitePartners,
    getSitePartnersByIds,
} from '@/lib/casaq';
import {blockData, withPreviewUrl} from '@/lib/site-blocks';
import { PartnersFilterGrid } from '@/components/site/blocks/PartnersFilterGrid';
import {parseSiteHtml} from "@/lib/site-html";
import Link from "next/link";

type Props = {
    bloc: CasaqBloc;
    currentDomain: string;
};

type Data = {
    titre?: string;
    texte?: string;
    mode?: 'all' | 'manual' | 'latest' | 'category';
    partner_ids?: Array<string | number>;
    category_id?: string | number | null;
    nb?: number;
};

export async function PartnersBlock({ bloc, currentDomain }: Props) {
    const data = blockData<Data>(bloc);

    const mode = data.mode === 'latest' ? 'all' : data.mode || 'all';
    const limit = Number(data.nb || 24);
    const partnerIds = Array.isArray(data.partner_ids) ? data.partner_ids : [];

    const partners =
        mode === 'manual'
            ? await getSitePartnersByIds(currentDomain, partnerIds)
            : await getSitePartners(currentDomain, {
                limit,
                categoryId: mode === 'category' ? data.category_id : null,
            });

    return (
        <section className={`section pd-l-r partners partners--${bloc.data.variant || 'cards'}`}>
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


                </div>

                <PartnersFilterGrid partners={partners}/>
            </div>
        </section>
    );
}