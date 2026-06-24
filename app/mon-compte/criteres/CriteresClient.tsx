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
        if (!formOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                closeFormModal();
            }
        }

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [formOpen]);
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
    function closeFormModal() {
        setFormOpen(false);
        setForm(emptyForm);
        setMessage(null);
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
                    <h1 className='h2'>Mes critères de recherche</h1>
                </div>

                <button type="button" className="account-primary-button site-btn" onClick={openCreateForm}>
                    Nouvelle recherche
                </button>
            </div>

            {message ? (
                <div className="account-panel account-message-panel">
                    {message}
                </div>
            ) : null}

            {formOpen ? (
                <div
                    className="account-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="account-search-modal-title"
                >
                    <button
                        type="button"
                        className="account-modal__overlay"
                        aria-label="Fermer"
                        onClick={closeFormModal}
                    />

                    <div className="account-modal__content">
                        <form className="account-search-form" onSubmit={handleSubmit}>
                            <div className="account-modal__head">
                                <div>

                                    <h2 id="account-search-modal-title" className='h3'>
                                        {form.id ? 'Modifier le critère' : 'Créer un critère'}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="account-modal__close"
                                    onClick={closeFormModal}
                                    aria-label="Fermer"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="account-modal__body">
                                <label className="account-field">
                                    Nom de la recherche
                                    <input
                                        value={form.name}
                                        required
                                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                                    />
                                </label>

                                <div className="account-form__grid">
                                    <label className="account-field">
                                        Transaction
                                        <select
                                            value={form.deal}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    deal: event.target.value as 'SALE' | 'RENT',
                                                })
                                            }
                                        >
                                            <option value="SALE">Vente</option>
                                            <option value="RENT">Location</option>
                                        </select>
                                    </label>

                                    <label className="account-field">
                                        Statut
                                        <select
                                            value={form.status}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    status: event.target.value as 'ACTIVE' | 'INACTIVE',
                                                })
                                            }
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="account-field">
                                    <label>Type de bien recherché</label>

                                    <SearchCategorySelector
                                        groups={categoryGroups}
                                        value={form.categories}
                                        onChange={(categories) => setForm({ ...form, categories })}
                                    />
                                </div>

                                <label className="account-field">
                                    NPA recherchés
                                    <input
                                        placeholder="1000, 1200, 1800"
                                        value={form.npas}
                                        onChange={(event) => setForm({ ...form, npas: event.target.value })}
                                    />
                                </label>

                                <div className="account-field">
                                    <label>Zones de recherche</label>

                                    <SearchGeoMap
                                        value={form.geo}
                                        onChange={(geo) => setForm({ ...form, geo })}
                                    />
                                </div>

                                <div className="account-form__grid">
                                    <label className="account-field">
                                        {form.deal === 'RENT' ? 'Loyer minimum' : 'Prix minimum'}
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.price_min}
                                            onChange={(event) =>
                                                setForm({ ...form, price_min: event.target.value })
                                            }
                                        />
                                    </label>

                                    <label className="account-field">
                                        {form.deal === 'RENT' ? 'Loyer maximum' : 'Prix maximum'}
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.price_max}
                                            onChange={(event) =>
                                                setForm({ ...form, price_max: event.target.value })
                                            }
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
                                            onChange={(event) =>
                                                setForm({ ...form, rooms_min: event.target.value })
                                            }
                                        />
                                    </label>

                                    <label className="account-field">
                                        Pièces maximum
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            value={form.rooms_max}
                                            onChange={(event) =>
                                                setForm({ ...form, rooms_max: event.target.value })
                                            }
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
                                            onChange={(event) =>
                                                setForm({ ...form, surface_min: event.target.value })
                                            }
                                        />
                                    </label>

                                    <label className="account-field">
                                        Surface maximum
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.surface_max}
                                            onChange={(event) =>
                                                setForm({ ...form, surface_max: event.target.value })
                                            }
                                        />
                                    </label>
                                </div>

                                <label className="account-field">
                                    Remarques / mots-clés
                                    <textarea
                                        rows={3}
                                        placeholder="Jardin, ascenseur, vue lac..."
                                        value={form.keywords}
                                        onChange={(event) =>
                                            setForm({ ...form, keywords: event.target.value })
                                        }
                                    />
                                </label>
                            </div>

                            <div className="account-modal__footer">
                                <button
                                    type="button"
                                    className="site-btn site-btn--secondary"
                                    onClick={closeFormModal}
                                >
                                    Annuler
                                </button>

                                <button type="submit" className="account-primary-button site-btn">
                                    {form.id ? 'Enregistrer' : 'Créer la recherche'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
                        <article
                            key={search.id}
                            className={
                                search.active
                                    ? 'account-search-row'
                                    : 'account-search-row account-search-row--inactive'
                            }
                        >
                            <div className="account-search-row__title ">
                                <strong>
                                    {search.name}
                                </strong>
                            </div>

                            <div className="account-search-row__deal">
                                {search.deal_label}
                            </div>

                            <div className="account-search-row__date">
                                {formatSearchDate(search.created_at)}
                            </div>

                            <div className="account-search-row__status">
                                <button
                                    type="button"
                                    className="account-search-status-button site-btn btn-sm"
                                    onClick={() => handleToggle(search)}
                                >
                                    {search.status_label}

                                </button>
                            </div>

                            <div className="account-search-row__actions">
                                <button
                                    type="button"
                                    className="account-search-icon-button"
                                    onClick={() => openEditForm(search)}
                                    aria-label="Modifier"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M11.7501 3.75071L15.7501 7.75052M1.53201 14.0602L0.75 18.75L5.44004 17.968C6.25484 17.8327 7.00694 17.446 7.59105 16.8621L18.1701 6.28259C18.5414 5.9113 18.75 5.40773 18.75 4.88266C18.75 4.35759 18.5414 3.85403 18.1701 3.48273L16.0191 1.33083C15.8352 1.1467 15.6168 1.00063 15.3764 0.900963C15.136 0.801299 14.8784 0.75 14.6181 0.75C14.3579 0.75 14.1002 0.801299 13.8598 0.900963C13.6194 1.00063 13.401 1.1467 13.2171 1.33083L2.63802 11.9103C2.05423 12.4941 1.66753 13.2458 1.53201 14.0602Z"
                                            stroke="#B97500" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>

                                </button>

                                <button
                                    type="button"
                                    className="account-search-icon-button"
                                    onClick={() => handleDelete(search)}
                                    aria-label="Supprimer"
                                >
                                    <svg width="19" height="20" viewBox="0 0 19 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M2.86719 3.92678V16.1026C2.86706 16.4503 2.93545 16.7946 3.06845 17.1158C3.20145 17.4371 3.39646 17.729 3.64232 17.9749C3.88819 18.2207 4.18009 18.4157 4.50135 18.5487C4.82262 18.6817 5.16694 18.7501 5.51464 18.75H12.9267C13.6286 18.75 14.3018 18.4712 14.7981 17.9749C15.2944 17.4786 15.5732 16.8054 15.5732 16.1035V3.92581M0.75 3.92678H17.6914"
                                                stroke="#031239" strokeWidth="1.5" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                            <path
                                                d="M6.0437 3.92676V2.33789C6.04345 2.12921 6.08438 1.92254 6.16414 1.72971C6.24391 1.53687 6.36095 1.36168 6.50856 1.21417C6.65616 1.06666 6.83142 0.949723 7.0243 0.870072C7.21718 0.790421 7.42389 0.749618 7.63257 0.750003H10.8083C11.017 0.749618 11.2237 0.790421 11.4166 0.870072C11.6095 0.949723 11.7848 1.06666 11.9324 1.21417C12.08 1.36168 12.197 1.53687 12.2768 1.72971C12.3565 1.92254 12.3975 2.12921 12.3972 2.33789V3.92676M7.10327 14.6071V9.31507M11.3386 14.6071V9.31507"
                                                stroke="#031239" strokeWidth="1.5" strokeLinecap="round"
                                                strokeLinejoin="round"/>

                                    </svg>

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

function formatSearchDate(value?: string | null): string {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat('fr-CH', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    }).format(new Date(value));
}
