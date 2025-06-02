'use client';
import React, { useEffect, useState } from 'react';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from '@/slices/store/storeApi';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Collapse
} from '@mui/material';
import { FaPlus, FaCheck, FaTimes, FaChevronRight, FaChevronDown, FaTrash } from 'react-icons/fa';

interface Props {
  setSelectedCategories: (categories: Category[]) => void;
  selectedCategories: Category[];
}

type CategoryNode = {
  id: number;
  company_id: number;
  name: string;
  parent_id: number | null;
  children?: CategoryNode[];
  created_at?: string;
  updated_at?: string;
};

const ItemCategories: React.FC<Props> = ({ setSelectedCategories, selectedCategories }) => {
  const { data, isLoading } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);

  // Initialize with selected categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      setSelectedCategoriesIds(selectedCategories.map(cat => cat.id));
    }
  }, [selectedCategories]);

  // Toggle category expansion
  const handleExpand = (id: number) => {
    setExpandedCategories(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Handle category selection
  const handleCategorySelect = (id: number) => {
    setHasChanges(true);
    setSelectedCategoriesIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Handle parent selection for new category
  const handleParentSelect = (id: number) => {
    setSelectedParentId(prev => prev === id ? null : id);
  };

  // Create new category
  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      await createCategory({
        name,
        parent_id: selectedParentId
      }).unwrap();
      setName('');
      setSelectedParentId(null);
      setIsCreatingNewCategory(false);
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Error creating category');
    }
  };

  // Finalize category selection
  const handleDoneClick = () => {
    if (!data?.data) return;

    const flattenCategories = (categories: CategoryNode[]): CategoryNode[] => {
      return categories.reduce<CategoryNode[]>((acc, category) => {
        if (selectedCategoriesIds.includes(category.id)) {
          acc.push(category);
        }
        if (category.children) {
          acc.push(...flattenCategories(category.children));
        }
        return acc;
      }, []);
    };

    const selected = flattenCategories(data.data);
    setSelectedCategories(
      selected.map(cat => ({
        id: cat.id,
        name: cat.name,
        company_id: cat.company_id,
        parent_id: cat.parent_id,
        created_at: cat.created_at || new Date().toISOString(),
        updated_at: cat.updated_at || new Date().toISOString(),
        children: cat.children?.map(child => ({
          id: child.id,
          name: child.name,
          company_id: child.company_id,
          parent_id: child.parent_id,
          created_at: child.created_at || new Date().toISOString(),
          updated_at: child.updated_at || new Date().toISOString(),
        })),
      }))
    );
    setHasChanges(false);
  };

  // Sync deselected categories to parent when none are selected
  useEffect(() => {
    if (selectedCategoriesIds.length === 0 && hasChanges) {
      setSelectedCategories([]);
    }
  }, [selectedCategoriesIds, hasChanges, setSelectedCategories]);

  // Render category tree
  const renderCategory = (category: CategoryNode) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.includes(category.id);
    const isSelected = selectedCategoriesIds.includes(category.id);
    const isHovered = hoveredCategoryId === category.id;

    return (
      <Box key={category.id}
        onMouseEnter={() => setHoveredCategoryId(category.id)}
        onMouseLeave={() => setHoveredCategoryId(null)}
        sx={{ position: 'relative' }}
      >
        <ListItemButton
          onClick={() => handleExpand(category.id)}
          sx={{ pl: category.parent_id ? 4 : 0, py: 0, minHeight: 30, }}
        >
          {hasChildren && (
            <ListItemIcon sx={{ maxWidth: 24, width: '100%', minWidth: 0 }}>
              {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </ListItemIcon>
          )}
          {!hasChildren && <Box sx={{ maxWidth: 24, width: '100%', minWidth: 0 }} />}
          <Checkbox
            edge="start"
            checked={isSelected}
            onChange={() => handleCategorySelect(category.id)}
            tabIndex={-1}
            disableRipple
            sx={{
              color: '#384b70',
              '&.Mui-checked': {
                color: '#384b70',
              },
            }}
          />
          <ListItemText primary={category.name} className='category-name' />
          {isHovered && category.name.toLowerCase() !== 'uncategorized' && (
            <FaTrash
              size={12}
              color="#384b70"
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                  deleteCategory(category.id)
                    .unwrap()
                    .catch((err) => {
                      console.error('Delete failed:', err);
                      alert('Failed to delete category');
                    });
                }
              }}
            />
          )}
        </ListItemButton>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.children?.map(renderCategory)}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  // Render parent categories for selection when creating new category
  const renderParentOptions = (category: CategoryNode) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.includes(category.id);
    const isSelected = selectedParentId === category.id;
    const isHovered = hoveredCategoryId === category.id;
    return (
      <Box key={category.id}
        onMouseEnter={() => setHoveredCategoryId(category.id)}
        onMouseLeave={() => setHoveredCategoryId(null)}
        sx={{ position: 'relative' }}
      >
        <ListItemButton
          onClick={() => {
            handleExpand(category.id);
          }}
          sx={{ pl: category.parent_id ? 4 : 0, py: 0, minHeight: 30, }}
        >
          <ListItemIcon sx={{ maxWidth: 24, width: '100%', minWidth: 0 }}>
            {hasChildren ? (
              isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />
            ) : null}
          </ListItemIcon>

          <Checkbox
            edge="start"
            checked={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              handleParentSelect(category.id);
              handleExpand(category.id);
            }}
            tabIndex={-1}
            disableRipple
            sx={{
              color: '#384b70',
              '&.Mui-checked': {
                color: '#384b70',
              },
            }}
          />
          <ListItemText primary={category.name} className='category-name' />
          {isHovered && category.name.toLowerCase() !== 'uncategorized' && (
            <FaTrash
              size={12}
              color="#384b70"
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                  deleteCategory(category.id)
                    .unwrap()
                    .catch((err) => {
                      console.error('Delete failed:', err);
                      alert('Failed to delete category');
                    });
                }
              }}
            />
          )}
        </ListItemButton>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.children?.map(renderParentOptions)}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!isCreatingNewCategory ? (
        <>
          <div className="basic_label_header">
            <h2 className="basic_label">Categories:</h2>
          </div>

          <div className="fields-wrapper">
            {isLoading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : data?.data.length === 0 ? (
              <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
                No categories found
              </Typography>
            ) : (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {data?.data.map(renderCategory)}
              </List>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} gap={1} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<FaPlus size={12} />}
                onClick={() => setIsCreatingNewCategory(true)}
                sx={{
                  borderColor: '#384b70',
                  color: '#384b70',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5,
                  minHeight: '30px',
                  '&:hover': { backgroundColor: '#e0f7f6' },
                }}
              >
                Create New
              </Button>

              {hasChanges && selectedCategoriesIds.length > 0 && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<FaTimes size={12} />}
                    onClick={() => {
                      setHasChanges(false);
                      setSelectedCategoriesIds(selectedCategories.map(cat => cat.id));
                    }}
                    sx={{
                      borderColor: '#384b70',
                      color: '#384b70',
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1.5,
                      minHeight: '30px',
                      '&:hover': { backgroundColor: '#e0f7f6' },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FaCheck size={12} />}
                    onClick={handleDoneClick}
                    sx={{
                      backgroundColor: '#384b70',
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1.5,
                      minHeight: '30px',
                      '&:hover': { backgroundColor: '#007c7a' },
                    }}
                  >
                    Done
                  </Button>
                </>
              )}
            </Box>
          </div>
        </>
      ) : (
        <>
          <div className="basic_label_header">
            <h2 className="basic_label"> Create New Category:</h2>
          </div>
          <div className="fields-wrapper">
            <TextField
              fullWidth
              label="Category Name"
              variant="outlined"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{
                sx: {
                  color: '#384b70',
                  '&.Mui-focused': {
                    color: '#384b70',
                  },
                },
              }}
              InputProps={{
                sx: {
                  paddingRight: 1,
                },
              }}
              sx={{
                maxWidth: 500,
                width: '100%',
                mb: 2,
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                    borderColor: '#384b70',
                  },
                },
              }}
            />

            <Typography variant="subtitle1" gutterBottom>
              select Parent Category (optional)
            </Typography>

            {isLoading ? (
              <CircularProgress />
            ) : (
              <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                {data?.data?.map(renderParentOptions)}
              </List>
            )}

            <Box display="flex" justifyContent="flex-end" gap={1} mt={2} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<FaTimes size={12} />}
                onClick={() => setIsCreatingNewCategory(false)}
                sx={{
                  borderColor: '#384b70',
                  color: '#384b70',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5,
                  minHeight: '30px',
                  '&:hover': { backgroundColor: '#e0f7f6' },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FaCheck size={12} />}
                onClick={handleSubmit}
                disabled={isCreating || !name.trim()}
                sx={{
                  backgroundColor: '#384b70',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1.5,
                  minHeight: '30px',
                  '&:hover': { backgroundColor: '#007c7a' },
                }}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </Box>

          </div>
        </>
      )}
    </Box>
  );
};

export default ItemCategories;