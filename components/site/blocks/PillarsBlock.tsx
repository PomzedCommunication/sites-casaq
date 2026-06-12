import type { CasaqBloc } from '@/lib/casaq';
import { blockData } from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
};

type Pillar = {
    icone?: string;
    titre?: string;
    texte?: string;
};

type Data = {
    titre?: string;
    texte?: string;
    items?: Pillar[];
};

export function PillarsBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);
    const items = Array.isArray(data.items) ? data.items : [];

    return (
        <section className={`section pillars pillars--${bloc.data.variant || 'three_columns'}`}>
            <div className="container">
                <div className="section-heading">
                    <h2>{data.titre || 'Nos valeurs'}</h2>
                    {data.texte ? <p>{data.texte}</p> : null}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {items.map((item, index) => (
                        <article key={index} style={{ background: '#fff', padding: 24, borderRadius: 12 }}>
                            <p><strong>Icône :</strong> {item.icone || '—'}</p>
                            <h3>{item.titre || 'Titre à compléter'}</h3>
                            {item.texte ? <p>{item.texte}</p> : null}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}