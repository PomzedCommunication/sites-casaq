import type {
    CasaqBiensMeta,
    CasaqBien,
    CasaqPage,
    CasaqSiteConfig,
    CasaqPost,
    CasaqBloc,
} from '@/lib/casaq';
import { PartnersBlock } from '@/components/site/blocks/PartnersBlock';
import { HeroSearchBlock } from '@/components/site/blocks/HeroSearchBlock';
import { HeroSimpleBlock } from '@/components/site/blocks/HeroSimpleBlock';
import { TextSimpleBlock } from '@/components/site/blocks/TextSimpleBlock';
import { ContactBlock } from '@/components/site/blocks/ContactBlock';
import { BiensBlock } from '@/components/site/blocks/BiensBlock';
import { FeaturedBiensBlock } from '@/components/site/blocks/FeaturedBiensBlock';
import { PropertyCategoriesBlock } from '@/components/site/blocks/PropertyCategoriesBlock';
import { CtaBannerBlock } from '@/components/site/blocks/CtaBannerBlock';
import { StatsBlock } from '@/components/site/blocks/StatsBlock';
import { ServicesCardsBlock } from '@/components/site/blocks/ServicesCardsBlock';
import { ServicesSectionsBlock } from '@/components/site/blocks/ServicesSectionsBlock';
import { TeamMembersBlock } from '@/components/site/blocks/TeamMembersBlock';
import { ImageGalleryBlock } from '@/components/site/blocks/ImageGalleryBlock';
import { PillarsBlock } from '@/components/site/blocks/PillarsBlock';
import { TestimonialsBlock } from '@/components/site/blocks/TestimonialsBlock';
import { SocialPostsBlock } from '@/components/site/blocks/SocialPostsBlock';
import { AgencyNewsBlock } from '@/components/site/blocks/AgencyNewsBlock';
import { PlaceholderBlock } from '@/components/site/blocks/PlaceholderBlock';
import { ImageTextBlock } from '@/components/site/blocks/ImageTextBlock';
import { TimelineHistoryBlock } from '@/components/site/blocks/TimelineHistoryBlock';
import { ImageSimpleBlock } from '@/components/site/blocks/ImageSimpleBlock';
import { DocumentsDownloadBlock } from '@/components/site/blocks/DocumentsDownloadBlock';
import { LinksCardsBlock } from '@/components/site/blocks/LinksCardsBlock';

