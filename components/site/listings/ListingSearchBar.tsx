'use client';

import { useEffect, useMemo, useState } from 'react';
import { filtersToApiParams } from '@/lib/listing/listing-url';
import { useJsApiLoader } from '@react-google-maps/api';
import { useListing } from './ListingProvider';
import { LocationAutocomplete } from './LocationAutocomplete';
import { ListingFilterPopover } from './ListingFilterPopover';
import { ListingRangeFields } from './ListingRangeFields';
import { ListingDistanceSlider } from './ListingDistanceSlider';
import type { ListingFilters } from '@/lib/listing/listing-types';
import { ListingCustomSelect } from './ListingCustomSelect';
const libraries: 'places'[] = ['places'];

type Props = {
    variant?: 'compact' | 'large';
    hideDealSelect?: boolean;
};

function formatPrice(value?: number): string {
    if (!value) return '';

    return new Intl.NumberFormat('fr-CH').format(value);
}

function getPriceStep(deal?: ListingFilters['deal']): number {
    return deal === 'RENT' ? 100 : 50000;
}

function getPriceFallbackMax(deal?: ListingFilters['deal']): number {
    return deal === 'RENT' ? 10000 : 5000000;
}
// const FALLBACK_CATEGORY_OPTIONS = [
//     { value: 'appartements', label: 'Appartements' },
//     { value: 'maisons', label: 'Maisons' },
//     { value: 'villas', label: 'Villas' },
//     { value: 'terrains', label: 'Terrains' },
//     { value: 'immeubles', label: 'Immeubles' },
//     { value: 'commerces', label: 'Commerces' },
//     { value: 'bureaux', label: 'Bureaux' },
//     { value: 'locaux-commerciaux', label: 'Locaux commerciaux' },
//     { value: 'parkings', label: 'Parkings' },
// ];
//
// function mergeCategoryOptions(
//     apiCategories?: { slug: string; label: string; count?: number }[]
// ) {
//     const map = new Map<string, { value: string; label: string; count?: number }>();
//
//     FALLBACK_CATEGORY_OPTIONS.forEach((category) => {
//         map.set(category.value, category);
//     });
//
//     apiCategories?.forEach((category) => {
//         map.set(category.slug, {
//             value: category.slug,
//             label: category.label,
//             count: category.count,
//         });
//     });
//
//     return Array.from(map.values());
// }


