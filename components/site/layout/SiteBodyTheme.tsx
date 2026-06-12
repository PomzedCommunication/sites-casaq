'use client';

import { useEffect } from 'react';
import type { CasaqSiteConfig } from '@/lib/casaq';

type Props = {
    config: CasaqSiteConfig['config'];
};

export function SiteBodyTheme({ config }: Props) {
    useEffect(() => {
        const body = document.body;

        body.style.setProperty('--site-background', config.couleur_fond || '#ffffff');
        body.style.setProperty('--site-grey', config.couleur_gris || '#f2f2f2');
        body.style.setProperty('--site-text', config.couleur_texte || '#111111');
        body.style.setProperty('--site-agency', config.couleur_agence || '#ff4b00');
        body.style.setProperty('--site-font', config.font || 'Inter, sans-serif');

        body.style.background = 'var(--site-background)';
        body.style.color = 'var(--site-text)';
        body.style.fontFamily = 'var(--site-font)';
    }, [config]);

    return null;
}