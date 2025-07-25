'use client';
import React, { useState } from 'react';
import {
    useCreateBrandMutation,
    useDeleteBrandMutation,
    useFetchBrandsQuery,
    useUpdateBrandMutation,
} from '@/slices';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import { FaPlus, FaCheck, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';

interface Props {
    selectedBrand: string;
    selectedBrandId: number | null;
    onBrandSelect: (brandName: string, brandId?: number) => void;
    collapsedSections: Record<string, boolean>;
    toggleSection: (key: string) => void;
    disabled?: boolean;
}

const ItemBrands: React.FC<Props> = ({ selectedBrand, onBrandSelect, collapsedSections, toggleSection, disabled = false }) => {
    const { data, isLoading, refetch } = useFetchBrandsQuery();
    const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
    const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
    const [deleteBrand] = useDeleteBrandMutation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [name, setName] = useState('');
    const [editingBrand, setEditingBrand] = useState<{ id: number; name: string } | null>(null);
    const [brandToDelete, setBrandToDelete] = useState<{ id: number; name: string } | null>(null);
    const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    // Handle brand selection
    const handleBrandSelect = (brandName: string) => {
        const selectedBrandObj = data?.find(brand => brand.name === brandName);
        onBrandSelect(brandName, selectedBrandObj?.id);
    };


    // Check if brand name exists
    const brandExists = (brandName: string) => {
        return data?.some(brand =>
            brand.name.toLowerCase() === brandName.toLowerCase() &&
            (!editingBrand || brand.id !== editingBrand.id)
        );
    };

    // Create or update brand
    const handleSubmit = async () => {
        if (!name.trim()) {
            setErrorMessage('Please enter a brand name');
            setShowError(true);
            return;
        }

        if (brandExists(name)) {
            setErrorMessage('Brand with this name already exists');
            setShowError(true);
            return;
        }

        try {
            if (editingBrand) {
                await updateBrand({ id: editingBrand.id, name }).unwrap();
            } else {
                const created = await createBrand({ name }).unwrap();
                onBrandSelect(name, created.id);
            }
            setName('');
            setEditingBrand(null);
            setIsFormOpen(false);
            refetch(); // Refresh the list
        } catch (err) {
            console.error('Error saving brand:', err);
            setErrorMessage('Error saving brand');
            setShowError(true);
        }
    };

    // Delete brand
    const handleDeleteBrand = async (id: number, brandName: string) => {
        try {
            await deleteBrand(id).unwrap();
            refetch(); // Refresh the list
            if (selectedBrand === brandName) {
                onBrandSelect('');
                refetch();
            }
        } catch (err) {
            console.error('Delete failed:', err);
            setErrorMessage('Failed to delete brand');
            setShowError(true);
        }
    };

    // Start editing a brand
    const handleEditBrand = (brand: { id: number; name: string }) => {
        setEditingBrand(brand);
        setName(brand.name);
        setIsFormOpen(true);
    };

    // Cancel form
    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingBrand(null);
        setName('');
    };

    // Close error snackbar
    const handleCloseError = () => {
        setShowError(false);
        setErrorMessage(null);
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

            {!isFormOpen ? (
                <>
                    <div className="basic_label_header">
                        <h2 className="basic_label">Brands:</h2>
                        <span
                            onClick={() => toggleSection('brands')}
                            style={{
                                color: 'var(--primary-color)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            aria-label="Toggle brands Section"
                        >
                            {collapsedSections['brands'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                        </span>
                    </div>
                    {!collapsedSections['brands'] && (
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
                                    }}>
                                    <CircularProgress color="primary" sx={{ color: 'var(--primary-color)' }} />
                                </Box>
                            ) : data?.length === 0 ? (
                                <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
                                    No brands found
                                </Typography>
                            ) : (
                                <FormControl fullWidth size="small" sx={{
                                    maxWidth: 500, mb: 2, ...(disabled && {
                                        pointerEvents: 'none',
                                        opacity: 0.5,
                                        backgroundColor: '#f5f5f5',
                                        cursor: 'not-allowed',
                                    }),
                                }}>
                                    <InputLabel id="brand-select-label" sx={{
                                        color: 'var(--primary-color)',
                                        '&.Mui-focused': {
                                            color: 'var(--primary-color)',
                                        },
                                    }}>Select Brand</InputLabel>
                                    <Select
                                        labelId="brand-select-label"
                                        value={selectedBrand}
                                        label="Select Brand"
                                        onChange={(e) => handleBrandSelect(e.target.value as string)}
                                        renderValue={(selected) => <span>{selected}</span>}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--primary-color)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'var(--primary-color)',
                                            },
                                        }}
                                    >
                                        {data?.map((brand) => (
                                            <MenuItem
                                                key={brand.id}
                                                value={brand.name}
                                                onMouseEnter={() => setHoveredBrandId(brand.id)}
                                                onMouseLeave={() => setHoveredBrandId(null)}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <span>{brand.name}</span>
                                                {hoveredBrandId === brand.id && (
                                                    <Box display="flex" gap={1}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditBrand(brand);
                                                            }}
                                                        >
                                                            <FaEdit size={12} color="var(--primary-color)" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setBrandToDelete({ id: brand.id, name: brand.name });
                                                                setShowDeleteConfirm(true);
                                                            }}
                                                        >
                                                            <FaTrash size={12} color="var(--primary-color)" />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} gap={1} flexWrap="wrap"
                                sx={{
                                    ...(disabled && {
                                        cursor: 'not-allowed',
                                    }),
                                }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FaPlus size={12} />}
                                    onClick={() => setIsFormOpen(true)}
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
                                    Add New Brand
                                </Button>
                            </Box>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="basic_label_header">
                        <h2 className="basic_label">
                            {editingBrand ? 'Edit Brand' : 'Add New Brand'}:
                        </h2>
                        <span
                            onClick={() => toggleSection('brands')}
                            style={{
                                color: 'var(--primary-color)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            aria-label="Toggle brands Section"
                        >
                            {collapsedSections['brands'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                        </span>
                    </div>
                    {!collapsedSections['brands'] && (
                        <div className="fields-wrapper">
                            <TextField
                                fullWidth
                                label="Brand Name"
                                variant="outlined"
                                size="small"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={brandExists(name)}
                                helperText={
                                    brandExists(name) ? 'Brand with this name already exists' : ''
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
                                            borderColor: brandExists(name) ? '#d32f2f' : 'var(--primary-color)',
                                        },
                                    },
                                    '& .MuiFormHelperText-root': {
                                        marginLeft: 0,
                                    },
                                }}
                            />

                            <Box display="flex" justifyContent="flex-end" gap={1} mt={2} flexWrap="wrap">
                                <Button
                                    variant="outlined"
                                    startIcon={<FaTimes size={12} />}
                                    onClick={handleCancel}
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
                                    disabled={(isCreating || isUpdating) || !name.trim() || brandExists(name)}
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
                                        ? (editingBrand ? 'Updating...' : 'Adding...')
                                        : (editingBrand ? 'Update' : 'Add')}
                                </Button>
                            </Box>
                        </div>
                    )}
                </>
            )}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                message={`Are you sure want to delete the brand "${brandToDelete?.name}"?`}
                onConfirm={() => {
                    if (brandToDelete) {
                        handleDeleteBrand(brandToDelete.id, brandToDelete.name);
                    }
                    setShowDeleteConfirm(false);
                    setBrandToDelete(null);
                }}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setBrandToDelete(null);
                }}
                type="delete"
            />
        </Box>
    );
};

export default ItemBrands;