// components/site/AgencyNewsSinglePage.tsx

import Link from 'next/link';
import type { CasaqPost, CasaqSiteConfig } from '@/lib/casaq';

type Props = {
    site: CasaqSiteConfig;
    post: CasaqPost;
};

export function AgencyNewsSinglePage({ site, post }: Props) {
    return (
        <main className="site-main">
            <article className="section agency-news-single">
                <div className="container">
                    <Link href="/actualites" className="agency-news-single__back">
                        ← Retour aux actualités
                    </Link>

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

                    {post.cover_image ? (
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="agency-news-single__image"
                        />
                    ) : null}

                    {/*{post.content ? (*/}
                    {/*    <div*/}
                    {/*        className="agency-news-single__content"*/}
                    {/*        dangerouslySetInnerHTML={{ __html: post.content }}*/}
                    {/*    />*/}
                    {/*) : post.excerpt ? (*/}
                    {/*    <p className="agency-news-single__excerpt">*/}
                    {/*        {post.excerpt}*/}
                    {/*    </p>*/}
                    {/*) : null}*/}
                </div>
            </article>
        </main>
    );
}