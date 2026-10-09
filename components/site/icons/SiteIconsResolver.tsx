import React from 'react';
import { SiteIconsProvider } from './SiteIconsProvider';

type Props = {
    icons?: Record<string, string | null | undefined>;
    children: React.ReactNode;
};

export async function SiteIconsResolver({
                                            icons,
                                            children,
                                        }: Props) {
    const resolvedIcons: Record<string, string> = {};

    if (icons) {
        await Promise.all(
            Object.entries(icons).map(async ([name, url]) => {
                if (!url) {
                    return;
                }

                try {
                    const response = await fetch(url, {
                        next: {
                            revalidate: 3600,
                        },
                    });

                    if (!response.ok) {
                        return;
                    }

                    const svg = await response.text();

                    if (svg.includes('<svg')) {
                        resolvedIcons[name] = svg;
                    }
                } catch (error) {
                    console.error(
                        `Impossible de charger l'icône "${name}"`,
                        error
                    );
                }
            })
        );
    }

    return (
        <SiteIconsProvider icons={resolvedIcons}>
            {children}
        </SiteIconsProvider>
    );
}