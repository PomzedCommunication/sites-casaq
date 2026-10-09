'use client';

import { useState } from 'react';
import { useSiteConfig } from '@/components/site/SiteConfigProvider';

type Props = {
    domain: string;
    bienId?: number | null;
};


export function PropertyContactForm({ domain, bienId }: Props) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const site = useSiteConfig();

    const isTemplate2 = site.template_key === 'template_2';
    // const showCreateAccount = isTemplate2 && site.show_create_account !== false;
    const showCreateAccount = false;


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        setStatus('loading');
        setMessage(null);

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

        // Société : toujours envoyée si le champ existe,
        // mais elle reste facultative.
        if (isTemplate2) {
            payload.company = String(formData.get('company') || '');
        }

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

            {!isTemplate2 && (
                <label>Coordonnées de contact</label>
            )}

            {/* Civilité */}
            {isTemplate2 ? (
                <div className="form-field">
                    <label>Civilité</label>

                    <div className="civilite-radios radios-form">
                        <label>
                            <input
                                type="radio"
                                name="civilite"
                                value="1"
                                required
                            />
                            Monsieur
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="civilite"
                                value="2"
                            />
                            Madame
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="civilite"
                                value="3"
                            />
                            Société
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="civilite"
                                value="4"
                            />
                            Famille
                        </label>
                    </div>
                </div>
            ) : (
                <div className="form-field">
                    <select name="civilite" required>
                        <option value="">Sélectionner...</option>
                        <option value="1">Monsieur</option>
                        <option value="2">Madame</option>
                        <option value="3">Société</option>
                        <option value="4">Famille</option>
                    </select>
                </div>
            )}

            {/* Prénom / Nom */}
            <div className="form-grid">
                <div className="form-field">
                    {isTemplate2 && <label>Prénom</label>}

                    <input
                        name="firstname"
                        placeholder={isTemplate2 ? 'Votre prénom' : 'Prénom'}
                        type="text"
                        required
                    />
                </div>

                <div className="form-field">
                    {isTemplate2 && <label>Nom</label>}

                    <input
                        name="lastname"
                        placeholder={isTemplate2 ? 'Votre nom' : 'Nom'}
                        type="text"
                        required
                    />
                </div>
            </div>

            {/* Société - uniquement template_2 */}
            {isTemplate2 && (
                <div className="form-field">
                    <label>Société <span>(facultatif)</span></label>

                    <input
                        name="company"
                        placeholder="Nom de la société"
                        type="text"
                    />
                </div>
            )}

            {/* Email */}
            <div className="form-field">
                {isTemplate2 && <label>Email</label>}

                <input
                    name="email"
                    placeholder={isTemplate2 ? 'votre@email.ch' : 'Email'}
                    type="email"
                    required
                />
            </div>

            {/* Téléphone */}
            <div className="form-field">
                {isTemplate2 && <label>Téléphone</label>}

                <input
                    name="phone"
                    placeholder={isTemplate2 ? '0761234567' : 'Téléphone'}
                    type="tel"
                    required
                />
            </div>

            <div className="space-form" />

            {/* Message */}
            <div className="form-field">
                <label>Message</label>

                <textarea
                    name="message"
                    placeholder={isTemplate2 ? 'Votre message...' : 'Message'}
                    rows={5}
                    defaultValue="Bonjour, "
                />
            </div>

            {/* Créer un compte */}
            {showCreateAccount && (
                <label className="form-checkbox">
                    <input
                        name="create_account"
                        type="checkbox"
                    />

                    <span>
                        Créer un compte avec ces données
                    </span>
                </label>
            )}

            {/* RGPD */}
            <label className="form-checkbox">
                <input
                    name="gdpr_accepted"
                    type="checkbox"
                    required
                />

                <span>

                    {isTemplate2 ? 'J\'accepte les conditions d\'utilisation et du traitement des données' : 'J’accepte que mes données soient transmises à l’agence pour le traitement de ma demande.'}

                </span>
            </label>

            <button
                className="property-contact-button"
                type="submit"
                disabled={status === 'loading'}
            >
                {status === 'loading'
                    ? 'Envoi...'
                    : 'Envoyer ma demande'}
            </button>

            {message ? (
                <p className={`form-message form-message--${status}`}>
                    {message}
                </p>
            ) : null}
        </form>
    );
}





