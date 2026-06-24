'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
    currentPath: string;
    search?: string;
    category?: string;
    categories: string[];
    previewDomain?: string;
};

export function AgencyNewsFilters({
                                      currentPath,
                                      search,
                                      category,
                                      categories,
                                      previewDomain,
                                  }: Props) {
    const router = useRouter();
    const [value, setValue] = useState(search || '');

    function buildHref(next: {
        search?: string;
        category?: string;
        page?: number;
    }) {
        const params = new URLSearchParams();

        if (next.search) {
            params.set('search', next.search);
        }

        if (next.category) {
            params.set('category', next.category);
        }

        if (next.page && next.page > 1) {
            params.set('page', String(next.page));
        }

        if (previewDomain) {
            params.set('site', previewDomain);
        }

        const query = params.toString();

        return query ? `${currentPath}?${query}` : currentPath;
    }

    function submitSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.push(
            buildHref({
                search: value.trim(),
                category,
                page: 1,
            })
        );
    }

    function selectCategory(nextCategory?: string) {
        router.push(
            buildHref({
                search: value.trim(),
                category: nextCategory,
                page: 1,
            })
        );
    }

    return (
        <div className="agency-news-filters">
            <form className="agency-news-filters__search" onSubmit={submitSearch}>
                <input
                    type="search"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="Titre, auteur, sujet, etc."
                    className="agency-news-filters__input"
                />

                <button
                    type="submit"
                    className="agency-news-filters__button"
                    aria-label="Rechercher"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6924 16.692L22.25 22.2496" stroke="white" />
                        <path
                            d="M10.1537 19.3073C15.2091 19.3073 19.3073 15.2091 19.3073 10.1537C19.3073 5.09824 15.2091 1 10.1537 1C5.09824 1 1 5.09824 1 10.1537C1 15.2091 5.09824 19.3073 10.1537 19.3073Z"
                            stroke="white" strokeWidth="2" />
                    </svg>
            </button>
        </form>

    {
        categories.length ? (
            <div className="agency-news-filters__categories">
                <button
                    type="button"
                    className={`site-btn btn-white agency-news-filters__chip ${!category ? 'is-active' : ''}`}
                    onClick={() => selectCategory(undefined)}
                >
                    Toutes
                </button>

                {categories.map((item) => (
                    <button
                            key={item}
                            type="button"
                            className={`site-btn btn-white agency-news-filters__chip ${
                                category === item ? 'is-active' : ''
                            }`}
                            onClick={() => selectCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}