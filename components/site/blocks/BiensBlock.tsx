import type { CasaqBiensMeta, CasaqBien, CasaqBloc } from '@/lib/casaq';
import { BiensGrid } from '@/components/site/listings/BiensGrid';

type Props = {
    bloc: CasaqBloc;
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    previewDomain?: string;
};

export function BiensBlock({ bloc, biens, previewDomain }: Props) {
    const data = bloc.data || {};

    return (
        <section className="section">
            <h2>{String(data.titre || 'Nos biens')}</h2>
            <BiensGrid biens={biens} previewDomain={previewDomain} />
        </section>
    );
}