function mergeCategoryOptions(
    apiCategories?: { slug: string; label: string; count?: number }[]
) {
    return (apiCategories || []).map((category) => ({
        value: category.slug,
        label: category.label,
        count: category.count,
    }));
}
export function ListingSearchBar({
                                     variant = 'large',
                                     hideDealSelect = false,
                                 }: Props) {
    const {
        filters,
        meta,
        availableFilters,
        previewDomain,
        setFilters,
        resetFilters,
        isPending,
    } = useListing();

    const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
    const [draftFilters, setDraftFilters] = useState<ListingFilters>(() => filters);
    const [previewTotal, setPreviewTotal] = useState(meta.total);
    const [isCounting, setIsCounting] = useState(false);
    const categoryOptions = useMemo(
        () => mergeCategoryOptions(availableFilters?.categories),
        [availableFilters?.categories]
    );
    const draftFiltersKey = useMemo(
        () => JSON.stringify(draftFilters),
        [draftFilters]
    );

    const priceMin = availableFilters?.price?.min ?? 0;
    const priceMax =
        availableFilters?.price?.max ??
        getPriceFallbackMax(draftFilters.deal);

    const priceStep = getPriceStep(draftFilters.deal);
    const priceSuffix = draftFilters.deal === 'RENT' ? 'CHF / mois' : 'CHF';

    const priceSummary =
        draftFilters.prixMin || draftFilters.prixMax
            ? `${draftFilters.prixMin ? formatPrice(draftFilters.prixMin) : 'Min'} – ${
                draftFilters.prixMax ? formatPrice(draftFilters.prixMax) : 'Max'
            }`
            : undefined;

    const piecesSummary =
        draftFilters.piecesMin || draftFilters.piecesMax
            ? `${draftFilters.piecesMin ?? 'Min'} – ${draftFilters.piecesMax ?? 'Max'}`
            : undefined;

    const distanceSummary =
        draftFilters.lat && draftFilters.lng
            ? `${draftFilters.rayon ?? 10} km`
            : undefined;

    useEffect(() => {
        const controller = new AbortController();

        async function loadPreviewTotal() {
            setIsCounting(true);

            try {
                const params = filtersToApiParams({
                    ...draftFilters,
                    page: 1,
                });

                params.set('domain', previewDomain || window.location.hostname);

                const response = await fetch(`/api/listings/count?${params.toString()}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    setPreviewTotal(meta.total);
                    return;
                }

                const json = await response.json();

                setPreviewTotal(Number(json.total || 0));
            } catch {
                if (!controller.signal.aborted) {
                    setPreviewTotal(meta.total);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsCounting(false);
                }
            }
        }

        const timeout = window.setTimeout(loadPreviewTotal, 250);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [draftFiltersKey, previewDomain, meta.total]);

    useEffect(() => {
        setDraftFilters(filters);
    }, [filtersKey]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    function updateDraft(values: Partial<ListingFilters>) {
        setDraftFilters((current) => ({
            ...current,
            ...values,
            page: 1,
        }));
    }

    function applyFilters() {
        setFilters({
            ...draftFilters,
            page: 1,
        });
    }

    function clearLocation() {
        updateDraft({
            locationLabel: undefined,
            city: undefined,
            lat: undefined,
            lng: undefined,
            rayon: undefined,
        });
    }

    function handleDealChange(value: string) {
        updateDraft({
            deal: value ? (value as 'SALE' | 'RENT') : undefined,
            categoryParent: undefined,
            prixMin: undefined,
            prixMax: undefined,
            piecesMin: undefined,
            piecesMax: undefined,
            surfaceMin: undefined,
            surfaceMax: undefined,
        });
    }
    return (
        <>
            <div className={`listing-search listing-search--${variant} listing-search--desktop`}>
                <div className="bar-filters">
                    {!hideDealSelect ? (
                        <ListingCustomSelect
                            value={draftFilters.deal ?? ''}
                            placeholder="Transaction"
                            options={[
                                { value: '', label: 'Tous' },
                                { value: 'SALE', label: 'À vendre' },
                                { value: 'RENT', label: 'À louer' },
                            ]}
                            onChange={handleDealChange}
                        />
                    ) : null}

                    <div className="listing-search__location">
                        {isLoaded ? (
                            <LocationAutocomplete
                                value={draftFilters.locationLabel}
                                onSelect={(location) =>
                                    updateDraft({
                                        locationLabel: location.label,
                                        city: location.city,
                                        lat: location.lat,
                                        lng: location.lng,
                                        rayon: draftFilters.rayon || 10,
                                    })
                                }
                            />
                        ) : (
                            <input placeholder="Localité" disabled />
                        )}

                        {draftFilters.locationLabel ? (
                            <button
                                type="button"
                                onClick={clearLocation}
                                className="listing-search__clear-location"
                            >
                                ×
                            </button>
                        ) : null}
                    </div>

                    <ListingFilterPopover
                        label=""
                        value={distanceSummary}
                        disabled={!draftFilters.lat || !draftFilters.lng}
                    >
                        <ListingDistanceSlider
                            value={draftFilters.rayon ?? 10}
                            disabled={!draftFilters.lat || !draftFilters.lng}
                            onChange={(rayon) => updateDraft({ rayon })}
                        />
                    </ListingFilterPopover>

                    <div className="sep-filter"></div>

                    <ListingFilterPopover label="Pièces" value={piecesSummary}>
                        <ListingRangeFields
                            minValue={draftFilters.piecesMin}
                            maxValue={draftFilters.piecesMax}
                            minPlaceholder="Min"
                            maxPlaceholder="Max"
                            step={0.5}
                            min={0}
                            max={20}
                            suffix="Nombre de pièces"
                            onChange={({ min, max }) =>
                                updateDraft({
                                    piecesMin: min,
                                    piecesMax: max,
                                })
                            }
                        />
                    </ListingFilterPopover>

                    <div className="sep-filter hide-home"></div>

                    <ListingFilterPopover label="Prix" value={priceSummary}>
                        <ListingRangeFields
                            minValue={draftFilters.prixMin}
                            maxValue={draftFilters.prixMax}
                            minPlaceholder={priceMin ? formatPrice(priceMin) : 'Min'}
                            maxPlaceholder={priceMax ? formatPrice(priceMax) : 'Max'}
                            step={priceStep}
                            min={0}
                            max={priceMax}
                            suffix={priceSuffix}
                            onChange={({ min, max }) =>
                                updateDraft({
                                    prixMin: min,
                                    prixMax: max,
                                })
                            }
                        />
                    </ListingFilterPopover>

                    <div className="sep-filter hide-home"></div>

                    <ListingCustomSelect
                        value={draftFilters.categoryParent ?? ''}
                        placeholder="Type"
                        options={[
                            { value: '', label: 'Tous les types' },
                            ...categoryOptions,
                        ]}
                        onChange={(value) =>
                            updateDraft({
                                categoryParent: value || undefined,
                                prixMin: undefined,
                                prixMax: undefined,
                                piecesMin: undefined,
                                piecesMax: undefined,
                                surfaceMin: undefined,
                                surfaceMax: undefined,
                            })
                        }
                    />
                </div>

                <button
                    type="button"
                    className="site-btn listing-search__count"
                    onClick={applyFilters}
                    disabled={isPending}
                >
                    {isPending || isCounting
                        ? 'Calcul…'
                        : `Filtrer (${previewTotal} objet${previewTotal > 1 ? 's' : ''})`}
                </button>
            </div>

            <div className="listing-search-mobile bar-filters ">
                <div className="listing-search-mobile__card">
                    {!hideDealSelect ? (
                        <div className="listing-search-mobile__select">
                            <ListingCustomSelect
                                value={draftFilters.deal ?? ''}
                                placeholder="Transaction"
                                options={[
                                    { value: '', label: 'Tous' },
                                    { value: 'SALE', label: 'À vendre' },
                                    { value: 'RENT', label: 'À louer' },
                                ]}
                                onChange={handleDealChange}
                            />
                        </div>
                    ) : null}

                    <div className="listing-search-mobile__location">
                        {isLoaded ? (
                            <LocationAutocomplete
                                value={draftFilters.locationLabel}
                                onSelect={(location) =>
                                    updateDraft({
                                        locationLabel: location.label,
                                        city: location.city,
                                        lat: location.lat,
                                        lng: location.lng,
                                        rayon: draftFilters.rayon || 10,
                                    })
                                }
                            />
                        ) : (
                            <input placeholder="Localité" disabled />
                        )}

                        {draftFilters.locationLabel ? (
                            <button
                                type="button"
                                onClick={clearLocation}
                                className="listing-search__clear-location"
                            >
                                ×
                            </button>
                        ) : null}
                    </div>

                    <div className="listing-search-mobile__field">
                    {/*<span className="listing-search-mobile__label">*/}
                    {/*    {draftFilters.rayon ?? 0} km*/}
                    {/*</span>*/}

                        <ListingDistanceSlider
                            value={draftFilters.rayon ?? 10}
                            disabled={!draftFilters.lat || !draftFilters.lng}
                            onChange={(rayon) => updateDraft({ rayon })}
                        />
                    </div>

                    <div className="listing-search-mobile__select">
                        <ListingCustomSelect
                            value={draftFilters.categoryParent ?? ''}
                            placeholder="Type"
                            options={[
                                { value: '', label: 'Tous les types' },
                                ...categoryOptions,
                            ]}
                            onChange={(value) =>
                                updateDraft({
                                    categoryParent: value || undefined,
                                    prixMin: undefined,
                                    prixMax: undefined,
                                    piecesMin: undefined,
                                    piecesMax: undefined,
                                    surfaceMin: undefined,
                                    surfaceMax: undefined,
                                })
                            }
                        />
                    </div>

                    <div className="listing-search-mobile__field">
                        <span className="listing-search-mobile__label">Pièces</span>

                        <ListingRangeFields
                            minValue={draftFilters.piecesMin}
                            maxValue={draftFilters.piecesMax}
                            minPlaceholder="1,0"
                            maxPlaceholder="15"
                            step={0.5}
                            min={0}
                            max={15}
                            suffix="Nombre de pièces"
                            onChange={({ min, max }) =>
                                updateDraft({
                                    piecesMin: min,
                                    piecesMax: max,
                                })
                            }
                        />
                    </div>

                    <div className="listing-search-mobile__field">
                        <span className="listing-search-mobile__label">Tous prix</span>

                        <ListingRangeFields
                            minValue={draftFilters.prixMin}
                            maxValue={draftFilters.prixMax}
                            minPlaceholder="0"
                            maxPlaceholder={String(priceMax)}
                            step={priceStep}
                            min={0}
                            max={priceMax}
                            suffix={priceSuffix}
                            onChange={({ min, max }) =>
                                updateDraft({
                                    prixMin: min,
                                    prixMax: max,
                                })
                            }
                        />
                    </div>

                    <div className="listing-search-mobile__actions">
                        <button
                            type="button"
                            className="listing-search-mobile__submit site-btn"
                            onClick={applyFilters}
                            disabled={isPending}
                        >
                            {isPending || isCounting ? 'Calcul…' : 'Rechercher'}
                        </button>


                    </div>
                </div>
            </div>
        </>
    );
}