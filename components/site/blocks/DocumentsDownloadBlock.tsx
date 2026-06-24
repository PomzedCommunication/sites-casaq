import Link from 'next/link';
import type { CasaqBloc } from '@/lib/casaq';
import { blockData, siteAssetUrl } from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';

type Props = {
    bloc: CasaqBloc;
    previewDomain?: string;
};

type DocumentItem = {
    titre?: string;
    fichier?: string;
};

type Data = {
    titre?: string;
    texte?: string;
    items?: DocumentItem[];
};

export function DocumentsDownloadBlock({ bloc, previewDomain }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];

    if (!data.titre && !data.texte && !items.length) {
        return null;
    }

    return (
        <section id="docs" className="section documents-download pd-l-r">
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Coups de cœur'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>

                </div>
                {items.length ? (
                    <div className="documents-download__grid">
                        {items.map((item, index) => {
                            const href = siteAssetUrl(item.fichier);

                            if (!href) {
                                return null;
                            }

                            return (
                                <Link
                                    key={`${item.titre}-${index}`}
                                    href={href}
                                    className="documents-download__card white"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                >
                                    <svg className="icone-pdf" width="26" height="30" viewBox="0 0 26 30" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M5 16H4V14H5C5.26522 14 5.51957 14.1054 5.70711 14.2929C5.89464 14.4804 6 14.7348 6 15C6 15.2652 5.89464 15.5196 5.70711 15.7071C5.51957 15.8946 5.26522 16 5 16ZM12 20V14H13C13.2652 14 13.5196 14.1054 13.7071 14.2929C13.8946 14.4804 14 14.7348 14 15V19C14 19.2652 13.8946 19.5196 13.7071 19.7071C13.5196 19.8946 13.2652 20 13 20H12Z"
                                            fill="white"/>
                                        <path fillRule="evenodd" clipRule="evenodd"
                                              d="M0 3C0 2.20435 0.316071 1.44129 0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0L19.414 0L26 6.586V27C26 27.7956 25.6839 28.5587 25.1213 29.1213C24.5587 29.6839 23.7956 30 23 30H3C2.20435 30 1.44129 29.6839 0.87868 29.1213C0.316071 28.5587 0 27.7956 0 27V3ZM5 12H2V22H4V18H5C5.79565 18 6.55871 17.6839 7.12132 17.1213C7.68393 16.5587 8 15.7956 8 15C8 14.2044 7.68393 13.4413 7.12132 12.8787C6.55871 12.3161 5.79565 12 5 12ZM13 12H10V22H13C13.7956 22 14.5587 21.6839 15.1213 21.1213C15.6839 20.5587 16 19.7956 16 19V15C16 14.2044 15.6839 13.4413 15.1213 12.8787C14.5587 12.3161 13.7956 12 13 12ZM18 22V12H24V14H20V16H22V18H20V22H18Z"
                                              fill="white"/>
                                    </svg>

                                    <svg className="icone-down" width="30" height="30" viewBox="0 0 30 30" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.2969 21.5869C14.0781 21.5081 13.875 21.375 13.6875 21.1875L6.93749 14.4375C6.56249 14.0625 6.38249 13.625 6.3975 13.125C6.4125 12.625 6.59249 12.1875 6.93749 11.8125C7.31249 11.4375 7.75812 11.2425 8.27437 11.2275C8.79062 11.2125 9.23562 11.3919 9.60937 11.7656L13.125 15.2813V1.87501C13.125 1.34376 13.305 0.898756 13.665 0.540006C14.025 0.181257 14.47 0.00125646 15 6.46551e-06C15.53 -0.00124353 15.9756 0.178757 16.3369 0.540006C16.6981 0.901256 16.8775 1.34626 16.875 1.87501V15.2813L20.3906 11.7656C20.7656 11.3906 21.2112 11.2106 21.7275 11.2256C22.2437 11.2406 22.6887 11.4363 23.0625 11.8125C23.4062 12.1875 23.5862 12.625 23.6025 13.125C23.6187 13.625 23.4387 14.0625 23.0625 14.4375L16.3125 21.1875C16.125 21.375 15.9219 21.5081 15.7031 21.5869C15.4844 21.6656 15.25 21.7044 15 21.7031C14.75 21.7019 14.5156 21.6631 14.2969 21.5869ZM3.75 30C2.71875 30 1.83625 29.6331 1.1025 28.8994C0.368749 28.1656 0.00125 27.2825 0 26.25V22.5C0 21.9687 0.18 21.5237 0.54 21.165C0.899999 20.8062 1.345 20.6262 1.875 20.625C2.405 20.6237 2.85062 20.8037 3.21187 21.165C3.57312 21.5262 3.7525 21.9712 3.75 22.5V26.25H26.25V22.5C26.25 21.9687 26.43 21.5237 26.79 21.165C27.15 20.8062 27.595 20.6262 28.125 20.625C28.655 20.6237 29.1006 20.8037 29.4618 21.165C29.8231 21.5262 30.0025 21.9712 30 22.5V26.25C30 27.2812 29.6331 28.1644 28.8994 28.8994C28.1656 29.6344 27.2825 30.0012 26.25 30H3.75Z"
                                            fill="white"/>
                                    </svg>


                                    <span className="documents-download__title h3">
                                        {item.titre}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </section>
    );
}