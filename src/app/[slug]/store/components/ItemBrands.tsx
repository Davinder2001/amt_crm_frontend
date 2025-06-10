'use client';
import React, { useState } from 'react';
import {
    useCreateBrandMutation,
    useDeleteBrandMutation,
    useFetchBrandsQuery,
} from '@/slices/store/storeApi';
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
    IconButton
} from '@mui/material';
import { FaPlus, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

interface Props {
    selectedBrand: string;
    onBrandSelect: (brandName: string) => void;
}

const ItemBrands: React.FC<Props> = ({ selectedBrand, onBrandSelect }) => {
    const { data, isLoading, refetch } = useFetchBrandsQuery();
    const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
    const [deleteBrand] = useDeleteBrandMutation();
    const [isCreatingNewBrand, setIsCreatingNewBrand] = useState(false);
    const [name, setName] = useState('');
    const [hoveredBrandId, setHoveredBrandId] = useState<number | null>(null);

    // Handle brand selection
    const handleBrandSelect = (brandName: string) => {
        onBrandSelect(brandName);
    };

    // Create new brand
    const handleSubmit = async () => {
        if (!name.trim()) {
            alert('Please enter a brand name');
            return;
        }

        try {
            await createBrand({ name }).unwrap();
            setName('');
            setIsCreatingNewBrand(false);
            refetch(); // Refresh the list
        } catch (err) {
            console.error('Error creating brand:', err);
            alert('Error creating brand');
        }
    };

    // Delete brand
    const handleDeleteBrand = async (id: number, brandName: string) => {
        if (confirm(`Are you sure you want to delete "${brandName}"?`)) {
            try {
                await deleteBrand(id).unwrap();
                refetch(); // Refresh the list
                if (selectedBrand === brandName) {
                    onBrandSelect('');
                }
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete brand');
            }
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {!isCreatingNewBrand ? (
                <>
                    <div className="basic_label_header">
                        <h2 className="basic_label">Brands:</h2>
                    </div>

                    <div className="fields-wrapper">
                        {isLoading ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress color="primary" sx={{ color: '#384b70' }}/>
                            </Box>
                        ) : data?.length === 0 ? (
                            <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
                                No brands found
                            </Typography>
                        ) : (
                            <FormControl fullWidth size="small" sx={{ maxWidth: 500, mb: 2 }}>
                                <InputLabel id="brand-select-label" sx={{ color: '#384b70' }}>Select Brand</InputLabel>
                                <Select
                                    labelId="brand-select-label"
                                    value={selectedBrand}
                                    label="Select Brand"
                                    onChange={(e) => handleBrandSelect(e.target.value)}
                                    renderValue={(selected) => <span>{selected}</span>}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#384b70',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#384b70',
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
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteBrand(brand.id, brand.name);
                                                    }}
                                                >
                                                    <FaTrash size={12} color="#384b70" />
                                                </IconButton>
                                            )}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        )}

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} gap={1} flexWrap="wrap">
                            <Button
                                variant="outlined"
                                startIcon={<FaPlus size={12} />}
                                onClick={() => setIsCreatingNewBrand(true)}
                                sx={{
                                    background: '#f0f0f0',
                                    border: 'none',
                                    color: '#2c2b2e',
                                    py: 0.5,
                                    px: 1.5,
                                    textTransform: 'capitalize !important',
                                    minHeight: '30px',
                                    '&:hover': { backgroundColor: '#DEE9F2' },
                                }}
                            >
                                Create New Brand
                            </Button>
                        </Box>
                    </div>
                </>
            ) : (
                <>
                    <div className="basic_label_header">
                        <h2 className="basic_label">Create New Brand:</h2>
                    </div>
                    <div className="fields-wrapper">
                        <TextField
                            fullWidth
                            label="Brand Name"
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

                        <Box display="flex" justifyContent="flex-end" gap={1} mt={2} flexWrap="wrap">
                            <Button
                                variant="outlined"
                                startIcon={<FaTimes size={12} />}
                                onClick={() => {
                                    setIsCreatingNewBrand(false);
                                    setName('');
                                }}
                                sx={{
                                    borderColor: '#384b70',
                                    color: '#384b70',
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
                                disabled={isCreating || !name.trim()}
                                sx={{
                                    backgroundColor: '#384b70',
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                    px: 1.5,
                                    minHeight: '30px',
                                    '&:hover': { backgroundColor: '#9cb9d0' },
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

export default ItemBrands;