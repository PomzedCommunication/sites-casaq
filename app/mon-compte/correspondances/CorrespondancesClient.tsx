'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AccountShell } from '@/components/site/account/AccountShell';
import { BienCard } from '@/components/site/listings/BienCard';
import {
    buildUrlWithPreviewDomain,
    getContactCorrespondancesClient,
    getCurrentDomainFromBrowser,
    type ContactCorrespondanceItem,
    type ContactCorrespondanceMeta,
} from '@/lib/contact-auth-client';

type Props = {
    previewDomain?: string | null;
};

const emptyMeta: ContactCorrespondanceMeta = {
    biens: 0,
    matches: 0,
    new: 0,
    price_changed: 0,
};

export function CorrespondancesClient({ previewDomain }: Props) {
    const [items, setItems] = useState<ContactCorrespondanceItem[]>([]);
    const [meta, setMeta] = useState<ContactCorrespondanceMeta>(emptyMeta);
    const [loading, setLoading] = useState(true);
    const [openIds, setOpenIds] = useState<number[]>([]);

    useEffect(() => {
        async function loadCorrespondances() {
            const domain = getCurrentDomainFromBrowser();
            const result = await getContactCorrespondancesClient(domain);

            if (!result.success) {
                window.location.href = buildUrlWithPreviewDomain('/login', previewDomain);
                return;
            }

            setItems(result.items);
            setMeta(result.meta);
            setLoading(false);
        }

        loadCorrespondances();
    }, [previewDomain]);

    function toggleOpen(bienId: number) {
        setOpenIds((current) => {
            if (current.includes(bienId)) {
                return current.filter((id) => id !== bienId);
            }

            return [...current, bienId];
        });
    }

    return (
        <AccountShell previewDomain={previewDomain} active="correspondances">
            <div className="account-heading">
                <div>
                    <p className="account-kicker">Mon espace</p>
                    <h1>Correspondances</h1>
                </div>
            </div>

            {loading ? (
                <div className="account-panel">
                    <p>Chargement...</p>
                </div>
            ) : (
                <>
                    {/*<div className="account-stats-grid">*/}
                    {/*    <div className="account-stat-card">*/}
                    {/*        <strong>{meta.biens}</strong>*/}
                    {/*        <span>Biens matchés</span>*/}
                    {/*    </div>*/}

                    {/*    <div className="account-stat-card">*/}
                    {/*        <strong>{meta.matches}</strong>*/}
                    {/*        <span>Correspondances</span>*/}
                    {/*    </div>*/}

                    {/*    <div className="account-stat-card">*/}
                    {/*        <strong>{meta.new}</strong>*/}
                    {/*        <span>Nouveaux biens</span>*/}
                    {/*    </div>*/}

                    {/*    <div className="account-stat-card">*/}
                    {/*        <strong>{meta.price_changed}</strong>*/}
                    {/*        <span>Prix modifiés</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {items.length === 0 ? (
                        <div className="account-panel">
                            <h2 className='h3'>Aucune correspondance pour le moment</h2>
                            <p>
                                Créez ou ajustez vos critères de recherche. Les biens correspondants apparaîtront ici
                                après calcul.
                            </p>

                            <Link
                                href={buildUrlWithPreviewDomain('/mon-compte/criteres', previewDomain)}
                                className="account-button-link site-btn"
                            >
                                Gérer mes critères
                            </Link>
                        </div>
                    ) : (
                        <div className="account-correspondance-list">
                            {items.map((item) => {
                                const bienId = item.bien.id;
                                const isOpen = openIds.includes(bienId);

                                return (
                                    <article key={bienId} className="account-correspondance-card">
                                        <div className="account-correspondance-badges site-btn btn-sm">
                                            <span>{item.best_score}%</span>

                                            {item.new ? <span>Nouveau</span> : null}
                                            {item.price_changed ? <span>Prix modifié</span> : null}
                                        </div>

                                        <BienCard
                                            bien={item.bien}
                                            previewDomain={previewDomain || undefined}
                                        />

                                        {/*<div className="account-correspondance-footer">*/}
                                        {/*    <div>*/}
                                        {/*        <strong>{item.matches.length}</strong>{' '}*/}
                                        {/*        recherche{item.matches.length > 1 ? 's' : ''} correspondante*/}
                                        {/*    </div>*/}

                                        {/*    <button type="button" onClick={() => toggleOpen(bienId)}>*/}
                                        {/*        {isOpen ? 'Masquer le détail' : 'Voir le détail'}*/}
                                        {/*    </button>*/}
                                        {/*</div>*/}

                                        {/*{isOpen ? (*/}
                                        {/*    <div className="account-correspondance-detail">*/}
                                        {/*        {item.matches.map((match) => (*/}
                                        {/*            <div key={match.id} className="account-correspondance-match">*/}
                                        {/*                <div>*/}
                                        {/*                    <div className="account-correspondance-match-title">*/}
                                        {/*                        {match.search.name}*/}
                                        {/*                    </div>*/}

                                        {/*                    {match.search.summary ? (*/}
                                        {/*                        <p>{match.search.summary}</p>*/}
                                        {/*                    ) : null}*/}

                                        {/*                    {match.reasons.length > 0 ? (*/}
                                        {/*                        <div className="account-correspondance-reasons">*/}
                                        {/*                            {match.reasons.slice(0, 6).map((reason) => (*/}
                                        {/*                                <span key={reason}>{reason}</span>*/}
                                        {/*                            ))}*/}
                                        {/*                        </div>*/}
                                        {/*                    ) : null}*/}
                                        {/*                </div>*/}

                                        {/*                <strong>{match.score}%</strong>*/}
                                        {/*            </div>*/}
                                        {/*        ))}*/}
                                        {/*    </div>*/}
                                        {/*) : null}*/}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </AccountShell>
    );
}