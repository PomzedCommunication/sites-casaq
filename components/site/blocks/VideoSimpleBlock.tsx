'use client';

import { useRef, useState } from 'react';

import Image from 'next/image';
import type { CasaqBloc } from '@/lib/casaq';
import {blockData, siteAssetUrl} from '@/lib/site-blocks';
import {SiteIcon} from "@/components/site/icons/SiteIcon";

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

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);


    if (!data.video) {
        return null;
    }

    const toggleSound = () => {
        if (!videoRef.current) return;

        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    return (
        <section className="section video-simple">
            <div className="container">
                    <video
                        ref={videoRef}
                        src={video}
                        className="video-simple__video"
                        // controls
                        playsInline
                        autoPlay
                        muted
                        loop
                    />

                <button
                    type="button"
                    className="video-simple__sound"
                    onClick={toggleSound}
                    aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                    {isMuted ? (
                        <SiteIcon name="volumemute" />
                    ) : (
                        <SiteIcon name="volume" />
                    )}
                </button>
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