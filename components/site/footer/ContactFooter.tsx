import { ReactNode } from 'react';

type Contact = {
    title?: string;
};

type Props = {
    contact: Contact;
    agencyName: string;
    contactAdresse?: string | null;
    contactTelephone?: string | null;
    contactTelephoneFixe?: string | null;
    contactEmail?: string | null;
    splitLines: (value: string) => string[];
    cleanPhone: (value: string) => string;
    className?: string;

};

export function ContactFooter({
                                  contact,
                                  agencyName,
                                  contactAdresse,
                                  contactTelephone,
                                  contactTelephoneFixe,
                                  contactEmail,
                                  splitLines,
                                  cleanPhone,
                                  className = '',
                              }: Props) {
    return (
        <div className={`site-footer__column ${className}`}>
            <h3>{contact.title || agencyName}</h3>

            <div className="site-footer__contact">
                {contact.title && (
                    <strong>{agencyName}</strong>
                )}

                {contactAdresse ? (
                    <div className="site-footer__address">
                        {splitLines(contactAdresse).map((line, index) => (
                            <span key={`${line}-${index}`}>
                                {line}
                            </span>
                        ))}
                    </div>
                ) : null}

                {contactTelephoneFixe ? (
                    <a href={`tel:${cleanPhone(contactTelephoneFixe)}`}>
                        {contactTelephoneFixe}
                    </a>
                ) : null}

                {contactTelephone ? (
                    <a href={`tel:${cleanPhone(contactTelephone)}`}>
                        {contactTelephone}
                    </a>
                ) : null}

                {contactEmail ? (
                    <a href={`mailto:${contactEmail}`}>
                        {contactEmail}
                    </a>
                ) : null}
            </div>
        </div>
    );
}