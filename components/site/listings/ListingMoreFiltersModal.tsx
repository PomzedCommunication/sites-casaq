import type { ListingFilters } from '@/lib/listing/listing-types';
import { LocationAutocomplete } from './LocationAutocomplete';
import { ListingFilterPopover } from './ListingFilterPopover';
import { ListingRangeFields } from './ListingRangeFields';
import { ListingDistanceSlider } from './ListingDistanceSlider';
import { ListingCustomSelect } from './ListingCustomSelect';


type ListingMoreFiltersModalProps = {
    filters: ListingFilters;
    onChange: (values: Partial<ListingFilters>) => void;
    onClose: () => void;
};

export function ListingMoreFiltersModal({
                                            filters,
                                            onChange,
                                            onClose,
                                        }: ListingMoreFiltersModalProps) {
    return (
        <div
            className="listing-more-filters"
            role="dialog"
            aria-modal="true"
            aria-label="Plus de filtres"
        >
            <div
                className="listing-more-filters__overlay"
                onClick={onClose}
            />

            <div className="listing-more-filters__content">
                <div className="listing-more-filters__header">
                    <h2>Plus de filtres</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                    </button>
                </div>

                <div className="listing-more-filters__body">
                    <div className="listing-more-filters__field">
                    <span className="listing-more-filters__label">Surface habitable </span>
                        <ListingRangeFields
                            minValue={filters.surfaceMin}
                            maxValue={filters.surfaceMax}
                            minPlaceholder="Min"
                            maxPlaceholder="Max"
                            step={1}
                            min={0}
                            max={1000}
                            suffix="m²"
                            onChange={({ min, max }) =>
                                onChange({
                                    surfaceMin: min,
                                    surfaceMax: max,
                                })
                            }
                        />
                    </div>


                    <div className="listing-more-filters__field">
                        <span className="listing-more-filters__label">Surface terrain</span>
                        <ListingRangeFields
                            minValue={filters.terrainMin}
                            maxValue={filters.terrainMax}
                            minPlaceholder="Min"
                            maxPlaceholder="Max"
                            step={1}
                            min={0}
                            max={10000}
                            suffix="m²"
                            onChange={({ min, max }) =>
                                onChange({
                                    terrainMin: min,
                                    terrainMax: max,
                                })
                            }
                        />
                    </div>

                    <div className="listing-more-filters__field">
                        <span className="listing-more-filters__label">Nombre de Chambre</span>
                        <ListingRangeFields
                            minValue={filters.chambresMin}
                            maxValue={filters.chambresMax}
                            minPlaceholder="Min"
                            maxPlaceholder="Max"
                            step={1}
                            min={0}
                            max={20}
                            suffix="Chambres"
                            onChange={({ min, max }) =>
                                onChange({
                                    chambresMin: min,
                                    chambresMax: max,
                                })
                            }
                        />
                    </div>


                    <div className="listing-more-filters__field">
                        <span className="listing-more-filters__label">Nombre de salles de bain</span>
                        <ListingRangeFields
                            minValue={filters.sallesDeBainMin}
                            maxValue={filters.sallesDeBainMax}
                            minPlaceholder="Min"
                            maxPlaceholder="Max"
                            step={1}
                            min={0}
                            max={20}
                            suffix="Salles de bain"
                            onChange={({ min, max }) =>
                                onChange({
                                    sallesDeBainMin: min,
                                    sallesDeBainMax: max,
                                })
                            }
                        />
                    </div>

                    <div className="listing-more-filters__field">
                        <label>État du bien</label>

                        <ListingCustomSelect
                            value={filters.etat ?? ''}
                            placeholder="Tous les états"
                            options={[
                                { value: '', label: 'Tous les états' },
                                { value: 'NEUF', label: 'Neuf' },
                                { value: 'TRES_BON', label: 'Très bon' },
                                { value: 'BON', label: 'Bon' },
                                { value: 'A_RENOVER', label: 'À rénover' },
                            ]}
                            onChange={(value) =>
                                onChange({
                                    etat: value || undefined,
                                })
                            }
                        />
                    </div>

                    <div className="listing-more-filters__field">
                        <span className="listing-more-filters__label">
                            Équipements & accès
                        </span>

                        <div className="listing-more-filters__checks">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.balcon}
                                    onChange={(event) =>
                                        onChange({
                                            balcon: event.target.checked,
                                        })
                                    }
                                />
                                <span>Balcon</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.terrasse}
                                    onChange={(event) =>
                                        onChange({
                                            terrasse: event.target.checked,
                                        })
                                    }
                                />
                                <span>Terrasse</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.parking}
                                    onChange={(event) =>
                                        onChange({
                                            parking: event.target.checked,
                                        })
                                    }
                                />
                                <span>Parking</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.garage}
                                    onChange={(event) =>
                                        onChange({
                                            garage: event.target.checked,
                                        })
                                    }
                                />
                                <span>Garage</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.piscine}
                                    onChange={(event) =>
                                        onChange({
                                            piscine: event.target.checked,
                                        })
                                    }
                                />
                                <span>Piscine</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.vue}
                                    onChange={(event) =>
                                        onChange({
                                            vue: event.target.checked,
                                        })
                                    }
                                />
                                <span>Vue</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.ascenseur}
                                    onChange={(event) =>
                                        onChange({
                                            ascenseur: event.target.checked,
                                        })
                                    }
                                />
                                <span>Ascenseur</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.accesPmr}
                                    onChange={(event) =>
                                        onChange({
                                            accesPmr: event.target.checked,
                                        })
                                    }
                                />
                                <span>Accès PMR</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.animauxAcceptes}
                                    onChange={(event) =>
                                        onChange({
                                            animauxAcceptes: event.target.checked,
                                        })
                                    }
                                />
                                <span>Animaux acceptés</span>
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!filters.colocation}
                                    onChange={(event) =>
                                        onChange({
                                            colocation: event.target.checked,
                                        })
                                    }
                                />
                                <span>Colocation</span>
                            </label>
                        </div>
                    </div>

                    <div className="listing-more-filters__field">
                        <span className="listing-more-filters__label">Disponibilité</span>
                        <label>
                            <input
                                type="checkbox"
                                checked={!!filters.disponibleImmediatement}
                                onChange={(event) =>
                                    onChange({
                                        disponibleImmediatement:
                                        event.target.checked,
                                    })
                                }
                            />
                            <span>Disponible immédiatement</span>
                        </label>
                    </div>
                </div>

                <div className="listing-more-filters__footer">
                    <button
                        type="button"
                        className="site-btn"
                        onClick={onClose}
                    >
                        Appliquer les filtres
                    </button>
                </div>
            </div>
        </div>
    );
}