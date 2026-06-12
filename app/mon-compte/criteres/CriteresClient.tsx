'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AccountShell } from '@/components/site/account/AccountShell';
import { SearchCategorySelector } from '@/components/site/account/SearchCategorySelector';
import { SearchGeoMap } from '@/components/site/account/SearchGeoMap';

import {
    buildUrlWithPreviewDomain,
    createContactSearchClient,
    deleteContactSearchClient,
    getContactSearchCategoriesClient,
    getContactSearchesClient,
    getCurrentDomainFromBrowser,
    toggleContactSearchClient,
    updateContactSearchClient,
    type ContactSearch,
    type ContactSearchCategoryGroup,
    type ContactSearchGeo,
} from '@/lib/contact-auth-client';



type Props = {
    previewDomain?: string | null;
};

type SearchFormState = {
    id?: number;
    name: string;
    deal: 'SALE' | 'RENT';
    status: 'ACTIVE' | 'INACTIVE';
    categories: number[];
    npas: string;
    price_min: string;
    price_max: string;
    rooms_min: string;
    rooms_max: string;
    surface_min: string;
    surface_max: string;
    keywords: string;
    geo: ContactSearchGeo;
};

const emptyForm: SearchFormState = {
    name: '',
    deal: 'SALE',
    status: 'ACTIVE',
    categories: [],
    npas: '',
    price_min: '',
    price_max: '',
    rooms_min: '',
    rooms_max: '',
    surface_min: '',
    surface_max: '',
    keywords: '',
    geo: {
        include: [],
        exclude: [],
    },
};

function numberOrEmpty(value: string): number | '' {
    const trimmed = value.trim();

    if (trimmed === '') {
        return '';
    }

    return Number(trimmed);
}

