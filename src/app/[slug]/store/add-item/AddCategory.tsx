'use client';
import React, { useEffect, useState } from 'react';
import {
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
} from '@/slices/store/storeApi';
import { FaSearch } from 'react-icons/fa'; // Importing search icon from react-icons

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

const filterCategories = (categories: CategoryNode[], term: string): CategoryNode[] => {
  if (!term.trim()) return categories;

  const lowerTerm = term.toLowerCase();

  return categories
    .map((cat) => {
      const matched = cat.name.toLowerCase().includes(lowerTerm);
      const filteredChildren = filterCategories(cat.children || [], term);
      if (matched || filteredChildren.length > 0) {
        return {
          ...cat,
          children: filteredChildren,
        };
      }
      return null;
    })
    .filter(Boolean) as CategoryNode[];
};

const AddCategory: React.FC<Props> = ({ onCategoryChange, selectedCategories }) => {
  const { data, isLoading } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [selectedListCategories, setSelectedListCategories] = useState<number[]>([]);
  const [selectedParents, setSelectedParents] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
        created_at: '',
        updated_at: '',
      }));
    onCategoryChange(selectedCats);
    setHasChanges(false);
  };

  const renderCategoriesWithChildren = (cats: CategoryNode[], level: number = 0) =>
    cats.map((cat) => (
      <div
        key={cat.id}
        style={{ marginLeft: `${level * 20}px`, marginBottom: '6px' }}
        className='category-input-lable-outer'
      >
        <label className="modern-box-checkbox">
          <input
            type="checkbox"
            checked={selectedListCategories.includes(cat.id)}
            onChange={() => handleListCheckboxChange(cat.id)}
          />
          <span className="box"></span>
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
        <label className="modern-box-checkbox">
          <input
            type="checkbox"
            checked={selectedParents.includes(cat.id)}
            onChange={() => handleParentCheckboxChange(cat.id)}
          />
          <span className="box"></span>
          {cat.name}
        </label>
      </div>
    ));
  };

  return (
    <div className="category-container">
      {!isCreatingNewCategory ? (
        <>
          <h2 className="category-title">All Categories</h2>

          {isLoading && <p>Loading categories...</p>}

          {!isLoading && data?.data?.length ? (
            <>
              {/* Search Bar with Icon */}
              <div className=" search-bar-group">
                  <FaSearch className="search-icon" color=' #009693' />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search categories..."
                    className="input-fields"
                  />
                
              </div>

              <div className="categories-list-outer-div">
                {renderCategoriesWithChildren(
                  filterCategories(data.data as CategoryNode[], searchTerm)
                )}
              </div>
            </>
          ) : (
            !isLoading && <p>No categories found.</p>
          )}

          <div className='done-category-button-outer'>
            <button
              type="button"
              onClick={() => setIsCreatingNewCategory(true)}
              className="buttons create-button"
            >
              Create New Category
            </button>

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
