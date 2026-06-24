import type { CasaqBien } from '@/lib/casaq';
import { BienCard } from '@/components/site/listings/BienCard';

type Props = {
    biens: CasaqBien[];
    previewDomain?: string;
    onBienHover?: (bienId: number | null) => void;
};

export function BiensGrid({ biens, previewDomain, onBienHover }: Props) {
    if (biens.length === 0) {
        return <p>Aucun bien disponible pour le moment.</p>;
    }

    return (
        <div className="biens-grid">
            {biens.map((bien) => (
                <div
                    key={bien.id}
                    onMouseEnter={() => onBienHover?.(bien.id)}
                    onMouseLeave={() => onBienHover?.(null)}
                >
                    <BienCard
                        bien={bien}
                        previewDomain={previewDomain}
                    />
                </div>
            ))}
        </div>
    );
}