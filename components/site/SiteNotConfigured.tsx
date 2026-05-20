type Props = {
    domain: string;
};

export function SiteNotConfigured({ domain }: Props) {
    return (
        <main className="site-not-configured">
            <div className="site-not-configured__card">
                <h1>Site non configuré</h1>
                <p>
                    Aucun site CasaQ actif n’est associé au domaine :
                </p>
                <code>{domain}</code>
                <p className="site-not-configured__hint">
                    Vérifiez que ce domaine est bien créé et actif dans CasaQ.
                </p>
            </div>
        </main>
    );
}