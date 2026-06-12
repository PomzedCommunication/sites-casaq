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

export function NotificationsClient({ previewDomain }: Props) {
    const [contact, setContact] = useState<ContactAccount | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

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

        const result = await updateContactAccountClient(domain, {
            newsletter_alert: Boolean(contact.newsletter_alert),
            matching_alert: contact.matching_alert !== false,
            price_alert: contact.price_alert !== false,
            contact_email: contact.contact_email !== false,
            contact_phone: Boolean(contact.contact_phone),
        });

        setSaving(false);
        setMessage(result.message || null);
        setMessageType(result.success ? 'success' : 'error');

        if (result.contact) {
            setContact(result.contact);
        }
    }

    if (loading || !contact) {
        return (
            <AccountShell previewDomain={previewDomain} active="notifications">
                <div className="account-panel">
                    <p>Chargement...</p>
                </div>
            </AccountShell>
        );
    }

    return (
        <AccountShell previewDomain={previewDomain} active="notifications">
            <div className="account-heading">
                <div>
                    <p className="account-kicker">Mon espace</p>
                    <h1>Paramètres et notifications</h1>
                </div>
            </div>

            <form className="account-settings-form" onSubmit={handleSubmit}>
                <section className="account-panel account-settings-section">
                    <div className="account-section-title">
                        <p className="account-kicker">Notifications</p>
                        <h2>Alertes immobilières</h2>
                    </div>

                    <NotificationToggle
                        title="Nouvelles correspondances"
                        description="Recevoir une notification lorsqu’un bien correspond à vos critères de recherche."
                        checked={contact.matching_alert !== false}
                        onChange={(checked) => setContact({ ...contact, matching_alert: checked })}
                    />

                    <NotificationToggle
                        title="Modification de prix"
                        description="Recevoir une notification lorsqu’un bien correspondant à vos critères change de prix."
                        checked={contact.price_alert !== false}
                        onChange={(checked) => setContact({ ...contact, price_alert: checked })}
                    />

                    <NotificationToggle
                        title="Newsletter"
                        description="Recevoir les actualités et informations de l’agence."
                        checked={Boolean(contact.newsletter_alert)}
                        onChange={(checked) => setContact({ ...contact, newsletter_alert: checked })}
                    />
                </section>

                <section className="account-panel account-settings-section">
                    <div className="account-section-title">
                        <p className="account-kicker">Préférences</p>
                        <h2>Moyens de contact</h2>
                    </div>

                    <NotificationToggle
                        title="Me contacter par e-mail"
                        description="Autoriser l’agence à vous contacter par e-mail."
                        checked={contact.contact_email !== false}
                        onChange={(checked) => setContact({ ...contact, contact_email: checked })}
                    />

                    <NotificationToggle
                        title="Me contacter par téléphone"
                        description="Autoriser l’agence à vous contacter par téléphone."
                        checked={Boolean(contact.contact_phone)}
                        onChange={(checked) => setContact({ ...contact, contact_phone: checked })}
                    />
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

function NotificationToggle({
                                title,
                                description,
                                checked,
                                onChange,
                            }: {
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="account-toggle-row">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
        </label>
    );
}