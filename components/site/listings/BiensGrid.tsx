import type { CasaqBien } from '@/lib/casaq';
import { BienCard } from '@/components/site/listings/BienCard';

type Props = {
    biens: CasaqBien[];
    previewDomain?: string;
};

export function BiensGrid({ biens, previewDomain }: Props) {
    if (biens.length === 0) {
        return <p>Aucun bien disponible pour le moment.</p>;
    }

    return (
        <div className="biens-grid">
            {biens.map((bien) => (
                <BienCard
                    key={bien.id}
                    bien={bien}
                    previewDomain={previewDomain}
                />
            ))}
        </div>
    );
}