import type { CasaqBloc } from '@/lib/casaq';
import {
    getSiteTeamMembers,
    getSiteTeamMembersByIds,
} from '@/lib/casaq';
import { blockData, siteAssetUrl } from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
    currentDomain: string;
};

type Data = {
    titre?: string;
    texte?: string;
    mode?: 'all' | 'manual' | 'latest';
    member_ids?: Array<string | number>;
    nb?: number;
};

export async function TeamMembersBlock({ bloc, currentDomain }: Props) {
    const data = blockData<Data>(bloc);

    const mode = data.mode === 'latest' ? 'all' : data.mode || 'all';
    const limit = Number(data.nb || 24);
    const memberIds = Array.isArray(data.member_ids) ? data.member_ids : [];

    const members =
        mode === 'manual'
            ? await getSiteTeamMembersByIds(currentDomain, memberIds)
            : await getSiteTeamMembers(currentDomain, { limit });

    return (
        <section className={`section team-members team-members--${bloc.variant || 'cards'}`}>
            <div className="container">
                <div className="section-heading">
                    <h2>{data.titre || 'Notre équipe'}</h2>
                    {data.texte ? <p>{data.texte}</p> : null}
                </div>

                {members.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {members.map((member) => {
                            const photo = siteAssetUrl(member.photo);

                            return (
                                <article
                                    key={member.id}
                                    style={{ background: '#fff', padding: 24, borderRadius: 12 }}
                                >
                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt={member.name || ''}
                                            style={{
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : null}

                                    <h3>{member.name || 'Nom à compléter'}</h3>

                                    {member.job_title ? <p>{member.job_title}</p> : null}
                                    {member.bio ? <p>{member.bio}</p> : null}
                                    {member.email ? <p>{member.email}</p> : null}
                                    {member.phone ? <p>{member.phone}</p> : null}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
                        Aucun membre disponible.
                    </div>
                )}
            </div>
        </section>
    );
}