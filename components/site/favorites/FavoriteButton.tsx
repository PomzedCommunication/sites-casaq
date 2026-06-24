'use client';

import { useState, type MouseEvent } from 'react';
import { buildUrlWithPreviewDomain } from '@/lib/contact-auth-client';
import { useFavorites } from '@/components/site/favorites/FavoritesProvider';

type Props = {
    bienId: number;
    previewDomain?: string;
};

export function FavoriteButton({ bienId, previewDomain }: Props) {
    const { isFavorite, toggleFavorite, loaded } = useFavorites();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const active = isFavorite(bienId);

    async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();

        setMessage(null);
        setLoading(true);

        const result = await toggleFavorite(bienId);

        setLoading(false);

        if ('connectRequired' in result && result.connectRequired) {
            window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
            return;
        }

        if (!result.success) {
            setMessage(result.message || 'Action impossible.');
        }
    }

    return (
        <div className="favorite-action">
            <button
                type="button"
                className={active ? 'favorite-button favorite-button--active' : 'favorite-button'}
                onClick={handleClick}
                disabled={loading || !loaded}
                aria-pressed={active}
            >
            <span className="favorite-button__icon" aria-hidden="true">
                <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.32444 2.875L9 3.8125L9.67556 2.875C10.4578 1.7875 11.6133 1 13 1C15.2133 1 17 2.88438 17 5.21875C17 6.09063 16.7511 6.89688 16.3244 7.5625C15.6044 8.69687 9 16 9 16C9 16 2.39556 8.69687 1.67556 7.5625C1.24889 6.89688 1 6.09063 1 5.21875C1 2.88438 2.78667 1 5 1C6.38667 1 7.54222 1.7875 8.32444 2.875Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            </button>

            {message ? <small className="favorite-message">{message}</small> : null}
        </div>
    );
}