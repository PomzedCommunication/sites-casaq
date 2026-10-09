'use client';

import { useState } from 'react';
import { buildUrlWithPreviewDomain } from '@/lib/contact-auth-client';
import { useFavorites } from '@/components/site/favorites/FavoritesProvider';
import { trackBienEvent } from '@/lib/casaq';
import { SiteIcon } from '@/components/site/icons/SiteIcon';

type Props = {
    bienId: number;
    previewDomain?: string;
    domain?: string;
};

export function FavoriteButton({ bienId, previewDomain, domain }: Props) {
    const { isFavorite, toggleFavorite, loaded } = useFavorites();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const active = isFavorite(bienId);

    async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (loading || !loaded) {
            return;
        }

        setMessage(null);
        setLoading(true);

        const wasActive = active;
        const result = await toggleFavorite(bienId);

        setLoading(false);

        if ('connectRequired' in result && result.connectRequired) {
            window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
            return;
        }

        if (!result.success) {
            setMessage(result.message || 'Action impossible.');
            return;
        }

        if (domain) {
            trackBienEvent(domain, bienId, 'favorite', {
                action: wasActive ? 'remove' : 'add',
                active_before_click: wasActive,
                active_after_click: !wasActive,
            });
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
                aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
                <span className="favorite-button__icon" aria-hidden="true">

                    <SiteIcon name="favoris" />

{/*                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 25 21" fill="none">*/}
{/*  <path d="M7.47653 0.75C3.84551 0.75 0.75 3.46673 0.75 6.99327C0.75 9.42657 1.88894 11.4746 3.39882 13.1712C4.90478 14.8627 6.84698 16.2824 8.6011 17.471L11.63 19.5216C11.792 19.6311 11.983 19.6896 12.1786 19.6896C12.3741 19.6896 12.5652 19.6311 12.7271 19.5216L15.756 17.471C17.5115 16.2824 19.4524 14.8627 20.957 13.1712C22.4682 11.4746 23.6071 9.42657 23.6071 6.99327C23.6071 3.46673 20.5116 0.75 16.8806 0.75C15.0076 0.75 13.3606 1.62771 12.1786 2.76404C10.9965 1.62771 9.3482 0.75 7.47653 0.75Z" stroke="#E41745" stroke-width="1.5"/>*/}
{/*</svg>*/}
                </span>
            </button>

            {message ? <small className="favorite-message">{message}</small> : null}
        </div>
    );
}