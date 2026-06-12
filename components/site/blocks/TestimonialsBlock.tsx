import type { CasaqBloc } from '@/lib/casaq';
import {
    getSiteTestimonials,
    getSiteTestimonialsByIds,
} from '@/lib/casaq';
import { blockData, siteAssetUrl } from '@/lib/site-blocks';

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

    return (
        <section className={`section testimonials testimonials--${bloc.data.variant || 'cards'}`}>
            <div className="container">
                <div className="section-heading">
                    <h2>{data.titre || 'Témoignages'}</h2>
                    {data.texte ? <p>{data.texte}</p> : null}
                </div>

                {testimonials.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {testimonials.map((testimonial) => {
                            const photo = siteAssetUrl(testimonial.photo);
                            const rating = Math.max(0, Math.min(5, Number(testimonial.rating || 0)));

                            return (
                                <article
                                    key={testimonial.id}
                                    style={{ background: '#fff', padding: 24, borderRadius: 12 }}
                                >
                                    {rating ? <p>{'★'.repeat(rating)}</p> : null}

                                    {testimonial.content ? (
                                        <p>{testimonial.content}</p>
                                    ) : null}

                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt={testimonial.author_name || ''}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : null}

                                    <strong>{testimonial.author_name || 'Auteur'}</strong>

                                    {testimonial.author_role ? (
                                        <p>{testimonial.author_role}</p>
                                    ) : null}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
                        Aucun témoignage disponible.
                    </div>
                )}
            </div>
        </section>
    );
}