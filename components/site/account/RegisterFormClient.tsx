'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    buildUrlWithPreviewDomain,
    getCurrentDomainFromBrowser,
    registerContactAccountClient,
    saveContactToken,
} from '@/lib/contact-auth-client';

type Props = {
    previewDomain?: string;
};

export function RegisterFormClient({ previewDomain }: Props) {
    const router = useRouter();

    const loginUrl = useMemo(
        () => buildUrlWithPreviewDomain('/login', previewDomain),
        [previewDomain],
    );

    const accountUrl = useMemo(
        () => buildUrlWithPreviewDomain('/mon-compte', previewDomain),
        [previewDomain],
    );

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [gdprAccepted, setGdprAccepted] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setMessage(null);

        const domain = getCurrentDomainFromBrowser();

        const result = await registerContactAccountClient({
            domain,
            firstname,
            lastname,
            email,
            phone,
            password,
            password_confirmation: passwordConfirmation,
            gdpr_accepted: gdprAccepted,
        });

        setLoading(false);

        if (!result.success || !result.data?.token) {
            setMessage(result.message || 'Création du compte impossible.');
            return;
        }

        saveContactToken(result.data.token);
        router.push(accountUrl);
    }

    return (
        <section className="account-auth__card big-auth-account">
            <h1>Créer un compte</h1>
            <p>Créez votre espace personnel pour gérer vos recherches et vos favoris.</p>

            <form onSubmit={handleSubmit} className="account-form">
                <div className="account-form__grid">
                    <label className="account-field">
                        Prénom
                        <input
                            type="text"
                            autoComplete="given-name"
                            required
                            value={firstname}
                            onChange={(event) => setFirstname(event.target.value)}
                        />
                    </label>

                    <label className="account-field">
                        Nom
                        <input
                            type="text"
                            autoComplete="family-name"
                            required
                            value={lastname}
                            onChange={(event) => setLastname(event.target.value)}
                        />
                    </label>
                </div>
                <div className="account-form__grid">

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
                        Téléphone
                        <input
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                        />
                    </label>
                </div>
                <div className="account-form__grid">

                    <label className="account-field">
                        Mot de passe
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
                </div>

                    <label className="account-checkbox">
                        <input
                            type="checkbox"
                            checked={gdprAccepted}
                            onChange={(event) => setGdprAccepted(event.target.checked)}
                        />
                        <span>J’accepte la politique de confidentialité.</span>
                    </label>

                    {message ? (
                        <p className="account-message account-message--error">
                            {message}
                        </p>
                    ) : null}

                    <button type="submit" className="account-button" disabled={loading}>
                        {loading ? 'Création...' : 'Créer mon compte'}
                    </button>
            </form>

            <div className="account-auth__links">
            <Link href={loginUrl}>J’ai déjà un compte</Link>
            </div>
        </section>
    );
}