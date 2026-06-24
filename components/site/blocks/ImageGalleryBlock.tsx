import type { CasaqBloc } from '@/lib/casaq';
import { blockData, siteAssetUrl } from '@/lib/site-blocks';
import {parseSiteHtml} from "@/lib/site-html";
import Link from "next/link";

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
        <section className={`section image-gallery pd-l-r image-gallery--${bloc.data.variant || 'grid'}`}>
            <div className="container">
                <div className="section-heading section-heading--with-action">
                    <div>
                        <h2>{data.titre || 'Coups de cœur'}</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>


                </div>

                <div className="grid-galery">
                    {images.map((item, index) => {
                        const image = siteAssetUrl(item.image);

                        return image ? (
                            <img
                                key={index}
                                src={image}
                                alt={item.alt || ''}
                            />
                        ) : null;
                    })}
                </div>
            </div>
        </section>
    );
}