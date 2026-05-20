import type { CasaqBiensMeta, CasaqBien, CasaqPage, CasaqSiteConfig } from '@/lib/casaq';
import { HeroBlock } from '@/components/site/blocks/HeroBlock';
import { TextBlock } from '@/components/site/blocks/TextBlock';
import { ContactBlock } from '@/components/site/blocks/ContactBlock';
import { BiensBlock } from '@/components/site/blocks/BiensBlock';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    previewDomain?: string;
};

export function BlocksRenderer({ site, page, biens, meta, previewDomain }: Props) {
    return (
        <>
            {page.blocs.map((bloc, index) => {
                if (bloc.type === 'hero') {
                    return (
                        <HeroBlock
                            key={`${bloc.type}-${index}`}
                            site={site}
                            bloc={bloc}
                            previewDomain={previewDomain}
                        />
                    );
                }

                if (bloc.type === 'texte') {
                    return <TextBlock key={`${bloc.type}-${index}`} bloc={bloc} />;
                }

                if (bloc.type === 'contact') {
                    return (
                        <ContactBlock
                            key={`${bloc.type}-${index}`}
                            site={site}
                            bloc={bloc}
                        />
                    );
                }

                if (bloc.type === 'biens') {
                    return (
                        <BiensBlock
                            key={`${bloc.type}-${index}`}
                            bloc={bloc}
                            biens={biens}
                            meta={meta}
                            previewDomain={previewDomain}
                        />
                    );
                }

                return (
                    <section key={`${bloc.type}-${index}`} className="section">
                        <p>Bloc non géré : {bloc.type}</p>
                    </section>
                );
            })}
        </>
    );
}