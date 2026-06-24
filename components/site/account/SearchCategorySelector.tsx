'use client';

import type { ContactSearchCategoryGroup } from '@/lib/contact-auth-client';

type Props = {
    groups: ContactSearchCategoryGroup[];
    value: number[];
    onChange: (value: number[]) => void;
};

export function SearchCategorySelector({ groups, value, onChange }: Props) {
    function toggleCategory(id: number) {
        if (value.includes(id)) {
            onChange(value.filter((item) => item !== id));
            return;
        }

        onChange([...value, id]);
    }

    function toggleGroup(group: ContactSearchCategoryGroup) {
        const childIds = group.children.map((child) => child.id);
        const allSelected = childIds.every((id) => value.includes(id));

        if (allSelected) {
            onChange(value.filter((id) => !childIds.includes(id)));
            return;
        }

        onChange(Array.from(new Set([...value, ...childIds])));
    }

    if (groups.length === 0) {
        return (
            <div className="search-category-empty">
                Aucune catégorie disponible.
            </div>
        );
    }

    return (
        <div className="search-category-selector">

            <div className="search-category-grid">
                {groups.map((group) => {
                    const childIds = group.children.map((child) => child.id);
                    const selectedCount = childIds.filter((id) => value.includes(id)).length;

                    if (group.children.length === 0) {
                        return null;
                    }

                    return (
                        <div key={group.id} className="search-category-group">
                            <div className="search-category-group__head">
                                <div>
                                    <strong>{group.name}</strong>
                                    {selectedCount > 0 ? (
                                        <span>{selectedCount}</span>
                                    ) : null}
                                </div>

                                <button type="button" className="site-btn btn-sm" onClick={() => toggleGroup(group)}>
                                    {selectedCount === group.children.length ? 'Aucun' : 'Tout'}
                                </button>
                            </div>

                            <div className="search-category-options">
                                {group.children.map((child) => {
                                    const selected = value.includes(child.id);

                                    return (
                                        <button
                                            key={child.id}
                                            type="button"
                                            className={
                                                selected
                                                    ? 'site-btn btn-sm search-category-option search-category-option--selected'
                                                    : 'site-btn btn-sm search-category-option'
                                            }
                                            onClick={() => toggleCategory(child.id)}
                                        >
                                            {child.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}