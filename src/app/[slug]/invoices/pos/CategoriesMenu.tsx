'use client';

import React, { useMemo } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Checkbox from '@mui/material/Checkbox';

interface Category {
    id: number;
    name: string;
    children?: Category[];
}

interface CatMenuProps {
    categories: Category[];
    selectedTopCatId: number | null;
    setSelectedTopCatId: (id: number | null) => void;
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
    // Build a set of all child category ids to filter out from top-level categories
    const childCategoryIds = useMemo(() => {
        const ids = new Set<number>();
        const collectChildIds = (cats: Category[]) => {
            cats.forEach(cat => {
                if (cat.children && cat.children.length > 0) {
                    cat.children.forEach(child => {
                        ids.add(child.id);
                        if (child.children) collectChildIds(child.children);
                    });
                }
            });
        };
        collectChildIds(categories);
        return ids;
    }, [categories]);

    // Filter top-level categories to exclude any that are children of others
    const topLevelCategories = useMemo(() => {
        return categories.filter(cat => !childCategoryIds.has(cat.id));
    }, [categories, childCategoryIds]);

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

    const renderNestedCategories = (
        categories: Category[],
        isMobile: boolean = false
    ) => (
        <ul className="nested-wrapper">
            {categories.map(child => (
                <li key={child.id}>
                    <div
                        className={`category-tab ${child.id === selectedChildCatId ? 'selected' : ''}`}
                    >
                        {isMobile ? (
                            <label className="category-checkbox-label" htmlFor={`child-cat-${child.id}`}>
                                <Checkbox
                                    id={`child-cat-${child.id}`}
                                    checked={selectedChildCatId === child.id}
                                    onChange={() => handleChildTabClick(child.id)}  // important!
                                    size="small"
                                />
                                {child.name}
                            </label>
                        ) : (
                            <button
                                className="category-button"
                                onClick={() => handleChildTabClick(child.id)}
                            >
                                {child.name}
                            </button>
                        )}

                        {(child.children ?? []).length > 0 && (
                            <span
                                className="expand-icon"
                                onClick={() => toggleExpandChild(child.id)}
                            >
                                {expandedChildCats.includes(child.id) ? (
                                    <FaChevronUp />
                                ) : (
                                    <FaChevronDown />
                                )}
                            </span>
                        )}
                    </div>

                    {expandedChildCats.includes(child.id) && child.children && (
                        renderNestedCategories(child.children, isMobile)
                    )}
                </li>
            ))}
        </ul>
    );

    const selectedTopCategory = categories.find(cat => cat.id === selectedTopCatId);
    const childCategories = selectedTopCategory?.children || [];

    return (
        <>
            {/* Desktop View */}
            <div className="desktop-categories">
                <select
                    value={selectedTopCatId ?? ''}
                    onChange={e => {
                        const value = e.target.value;
                        const id = value === '' ? null : parseInt(value);
                        setSelectedTopCatId(id);
                        setSelectedChildCatId(null);
                        setExpandedChildCats([]);
                    }}
                    className="top-category-select"
                >
                    <option value="">All</option>
                    {topLevelCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {selectedTopCatId !== null && (
                    <div>{renderNestedCategories(childCategories)}</div>
                )}
            </div>

            {/* Mobile View */}
            <div className="mobile-categories">
                <ul className="top-category-list">
                    <li>
                        <div
                            className={`category-tab ${selectedTopCatId === null ? 'selected' : ''}`}
                        >
                            <label className="category-checkbox-label">
                                <Checkbox
                                    checked={selectedTopCatId === null}
                                    onChange={() => {
                                        setSelectedTopCatId(null);
                                        setSelectedChildCatId(null);
                                        setExpandedChildCats([]);
                                    }}
                                    size="small"
                                />
                                All
                            </label>
                        </div>
                    </li>
                    {topLevelCategories.map(cat => (
                        <li key={cat.id}>
                            <div
                                className={`category-tab ${cat.id === selectedTopCatId ? 'selected' : ''}`}
                            >
                                <label className="category-checkbox-label">
                                    <Checkbox
                                        checked={selectedTopCatId === cat.id}
                                        onChange={() => {
                                            setSelectedTopCatId(cat.id);
                                            setSelectedChildCatId(null);
                                            setExpandedChildCats([]);
                                        }}
                                        size="small"
                                    />
                                    {cat.name}
                                </label>

                                {(cat.children ?? []).length > 0 && (
                                    <span
                                        className="expand-icon"
                                        onClick={() => toggleExpandChild(cat.id)}
                                    >
                                        {expandedChildCats.includes(cat.id) ? (
                                            <FaChevronUp />
                                        ) : (
                                            <FaChevronDown />
                                        )}
                                    </span>
                                )}
                            </div>

                            {expandedChildCats.includes(cat.id) && cat.children && (
                                renderNestedCategories(cat.children, true)
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default CategoriesMenu;
