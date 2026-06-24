'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    buildUrlWithPreviewDomain,
    getCurrentDomainFromBrowser,
    loginContactAccountClient,
    saveContactToken,
} from '@/lib/contact-auth-client';

type Props = {
    previewDomain?: string;
};

export function LoginFormClient({ previewDomain }: Props) {
    const router = useRouter();

    const registerUrl = useMemo(
        () => buildUrlWithPreviewDomain('/register', previewDomain),
        [previewDomain],
    );

    const forgotPasswordUrl = useMemo(
        () => buildUrlWithPreviewDomain('/forgot-password', previewDomain),
        [previewDomain],
    );

    const accountUrl = useMemo(
        () => buildUrlWithPreviewDomain('/mon-compte', previewDomain),
        [previewDomain],
    );

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setMessage(null);

        const domain = getCurrentDomainFromBrowser();

        const result = await loginContactAccountClient({
            domain,
            email,
            password,
        });

        setLoading(false);

        if (!result.success || !result.data?.token) {
            setMessage(result.message || 'Connexion impossible.');
            return;
        }

        saveContactToken(result.data.token);
        router.push(accountUrl);
    }

    return (
        <section className="account-auth__card">
            <h1 className='h2'>Connexion</h1>
            <p>Connectez-vous à votre espace personnel.</p>

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

                <label className="account-field">
                    Mot de passe
                    <input
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </label>

                {message ? (
                    <p className="account-message account-message--error">
                        {message}
                    </p>
                ) : null}

                <button type="submit" className="account-button" disabled={loading}>
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <div className="account-auth__links">
                <Link href={registerUrl}>Créer un compte</Link>
                <Link href={forgotPasswordUrl}>Mot de passe oublié ?</Link>
            </div>
        </section>
    );
}