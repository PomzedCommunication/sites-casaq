'use client';

import Script from 'next/script';

type Props = {
    measurementId?: string | null;
};

function normalizeGoogleAnalyticsId(value?: string | null): string | null {
    const id = String(value || '').trim();

    if (!id) {
        return null;
    }

    // Accepte uniquement les Measurement IDs GA4 du type G-XXXXXXXX
    if (!/^G-[A-Z0-9]+$/i.test(id)) {
        return null;
    }

    return id.toUpperCase();
}

export function GoogleAnalytics({ measurementId }: Props) {
    const id = normalizeGoogleAnalyticsId(measurementId);

    if (!id) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
                strategy="afterInteractive"
            />

            <Script id={`google-analytics-${id}`} strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${id}', {
                        anonymize_ip: true
                    });
                `}
            </Script>
        </>
    );
}