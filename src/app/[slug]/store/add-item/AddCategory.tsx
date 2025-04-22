'use client';
import React, { useEffect, useState } from 'react';
import {
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
} from '@/slices/store/storeApi';

interface Props {
  onCategoryChange: (categories: Category[]) => void;
  selectedCategories: Category[];
}

type CategoryNode = {
  id: number;
  company_id: number;
  name: string;
  parent_id: number | null;
  children?: CategoryNode[];
};

const flattenCategories = (
  categories: CategoryNode[],
  level: number = 0
): Array<CategoryNode & { level: number }> => {
  return categories.reduce((acc, cat) => {
    acc.push({ ...cat, level });
    const kids = cat.children ?? [];
    if (kids.length > 0) {
      acc.push(...flattenCategories(kids, level + 1));
    }
    return acc;
  }, [] as Array<CategoryNode & { level: number }>);
};

const AddCategory: React.FC<Props> = ({ onCategoryChange, selectedCategories }) => {
  const { data, isLoading } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [selectedListCategories, setSelectedListCategories] = useState<number[]>([]);
  const [selectedParents, setSelectedParents] = useState<number[]>([]);
  const [name, setName] = useState('');

  const handleListCheckboxChange = (id: number) => {
    setHasChanges(true);
    setSelectedListCategories((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleParentCheckboxChange = (id: number) => {
    setSelectedParents((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (selectedCategories.length > 0) {
      setSelectedListCategories(selectedCategories.map((cat) => cat.id));
    }
  }, [selectedCategories]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Please enter a category name.');
      return;
    }
    try {
      if (selectedParents.length === 0) {
        await createCategory({ name, parent_id: null });
      } else {
        for (const pid of selectedParents) {
          await createCategory({ name, parent_id: pid });
        }
      }
      setName('');
      setSelectedParents([]);
      setIsCreatingNewCategory(false);
      alert('Category created!');
    } catch (err) {
      console.error(err);
      alert('Error creating category');
    }
  };
  const handleDoneClick = () => {
    const allFlattened = flattenCategories(data?.data || []);
    const selectedCats = allFlattened
      .filter(cat => selectedListCategories.includes(cat.id))
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        company_id: cat.company_id,
        parent_id: cat.parent_id,
        created_at: '', // filling required fields
        updated_at: '',
      }));
  
    onCategoryChange(selectedCats);
    setHasChanges(false);
  };
  



  const renderCategoriesWithChildren = (
    cats: CategoryNode[],
    level: number = 0
  ) =>
    cats.map((cat) => (
      <div
        key={cat.id}
        style={{ marginLeft: `${level * 20}px`, marginBottom: '6px' }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={selectedListCategories.includes(cat.id)}
            onChange={() => handleListCheckboxChange(cat.id)}
            style={{ width: 'auto' }}
          />
          {cat.name}
        </label>
        {(cat.children ?? []).length > 0 &&
          renderCategoriesWithChildren(cat.children!, level + 1)}
      </div>
    ));

  const renderParentCategories = (cats: CategoryNode[]) => {
    const flat = flattenCategories(cats);
    return flat.map((cat) => (
      <div
        key={cat.id}
        style={{
          marginBottom: '6px',
          marginLeft: `${cat.level * 20}px`,
        }}
      >
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
    // <div style={{ maxWidth: '500px', padding: '1rem' }}>
    //   {!isCreatingNewCategory ? (
    //     <>
    //       <h2>All Categories</h2>
    //       {isLoading && <p>Loading categories...</p>}
    //       {!isLoading && data?.data?.length ? (
    //         <div>
    //           {renderCategoriesWithChildren(data.data as CategoryNode[])}

    //           {hasChanges && (
    //             <button
    //               type="button"
    //               onClick={() => {
    //                 const allFlattened = flattenCategories(data?.data || []) as (Category & { level: number })[];

    //                 const selectedCats: Category[] = allFlattened
    //                   .filter(cat => selectedListCategories.includes(cat.id))
    //                   .map(({...rest }) => rest);

    //                 onCategoryChange(selectedCats);
    //                 setHasChanges(false);
    //               }}
    //               style={{
    //                 padding: '10px 16px',
    //                 backgroundColor: '#4caf50',
    //                 color: '#fff',
    //                 border: 'none',
    //                 borderRadius: '6px',
    //                 cursor: 'pointer',
    //                 marginTop: '20px',
    //                 display: 'block',
    //               }}
    //             >
    //               Done
    //             </button>
    //           )}
    //         </div>
    //       ) : (
    //         !isLoading && <p>No categories found.</p>
    //       )}
    //       <button
    //         type="button"
    //         onClick={() => setIsCreatingNewCategory(true)}
    //         style={{
    //           padding: '10px 16px',
    //           backgroundColor: '#009693',
    //           color: '#fff',
    //           border: 'none',
    //           borderRadius: '6px',
    //           cursor: 'pointer',
    //           marginTop: '20px',
    //         }}
    //       >
    //         Create New Category
    //       </button>
    //     </>
    //   ) : (
    //     <div>
    //       <h2>Create New Category</h2>

    //       <div style={{ marginBottom: '1rem' }}>
    //         <label>Category Name</label>
    //         <input
    //           type="text"
    //           value={name}
    //           onChange={(e) => setName(e.target.value)}
    //           placeholder="Enter category name"
    //           style={{
    //             display: 'block',
    //             width: '100%',
    //             padding: '8px',
    //             borderRadius: '4px',
    //             border: '1px solid #ccc',
    //             marginTop: '4px',
    //           }}
    //         />
    //       </div>

    //       <div style={{ marginBottom: '1rem' }}>
    //         <label>Select Parent Category</label>
    //         <div style={{ marginTop: '8px' }}>
    //           {isLoading && <p>Loading...</p>}
    //           {!isLoading && data?.data?.length ? (
    //             renderParentCategories(data.data as CategoryNode[])
    //           ) : (
    //             <p>No parent categories found.</p>
    //           )}
    //         </div>
    //       </div>

    //       <button
    //         type="button"
    //         onClick={handleSubmit}
    //         disabled={isCreating}
    //         style={{
    //           padding: '10px 16px',
    //           backgroundColor: '#009693',
    //           color: '#fff',
    //           border: 'none',
    //           borderRadius: '6px',
    //           cursor: 'pointer',
    //         }}
    //       >
    //         {isCreating ? 'Creating...' : 'Create Category'}
    //       </button>
    //       <button
    //         type="button"
    //         onClick={() => setIsCreatingNewCategory(false)}
    //         style={{
    //           padding: '10px 16px',
    //           backgroundColor: '#ccc',
    //           color: '#000',
    //           border: 'none',
    //           borderRadius: '6px',
    //           cursor: 'pointer',
    //           marginLeft: '10px',
    //         }}
    //       >
    //         Cancel
    //       </button>
    //     </div>
    //   )}
    // </div>





<div className="category-container">
  {!isCreatingNewCategory ? (
    <>
      <h2 className="category-title">All Categories</h2>
      {isLoading && <p>Loading categories...</p>}
      
      {!isLoading && data?.data?.length ? (
        <div>
          {renderCategoriesWithChildren(data.data as CategoryNode[])}

          {hasChanges && (
            <button
              type="button"
              onClick={handleDoneClick}
              className="category-button done-button"
            >
              Done
            </button>
          )}
        </div>
      ) : (
        !isLoading && <p>No categories found.</p>
      )}

      <button
        type="button"
        onClick={() => setIsCreatingNewCategory(true)}
        className="buttons create-button"
      >
        Create New Category
      </button>
    </>
  ) : (
    <div>
      <h2 className="category-title">Create New Category</h2>

      <div className="form-group">
        <label>Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label>Select Parent Category</label>
        <div className="parent-category-list">
          {isLoading && <p>Loading...</p>}
          {!isLoading && data?.data?.length ? (
            renderParentCategories(data.data as CategoryNode[])
          ) : (
            <p>No parent categories found.</p>
          )}
        </div>
      </div>

      <div className="button-group">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isCreating}
          className="buttons create-button"
        >
          {isCreating ? 'Creating...' : 'Create Category'}
        </button>

        <button
          type="button"
          onClick={() => setIsCreatingNewCategory(false)}
          className="buttons cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default AddCategory;
