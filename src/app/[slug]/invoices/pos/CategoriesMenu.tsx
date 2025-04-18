'use client';

import React from 'react';
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';

interface Category {
    id: number;
    name: string;
    children?: Category[];
}

interface CatMenuProps {
    categories: Category[];
    selectedTopCatId: number | null;
    setSelectedTopCatId: (id: number) => void;
    selectedChildCatId: number | null;
    setSelectedChildCatId: (id: number | null) => void;
    expandedChildCats: number[];
    setExpandedChildCats: (ids: number[]) => void;
}

const CategoriesMenu: React.FC<CatMenuProps> = ({
    categories,
    selectedTopCatId,
    setSelectedTopCatId,
    selectedChildCatId,
    setSelectedChildCatId,
    expandedChildCats,
    setExpandedChildCats,
}) => {
    const handleChildTabClick = (id: number) => {
        setSelectedChildCatId(selectedChildCatId === id ? null : id);
    };

    const toggleExpandChild = (id: number) => {
        setExpandedChildCats(
            expandedChildCats.includes(id)
                ? expandedChildCats.filter(cid => cid !== id)
                : [...expandedChildCats, id]
        );
    };

    const renderNestedCategories = (categories: Category[]) => (
        <div className="nested-wrapper">
            {categories.map(child => (
                <div key={child.id}>
                    <div
                        className={`category-tab ${child.id === selectedChildCatId ? 'selected' : ''}`}
                    >
                        <button
                            className="category-button"
                            onClick={() => handleChildTabClick(child.id)}
                        >
                            {child.name}
                        </button>
                        {(child.children ?? []).length > 0 && (
                            <span
                                className="expand-icon"
                                onClick={() => toggleExpandChild(child.id)}
                            >
                                {expandedChildCats.includes(child.id) ? (
                                    <FaChevronCircleUp />
                                ) : (
                                    <FaChevronCircleDown />
                                )}
                            </span>
                        )}
                    </div>
                    {expandedChildCats.includes(child.id) && child.children && (
                        renderNestedCategories(child.children)
                    )}
                </div>
            ))}
        </div>
    );

    const selectedTopCategory = categories.find(cat => cat.id === selectedTopCatId);
    const childCategories = selectedTopCategory?.children || [];

    return (
        <div className="categories-menu">
            <select
                value={selectedTopCatId ?? ''}
                onChange={e => {
                    const id = parseInt(e.target.value);
                    setSelectedTopCatId(id);
                    setSelectedChildCatId(null);
                    setExpandedChildCats([]);
                }}
                className="top-category-select"
            >
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <div>{renderNestedCategories(childCategories)}</div>
        </div>
    );
};

export default CategoriesMenu;
