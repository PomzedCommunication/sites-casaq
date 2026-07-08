'use client';

import { useState } from 'react';

type Props = {
    domain: string;
    bienId?: number | null;
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

        // const payload = {
        //     domain,
        //     bien_id: bienId || null,
        //     civilite: String(formData.get('civilite') || ''),
        //     firstname: String(formData.get('firstname') || ''),
        //     lastname: String(formData.get('lastname') || ''),
        //     email: String(formData.get('email') || ''),
        //     phone: String(formData.get('phone') || ''),
        //     message: String(formData.get('message') || ''),
        //     gdpr_accepted: formData.get('gdpr_accepted') === 'on',
        //     intent: 'contact_agent',
        //     page_url: window.location.href,
        // };
        const payload: Record<string, unknown> = {
            domain,
            civilite: String(formData.get('civilite') || ''),
            firstname: String(formData.get('firstname') || ''),
            lastname: String(formData.get('lastname') || ''),
            email: String(formData.get('email') || ''),
            phone: String(formData.get('phone') || ''),
            message: String(formData.get('message') || ''),
            gdpr_accepted: formData.get('gdpr_accepted') === 'on',
            intent: bienId ? 'contact_agent' : 'question',
            page_url: window.location.href,
        };

        if (bienId) {
            payload.bien_id = bienId;
        }
        const res = await fetch('/api/demandes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => null);
        // console.log('demande response', res.status, json);
        if (!res.ok || !json?.success) {
            setStatus('error');

            const errors = json?.errors
                ? Object.values(json.errors).join(' ')
                : null;

            setMessage(errors || json?.message || 'Impossible d’envoyer la demande.');
            return;
        }

        setStatus('success');
        setMessage('Votre demande a bien été envoyée.');
        form.reset();
    }

    return (
        <form className="property-contact-form" onSubmit={handleSubmit}>
            {/*<h3>Demander des informations</h3>*/}
            <label>Coordonnées de contact</label>

            <div className="form-field">
                {/*<label>Civilité</label>*/}
                <select name="civilite" required>
                    <option value="">Sélectionner...</option>
                    <option value="1">Monsieur</option>
                    <option value="2">Madame</option>
                    <option value="3">Société</option>
                    <option value="4">Famille</option>
                </select>
            </div>
            <div className="form-grid">

                <div className="form-field">
                    {/*<label>Prénom</label>*/}
                    <input name="firstname" placeholder="Prénom" type="text" required/>
                </div>

                <div className="form-field">
                    {/*<label>Nom</label>*/}
                    <input name="lastname" placeholder="Nom" type="text" required/>
                </div>
            </div>

            <div className="form-field">
                {/*<label>Email</label>*/}
                <input name="email" placeholder="Email" type="email" required/>
            </div>

            <div className="form-field">
                {/*<label>Téléphone</label>*/}
                <input name="phone" placeholder="Téléphone" type="tel" required/>
            </div>
            <div className="space-form">

            </div>
            <div className="form-field">
                <label>Message</label>
                <textarea
                    name="message"
                    placeholder="Message"
                    rows={5}
                    defaultValue="Bonjour, "
                />
            </div>

            <label className="form-checkbox">
                <input name="gdpr_accepted" type="checkbox" required/>
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