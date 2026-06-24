import type { CasaqBloc } from '@/lib/casaq';
import {
    getSiteTeamMembers,
    getSiteTeamMembersByIds,
} from '@/lib/casaq';
import {blockData, siteAssetUrl, withPreviewUrl} from '@/lib/site-blocks';
import {parseSiteHtml} from "@/lib/site-html";
import Link from "next/link";

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
        <section className={`section team-members pd-l-r team-members--${bloc.data.variant || 'cards'}`}>
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Nos trois piliers'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>


                </div>

                {members.length ? (
                    <div className="team-members__grid">
                        {members.map((member) => {
                            const photo = siteAssetUrl(member.photo);

                            return (
                                <article
                                    key={member.id}
                                    className="team-members__card"
                                >
                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt={member.name || ''}
                                            className="team-members__photo"
                                        />
                                    ) : null}

                                    {member.job_title ? (
                                        <p className="team-members__job">
                                            {member.job_title}
                                        </p>
                                    ) : null}
                                    <h3 className="team-members__name">
                                        {member.name || 'Nom à compléter'}
                                    </h3>

                                    <div className="flex-email-phone">
                                        {member.email ? (
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="team-members__email"
                                            >
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M4.6 26C3.885 26 3.27313 25.7432 2.7644 25.2296C2.25567 24.7159 2.00087 24.0977 2 23.375V7.625C2 6.90312 2.2548 6.28537 2.7644 5.77175C3.274 5.25812 3.88587 5.00087 4.6 5H25.4C26.115 5 26.7273 5.25725 27.2369 5.77175C27.7465 6.28625 28.0009 6.904 28 7.625V23.375C28 24.0969 27.7456 24.7151 27.2369 25.2296C26.7282 25.7441 26.1159 26.0009 25.4 26H4.6ZM15 16.8125L25.4 10.25V7.625L15 14.1875L4.6 7.625V10.25L15 16.8125Z"
                                                        fill="white"/>
                                                </svg>

                                            </a>
                                        ) : null}

                                        {member.phone ? (
                                            <a
                                                href={`tel:${member.phone.replace(/\s+/g, '')}`}
                                                className="team-members__phone"
                                            >
                                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.22333 14.0883C10.9033 17.39 13.61 20.085 16.9117 21.7767L19.4783 19.21C19.7933 18.895 20.26 18.79 20.6683 18.93C21.975 19.3617 23.3867 19.595 24.8333 19.595C25.475 19.595 26 20.12 26 20.7617V24.8333C26 25.475 25.475 26 24.8333 26C13.8783 26 5 17.1217 5 6.16667C5 5.525 5.525 5 6.16667 5H10.25C10.8917 5 11.4167 5.525 11.4167 6.16667C11.4167 7.625 11.65 9.025 12.0817 10.3317C12.21 10.74 12.1167 11.195 11.79 11.5217L9.22333 14.0883Z" fill="white"/>
                                                </svg>

                                            </a>
                                        ) : null}
                                    </div>

                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="team-members__empty">
                        Aucun membre disponible.
                    </div>
                )}


            </div>
        </section>
    );
}