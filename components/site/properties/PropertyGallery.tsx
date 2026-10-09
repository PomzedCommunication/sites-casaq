'use client';

import { useState } from 'react';

import { PropertyAutoGallerySlider } from './PropertyAutoGallerySlider';
import { PropertyGalleryLightbox } from './PropertyGalleryLightbox';

type GalleryImage = {
    src: string;
    alt?: string | null;
};

type Props = {
    images: GalleryImage[];
    title: string;
};

export function PropertyGallery({
                                    images,
                                    title,
                                }: Props) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    return (
        <>
            <PropertyAutoGallerySlider
                images={images}
                title={title}
                onOpenGallery={() => setIsGalleryOpen(true)}
            />

            {isGalleryOpen && (
                <PropertyGalleryLightbox
                    images={images}
                    title={title}
                    onClose={() => setIsGalleryOpen(false)}
                />
            )}
        </>
    );
}