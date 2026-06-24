'use client';

import { useEffect, useState } from 'react';
import {
    buildUrlWithPreviewDomain,
    getContactFavoritesClient,
    getCurrentDomainFromBrowser,
    type ContactFavorite,
} from '@/lib/contact-auth-client';
import { BienCard } from '@/components/site/listings/BienCard';
import { AccountShell } from '@/components/site/account/AccountShell';
import type { CasaqBien } from '@/lib/casaq';
type Props = {
    previewDomain?: string | null;
};

export function FavorisClient({ previewDomain }: Props) {
    const [favorites, setFavorites] = useState<ContactFavorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFavorites() {
            const domain = getCurrentDomainFromBrowser();
            const result = await getContactFavoritesClient(domain);

            if (!result.success) {
                window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
                return;
            }

            setFavorites(result.favorites);
            setLoading(false);
        }

        loadFavorites();
    }, [previewDomain]);

    const biens = favorites
        .map((favorite) => favorite.bien)
        .filter((bien): bien is CasaqBien => Boolean(bien));

    return (
        <AccountShell previewDomain={previewDomain} active="favoris">
            <div className="account-heading">
                <div>
                    <p className="account-kicker">Mon espace</p>
                    <h1>Mes favoris</h1>
                </div>
            </div>

            {loading ? (
                <div className="account-panel">
                    <p>Chargement...</p>
                </div>
            ) : biens.length === 0 ? (
                <div className="account-panel">
                    <h2>Aucun favori pour le moment</h2>
                    <p>Ajoutez des biens à vos favoris depuis les listings ou les pages de détail.</p>
                </div>
            ) : (
                <div className="biens-grid">
                    {biens.map((bien) => (
                        <BienCard
                            key={bien.id}
                            bien={bien}
                            previewDomain={previewDomain || undefined}
                        />
                    ))}
                </div>
            )}
        </AccountShell>
    );
}