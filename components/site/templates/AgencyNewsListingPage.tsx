import Link from 'next/link';
import Image from 'next/image';
import type {
    CasaqBiensMeta,
    CasaqBien,
    CasaqPage,
    CasaqPost,
    CasaqPostsMeta,
    CasaqSiteConfig,
} from '@/lib/casaq';
import { withPreviewUrl } from '@/lib/site-blocks';
import { BlocksRenderer } from '@/components/site/blocks/BlocksRenderer';
import { AgencyNewsFilters } from '@/components/site/templates/AgencyNewsFilters';
import {parseSiteHtml} from "@/lib/site-html";

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    posts: CasaqPost[];
    meta: CasaqPostsMeta;
    currentPath: string;
    currentDomain: string;
    search?: string;
    category?: string;
    categories?: string[];
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

function buildPageHref(
    currentPath: string,
    page: number,
    category?: string,
    previewDomain?: string,
    search?: string,
) {
    const params = new URLSearchParams();

    if (page > 1) {
        params.set('page', String(page));
    }

    if (category) {
        params.set('category', category);
    }

    if (search) {
        params.set('search', search);
    }

    const query = params.toString();
    const href = query ? `${currentPath}?${query}` : currentPath;

    return withPreviewUrl(href, previewDomain);
}

function formatDate(value?: string | null) {
    if (!value) {
        return null;
    }

    return new Date(value).toLocaleDateString('fr-CH');
}

export function AgencyNewsListingPage({
                                          site,
                                          page,
                                          posts,
                                          meta,
                                          currentPath,
                                          currentDomain,
                                          search,
                                          category,
                                          categories = [],
                                          previewDomain,
                                      }: Props) {
    return (
        <main className="site-main">
            <BlocksRenderer
                site={site}
                page={page}
                biens={emptyBiens}
                meta={emptyBiensMeta}
                currentDomain={currentDomain}
                previewDomain={previewDomain}
            />

            <section className="section agency-news-listing pd-l-r">
                <div className="container">
                    <AgencyNewsFilters
                        currentPath={currentPath}
                        search={search}
                        category={category}
                        categories={categories}
                        previewDomain={previewDomain}
                    />

                    {posts.length ? (
                        <div className="agency-news-listing__grid">
                            {posts.map((post) => {
                                const postHref = withPreviewUrl(
                                    post.url || `/actualites/${post.slug}`,
                                    previewDomain
                                );

                                const publishedLabel = formatDate(post.published_at);

                                return (
                                    <article key={post.id} className="agency-news__card">
                                        <Link href={postHref} className="agency-news__link">
                                            <div className="agency-news__image-wrap">
                                                {post.cover_image ? (
                                                    <Image
                                                        src={post.cover_image}
                                                        alt={post.title}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                        className="agency-news__image"
                                                    />
                                                ) : (
                                                    <div className="agency-news__placeholder">
                                                    </div>
                                                )}

                                                {post.category ? (
                                                    <span className="agency-news__badge site-btn btn-sm white">
                                                        {post.category}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="agency-news__content">
                                                <div className="agency-news__meta">
                                                    {post.published_at && publishedLabel ? (
                                                        <time dateTime={post.published_at}>
                                                            {publishedLabel}
                                                        </time>
                                                    ) : null}
                                                </div>

                                                <h3>{post.title}</h3>
                                                {post.excerpt ? (
                                                    <div className="txt">
                                                        {parseSiteHtml(post.excerpt)}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="agency-news-listing__empty">
                            Aucune actualité disponible.
                        </div>
                    )}

                    {meta.total_pages > 1 ? (
                        <div className="pagination">
                            {meta.page > 1 ? (
                                <Link
                                    href={buildPageHref(
                                        currentPath,
                                        meta.page - 1,
                                        category,
                                        previewDomain,
                                        search
                                    )}
                                >
                                    Précédent
                                </Link>
                            ) : null}

                            <span>
                                Page {meta.page} / {meta.total_pages}
                            </span>

                            {meta.has_more ? (
                                <Link
                                    href={buildPageHref(
                                        currentPath,
                                        meta.page + 1,
                                        category,
                                        previewDomain,
                                        search
                                    )}
                                >
                                    Suivant
                                </Link>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    );
}