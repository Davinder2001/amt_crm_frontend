'use client';
import React, { useState } from 'react';
import {
    useCreateCategoryMutation,
    useFetchCategoriesQuery,
} from '@/slices/store/storeApi';

const AddCategory = () => {
    const { data, isLoading } = useFetchCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

    const [name, setName] = useState('');
    const [selectedParents, setSelectedParents] = useState<number[]>([]);

    const handleCheckboxChange = (id: number) => {
        setSelectedParents(prev =>
            prev.includes(id)
                ? prev.filter(pid => pid !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!name.trim()) return alert("Please enter a category name.");

        try {
            if (selectedParents.length === 0) {
                // Create as a top-level category
                await createCategory({
                    name,
                    parent_id: null,
                });
            } else {
                // Create one category under each selected parent
                for (const parentId of selectedParents) {
                    await createCategory({
                        name,
                        parent_id: parentId,
                    });
                }
            }

            setName('');
            setSelectedParents([]);
            alert('Category created!');
        } catch (error) {
            console.error(error);
            alert('Error creating category');
        }
    };

    const renderCheckboxes = (categories: Category[], level = 0) => {
        return categories.map(cat => (
            <div key={cat.id} style={{ marginLeft: `${level * 20}px`, marginBottom: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={selectedParents.includes(cat.id)}
                        onChange={() => handleCheckboxChange(cat.id)}
                        style={{ width: 'auto' }}
                    />
                    {cat.name}
                </label>
                {cat.children && renderCheckboxes(cat.children, level + 1)}
            </div>
        ));
    };

    return (
        <div style={{ maxWidth: '500px', padding: '1rem' }}>
            {/* Category Name Input */}
            <div style={{ marginBottom: '1rem' }}>
                <label>Category Name</label>
                <input
                    type="text"
                    value={name}
                    required
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter category name"
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        marginTop: '4px'
                    }}
                />
            </div>

            {/* Parent Category Selection */}
            <div style={{ marginBottom: '1rem' }}>
                <label>Choose Parent Categories</label>
                <div style={{ marginTop: '8px' }}>
                    {isLoading && <p>Loading categories...</p>}
                    {!isLoading && data?.data && data.data.length > 0 ? (
                        renderCheckboxes(data.data)
                    ) : (
                        !isLoading && <p>No categories found.</p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="button"
                onClick={handleSubmit}
                disabled={isCreating}
                style={{
                    padding: '10px 16px',
                    backgroundColor: '#009693',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}
            >
                {isCreating ? 'Creating...' : 'Create Category'}
            </button>
        </div>
    );
};

export default AddCategory;
