import { useState } from 'react';

type Newsletter = {
    enabled?: boolean;
    title?: string;
    description?: string;
    button_text?: string;
    placeholder?: string;
    popup_text?: string;
    popup_title?: string;
    display_mode?: string;
};

type Props = {
    newsletter: Newsletter;
    className?: string;
};

export function NewsletterFooter({
                                     newsletter,
                                     className = ''
                                 }: Props) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    if (newsletter.enabled === false) {
        return null;
    }

    const isPopup = newsletter.display_mode === 'popup';

    const form = (
        <form className="site-newsletter__form">
            <span className="site-newsletter__icon">✉</span>

            <input
                type="email"
                placeholder={
                    newsletter.placeholder || 'Votre adresse e-mail'
                }
            />

            <button type="submit" className={'site-btn site_submit_news'} aria-label="S’abonner">
            </button>
        </form>
    );

    return (
        <div className={`site-newsletter ${className}`}>
            <h3>
                {newsletter.title || 'S’abonner à notre Newsletter'}
            </h3>

            {newsletter.description ? (
                <p>{newsletter.description}</p>
            ) : null}

            {isPopup ? (
                <>
                    <button
                        type="button"
                        className="site-newsletter__button site-btn"
                        onClick={() => setIsPopupOpen(true)}
                    >
                        {newsletter.button_text || 'S’abonner'}
                    </button>

                    {isPopupOpen ? (
                        <div
                            className="site-newsletter__popup"
                            onClick={() => setIsPopupOpen(false)}
                        >
                            <div
                                className="site-newsletter__popup-content"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    className="site-newsletter__popup-close"
                                    onClick={() => setIsPopupOpen(false)}
                                    aria-label="Fermer"
                                >
                                    ×
                                </button>

                                <h3>
                                    {newsletter.popup_title ||
                                        newsletter.title ||
                                        'S’abonner à notre Newsletter'}
                                </h3>

                                {newsletter.popup_text ? (
                                    <p>{newsletter.popup_text}</p>
                                ) : null}

                                {form}
                            </div>
                        </div>
                    ) : null}
                </>
            ) : (
                form
            )}
        </div>
    );
}