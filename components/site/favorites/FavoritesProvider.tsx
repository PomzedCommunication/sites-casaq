'use client';

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    addContactFavoriteClient,
    getContactFavoritesClient,
    getContactToken,
    getCurrentDomainFromBrowser,
    removeContactFavoriteClient,
    type ContactFavorite,
} from '@/lib/contact-auth-client';

type FavoritesContextValue = {
    favoriteIds: Set<number>;
    favorites: ContactFavorite[];
    loaded: boolean;
    isFavorite: (bienId: number) => boolean;
    toggleFavorite: (bienId: number) => Promise<{
        success: boolean;
        message?: string;
        connectRequired?: boolean;
    }>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type Props = {
    children: ReactNode;
};

export function FavoritesProvider({ children }: Props) {
    const [favorites, setFavorites] = useState<ContactFavorite[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function loadFavorites() {
            const token = getContactToken();

            if (!token) {
                setFavorites([]);
                setLoaded(true);
                return;
            }

            const domain = getCurrentDomainFromBrowser();
            const result = await getContactFavoritesClient(domain);

            if (result.success) {
                setFavorites(result.favorites);
            }

            setLoaded(true);
        }

        loadFavorites();
    }, []);

    const favoriteIds = useMemo(() => {
        return new Set(
            favorites
                .map((favorite) => favorite.bien?.id)
                .filter((id): id is number => typeof id === 'number'),
        );
    }, [favorites]);

    function isFavorite(bienId: number): boolean {
        return favoriteIds.has(bienId);
    }

    async function toggleFavorite(bienId: number): Promise<{
        success: boolean;
        message?: string;
        connectRequired?: boolean;
    }> {
        const token = getContactToken();

        if (!token) {
            return {
                success: false,
                message: 'CONNECT_REQUIRED',
                connectRequired: true,
            };
        }

        const domain = getCurrentDomainFromBrowser();
        const active = favoriteIds.has(bienId);

        if (active) {
            const result = await removeContactFavoriteClient(domain, bienId);

            if (result.success) {
                setFavorites((items) => items.filter((item) => item.bien?.id !== bienId));
            }

            return result;
        }

        const result = await addContactFavoriteClient(domain, bienId);

        if (result.success) {
            const reload = await getContactFavoritesClient(domain);

            if (reload.success) {
                setFavorites(reload.favorites);
            }
        }

        return result;
    }

    return (
        <FavoritesContext.Provider
            value={{
                favoriteIds,
                favorites,
                loaded,
                isFavorite,
                toggleFavorite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) {
        return {
            favoriteIds: new Set<number>(),
            favorites: [],
            loaded: false,
            isFavorite: () => false,
            toggleFavorite: async () => ({
                success: false,
                message: 'Favoris indisponibles.',
            }),
        };
    }

    return context;
}