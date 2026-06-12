import type { CasaqBloc } from '@/lib/casaq';
import { blockData, siteAssetUrl } from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
};

type GalleryImage = {
    image?: string;
    alt?: string;
};

type Data = {
    titre?: string;
    texte?: string;
    images?: GalleryImage[];
};

export function ImageGalleryBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);
    const images = Array.isArray(data.images) ? data.images : [];

    return (
        <section className={`section image-gallery image-gallery--${bloc.variant || 'grid'}`}>
            <div className="container">
                <div className="section-heading">
                    <h2>{data.titre || 'Galerie'}</h2>
                    {data.texte ? <p>{data.texte}</p> : null}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {images.map((item, index) => {
                        const image = siteAssetUrl(item.image);

                        return image ? (
                            <img
                                key={index}
                                src={image}
                                alt={item.alt || ''}
                                style={{ width: '100%', borderRadius: 12 }}
                            />
                        ) : null;
                    })}
                </div>
            </div>
        </section>
    );
}