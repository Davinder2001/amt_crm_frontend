'use client';

import React from 'react';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

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
        <div style={{ marginLeft: level * 5 }}>
            {categories.map(child => (
                <>
                    <div key={child.id} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', background: child.id === selectedChildCatId ? '#009693' : '#fff', color: child.id === selectedChildCatId ? '#fff' : '#000' }}>
                        <button
                            onClick={() => handleChildTabClick(child.id)}
                            style={{
                                padding: '10px',
                                background: child.id === selectedChildCatId ? '#009693' : '#fff',
                                color: child.id === selectedChildCatId ? '#fff' : '#000',
                                border: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                flex: 1,
                            }}
                        >
                            {child.name}
                        </button>
                        {(child.children ?? []).length > 0 && (
                            <span onClick={() => toggleExpandChild(child.id)} style={{ margin: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}}>
                                {expandedChildCats.includes(child.id) ? <FaMinusCircle/> : <FaPlusCircle/>}
                            </span>
                        )}
                    </div>
                    {expandedChildCats.includes(child.id) && child.children && (
                        renderNestedCategories(child.children, level + 1)
                    )}
                </>
            ))}
        </div>
    );

    const selectedTopCategory = categories.find(cat => cat.id === selectedTopCatId);
    const childCategories = selectedTopCategory?.children || [];

    return (
        <div style={{ backgroundColor: '#fff', flex: 1 }}>
            <select
                value={selectedTopCatId ?? ''}
                onChange={e => {
                    const id = parseInt(e.target.value);
                    setSelectedTopCatId(id);
                    setSelectedChildCatId(null);
                    setExpandedChildCats([]);
                }}
                style={{ width: '100%' }}
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
