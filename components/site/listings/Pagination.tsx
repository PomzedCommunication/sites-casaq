import Link from 'next/link';
import type { CasaqBiensMeta } from '@/lib/casaq';

type Props = {
    meta: CasaqBiensMeta;
    currentPath: string;
    previewDomain?: string;
};

export function Pagination({ meta, currentPath, previewDomain }: Props) {
    if (meta.total_pages <= 1) {
        return null;
    }

    const pages = Array.from({ length: meta.total_pages }, (_, index) => index + 1);

    return (
        <nav className="pagination">
            {pages.map((page) => {
                const isCurrent = page === meta.page;

                if (isCurrent) {
                    return (
                        <span key={page} className="pagination__current">
              {page}
            </span>
                    );
                }

                return (
                    <Link
                        key={page}
                        href={buildPageUrl(currentPath, page, previewDomain)}
                        className="pagination__link"
                    >
                        {page}
                    </Link>
                );
            })}
        </nav>
    );
}

function buildPageUrl(path: string, page: number, previewDomain?: string): string {
    const params = new URLSearchParams();

    params.set('page', String(page));

    if (previewDomain) {
        params.set('site', previewDomain);
    }

    return `${path}?${params.toString()}`;
}