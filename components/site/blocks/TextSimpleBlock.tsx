import type { CasaqBloc } from '@/lib/casaq';
import { blockData } from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
};

type Data = {
    titre?: string;
    contenu?: string;
    texte?: string;
};

export function TextSimpleBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);
    const content = data.contenu || data.texte;

    if (!data.titre && !content) {
        return null;
    }

    return (
        <section className="section content-block">
            <div className="container">
                {data.titre ? <h2>{data.titre}</h2> : null}
                {content ? <p>{content}</p> : null}
            </div>
        </section>
    );
}