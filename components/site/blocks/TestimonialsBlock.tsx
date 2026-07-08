import type { CasaqBloc } from '@/lib/casaq';
import {
    getSiteTestimonials,
    getSiteTestimonialsByIds,
} from '@/lib/casaq';
import { blockData, siteAssetUrl } from '@/lib/site-blocks';
import { parseSiteHtml } from '@/lib/site-html';
import {
    TestimonialsSlider,
    type SerializedTestimonial,
} from '@/components/site/blocks/TestimonialsSlider';

type Props = {
    bloc: CasaqBloc;
    currentDomain: string;
};

type Data = {
    titre?: string;
    texte?: string;
    mode?: 'all' | 'manual' | 'category' | 'latest';
    testimonial_ids?: Array<string | number>;
    category_id?: string | number | null;
    nb?: number;
};

export async function TestimonialsBlock({ bloc, currentDomain }: Props) {
    const data = blockData<Data>(bloc);

    const mode = data.mode === 'latest' ? 'all' : data.mode || 'all';
    const limit = Number(data.nb || 6);
    const testimonialIds = Array.isArray(data.testimonial_ids)
        ? data.testimonial_ids
        : [];

    const testimonials =
        mode === 'manual'
            ? await getSiteTestimonialsByIds(currentDomain, testimonialIds)
            : await getSiteTestimonials(currentDomain, {
                limit,
                categoryId: mode === 'category' ? data.category_id : null,
            });

    const serializedTestimonials: SerializedTestimonial[] = testimonials.map((testimonial) => ({
        id: testimonial.id,
        content: testimonial.content || '',
        author_name: testimonial.author_name || '',
        author_role: testimonial.author_role || '',
        photo: siteAssetUrl(testimonial.photo) || null,
        rating: Number(testimonial.rating || 0),
    }));

    return (
        <section className={`section testimonials pd-l-r testimonials--${bloc.data.variant || 'cards'}`}>
            <div className="container">
                {data.titre ? (
                        <div className="section-heading">
                    <div>
                        <h2>{data.titre }</h2>

                        {data.texte ? (
                            <div className="txt">
                                {parseSiteHtml(data.texte)}
                            </div>
                        ) : null}
                    </div>
                </div>
                ) : null}

                {serializedTestimonials.length ? (
                    <TestimonialsSlider testimonials={serializedTestimonials} />
                ) : (
                    <div className="testimonials__empty">
                        {/*Aucun témoignage disponible.*/}
                    </div>
                )}
            </div>
        </section>
    );
}