//
// export function PropertyContactForm({ domain, bienId }: Props) {
//     const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
//     const [message, setMessage] = useState<string | null>(null);
//
//     const site = useSiteConfig();
//
//     async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//         event.preventDefault();
//
//         const form = event.currentTarget;
//         const formData = new FormData(form);
//
//         setStatus('loading');
//         setMessage(null);
//
//         // const payload = {
//         //     domain,
//         //     bien_id: bienId || null,
//         //     civilite: String(formData.get('civilite') || ''),
//         //     firstname: String(formData.get('firstname') || ''),
//         //     lastname: String(formData.get('lastname') || ''),
//         //     email: String(formData.get('email') || ''),
//         //     phone: String(formData.get('phone') || ''),
//         //     message: String(formData.get('message') || ''),
//         //     gdpr_accepted: formData.get('gdpr_accepted') === 'on',
//         //     intent: 'contact_agent',
//         //     page_url: window.location.href,
//         // };
//         const payload: Record<string, unknown> = {
//             domain,
//             civilite: String(formData.get('civilite') || ''),
//             firstname: String(formData.get('firstname') || ''),
//             lastname: String(formData.get('lastname') || ''),
//             email: String(formData.get('email') || ''),
//             phone: String(formData.get('phone') || ''),
//             message: String(formData.get('message') || ''),
//             gdpr_accepted: formData.get('gdpr_accepted') === 'on',
//             intent: bienId ? 'contact_agent' : 'question',
//             page_url: window.location.href,
//         };
//
//         if (bienId) {
//             payload.bien_id = bienId;
//         }
//         const res = await fetch('/api/demandes', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload),
//         });
//
//         const json = await res.json().catch(() => null);
//         // console.log('demande response', res.status, json);
//         if (!res.ok || !json?.success) {
//             setStatus('error');
//
//             const errors = json?.errors
//                 ? Object.values(json.errors).join(' ')
//                 : null;
//
//             setMessage(errors || json?.message || 'Impossible d’envoyer la demande.');
//             return;
//         }
//
//         setStatus('success');
//         setMessage('Votre demande a bien été envoyée.');
//         form.reset();
//     }
//
//     return (
//         <form className="property-contact-form" onSubmit={handleSubmit}>
//             {/*<h3>Demander des informations</h3>*/}
//
//             {site.template_key !== 'template_2' ? (<label>Coordonnées de contact</label>) : null }
//
//             {site.template_key === 'template_2' ? (
//                 <div className="form-field">
//                     <label>Civilité</label>
//                     <div className="civilite-radios">
//                         <label>
//                             <input
//                                 type="radio"
//                                 name="civilite"
//                                 value="1"
//                                 required
//                             />
//                             Monsieur
//                         </label>
//
//                         <label>
//                             <input
//                                 type="radio"
//                                 name="civilite"
//                                 value="2"
//                             />
//                             Madame
//                         </label>
//
//                         <label>
//                             <input
//                                 type="radio"
//                                 name="civilite"
//                                 value="3"
//                             />
//                             Société
//                         </label>
//
//                         <label>
//                             <input
//                                 type="radio"
//                                 name="civilite"
//                                 value="4"
//                             />
//                             Famille
//                         </label>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="form-field">
//                     <select name="civilite" required>
//                         <option value="">Sélectionner...</option>
//                         <option value="1">Monsieur</option>
//                         <option value="2">Madame</option>
//                         <option value="3">Société</option>
//                         <option value="4">Famille</option>
//                     </select>
//                 </div>
//             )}
//
//
//             <div className="form-field">
//                 {/*<label>Civilité</label>*/}
//                 <select name="civilite" required>
//                     <option value="">Sélectionner...</option>
//                     <option value="1">Monsieur</option>
//                     <option value="2">Madame</option>
//                     <option value="3">Société</option>
//                     <option value="4">Famille</option>
//                 </select>
//             </div>
//             <div className="form-grid">
//
//                 <div className="form-field">
//                     {/*<label>Prénom</label>*/}
//                     <input name="firstname" placeholder="Prénom" type="text" required/>
//                 </div>
//
//                 <div className="form-field">
//                     {/*<label>Nom</label>*/}
//                     <input name="lastname" placeholder="Nom" type="text" required/>
//                 </div>
//             </div>
//
//             <div className="form-field">
//                 {/*<label>Email</label>*/}
//                 <input name="email" placeholder="Email" type="email" required/>
//             </div>
//
//             <div className="form-field">
//                 {/*<label>Téléphone</label>*/}
//                 <input name="phone" placeholder="Téléphone" type="tel" required/>
//             </div>
//             <div className="space-form">
//
//             </div>
//             <div className="form-field">
//                 <label>Message</label>
//                 <textarea
//                     name="message"
//                     placeholder="Message"
//                     rows={5}
//                     defaultValue="Bonjour, "
//                 />
//             </div>
//
//             <label className="form-checkbox">
//                 <input name="gdpr_accepted" type="checkbox" required/>
//                 <span>J’accepte que mes données soient transmises à l’agence pour le traitement de ma demande.</span>
//             </label>
//
//             <button className="property-contact-button" type="submit" disabled={status === 'loading'}>
//                 {status === 'loading' ? 'Envoi...' : 'Envoyer ma demande'}
//             </button>
//
//             {message ? (
//                 <p className={`form-message form-message--${status}`}>
//                     {message}
//                 </p>
//             ) : null}
//         </form>
//     );
// }