type Props = {
    site: CasaqSiteConfig;
    page: CasaqPage;
    biens: CasaqBien[];
    meta: CasaqBiensMeta;
    currentDomain: string;
    previewDomain?: string;
    currentPost?: CasaqPost | null;
    blocs?: CasaqBloc[];
};
export function BlocksRenderer({
                                   site,
                                   page,
                                   biens,
                                   meta,
                                   currentDomain,
                                   previewDomain,
                                   currentPost,
                                   blocs,
                               }: Props) {
    const blocsToRender = blocs || page.blocs || [];

    console.log('PAGE BLOCS', page.slug, page.blocs);
    console.log('PROP BLOCS', blocs);
    console.log('BLOCS RENDERED BEFORE FILTER', blocsToRender);
    console.log('BLOCS RENDERED AFTER FILTER', blocsToRender.filter((bloc) => bloc.actif !== false));
    return (
        <>
            {blocsToRender
                .filter((bloc) => isBlocActive(bloc))
                .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
                .map((bloc, index) => {
                    const key = `${bloc.type}-${index}`;

                switch (bloc.type) {
                    case 'hero_search':
                        return (
                            <HeroSearchBlock
                                key={key}
                                site={site}
                                bloc={bloc}
                                previewDomain={previewDomain}
                            />
                        );

                    case 'hero_simple':
                        return <HeroSimpleBlock key={key} site={site} bloc={bloc} />;

                    case 'text_simple':
                    case 'texte':
                        return <TextSimpleBlock key={key} bloc={bloc} />;

                    case 'contact_form':
                    case 'contact':
                        return <ContactBlock key={key} site={site} bloc={bloc} />;

                    case 'biens':
                    case 'biens_listing':
                        return (
                            <BiensBlock
                                key={key}
                                bloc={bloc}
                                biens={biens}
                                meta={meta}
                                previewDomain={previewDomain}
                            />
                        );
                    case 'image_text':
                        return (
                            <ImageTextBlock
                                key={key}
                                bloc={bloc}
                                previewDomain={previewDomain}
                            />
                        );
                    case 'featured_biens':
                        return (
                            <FeaturedBiensBlock
                                key={key}
                                bloc={bloc}
                                biens={biens}
                                currentDomain={currentDomain}
                                previewDomain={previewDomain}
                            />
                        );

                    case 'property_categories':
                        return (
                            <PropertyCategoriesBlock
                                key={key}
                                bloc={bloc}
                                currentDomain={currentDomain}
                                previewDomain={previewDomain}
                            />
                        );

                    case 'services_cards':
                        return (
                            <ServicesCardsBlock
                                key={key}
                                site={site}
                                bloc={bloc}
                                previewDomain={previewDomain}
                            />
                        );
                    case 'services_sections':
                        return <ServicesSectionsBlock key={key} bloc={bloc} previewDomain={previewDomain} />;

                    // case 'stats':
                    //     return <StatsBlock key={key} bloc={bloc} previewDomain={previewDomain} />;
                    // case 'stats':
                    //     return <StatsBlock key={key} bloc={bloc} />;
                    // case 'cta_banner':
                    //     return <CtaBannerBlock key={key} bloc={bloc} previewDomain={previewDomain} />;
                    case 'stats':
                        return <StatsBlock key={key} bloc={bloc} />;

                    case 'cta_banner':
                        return <CtaBannerBlock key={key} bloc={bloc} />;
                    case 'team_members':
                        return (
                            <TeamMembersBlock
                                key={key}
                                bloc={bloc}
                                currentDomain={currentDomain}
                            />
                        );
                    case 'image_gallery':
                        return <ImageGalleryBlock key={key} bloc={bloc} />;
                    case 'image_simple':
                        return <ImageSimpleBlock key={key} bloc={bloc} />;
                    case 'pillars':
                        return (
                            <PillarsBlock
                                key={key}
                                bloc={bloc}
                                previewDomain={previewDomain}
                            />
                        );
                    case 'testimonials':
                        return (
                            <TestimonialsBlock
                                key={key}
                                bloc={bloc}
                                currentDomain={currentDomain}
                            />
                        );
                    case 'timeline_history':
                        return <TimelineHistoryBlock key={key} bloc={bloc} />;
                    case 'partners':
                        return (
                            <PartnersBlock
                                key={key}
                                bloc={bloc}
                                currentDomain={currentDomain}
                            />
                        );
                    case 'social_posts':
                        return <SocialPostsBlock key={key} bloc={bloc} previewDomain={previewDomain} />;

                    case 'agency_news':
                    case 'news_listing':
                        return (
                            <AgencyNewsBlock
                                key={key}
                                bloc={bloc}
                                currentDomain={currentDomain}
                                previewDomain={previewDomain}
                            />
                        );
                    case 'documents_download':
                        return (
                            <DocumentsDownloadBlock
                                key={key}
                                bloc={bloc}
                                previewDomain={previewDomain}
                            />
                        );

                    case 'links_cards':
                    case 'liens':
                        return (
                            <LinksCardsBlock
                                key={key}
                                bloc={bloc}
                                previewDomain={previewDomain}
                            />
                        );

                    default:
                        return <PlaceholderBlock key={key} bloc={bloc} />;
                }
            })}
        </>
    );
}
function isBlocActive(bloc: CasaqBloc): boolean {
    const value = bloc.actif as unknown;

    if (value === false) return false;
    if (value === 0) return false;
    if (value === '0') return false;
    if (value === 'false') return false;
    if (value === 'off') return false;
    if (value === 'no') return false;
    if (value === null) return false;

    return true;
}