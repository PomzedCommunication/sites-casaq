import type { CasaqBloc } from '@/lib/casaq';

type Props = {
    bloc: CasaqBloc;
};

export function TextBlock({ bloc }: Props) {
    const data = bloc.data || {};

    return (
        <section className="section content-block">
            <h1>{String(data.titre || '')}</h1>
            <p>{String(data.contenu || 'Contenu à compléter dans CasaQ.')}</p>
        </section>
    );
}