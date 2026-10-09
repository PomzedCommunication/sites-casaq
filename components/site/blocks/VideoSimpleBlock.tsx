import Image from 'next/image';
import type { CasaqBloc } from '@/lib/casaq';
import {blockData, siteAssetUrl} from '@/lib/site-blocks';

type Props = {
    bloc: CasaqBloc;
};

type Data = {
    video?: string;
};

export function VideoSimpleBlock({ bloc }: Props) {
    const data = blockData<Data>(bloc);
    const video = siteAssetUrl(data.video);
    // console.log( 'video', bloc);


    if (!data.video) {
        return null;
    }

    return (
        <section className="section video-simple">
            <div className="container">
                    <video
                        src={video}
                        className="video-simple__video"
                        // controls
                        playsInline
                        autoPlay
                        muted
                    />
            </div>
        </section>
    );

    // if (!data.image) {
    //     return null;
    // }
    //
    // return (
    //     <section className={`section pd-l-r image-simple image-simple--${data.variant || 'default'}`}>
    //         <div className="container">
    //             <figure className="image-simple__figure">
    //                 <Image
    //                     src={data.image}
    //                     alt={data.legende || ''}
    //                     width={2500}
    //                     height={2000}
    //                     className="image-simple__image"
    //                 />
    //
    //                 {data.legende ? (
    //                     <figcaption className="image-simple__caption">
    //                         {data.legende}
    //                     </figcaption>
    //                 ) : null}
    //             </figure>
    //         </div>
    //     </section>
    // );
}