import Image from 'next/image';
import type { CasaqBloc } from '@/lib/casaq';
import { blockData } from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
};

type Data = {
    image?: string;
    legende?: string;
    variant?: string;
};

export function ImageSimpleBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);

    if (!data.image) {
        return null;
    }

    return (
        <section className={`section pd-l-r image-simple image-simple--${data.variant || 'default'}`}>
            <div className="container">
                <figure className="image-simple__figure">
                    <Image
                        src={data.image}
                        alt={data.legende || ''}
                        width={2500}
                        height={2000}
                        className="image-simple__image"
                    />

                    {data.legende ? (
                        <figcaption className="image-simple__caption">
                            {data.legende}
                        </figcaption>
                    ) : null}
                </figure>
            </div>
        </section>
    );
}