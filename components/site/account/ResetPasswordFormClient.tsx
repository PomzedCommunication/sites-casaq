'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    buildUrlWithPreviewDomain,
    getCurrentDomainFromBrowser,
    resetPasswordClient,
} from '@/lib/contact-auth-client';

type Props = {
    previewDomain?: string;
};

export function ResetPasswordFormClient({ previewDomain }: Props) {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const loginUrl = useMemo(
        () => buildUrlWithPreviewDomain('/login', previewDomain),
        [previewDomain],
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setMessage(null);

        const domain = getCurrentDomainFromBrowser();

        const result = await resetPasswordClient({
            domain,
            token,
            password,
            password_confirmation: passwordConfirmation,
        });

        setLoading(false);
        setSuccess(result.success);
        setMessage(result.message || 'Mot de passe réinitialisé.');
    }

    return (
        <section className="account-auth__card">
            <h1>Nouveau mot de passe</h1>
            <p>Choisissez un nouveau mot de passe pour votre espace personnel.</p>

            {!token ? (
                <p className="account-message account-message--error">
                    Lien de réinitialisation invalide.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="account-form">
                    <label className="account-field">
                        Nouveau mot de passe
                        <input
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </label>

                    <label className="account-field">
                        Confirmer le mot de passe
                        <input
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={passwordConfirmation}
                            onChange={(event) => setPasswordConfirmation(event.target.value)}
                        />
                    </label>

                    {message ? (
                        <p className={`account-message ${success ? '' : 'account-message--error'}`}>
                            {message}
                        </p>
                    ) : null}

                    <button type="submit" className="account-button" disabled={loading || success}>
                        {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            )}

            <div className="account-auth__links">
                <Link href={loginUrl}>Retour à la connexion</Link>
            </div>
        </section>
    );
}