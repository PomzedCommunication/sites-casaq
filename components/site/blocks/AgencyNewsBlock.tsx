import Link from 'next/link';
import type { CasaqBloc, CasaqPost } from '@/lib/casaq';
import { getSitePosts, getSitePostsByIds } from '@/lib/casaq';
import { blockData, getLinkProps, withPreviewUrl } from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';
import { AgencyNewsSlider } from './AgencyNewsSlider';

type Props = {
    bloc: CasaqBloc;
    currentDomain: string;
    previewDomain?: string;
    excludePostId?: string | number;
};

type Data = {
    titre?: string;
    texte?: string;
    mode?: 'latest' | 'manual' | 'category';

    post_ids?: Array<string | number | { id?: string | number }>;
    posts?: Array<string | number | { id?: string | number }>;
    actualites?: Array<string | number | { id?: string | number }>;

    category?: string;
    nb?: number | string;
    cta?: {
        label?: string;
        url?: string;
        target_blank?: boolean;
    };
};

export type SerializedPost = {
    id: string | number;
    href: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    coverImage: string | null;
    publishedAt: string | null;
    publishedLabel: string | null;
};

export async function AgencyNewsBlock({
                                          bloc,
                                          currentDomain,
                                          previewDomain,
                                          excludePostId,
                                      }: Props) {
    const data = blockData<Data>(bloc);
    const cta = getLinkProps(data.cta);
    const variant = bloc.data.variant || 'carousel';
    const isCarousel = variant === 'carousel';

    const mode = data.mode || 'latest';
    const limit = getLimit(data.nb, isCarousel ? 12 : 6);

    const postIds = getPostIds(data);

    const posts = await getAgencyPosts({
        domain: currentDomain,
        mode,
        limit: excludePostId ? limit + 1 : limit,
        postIds,
        category: data.category,
    });

    const filteredPosts = excludePostId
        ? posts.filter((post) => String(post.id) !== String(excludePostId)).slice(0, limit)
        : posts.slice(0, limit);

    const serializedPosts = filteredPosts.map(serializePost);

    return (
        <section className={`section agency-news agency-news--${variant}`}>
            <div className="container pd-l-r">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Nos actualités'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>

                    {cta ? (
                        <Link
                            href={withPreviewUrl(cta.href, previewDomain)}
                            target={cta.target}
                            rel={cta.rel}
                            className="site-btn site-btn--primary"
                        >
                            {cta.label || 'Voir toutes nos actualités'}
                        </Link>
                    ) : null}
                </div>

                {serializedPosts.length ? (
                    isCarousel ? (
                        <AgencyNewsSlider
                            posts={serializedPosts}
                            previewDomain={previewDomain}
                        />
                    ) : (
                        <div className="agency-news__grid">
                            {serializedPosts.map((post) => (
                                <AgencyNewsCard
                                    key={post.id}
                                    post={post}
                                    previewDomain={previewDomain}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="agency-news__empty">
                        Aucune actualité disponible.
                    </div>
                )}
            </div>
        </section>
    );
}

async function getAgencyPosts({
                                  domain,
                                  mode,
                                  limit,
                                  postIds,
                                  category,
                              }: {
    domain: string;
    mode: 'latest' | 'manual' | 'category';
    limit: number;
    postIds: Array<string | number>;
    category?: string;
}): Promise<CasaqPost[]> {
    if (mode === 'manual') {
        if (!postIds.length) {
            return [];
        }

        const ids = postIds.map((id) => String(id));

        const posts = await getSitePostsByIds(domain, ids);

        return posts
            .sort(
                (a, b) =>
                    ids.indexOf(String(a.id)) -
                    ids.indexOf(String(b.id))
            )
            .slice(0, limit);
    }

    return getSitePosts(domain, {
        limit,
        category: mode === 'category' ? category : undefined,
    });
}

function getPostIds(data: Data): Array<string | number> {
    const raw =
        data.post_ids ||
        data.posts ||
        data.actualites ||
        [];

    if (!Array.isArray(raw)) {
        return [];
    }

    return raw
        .map((item) => {
            if (
                item &&
                typeof item === 'object' &&
                'id' in item
            ) {
                return item.id;
            }

            return item;
        })
        .filter((id): id is string | number => {
            return id !== null && id !== undefined && String(id).trim() !== '';
        });
}
function AgencyNewsCard({
                            post,
                            previewDomain,
                        }: {
    post: SerializedPost;
    previewDomain?: string;
}) {
    return (
        <article className="agency-news__card">
            <Link
                href={withPreviewUrl(post.href, previewDomain)}
                className="agency-news__link"
            >
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="agency-news__image"
                    />
                ) : null}

                <div className="agency-news__content">
                    {post.category ? (
                        <span className="agency-news__category">
                            {post.category}
                        </span>
                    ) : null}

                    <h3>{post.title}</h3>

                    {post.excerpt ? <p>{post.excerpt}</p> : null}

                    {post.publishedAt && post.publishedLabel ? (
                        <time dateTime={post.publishedAt}>
                            {post.publishedLabel}
                        </time>
                    ) : null}
                </div>
            </Link>
        </article>
    );
}

function serializePost(post: CasaqPost): SerializedPost {
    const publishedAt = post.published_at || null;

    return {
        id: post.id,
        href: post.url || `/actualites/${post.slug}`,
        title: post.title || '',
        excerpt: post.excerpt || null,
        category: post.category || null,
        coverImage: post.cover_image || null,
        publishedAt,
        publishedLabel: publishedAt
            ? new Date(publishedAt).toLocaleDateString('fr-CH')
            : null,
    };
}

function getLimit(value: unknown, fallback: number): number {
    const nb = Number(value || fallback);

    if (!Number.isFinite(nb)) {
        return fallback;
    }

    return Math.max(1, Math.min(12, nb));
}