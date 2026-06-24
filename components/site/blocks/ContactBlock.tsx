import type { CasaqBloc, CasaqSiteConfig } from '@/lib/casaq';
import { parseSiteHtml } from '@/lib/site-html';
import { PropertyContactForm } from '@/components/site/properties/PropertyContactForm';

type Props = {
    site: CasaqSiteConfig;
    bloc: CasaqBloc;
};

type Data = {
    titre?: string;
    texte?: string;
};

type ContactHourItem = {
    label?: string;
    day?: string;
    weekday?: number | string | null;
    closed?: boolean;
    slots?: Array<{
        start?: string;
        end?: string;
    }>;
    value?: string;
    note?: string;
};

export function ContactBlock({ site, bloc }: Props) {
    const data = (bloc.data || {}) as Data;

    const footer = site.footer || {};
    const contact = footer.contact || {};
    const hours = footer.hours || {};
    const hourItems = Array.isArray(hours.items) ? hours.items : [];

    const contactAdresse = contact.adresse || site.infos.adresse;
    const contactTelephone = contact.telephone || site.infos.telephone;
    const contactEmail = contact.email || site.infos.email;

    return (
        <section className="section contact-block pd-l-r">
            <div className="container">
                <div className="contact-block__grid">
                    <div className="contact-block__content">
                        <h1>{data.titre || 'Contactez-nous'}</h1>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}

                        <div className="contact-block__infos">
                            <strong className="p">{site.agence.nom}</strong>

                            {contactAdresse ? (
                                <div className="site__address">
                                    {splitLines(contactAdresse).map((line, index) => (
                                        <span className="p" key={`${line}-${index}`}>
                                            {line}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

                            {contactTelephone ? (
                                <a className="p" href={`tel:${cleanPhone(contactTelephone)}`}>
                                    {contactTelephone}
                                </a>
                            ) : null}

                            {contactEmail ? (
                                <a className="p" href={`mailto:${contactEmail}`}>
                                    {contactEmail}
                                </a>
                            ) : null}
                        </div>

                        <div className="contact-block__horaires">
                            <strong className="p">
                                {hours.title || 'Horaires'}
                            </strong>

                            {hourItems.length ? (
                                <div className="site-footer__hours">
                                    {hourItems.map((item, index) => {
                                        const isToday = isTodayHourItem(item);

                                        return (
                                            <div
                                                key={index}
                                                className={`site-footer__hour-row ${isToday ? 'is-today' : ''}`}
                                            >
                                                <span className="site-footer__hour-day p">
                                                    {item.label || item.day}
                                                </span>

                                                <span className="site-footer__hour-value p">
                                                    {formatHourItem(item)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="contact-block__form">
                        <PropertyContactForm
                            domain={site.domain}
                            bienId={null}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function cleanPhone(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
}

function splitLines(value?: string | null): string[] {
    return String(value || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function formatHourItem(item: ContactHourItem) {
    if (item.closed) {
        return item.note || 'Fermé';
    }

    const slots = Array.isArray(item.slots)
        ? item.slots.filter((slot) => slot.start && slot.end)
        : [];

    if (slots.length) {
        return slots
            .map((slot) => `${slot.start} – ${slot.end}`)
            .join(' et ');
    }

    if (item.value) {
        return item.value;
    }

    return item.note || '';
}

function isTodayHourItem(item: ContactHourItem): boolean {
    const now = new Date();
    const weekday = now.getDay() === 0 ? 7 : now.getDay();

    return Number(item.weekday) === weekday;
}