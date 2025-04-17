'use client';

import React from 'react';

interface catMenuProps {
    categories: Category[];
    selectedTopCatId: number | null;
    setSelectedTopCatId: (id: number) => void;
    selectedChildCatId: number | null;
    setSelectedChildCatId: (id: number | null) => void;
    expandedChildCats: number[];
    setExpandedChildCats: (ids: number[]) => void;
}

const CategoriesMenu: React.FC<catMenuProps> = ({
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

    const renderNestedCategories = (categories: Category[], level = 1) => (
        <div style={{ marginLeft: level * 20 }}>
            {categories.map(child => (
                <div key={child.id}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            onClick={() => handleChildTabClick(child.id)}
                            style={{
                                padding: '10px',
                                background: child.id === selectedChildCatId ? '#ddd' : '#fff',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                flex: 1,
                            }}
                        >
                            {child.name}
                        </button>
                        {(child.children ?? []).length > 0 && (
                            <button onClick={() => toggleExpandChild(child.id)} style={{ marginLeft: 4 }}>
                                {expandedChildCats.includes(child.id) ? '-' : '+'}
                            </button>
                        )}
                    </div>
                    {expandedChildCats.includes(child.id) && child.children && (
                        renderNestedCategories(child.children, level + 1)
                    )}
                </div>
            ))}
        </div>
    );

    const selectedTopCategory = categories.find(cat => cat.id === selectedTopCatId);
    const childCategories = selectedTopCategory?.children || [];

    return (
        <div>
            <select
                value={selectedTopCatId ?? ''}
                onChange={e => {
                    const id = parseInt(e.target.value);
                    setSelectedTopCatId(id);
                    setSelectedChildCatId(null);
                    setExpandedChildCats([]);
                }}
            >
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <div style={{ marginTop: '1rem' }}>
                {renderNestedCategories(childCategories)}
            </div>
        </div>
    );
};

export default CategoriesMenu;
