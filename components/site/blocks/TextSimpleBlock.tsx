import type { CasaqBloc } from '@/lib/casaq';
import { blockData } from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';

type Props = {
    bloc: CasaqBloc;
};

type Data = {
    titre?: string;
    contenu?: string;
    texte?: string;
    variant?: string;
};

export function TextSimpleBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);
    const content = data.contenu || data.texte;

    if (!data.titre && !content) {
        return null;
    }

    return (
        <section className="section pd-l-r content-block">
            <div className="container">
                {data.titre
                    ? bloc.variant === 'intro'
                        ? <h1>{data.titre}</h1>
                        : <h2>{data.titre}</h2>
                    : null
                }

                {content ? (
                    <div className="txt">
                        {parseSiteHtml(content)}
                    </div>
                ) : null}
            </div>
        </section>
    );
}

// export function TextSimpleBlock({ bloc }: Props) {
//     const data = blockData<Data>(bloc);
//     const content = data.contenu || data.texte;
//
//     console.log('bloc', bloc);
//
//     console.log('intro', data);
//
//
//     if (!data.titre && !content) {
//         return null;
//     }
//
//     return (
//         <section className="section pd-l-r content-block">
//             <div className="container">
//                 {data.titre ? <h2>{data.titre}</h2> : null}
//                 {content ? <div className='txt'>
//                     {parseSiteHtml(content)}
//                     </div> : null}
//             </div>
//         </section>
//     );
// }