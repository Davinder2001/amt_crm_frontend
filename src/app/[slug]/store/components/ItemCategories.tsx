'use client';
import React, { useEffect, useState } from 'react';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useFetchCategoriesQuery,
} from '@/slices';
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
  Collapse,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { FaPlus, FaCheck, FaTimes, FaChevronRight, FaChevronDown, FaTrash, FaEdit } from 'react-icons/fa';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';

interface Props {
  setSelectedCategories: (categories: Category[]) => void;
  selectedCategories: Category[];
  collapsedSections?: Record<string, boolean>;
  toggleSection?: (key: string) => void;
  disabled?: boolean;
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

const ItemCategories: React.FC<Props> = ({ setSelectedCategories, selectedCategories, collapsedSections, toggleSection, disabled = false }) => {
  const { data, isLoading } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    parent_id: number | null;
  } | null>(null);

  // Close error snackbar
  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage(null);
  };

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

  // Update selected categories whenever selection changes
  const updateSelectedCategories = (ids: number[]) => {
    if (!data?.data) return;

    const flattenCategories = (categories: CategoryNode[]): CategoryNode[] => {
      return categories.reduce<CategoryNode[]>((acc, category) => {
        if (ids.includes(category.id)) {
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
  };

  // Handle category selection
  const handleCategorySelect = (id: number) => {
    const newSelectedIds = selectedCategoriesIds.includes(id)
      ? selectedCategoriesIds.filter(item => item !== id)
      : [...selectedCategoriesIds, id];

    setSelectedCategoriesIds(newSelectedIds);
    updateSelectedCategories(newSelectedIds);
  };

  // Handle parent selection for new category
  const handleParentSelect = (id: number) => {
    setSelectedParentId(prev => prev === id ? null : id);
  };

  // Check if category name exists under the same parent
  const categoryExists = (categoryName: string, parentId: number | null) => {
    return data?.data?.some(category => {
      const nameMatches = category.name.toLowerCase() === categoryName.toLowerCase();
      const parentMatches = category.parent_id === parentId;

      // If editing, exclude the current category from the check
      if (editingCategory) {
        return nameMatches && parentMatches && category.id !== editingCategory.id;
      }
      return nameMatches && parentMatches;
    });
  };

  // Start editing a category
  const handleEditCategory = (category: CategoryNode) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      parent_id: category.parent_id
    });
    setName(category.name);
    setSelectedParentId(category.parent_id);
    setIsCreatingNewCategory(true);
  };

  // Create new category
  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter a category name');
      setShowError(true);
      return;
    }

    if (categoryExists(name, selectedParentId)) {
      setErrorMessage('Category with this name already exists under the selected parent');
      setShowError(true);
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: {
            name,
            parent_id: selectedParentId
          }
        }).unwrap();
      } else {
        await createCategory({
          name,
          parent_id: selectedParentId
        }).unwrap();
      }
      setName('');
      setSelectedParentId(null);
      setEditingCategory(null);
      setIsCreatingNewCategory(false);
    } catch (err) {
      console.error('Error saving category:', err);
      setErrorMessage('Error saving category');
      setShowError(true);
    }
  };

  // Initial expansion of parent categories
  useEffect(() => {
    if (!data?.data || selectedCategories.length === 0) return;

    // Function to find all parent IDs for selected categories
    const findParentIds = (categories: CategoryNode[], selectedIds: number[]): number[] => {
      const parentIds = new Set<number>();

      const findParents = (node: CategoryNode): boolean => {
        if (selectedIds.includes(node.id)) {
          // If this node is selected, we need to expand all its parents
          let current = node;
          while (current.parent_id) {
            parentIds.add(current.parent_id);
            // Find the parent node
            const parent = data.data?.find(cat => cat.id === current.parent_id);
            if (parent) {
              current = parent;
            } else {
              break;
            }
          }
          return true;
        }

        if (node.children) {
          for (const child of node.children) {
            if (findParents(child)) {
              // If any child is selected, expand this node
              parentIds.add(node.id);
              return true;
            }
          }
        }
        return false;
      };

      for (const category of categories) {
        findParents(category);
      }

      return Array.from(parentIds);
    };

    const parentIdsToExpand = findParentIds(data.data, selectedCategories.map(cat => cat.id));

    if (parentIdsToExpand.length > 0) {
      setExpandedCategories(prev => {
        // Merge with existing expanded categories
        const newExpanded = new Set([...prev, ...parentIdsToExpand]);
        return Array.from(newExpanded);
      });
    }
  }, [data, selectedCategories]); // Run when data or selected categories change

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
        sx={{
          position: 'relative', ...(disabled && {
            cursor: 'not-allowed',
          }),
        }}
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
              color: 'var(--primary-color)',
              '&.Mui-checked': {
                color: 'var(--primary-color)',
              },
            }}
          />
          <ListItemText primary={category.name} className='' />
          {isHovered && category.name.toLowerCase() !== 'uncategorized' && (
            <Box display="flex" gap={1} marginLeft="auto">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory(category);
                }}
              >
                <FaEdit size={12} color="var(--primary-color)" />
              </IconButton>
              <IconButton
                size="small"
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
              >
                <FaTrash size={12} color="var(--primary-color)" />
              </IconButton>
            </Box>
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
        sx={{
          position: 'relative', ...(disabled && {
            cursor: 'not-allowed',
          }),
        }}
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
              color: 'var(--primary-color)',
              '&.Mui-checked': {
                color: 'var(--primary-color)',
              },
            }}
          />
          <ListItemText primary={category.name} className='' />
          {isHovered && category.name.toLowerCase() !== 'uncategorized' && (
            <Box display="flex" gap={1} marginLeft="auto">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory(category);
                }}
              >
                <FaEdit size={12} color="var(--primary-color)" />
              </IconButton>
              <IconButton
                size="small"
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
              >
                <FaTrash size={12} color="var(--primary-color)" />
              </IconButton>
            </Box>
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
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      {!isCreatingNewCategory ? (
        <>
          <div className="basic_label_header">
            <h2 className="basic_label">Categories:</h2>
            {toggleSection && collapsedSections && (
              <span
                onClick={() => toggleSection('categories')}
                style={{
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Toggle categories Section"
              >
                {(collapsedSections?.['categories']) ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
              </span>
            )}
          </div>

          {!collapsedSections?.['categories'] && (
            <div className="fields-wrapper">
              {isLoading ? (
                <Box display="flex" justifyContent="center"
                  sx={{
                    maxHeight: 300,
                    overflow: 'auto',
                    ...(disabled && {
                      pointerEvents: 'none',
                      opacity: 0.5,
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                    }),
                  }}
                >
                  <CircularProgress color="primary" sx={{ color: 'var(--primary-color)' }} />
                </Box>
              ) : data?.data.length === 0 ? (
                <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
                  No categories found
                </Typography>
              ) : (
                <List
                  sx={{
                    maxHeight: 300,
                    overflow: 'auto',
                    ...(disabled && {
                      pointerEvents: 'none',
                      opacity: 0.5,
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                    }),
                  }}
                >
                  {data?.data.map(renderCategory)}
                </List>
              )}

              <Box display="flex" justifyContent="flex-start" alignItems="center" mt={2} gap={1} flexWrap="wrap" sx={{
                ...(disabled && {
                  cursor: 'not-allowed',
                }),
              }}>
                <Button
                  variant="outlined"
                  startIcon={<FaPlus size={12} />}
                  onClick={() => setIsCreatingNewCategory(true)}
                  sx={{
                    background: '#f0f0f0',
                    border: 'none',
                    color: '#2c2b2e',
                    py: 0.5,
                    px: 1.5,
                    textTransform: 'capitalize !important',
                    minHeight: '30px',
                    '&:hover': { backgroundColor: '#DEE9F2' },
                    ...(disabled && {
                      pointerEvents: 'none',
                      opacity: 0.5,
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                    }),
                  }}
                >
                  Create New
                </Button>
              </Box>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="basic_label_header">
            <h2 className="basic_label">
              {editingCategory ? 'Edit Category' : 'Create New Category'}:
            </h2>
            {toggleSection && collapsedSections && (
              <span
                onClick={() => toggleSection('categories')}
                style={{
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Toggle categories Section"
              >
                {collapsedSections?.['categories'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
              </span>
            )}
          </div>
          {!collapsedSections?.['categories'] && (
            <div className="fields-wrapper">
              <TextField
                fullWidth
                label="Category Name"
                variant="outlined"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={categoryExists(name, selectedParentId)}
                helperText={
                  categoryExists(name, selectedParentId)
                    ? 'Category with this name already exists'
                    : ''
                }
                InputLabelProps={{
                  sx: {
                    color: '#ccc',
                    '&.Mui-focused': {
                      color: 'var(--primary-color)',
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
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: categoryExists(name, selectedParentId) ? '#efefef' : 'var(--primary-color)',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    marginLeft: 0,
                  },
                }}
              />

              <Typography variant="subtitle1" gutterBottom>
                Select Parent Category (optional)
              </Typography>

              {isLoading ? (
                <CircularProgress color="primary" sx={{ color: 'var(--primary-color)' }} />
              ) : (
                <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                  {data?.data?.map(renderParentOptions)}
                </List>
              )}

              <Box display="flex" justifyContent="flex-end" gap={1} mt={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<FaTimes size={12} />}
                  onClick={() => {
                    setIsCreatingNewCategory(false);
                    setEditingCategory(null);
                  }}
                  sx={{
                    borderColor: 'var(--primary-color)',
                    color: 'var(--primary-color)',
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1.5,
                    minHeight: '30px',
                    '&:hover': { backgroundColor: '#DEE9F2' },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FaCheck size={12} />}
                  onClick={handleSubmit}
                  disabled={isCreating || !name.trim() || categoryExists(name, selectedParentId)}
                  sx={{
                    backgroundColor: 'var(--primary-color)',
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1.5,
                    minHeight: '30px',
                    '&:hover': { backgroundColor: '#9cb9d0' },
                  }}
                >
                  {isCreating || isUpdating
                    ? (editingCategory ? 'Updating...' : 'Creating...')
                    : (editingCategory ? 'Update' : 'Create')}
                </Button>
              </Box>

            </div>
          )}
        </>
      )}
    </Box>
  );
};

export default ItemCategories;