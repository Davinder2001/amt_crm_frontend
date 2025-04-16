'use client';
import React, { useState } from 'react';
import {
    useCreateCategoryMutation,
    useFetchCategoriesQuery,
} from '@/slices/store/storeApi';

const AddCategory = () => {
    const { data, isLoading } = useFetchCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

    // Separate state for list selection and parent selection
    const [selectedListCategories, setSelectedListCategories] = useState<number[]>([]);
    const [selectedParents, setSelectedParents] = useState<number[]>([]);
    const [name, setName] = useState('');

    // Handler for checkbox selection in the main list
    const handleListCheckboxChange = (id: number) => {
        setSelectedListCategories(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    //  Handler for parent selection in the form
    const handleParentCheckboxChange = (id: number) => {
        setSelectedParents(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!name.trim()) return alert("Please enter a category name.");

        try {
            if (selectedParents.length === 0) {
                await createCategory({ name, parent_id: null });
            } else {
                for (const parentId of selectedParents) {
                    await createCategory({ name, parent_id: parentId });
                }
            }

            // Reset
            setName('');
            setSelectedParents([]);
            setIsCreatingNewCategory(false);
            alert('Category created!');
        } catch (error) {
            console.error(error);
            alert('Error creating category');
        }
    };

    //  Recursive render for list view (full category tree)
    const renderCategoriesWithChildren = (categories: Category[], level = 0) => {
        return categories.map(cat => (
            <div key={cat.id} style={{ marginLeft: `${level * 20}px`, marginBottom: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={selectedListCategories.includes(cat.id)}
                        onChange={() => handleListCheckboxChange(cat.id)}
                        style={{ width: 'auto' }}
                    />
                    {cat.name}
                </label>
                {cat.children && cat.children.length > 0 && (
                    renderCategoriesWithChildren(cat.children, level + 1)
                )}
            </div>
        ));
    };

    //  Only render top-level categories as parents (for create form)
    const renderParentCategories = (categories: Category[]) => {
        return categories
            .filter(cat => cat.parent_id === null)
            .map(cat => (
                <div key={cat.id} style={{ marginBottom: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="checkbox"
                            checked={selectedParents.includes(cat.id)}
                            onChange={() => handleParentCheckboxChange(cat.id)}
                            style={{ width: 'auto' }}
                        />
                        {cat.name}
                    </label>
                </div>
            ));
    };

    return (
        <div style={{ maxWidth: '500px', padding: '1rem' }}>
            {!isCreatingNewCategory ? (
                <>
                    <h2>All Categories</h2>

                    {isLoading && <p>Loading categories...</p>}
                    {!isLoading && data?.data && data.data.length > 0 ? (
                        renderCategoriesWithChildren(data.data)
                    ) : (
                        !isLoading && <p>No categories found.</p>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsCreatingNewCategory(true)}
                        style={{
                            padding: '10px 16px',
                            backgroundColor: '#009693',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        Create New Category
                    </button>
                </>
            ) : (
                <div>
                    <h2>Create New Category</h2>

                    {/* Category name input */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Category Name</label>
                        <input
                            type="text"
                            value={name}
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

                    {/* Parent category selection */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Select Parent Category</label>
                        <div style={{ marginTop: '8px' }}>
                            {isLoading && <p>Loading...</p>}
                            {!isLoading && data?.data && data.data.length > 0 ? (
                                renderParentCategories(data.data)
                            ) : (
                                <p>No parent categories found.</p>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
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

                    <button
                        type="button"
                        onClick={() => setIsCreatingNewCategory(false)}
                        style={{
                            padding: '10px 16px',
                            backgroundColor: '#ccc',
                            color: '#000',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddCategory;
