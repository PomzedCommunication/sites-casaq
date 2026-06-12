'use client';

import { useState } from 'react';
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

    async function handleClick() {
        setMessage(null);
        setLoading(true);

        const result = await toggleFavorite(bienId);

        setLoading(false);

        // if (result.connectRequired) {
        //     window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
        //     return;
        // }
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
                {active ? '♥ Favori' : '♡ Favori'}
            </button>

            {message ? <small className="favorite-message">{message}</small> : null}
        </div>
    );
}