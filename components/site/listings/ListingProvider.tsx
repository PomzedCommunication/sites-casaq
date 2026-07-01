'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import type { CasaqBien, CasaqBiensMeta } from '@/lib/casaq';
import type {
    ListingAvailableFilters,
    ListingFilters,
    ListingSort,
} from '@/lib/listing/listing-types';
import { buildListingPath } from '@/lib/listing/listing-url';

type ListingContextValue = {
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    filters: ListingFilters;
    availableFilters?: ListingAvailableFilters;
    previewDomain?: string;
    isPending: boolean;

    setFilter: <K extends keyof ListingFilters>(
        key: K,
        value: ListingFilters[K]
    ) => void;

    setFilters: (values: Partial<ListingFilters>) => void;
    setSort: (sort: ListingSort) => void;
    resetFilters: () => void;
};

const ListingContext = createContext<ListingContextValue | null>(null);

const defaultMeta: CasaqBiensMeta = {
    total: 0,
    page: 1,
    per_page: 12,
    total_pages: 0,
    has_more: false,
};

// function normalizeInitialFilters(filters?: ListingFilters): ListingFilters {
//     return {
//         deal: filters?.deal,
//         sort: filters?.sort || 'recent',
//         view: filters?.view || 'grid',
//         page: filters?.page || 1,
//
//         category: filters?.category,
//         categoryParent: filters?.categoryParent,
//
//         locationLabel: filters?.locationLabel,
//         city: filters?.city,
//         lat: filters?.lat,
//         lng: filters?.lng,
//         rayon: filters?.rayon,
//
//         prixMin: filters?.prixMin,
//         prixMax: filters?.prixMax,
//         piecesMin: filters?.piecesMin,
//         piecesMax: filters?.piecesMax,
//         surfaceMin: filters?.surfaceMin,
//         surfaceMax: filters?.surfaceMax,
//
//         prestige: filters?.prestige,
//     };
// }
function normalizeInitialFilters(
    filters?: ListingFilters,
    forcedDeal?: 'SALE' | 'RENT'
): ListingFilters {
    return {
        deal: forcedDeal ?? filters?.deal,
        sort: filters?.sort || 'recent',
        view: filters?.view || 'grid',
        page: filters?.page || 1,

        category: filters?.category,
        categoryParent: filters?.categoryParent,

        locationLabel: filters?.locationLabel,
        city: filters?.city,
        lat: filters?.lat,
        lng: filters?.lng,
        rayon: filters?.rayon,

        prixMin: filters?.prixMin,
        prixMax: filters?.prixMax,
        piecesMin: filters?.piecesMin,
        piecesMax: filters?.piecesMax,
        surfaceMin: filters?.surfaceMin,
        surfaceMax: filters?.surfaceMax,

        prestige: filters?.prestige,
    };
}
function withPreviewDomain(url: string, previewDomain?: string): string {
    if (!previewDomain) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}site=${encodeURIComponent(previewDomain)}`;
}

// type Props = {
//     initialBiens?: CasaqBien[];
//     initialMeta?: CasaqBiensMeta;
//     initialFilters?: ListingFilters;
//     availableFilters?: ListingAvailableFilters;
//     previewDomain?: string;
//     children: React.ReactNode;
// };
type Props = {
    initialBiens?: CasaqBien[];
    initialMeta?: CasaqBiensMeta;
    initialFilters?: ListingFilters;
    availableFilters?: ListingAvailableFilters;
    previewDomain?: string;
    forcedDeal?: 'SALE' | 'RENT';
    children: React.ReactNode;
};
// export function ListingProvider({
//                                     initialBiens = [],
//                                     initialMeta = defaultMeta,
//                                     initialFilters,
//                                     availableFilters,
//                                     previewDomain,
//                                     children,
//                                 }: Props) {
    export function ListingProvider({
                                        initialBiens = [],
                                        initialMeta = defaultMeta,
                                        initialFilters,
                                        availableFilters,
                                        previewDomain,
                                        forcedDeal,
                                        children,
                                    }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [biens, setBiens] = useState<CasaqBien[]>(initialBiens);
    const [meta, setMeta] = useState<CasaqBiensMeta>(initialMeta);
    // const [filters, setFiltersState] = useState<ListingFilters>(() =>
    //     normalizeInitialFilters(initialFilters)
    // );
        const [filters, setFiltersState] = useState<ListingFilters>(() =>
            normalizeInitialFilters(initialFilters, forcedDeal)
        );
    useEffect(() => {
        setBiens(initialBiens);
    }, [initialBiens]);

    useEffect(() => {
        setMeta(initialMeta);
    }, [initialMeta]);

    const initialFiltersKey = JSON.stringify(initialFilters || {});

    // useEffect(() => {
    //     setFiltersState(normalizeInitialFilters(initialFilters));
    // }, [initialFiltersKey]);
        useEffect(() => {
            setFiltersState(normalizeInitialFilters(initialFilters, forcedDeal));
        }, [initialFiltersKey, forcedDeal]);

    const pushFilters = useCallback(
        (nextFilters: ListingFilters) => {
            const url = withPreviewDomain(buildListingPath(nextFilters), previewDomain);

            startTransition(() => {
                router.push(url);
            });
        },
        [router, previewDomain]
    );

    // const setFilters = useCallback(
    //     (values: Partial<ListingFilters>) => {
    //         const next: ListingFilters = {
    //             ...filters,
    //             ...values,
    //             page: values.page ?? 1,
    //         };
    //
    //         setFiltersState(next);
    //         pushFilters(next);
    //     },
    //     [filters, pushFilters]
    // );
        const setFilters = useCallback(
            (values: Partial<ListingFilters>) => {
                const hasDealValue = Object.prototype.hasOwnProperty.call(values, 'deal');

                const next: ListingFilters = {
                    ...filters,
                    ...values,
                    deal: forcedDeal ?? (hasDealValue ? values.deal : filters.deal),
                    page: values.page ?? 1,
                };

                setFiltersState(next);
                pushFilters(next);
            },
            [filters, forcedDeal, pushFilters]
        );
    const setFilter = useCallback(
        <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) => {
            setFilters({ [key]: value } as Partial<ListingFilters>);
        },
        [setFilters]
    );

    const setSort = useCallback(
        (sort: ListingSort) => {
            setFilters({ sort });
        },
        [setFilters]
    );

        const resetFilters = useCallback(() => {
            const next: ListingFilters = {
                deal: forcedDeal,
                sort: 'recent',
                view: 'grid',
                page: 1,
            };

            setFiltersState(next);
            pushFilters(next);
        }, [forcedDeal, pushFilters]);


    const value = useMemo(
        () => ({
            biens,
            meta,
            filters,
            availableFilters,
            previewDomain,
            isPending,
            setFilter,
            setFilters,
            setSort,
            resetFilters,
        }),
        [
            biens,
            meta,
            filters,
            availableFilters,
            previewDomain,
            isPending,
            setFilter,
            setFilters,
            setSort,
            resetFilters,
        ]
    );

    return (
        <ListingContext.Provider value={value}>
            {children}
        </ListingContext.Provider>
    );
}

export function useListing() {
    const context = useContext(ListingContext);

    if (!context) {
        throw new Error('useListing must be used inside ListingProvider');
    }

    return context;
}