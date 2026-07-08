'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CookieConsent = {
    essential: true;
    analytics: boolean;
    marketing: boolean;
};

const COOKIE_KEY = 'casaq_cookie_consent';

export function useCookieConsent() {
    const [consent, setConsent] = useState<CookieConsent | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem(COOKIE_KEY);

        if (raw) {
            try {
                setConsent(JSON.parse(raw));
            } catch {
                setConsent(null);
            }
        }
    }, []);

    const save = (value: CookieConsent) => {
        localStorage.setItem(COOKIE_KEY, JSON.stringify(value));
        setConsent(value);
    };

    const acceptAll = () =>
        save({ essential: true, analytics: true, marketing: true });

    const rejectAll = () =>
        save({ essential: true, analytics: false, marketing: false });

    const saveCustom = (analytics: boolean, marketing: boolean) =>
        save({ essential: true, analytics, marketing: false });

    return { consent, acceptAll, rejectAll, saveCustom };
}

export function CookieBanner() {
    const { consent, acceptAll, rejectAll, saveCustom } = useCookieConsent();

    const [show, setShow] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [analytics, setAnalytics] = useState(true);

    useEffect(() => {
        if (consent === null) {
            const timer = window.setTimeout(() => setShow(true), 600);
            return () => window.clearTimeout(timer);
        }

        setShow(false);
    }, [consent]);

    if (!show) {
        return null;
    }

    return (
        <>
            <div className="site-cookie-overlay" />

            <section
                className="site-cookie-banner"
                role="dialog"
                aria-label="Gestion des cookies"
                aria-modal="true"
            >
                <div className="site-cookie-banner__header">
                    <h3 className="site-cookie-banner__title">
                        Nous utilisons des cookies
                    </h3>
                </div>

                <div className="txt site-cookie-banner__text">
                    <p>
                        Ce site utilise des cookies essentiels à son fonctionnement
                        et des cookies de mesure d’audience pour améliorer votre
                        expérience. Ces derniers ne seront activés qu’après votre
                        accord.{' '}
                        <Link href="/impressum" className="site-cookie-banner__link">
                            Politique de confidentialité
                        </Link>
                    </p>
                </div>

                {showDetails ? (
                    <div className="site-cookie-banner__details">
                        <div className="site-cookie-row">
                            <div className="site-cookie-row__info">
                                <strong>Cookies essentiels</strong>
                                <span>Nécessaires au fonctionnement du site. Toujours actifs.</span>
                            </div>

                            <div className="site-cookie-toggle site-cookie-toggle--on site-cookie-toggle--disabled">
                                <span className="site-cookie-toggle__knob" />
                            </div>
                        </div>

                        <div className="site-cookie-row">
                            <div className="site-cookie-row__info">
                                <strong>Cookies analytiques</strong>
                                <span>Mesure d’audience anonymisée.</span>
                            </div>

                            <button
                                type="button"
                                className={`site-cookie-toggle ${analytics ? 'site-cookie-toggle--on' : ''}`}
                                onClick={() => setAnalytics((current) => !current)}
                                aria-label={analytics ? 'Désactiver analytics' : 'Activer analytics'}
                            >
                                <span className="site-cookie-toggle__knob" />
                            </button>
                        </div>
                    </div>
                ) : null}

                <div className="site-cookie-banner__actions">
                    <button
                        type="button"
                        className="site-cookie-banner__button site-cookie-banner__button--secondary"
                        onClick={() => {
                            rejectAll();
                            setShow(false);
                        }}
                    >
                        Tout refuser
                    </button>

                    <button
                        type="button"
                        className="site-cookie-banner__button site-cookie-banner__button--secondary"
                        onClick={() => setShowDetails((current) => !current)}
                    >
                        {showDetails ? 'Masquer' : 'Paramètres'}
                    </button>

                    {showDetails ? (
                        <button
                            type="button"
                            className="site-cookie-banner__button"
                            onClick={() => {
                                saveCustom(analytics, false);
                                setShow(false);
                            }}
                        >
                            Enregistrer
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="site-cookie-banner__button"
                            onClick={() => {
                                acceptAll();
                                setShow(false);
                            }}
                        >
                            Tout accepter
                        </button>
                    )}
                </div>
            </section>
        </>
    );
}