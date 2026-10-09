'use client';

import {
    createContext,
    useContext,
} from 'react';
import type {CasaqSiteConfig} from "@/lib/casaq";

const SiteConfigContext = createContext<CasaqSiteConfig | null>(null);

export function SiteConfigProvider({
                                       site,
                                       children,
                                   }: {
    site: CasaqSiteConfig;
    children: React.ReactNode;
}) {
    return (
        <SiteConfigContext.Provider value={site}>
            {children}
            </SiteConfigContext.Provider>
    );
}

export function useSiteConfig() {
    const site = useContext(SiteConfigContext);

    if (!site) {
        throw new Error(
            'useSiteConfig doit être utilisé à l’intérieur de SiteConfigProvider'
        );
    }

    return site;
}