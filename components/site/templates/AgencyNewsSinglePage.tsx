// components/site/AgencyNewsSinglePage.tsx

import Link from 'next/link';
import type {
    CasaqBiensMeta,
    CasaqBien,
    CasaqPage,
    CasaqPost,
    CasaqSiteConfig,
    CasaqBloc,
} from '@/lib/casaq';
import { withPreviewUrl } from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';
import { BlocksRenderer } from '@/components/site/blocks/BlocksRenderer';
import Image from "next/image";
import {cleanSiteText} from "@/lib/text";
import { AgencyNewsBlock } from '@/components/site/blocks/AgencyNewsBlock';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    post: CasaqPost;
    currentDomain: string;
    previewDomain?: string;
};

const emptyBiens: CasaqBien[] = [];

const emptyBiensMeta: CasaqBiensMeta = {
    total: 0,
    page: 1,
    per_page: 12,
    total_pages: 0,
    has_more: false,
};

export function AgencyNewsSinglePage({
                                         site,
                                         page,
                                         post,
                                         currentDomain,
                                         previewDomain,
                                     }: Props) {
    const hasBlocks = Array.isArray(post.blocks) && post.blocks.length > 0;
    const relatedNewsBloc: CasaqBloc = {
        type: 'agency_news',
        ordre: 999,
        actif: true,
        data: {
            variant: 'carousel',
            titre: 'Autres actualités',
            texte: '',
            mode: 'latest',
            nb: 6,
            cta: {
                label: 'Toutes les actualités',
                url: '/actualites',
                target_blank: false,
            },
        },
    };
    return (
        <main className="site-main">

            <section className="site-hero site-hero--simple">
                {post.cover_image ? (
                    <>
                        <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            priority
                            sizes="100vw"
                            className="site-hero__image"
                        />

                        <div className="site-hero__overlay"/>
                    </>
                ) : null}

                <div className="site-hero__content white">
                    {post.category ? (
                        <div className="agency-news-single__category">
                            {post.category}
                        </div>
                    ) : null}
                    <h1>{post.title}</h1>

                    {post.published_at ? (
                        <time
                            className="agency-news-single__date"
                            dateTime={post.published_at}
                        >
                            {new Date(post.published_at).toLocaleDateString('fr-CH')}
                        </time>
                    ) : null}

                    {/*{post.excerpt ? (*/}
                    {/*    <p className="agency-news-single__excerpt">*/}
                    {/*        {parseSiteHtml(post.excerpt)}*/}
                    {/*    </p>*/}
                    {/*) : null}*/}
                </div>
            </section>


            <div className="content-post">
                {hasBlocks ? (
                    <BlocksRenderer
                        site={site}
                        page={page}
                        biens={emptyBiens}
                        meta={emptyBiensMeta}
                        currentDomain={currentDomain}
                        previewDomain={previewDomain}
                        blocs={post.blocks}
                    />
                ) : null}
            </div>
            <AgencyNewsBlock
                bloc={relatedNewsBloc}
                currentDomain={currentDomain}
                previewDomain={previewDomain}
                excludePostId={post.id}
            />
        </main>
    );
}