export function CriteresClient({ previewDomain }: Props) {
    const [searches, setSearches] = useState<ContactSearch[]>([]);
    const [form, setForm] = useState<SearchFormState>(emptyForm);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [categoryGroups, setCategoryGroups] = useState<ContactSearchCategoryGroup[]>([]);

    useEffect(() => {
        loadSearches();
    }, []);
    async function loadSearches() {
        const domain = getCurrentDomainFromBrowser();

        const [searchesResult, categoriesResult] = await Promise.all([
            getContactSearchesClient(domain),
            getContactSearchCategoriesClient(domain),
        ]);

        if (!searchesResult.success) {
            window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
            return;
        }

        setSearches(searchesResult.searches);

        if (categoriesResult.success) {
            setCategoryGroups(categoriesResult.categories);
        }

        setLoading(false);
    }



    function openCreateForm() {
        setForm({
            ...emptyForm,
            name: 'Ma recherche ' + new Date().toLocaleDateString('fr-CH'),
            geo: {
                include: [],
                exclude: [],
            },
        });
        setMessage(null);
        setFormOpen(true);
    }

    function openEditForm(search: ContactSearch) {
        setForm({
            id: search.id,
            name: search.name,
            deal: search.deal,
            status: search.status === 'ARCHIVED' ? 'INACTIVE' : search.status,
            categories: Array.isArray(search.criteria?.categories)
                ? search.criteria.categories.map(Number)
                : [],
            npas: Array.isArray(search.criteria?.npas) ? search.criteria.npas.join(', ') : '',
            price_min: search.criteria?.price_min ? String(search.criteria.price_min) : '',
            price_max: search.criteria?.price_max ? String(search.criteria.price_max) : '',
            rooms_min: search.criteria?.rooms_min ? String(search.criteria.rooms_min) : '',
            rooms_max: search.criteria?.rooms_max ? String(search.criteria.rooms_max) : '',
            surface_min: search.criteria?.surface_min ? String(search.criteria.surface_min) : '',
            surface_max: search.criteria?.surface_max ? String(search.criteria.surface_max) : '',
            keywords: search.criteria?.keywords || '',
            geo: search.geo || {
                include: [],
                exclude: [],
            },
        });
        setMessage(null);
        setFormOpen(true);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const domain = getCurrentDomainFromBrowser();

        const payload = {
            name: form.name,
            deal: form.deal,
            status: form.status,
            criteria: {
                categories: form.categories,
                npas: form.npas,
                price_min: numberOrEmpty(form.price_min),
                price_max: numberOrEmpty(form.price_max),
                rooms_min: numberOrEmpty(form.rooms_min),
                rooms_max: numberOrEmpty(form.rooms_max),
                surface_min: numberOrEmpty(form.surface_min),
                surface_max: numberOrEmpty(form.surface_max),
                keywords: form.keywords,
            },
            geo: form.geo,
        };

        const result = form.id
            ? await updateContactSearchClient(domain, form.id, payload)
            : await createContactSearchClient(domain, payload);

        setMessage(result.message || null);

        if (result.success) {
            setForm(emptyForm);
            setFormOpen(false);
            await loadSearches();
        }
    }

    async function handleToggle(search: ContactSearch) {
        const domain = getCurrentDomainFromBrowser();
        const result = await toggleContactSearchClient(domain, search.id);

        if (result.success) {
            await loadSearches();
        }
    }

    async function handleDelete(search: ContactSearch) {
        if (!window.confirm('Supprimer cette recherche ?')) {
            return;
        }

        const domain = getCurrentDomainFromBrowser();
        const result = await deleteContactSearchClient(domain, search.id);

        if (result.success) {
            setSearches((items) => items.filter((item) => item.id !== search.id));
        }
    }

    return (
        <AccountShell previewDomain={previewDomain} active="criteres">
            <div className="account-heading">
                <div>
                    <p className="account-kicker">Mon espace</p>
                    <h1>Mes critères de recherche</h1>
                </div>

                <button type="button" className="account-primary-button" onClick={openCreateForm}>
                    Nouvelle recherche
                </button>
            </div>

            {message ? (
                <div className="account-panel account-message-panel">
                    {message}
                </div>
            ) : null}

            {formOpen ? (
                <form className="account-panel account-search-form" onSubmit={handleSubmit}>
                    <div className="account-form-head">
                        <div>
                            <p className="account-kicker">{form.id ? 'Modification' : 'Nouvelle recherche'}</p>
                            <h2>{form.id ? 'Modifier le critère' : 'Créer un critère'}</h2>
                        </div>

                        <button type="button" onClick={() => setFormOpen(false)}>
                            Fermer
                        </button>
                    </div>

                    <label className="account-field">
                        Nom de la recherche
                        <input
                            value={form.name}
                            required
                            onChange={(event) => setForm({...form, name: event.target.value})}
                        />
                    </label>

                    <div className="account-form__grid">
                        <label className="account-field">
                            Transaction
                            <select
                                value={form.deal}
                                onChange={(event) => setForm({...form, deal: event.target.value as 'SALE' | 'RENT'})}
                            >
                                <option value="SALE">Vente</option>
                                <option value="RENT">Location</option>
                            </select>
                        </label>

                        <label className="account-field">
                            Statut
                            <select
                                value={form.status}
                                onChange={(event) => setForm({
                                    ...form,
                                    status: event.target.value as 'ACTIVE' | 'INACTIVE'
                                })}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </label>
                    </div>
                    <div className="account-field">
                        <span>Type de bien recherché</span>

                        <SearchCategorySelector
                            groups={categoryGroups}
                            value={form.categories}
                            onChange={(categories) => setForm({...form, categories})}
                        />
                    </div>
                    <label className="account-field">
                        NPA recherchés
                        <input
                            placeholder="1000, 1200, 1800"
                            value={form.npas}
                            onChange={(event) => setForm({...form, npas: event.target.value})}
                        />
                    </label>
                    <div className="account-field">
                        <span>Zones de recherche</span>

                        <SearchGeoMap
                            value={form.geo}
                            onChange={(geo) => setForm({...form, geo})}
                        />
                    </div>


                    <div className="account-form__grid">
                        <label className="account-field">
                            {form.deal === 'RENT' ? 'Loyer minimum' : 'Prix minimum'}
                            <input
                                type="number"
                                min="0"
                                value={form.price_min}
                                onChange={(event) => setForm({...form, price_min: event.target.value})}
                            />
                        </label>

                        <label className="account-field">
                            {form.deal === 'RENT' ? 'Loyer maximum' : 'Prix maximum'}
                            <input
                                type="number"
                                min="0"
                                value={form.price_max}
                                onChange={(event) => setForm({...form, price_max: event.target.value})}
                            />
                        </label>
                    </div>

                    <div className="account-form__grid">
                        <label className="account-field">
                            Pièces minimum
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={form.rooms_min}
                                onChange={(event) => setForm({...form, rooms_min: event.target.value})}
                            />
                        </label>

                        <label className="account-field">
                            Pièces maximum
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={form.rooms_max}
                                onChange={(event) => setForm({...form, rooms_max: event.target.value})}
                            />
                        </label>
                    </div>

                    <div className="account-form__grid">
                        <label className="account-field">
                            Surface minimum
                            <input
                                type="number"
                                min="0"
                                value={form.surface_min}
                                onChange={(event) => setForm({...form, surface_min: event.target.value})}
                            />
                        </label>

                        <label className="account-field">
                            Surface maximum
                            <input
                                type="number"
                                min="0"
                                value={form.surface_max}
                                onChange={(event) => setForm({...form, surface_max: event.target.value})}
                            />
                        </label>
                    </div>

                    <label className="account-field">
                        Remarques / mots-clés
                        <textarea
                            rows={3}
                            placeholder="Jardin, ascenseur, vue lac..."
                            value={form.keywords}
                            onChange={(event) => setForm({...form, keywords: event.target.value})}
                        />
                    </label>

                    <button type="submit" className="account-primary-button">
                        {form.id ? 'Enregistrer' : 'Créer la recherche'}
                    </button>
                </form>
            ) : null}

            {loading ? (
                <div className="account-panel">
                    <p>Chargement...</p>
                </div>
            ) : searches.length === 0 ? (
                <div className="account-panel">
                    <h2>Aucune recherche enregistrée</h2>
                    <p>Créez vos critères pour retrouver plus facilement les biens qui vous correspondent.</p>
                </div>
            ) : (
                <div className="account-search-list">
                    {searches.map((search) => (
                        <article key={search.id}
                                 className={search.active ? 'account-search-card' : 'account-search-card account-search-card--inactive'}>
                            <div className="account-search-card__head">
                                <div>
                                    <p className="account-kicker">{search.deal_label}</p>
                                    <h2>{search.name}</h2>
                                    <p>{search.summary}</p>
                                </div>

                                <span
                                    className={search.active ? 'account-status account-status--active' : 'account-status'}>
                  {search.status_label}
                </span>
                            </div>

                            <div className="account-search-card__criteria">
                                <SearchCriterion
                                    label="Types de bien"
                                    value={formatCategories(search.criteria?.categories, categoryGroups)}
                                />
                                <SearchCriterion label="Zones incluses" value={formatZones(search.geo?.include)}/>
                                <SearchCriterion label="Zones exclues" value={formatZones(search.geo?.exclude)}/>
                                <SearchCriterion label="NPA" value={formatArray(search.criteria?.npas)}/>
                                <SearchCriterion label="Prix"
                                                 value={formatRange(search.criteria?.price_min, search.criteria?.price_max, 'CHF')}/>
                                <SearchCriterion label="Pièces"
                                                 value={formatRange(search.criteria?.rooms_min, search.criteria?.rooms_max, '')}/>
                                <SearchCriterion label="Surface"
                                                 value={formatRange(search.criteria?.surface_min, search.criteria?.surface_max, 'm²')}/>
                                <SearchCriterion label="Mots-clés" value={search.criteria?.keywords}/>
                            </div>

                            <div className="account-search-card__actions">
                                <button type="button" onClick={() => handleToggle(search)}>
                                    {search.active ? 'Désactiver' : 'Activer'}
                                </button>

                                <button type="button" onClick={() => openEditForm(search)}>
                                    Modifier
                                </button>

                                <button type="button" onClick={() => handleDelete(search)}>
                                    Supprimer
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </AccountShell>
    );
}

function SearchCriterion({label, value}: { label: string; value?: string | number | null }) {
    return (
        <div className="account-search-criterion">
            <span>{label}</span>
            <strong>{value || 'Non défini'}</strong>
        </div>
    );
}

function formatArray(value: unknown): string {
    if (!Array.isArray(value) || value.length === 0) {
        return '';
    }

    return value.join(', ');
}

function formatRange(min?: string | number, max?: string | number, suffix?: string): string {
    if (!min && !max) {
        return '';
    }

    const end = suffix ? ` ${suffix}` : '';

    if (min && max) {
        return `${min} – ${max}${end}`;
    }

    if (min) {
        return `dès ${min}${end}`;
    }

    return `jusqu’à ${max}${end}`;
}
function formatZones(value: unknown): string {
    if (!Array.isArray(value) || value.length === 0) {
        return '';
    }

    return value
        .map((zone) => {
            const name = typeof zone?.name === 'string' ? zone.name.split(',')[0] : 'Zone';
            const radius = zone?.radius_km ? ` (${zone.radius_km} km)` : '';

            return `${name}${radius}`;
        })
        .join(', ');
}

function formatCategories(
    value: unknown,
    groups: ContactSearchCategoryGroup[],
): string {
    if (!Array.isArray(value) || value.length === 0) {
        return 'Tous types';
    }

    const ids = value.map(Number);
    const names: string[] = [];

    groups.forEach((group) => {
        group.children.forEach((child) => {
            if (ids.includes(child.id)) {
                names.push(child.name);
            }
        });
    });

    return names.length > 0 ? names.join(', ') : ids.join(', ');
}