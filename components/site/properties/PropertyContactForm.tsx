'use client';

import { useState } from 'react';

type Props = {
    domain: string;
    bienId: number;
};

export function PropertyContactForm({ domain, bienId }: Props) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        setStatus('loading');
        setMessage(null);

        const payload = {
            domain,
            bien_id: bienId,
            civilite: String(formData.get('civilite') || ''),
            firstname: String(formData.get('firstname') || ''),
            lastname: String(formData.get('lastname') || ''),
            email: String(formData.get('email') || ''),
            phone: String(formData.get('phone') || ''),
            message: String(formData.get('message') || ''),
            gdpr_accepted: formData.get('gdpr_accepted') === 'on',
            intent: 'contact_agent',
            page_url: window.location.href,
        };

        const res = await fetch('/api/demandes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.success) {
            setStatus('error');
            setMessage(json?.message || 'Impossible d’envoyer la demande.');
            return;
        }

        setStatus('success');
        setMessage('Votre demande a bien été envoyée.');
        form.reset();
    }

    return (
        <form className="property-contact-form" onSubmit={handleSubmit}>
            <h3>Demander des informations</h3>

            <div className="form-grid">
                <div className="form-field">
                    <label>Civilité</label>
                    <select name="civilite" required>
                        <option value="">Sélectionner...</option>
                        <option value="1">Monsieur</option>
                        <option value="2">Madame</option>
                        <option value="3">Société</option>
                        <option value="4">Famille</option>
                    </select>
                </div>
                <div className="form-field">
                    <label>Prénom</label>
                    <input name="firstname" type="text" required/>
                </div>

                <div className="form-field">
                    <label>Nom</label>
                    <input name="lastname" type="text" required/>
                </div>
            </div>

            <div className="form-field">
                <label>Email</label>
                <input name="email" type="email"/>
            </div>

            <div className="form-field">
                <label>Téléphone</label>
                <input name="phone" type="tel"/>
            </div>

            <div className="form-field">
                <label>Message</label>
                <textarea
                    name="message"
                    rows={5}
                    defaultValue="Bonjour, je souhaite recevoir plus d'informations sur ce bien."
                />
            </div>

            <label className="form-checkbox">
                <input name="gdpr_accepted" type="checkbox" required />
                <span>J’accepte que mes données soient transmises à l’agence pour le traitement de ma demande.</span>
            </label>

            <button className="property-contact-button" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Envoi...' : 'Envoyer ma demande'}
            </button>

            {message ? (
                <p className={`form-message form-message--${status}`}>
                    {message}
                </p>
            ) : null}
        </form>
    );
}