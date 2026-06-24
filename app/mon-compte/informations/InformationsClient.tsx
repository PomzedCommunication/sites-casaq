'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AccountShell } from '@/components/site/account/AccountShell';
import {
    buildUrlWithPreviewDomain,
    getContactAccountClient,
    getCurrentDomainFromBrowser,
    updateContactAccountClient,
    type ContactAccount,
} from '@/lib/contact-auth-client';

type Props = {
    previewDomain?: string | null;
};

type PasswordState = {
    password: string;
    password_confirmation: string;
};

export function InformationsClient({ previewDomain }: Props) {
    const [contact, setContact] = useState<ContactAccount | null>(null);
    const [passwords, setPasswords] = useState<PasswordState>({
        password: '',
        password_confirmation: '',
    });
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadContact() {
            const domain = getCurrentDomainFromBrowser();
            const result = await getContactAccountClient(domain);

            if (!result.success || !result.contact) {
                window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
                return;
            }

            setContact(result.contact);
            setLoading(false);
        }

        loadContact();
    }, [previewDomain]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!contact) {
            return;
        }

        setSaving(true);
        setMessage(null);

        const domain = getCurrentDomainFromBrowser();

        const payload = {
            civilite: contact.civilite || '',
            firstname: contact.firstname || '',
            lastname: contact.lastname || '',
            phone: contact.phone || '',
            mobile: contact.mobile || '',
            address: contact.address || '',
            address2: contact.address2 || '',
            npa: contact.npa || '',
            city: contact.city || '',
            country: contact.country || '',
            password: passwords.password,
            password_confirmation: passwords.password_confirmation,
        };

        const result = await updateContactAccountClient(domain, payload);

        setSaving(false);
        setMessage(result.message || null);
        setMessageType(result.success ? 'success' : 'error');

        if (result.contact) {
            setContact(result.contact);
        }

        if (result.success) {
            setPasswords({
                password: '',
                password_confirmation: '',
            });
        }
    }

    if (loading || !contact) {
        return (
            <AccountShell previewDomain={previewDomain} active="informations">
                <div className="account-panel">
                    <p>Chargement...</p>
                </div>
            </AccountShell>
        );
    }

    return (
        <AccountShell previewDomain={previewDomain} active="informations">
            <div className="account-heading">
                <div>
                    <p className="account-kicker">Mon espace</p>
                    <h1>Informations personnelles</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="account-profile-form">
                <section className="account-panel account-profile-section">
                    <div className="account-section-title">
                        <p className="account-kicker">Coordonnées</p>
                        <h3>Vos informations</h3>
                    </div>

                    <div className="account-form__grid">
                        <label className="account-field">
                            Civilité
                            <select
                                value={contact.civilite || ''}
                                onChange={(event) => setContact({...contact, civilite: event.target.value})}
                            >
                                <option value="">— Sélectionner —</option>
                                <option value="1">Monsieur</option>
                                <option value="2">Madame</option>
                                <option value="3">Société</option>
                                <option value="4">Famille</option>
                            </select>
                        </label>

                        <label className="account-field">
                            Adresse e-mail
                            <input value={contact.email || ''} disabled/>
                        </label>
                    </div>

                    <div className="account-form__grid">
                        <label className="account-field">
                            Prénom
                            <input
                                value={contact.firstname || ''}
                                onChange={(event) => setContact({ ...contact, firstname: event.target.value })}
                            />
                        </label>

                        <label className="account-field">
                            Nom
                            <input
                                value={contact.lastname || ''}
                                onChange={(event) => setContact({ ...contact, lastname: event.target.value })}
                            />
                        </label>
                    </div>

                    <div className="account-form__grid">
                        <label className="account-field">
                            Téléphone
                            <input
                                value={contact.phone || ''}
                                onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                            />
                        </label>

                        <label className="account-field">
                            Mobile
                            <input
                                value={contact.mobile || ''}
                                onChange={(event) => setContact({ ...contact, mobile: event.target.value })}
                            />
                        </label>
                    </div>

                    <label className="account-field">
                        Adresse
                        <input
                            value={contact.address || ''}
                            onChange={(event) => setContact({ ...contact, address: event.target.value })}
                        />
                    </label>

                    <label className="account-field">
                        Complément d’adresse
                        <input
                            value={contact.address2 || ''}
                            onChange={(event) => setContact({ ...contact, address2: event.target.value })}
                        />
                    </label>

                    <div className="account-form__grid">
                        <label className="account-field">
                            NPA
                            <input
                                value={contact.npa || ''}
                                onChange={(event) => setContact({ ...contact, npa: event.target.value })}
                            />
                        </label>

                        <label className="account-field">
                            Ville
                            <input
                                value={contact.city || ''}
                                onChange={(event) => setContact({ ...contact, city: event.target.value })}
                            />
                        </label>
                    </div>

                    <label className="account-field">
                        Pays
                        <input
                            value={contact.country || ''}
                            onChange={(event) => setContact({ ...contact, country: event.target.value })}
                        />
                    </label>
                </section>

                <section className="account-panel account-profile-section">
                    <div className="account-section-title">
                        <p className="account-kicker">Sécurité</p>
                        <h3>Mot de passe</h3>
                    </div>

                    <p className="account-help">
                        Laissez ces champs vides si vous ne souhaitez pas modifier votre mot de passe.
                    </p>

                    <label className="account-field">
                        Nouveau mot de passe
                        <input
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={passwords.password}
                            onChange={(event) => setPasswords({ ...passwords, password: event.target.value })}
                        />
                    </label>

                    <label className="account-field">
                        Confirmer le nouveau mot de passe
                        <input
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={passwords.password_confirmation}
                            onChange={(event) =>
                                setPasswords({ ...passwords, password_confirmation: event.target.value })
                            }
                        />
                    </label>
                </section>

                {message ? (
                    <p
                        className={
                            messageType === 'success'
                                ? 'account-message account-message--success'
                                : 'account-message account-message--error'
                        }
                    >
                        {message}
                    </p>
                ) : null}

                <div className="account-profile-actions">
                    <button type="submit" className="account-button" disabled={saving}>
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </AccountShell>
    );
}