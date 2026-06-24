'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import {
    buildUrlWithPreviewDomain,
    forgotPasswordClient,
    getCurrentDomainFromBrowser,
} from '@/lib/contact-auth-client';

type Props = {
    previewDomain?: string;
};

export function ForgotPasswordFormClient({ previewDomain }: Props) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const loginUrl = useMemo(
        () => buildUrlWithPreviewDomain('/login', previewDomain),
        [previewDomain],
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setMessage(null);

        const domain = getCurrentDomainFromBrowser();

        const resetUrl =
            window.location.origin +
            buildUrlWithPreviewDomain('/reset-password', previewDomain);

        const result = await forgotPasswordClient({
            domain,
            email,
            reset_url: resetUrl,
        });

        setLoading(false);
        setMessage(result.message || 'Si un compte existe avec cette adresse, un email a été envoyé.');
    }

    return (
        <section className="account-auth__card">
            <h1 className='h2'>Mot de passe oublié</h1>
            <p>Entrez votre adresse e-mail. Vous recevrez un lien pour créer un nouveau mot de passe.</p>

            <form onSubmit={handleSubmit} className="account-form">
                <label className="account-field">
                    Adresse e-mail
                    <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </label>

                {message ? (
                    <p className="account-message">
                        {message}
                    </p>
                ) : null}

                <button type="submit" className="account-button" disabled={loading}>
                    {loading ? 'Envoi...' : 'Recevoir le lien'}
                </button>
            </form>

            <div className="account-auth__links">
                <Link href={loginUrl}>Retour à la connexion</Link>
            </div>
        </section>
    );
}