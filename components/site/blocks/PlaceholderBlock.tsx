import type { CasaqBloc } from '@/lib/casaq';

type Props = {
    bloc: CasaqBloc;
};

export function PlaceholderBlock({ bloc }: Props) {
    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    return (
        <section className="section">
            <div className="container">
                <p style={{ opacity: 0.6 }}>
                    Bloc non géré côté front : <code>{bloc.type}</code>
                </p>
            </div>
        </section>
    );
}