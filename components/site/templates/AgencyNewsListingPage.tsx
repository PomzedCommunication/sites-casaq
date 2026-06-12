// components/site/AgencyNewsListingPage.tsx

import Link from 'next/link';
import type { CasaqPage, CasaqPost, CasaqPostsMeta, CasaqSiteConfig } from '@/lib/casaq';
import { withPreviewUrl } from '@/lib/site-blocks';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    posts: CasaqPost[];
    meta: CasaqPostsMeta;
    currentPath: string;
    category?: string;
    previewDomain?: string;
};

function buildPageHref(
    currentPath: string,
    page: number,
    category?: string,
    previewDomain?: string,
) {
    const params = new URLSearchParams();

    if (page > 1) {
        params.set('page', String(page));
    }

    if (category) {
        params.set('category', category);
    }

    const query = params.toString();
    const href = query ? `${currentPath}?${query}` : currentPath;

    return withPreviewUrl(href, previewDomain);
}

export function AgencyNewsListingPage({
                                          page,
                                          posts,
                                          meta,
                                          currentPath,
                                          category,
                                          previewDomain,
                                      }: Props) {
    return (
        <main className="site-main">
            <section className="section agency-news-listing">
                <div className="container">
                    <div className="section-heading">
                        <h1>{page.titre || 'Actualités'}</h1>
                        {page.meta_description ? <p>{page.meta_description}</p> : null}
                    </div>

                    {category ? (
                        <div className="agency-news-listing__filter">
                            Catégorie : <strong>{category}</strong>
                        </div>
                    ) : null}

                    {posts.length ? (
                        <div className="agency-news-listing__grid">
                            {posts.map((post) => {
                                const postHref = withPreviewUrl(
                                    post.url || `/actualites/${post.slug}`,
                                    previewDomain
                                );

                                return (
                                    <article key={post.id} className="agency-news-listing__card">
                                        <Link href={postHref}>
                                            {post.cover_image ? (
                                                <img
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    className="agency-news-listing__image"
                                                />
                                            ) : null}

                                            <div className="agency-news-listing__content">
                                                {post.category ? (
                                                    <span className="agency-news-listing__category">
                                                        {post.category}
                                                    </span>
                                                ) : null}

                                                <h2>{post.title}</h2>

                                                {post.excerpt ? (
                                                    <p>{post.excerpt}</p>
                                                ) : null}

                                                {post.published_at ? (
                                                    <time dateTime={post.published_at}>
                                                        {new Date(post.published_at).toLocaleDateString('fr-CH')}
                                                    </time>
                                                ) : null}
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
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
                                        previewDomain
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
                                        previewDomain
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