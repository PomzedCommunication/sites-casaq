'use client';

import { useEffect } from 'react';
import Image from 'next/image';

type GalleryImage = {
    src: string;
    alt?: string | null;
};

type Props = {
    images: GalleryImage[];
    title: string;
    initialIndex?: number;
    onClose: () => void;
};

export function PropertyGalleryLightbox({
                                            images,
                                            title,
                                            onClose,
                                        }: Props) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!images.length) {
        return null;
    }

    return (
        <div
            className="property-gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Galerie photos"
        >
            <button
                type="button"
                className="property-gallery-lightbox__close"
                onClick={onClose}
                aria-label="Fermer la galerie"
            >
                <span />
                <span />
            </button>

            <div className="property-gallery-lightbox__grid">
                {images.map((image, index) => (
                    <div
                        key={`${image.src}-${index}`}
                        className="property-gallery-lightbox__item"
                    >
                        <Image
                            src={image.src}
                            alt={
                                image.alt ||
                                `${title} - photo ${index + 1}`
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={95}
                            className="property-gallery-lightbox__image"
                        />
                    </div>
                ))}
            </div>

            <div className="property-gallery-lightbox__counter">
                {images.length} images
            </div>
        </div>
    );
}



// 'use client';
//
// import { useEffect } from 'react';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, A11y } from 'swiper/modules';
//
// import type { Swiper as SwiperType } from 'swiper';
//
// import 'swiper/css';
// import 'swiper/css/navigation';
//
// type GalleryImage = {
//     src: string;
//     alt?: string | null;
// };
//
// type Props = {
//     images: GalleryImage[];
//     title: string;
//     initialIndex?: number;
//     onClose: () => void;
// };
//
// export function PropertyGalleryLightbox({
//                                             images,
//                                             title,
//                                             initialIndex = 0,
//                                             onClose,
//                                         }: Props) {
//     useEffect(() => {
//         const handleKeyDown = (event: KeyboardEvent) => {
//             if (event.key === 'Escape') {
//                 onClose();
//             }
//         };
//
//         document.addEventListener('keydown', handleKeyDown);
//
//         document.body.style.overflow = 'hidden';
//
//         return () => {
//             document.removeEventListener('keydown', handleKeyDown);
//             document.body.style.overflow = '';
//         };
//     }, [onClose]);
//
//     if (!images.length) {
//         return null;
//     }
//
//     return (
//         <div
//             className="property-gallery-lightbox"
//             role="dialog"
//             aria-modal="true"
//             aria-label="Galerie photos"
//         >
//             <button
//                 type="button"
//                 className="property-gallery-lightbox__close"
//                 onClick={onClose}
//                 aria-label="Fermer la galerie"
//             >
//                 <span />
//                 <span />
//             </button>
//
//             <Swiper
//                 modules={[Navigation, A11y]}
//                 initialSlide={Math.min(initialIndex, images.length - 1)}
//                 slidesPerView={1}
//                 spaceBetween={0}
//                 navigation
//                 grabCursor
//                 allowTouchMove
//                 className="property-gallery-lightbox__swiper"
//             >
//                 {images.map((image, index) => (
//                     <SwiperSlide
//                         key={`${image.src}-${index}`}
//                         className="property-gallery-lightbox__slide"
//                     >
//                         <div className="property-gallery-lightbox__image-wrapper">
//                             <Image
//                                 src={image.src}
//                                 alt={
//                                     image.alt ||
//                                     `${title} - photo ${index + 1}`
//                                 }
//                                 fill
//                                 sizes="100vw"
//                                 quality={95}
//                                 className="property-gallery-lightbox__image"
//                             />
//                         </div>
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//
//             <div className="property-gallery-lightbox__counter">
//                 {images.length} images
//             </div>
//         </div>
//     );
// }