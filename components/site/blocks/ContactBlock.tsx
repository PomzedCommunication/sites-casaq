import type {CasaqBloc, CasaqSiteConfig} from '@/lib/casaq';
import {parseSiteHtml} from '@/lib/site-html';
import {PropertyContactForm} from '@/components/site/properties/PropertyContactForm';

type Props = {
    site: CasaqSiteConfig;
    bloc: CasaqBloc;
};

type Data = {
    titre?: string;
    texte?: string;
};

export function ContactBlock({site, bloc}: Props) {
    const data = (bloc.data || {}) as Data;
    const footer = site.footer || {};
    const hours = footer.hours || {};
    const hourItems = Array.isArray(hours.items) ? hours.items : [];

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
                            <strong className="p" >{site.agence.nom}</strong>

                            {site.infos.adresse ? (
                                <div className="site__address">
                                    {splitLines(site.infos.adresse).map((line, index) => (
                                        <span className="p"  key={`${line}-${index}`}>
                                            {line}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                            {site.infos.telephone ? (
                                <a className="p" href={`tel:${cleanPhone(site.infos.telephone)}`}>
                                    {site.infos.telephone}
                                </a>
                            ) : null}

                            {site.infos.email ? (
                                <a className="p" href={`mailto:${site.infos.email}`}>
                                    {site.infos.email}
                                </a>
                            ) : null}
                        </div>
                        <div className="contact-block__horaires">
                            <strong  className="p" >Horaires</strong>

                            {hourItems.length ? (
                                <div className="site-footer__hours">
                                    {hourItems.map((item, index) => (
                                        <div key={index} className="site-footer__hour-row">
                                        <span className="site-footer__hour-day p">
                                            {item.day || item.label}
                                        </span>

                                            <span className="site-footer__hour-value p">
                                            {formatHourItem(item)}
                                        </span>
                                        </div>
                                    ))}
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

function formatHourItem(item: {
    value?: string;
    morning?: string;
    afternoon?: string;
    note?: string;
}) {
    if (item.value) {
        return item.value;
    }

    const parts = [item.morning, item.afternoon].filter(Boolean);

    if (parts.length) {
        return parts.join(' et ');
    }

    return item.note || '';
}