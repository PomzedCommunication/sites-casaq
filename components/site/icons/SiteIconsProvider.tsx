'use client';

import React, { createContext, useContext } from 'react';

type SiteIcons = Record<string, string | null | undefined>;

const SiteIconsContext = createContext<SiteIcons>({});

type SiteIconsProviderProps = {
    icons?: SiteIcons;
    children: React.ReactNode;
};

export function SiteIconsProvider({
                                      icons,
                                      children,
                                  }: SiteIconsProviderProps) {
    return (
        <SiteIconsContext.Provider value={icons ?? {}}>
            {children}
        </SiteIconsContext.Provider>
    );
}

export function useSiteIcons() {
    return useContext(SiteIconsContext);
}