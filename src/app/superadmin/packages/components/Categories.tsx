"use client";

import React, { useState, useEffect } from "react";
import {
    useGetBusinessCategoriesQuery,
    useCreateBusinessCategoryMutation,
    useUpdateBusinessCategoryMutation,
    useDeleteBusinessCategoryMutation,
} from "@/slices/superadminSlices/businessCategory/businesscategoryApi";
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useMediaQuery, useTheme } from '@mui/material';

const BusinessCategories = () => {
    const { data: categories, isLoading, isError } = useGetBusinessCategoriesQuery();
    const [createCategory] = useCreateBusinessCategoryMutation();
    const [updateCategory] = useUpdateBusinessCategoryMutation();
    const [deleteCategory] = useDeleteBusinessCategoryMutation();
    const [isUpdating, setIsUpdating] = useState(false);
    const { setTitle } = useBreadcrumb();

    const [form, setForm] = useState({ id: null as number | null, name: "" });

    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:483px)');



    // Add this state at the top of your component
    const [showAll, setShowAll] = useState(false);
    // Right after showAll
    const visibleCategories = isMobile
        ? (showAll ? categories : categories?.slice(0, 4))
        : (showAll ? categories : categories?.slice(0, 6));


    const handleSubmit = async () => {
        if (form.id) {
            setIsUpdating(true);
            await updateCategory({ id: form.id, name: form.name });
            setIsUpdating(false);
        } else {
            await createCategory({ name: form.name });
        }
        setForm({ id: null, name: "" });
    };


    const handleEdit = (category: BusinessCategory) => {
        setForm({ id: category.id, name: category.name });
    };

    const handleCancel = () => {
        setForm({ id: null, name: "" });
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            await deleteCategory(id);
        }
    };
    useEffect(() => {
        setTitle('Manage Categories');
    }, [setTitle]);

    return (
        <Box className="business-category-page">

            <Paper className="glass-form">

                <TextField
                    fullWidth
                    label="Category Name"
                    variant="outlined"
                    size="small"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    InputLabelProps={{
                        sx: {
                            color: '#009693',
                            '&.Mui-focused': {
                                color: '#009693',
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
                        '& .MuiOutlinedInput-root.Mui-focused': {
                            '& fieldset': {
                                borderColor: '#009693',
                            },
                        },
                    }}
                />

                <Box className="form-actions">
                    {form.id && (
                        <Button className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        className="add-btn"
                        onClick={handleSubmit}
                        startIcon={!form.id ? <FaPlus /> : null}
                        disabled={isUpdating}
                    >
                        {form.id ? (isUpdating ? "Updating..." : "Update") : "Add"}
                    </Button>



                </Box>
            </Paper>



            {categories && categories.length > 6 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1.5 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowAll(!showAll)}
                        sx={{
                            color: '#009693',
                            borderColor: '#009693',
                            '&:hover': {
                                backgroundColor: '#00969315',
                                borderColor: '#009693'
                            }
                        }}
                    >
                        {showAll ? 'Show Less' : 'See All'}
                    </Button>
                </Box>
            )}
            {isLoading ? (
                <Box className="loading-center">
                    <CircularProgress />
                </Box>
            ) : isError ? (
                <Typography color="error">Failed to load categories.</Typography>
            ) : (
                <div className="category-grid">
                    {visibleCategories?.map((cat) => (
                        <Paper key={cat.id} className="category-box">
                            <Typography className="category-name">{cat.name}</Typography>
                            <Box className="action-buttons">
                                <IconButton className="edit-btn" onClick={() => handleEdit(cat)}>
                                    <FaEdit />
                                </IconButton>
                                <IconButton className="delete-btn" onClick={() => handleDelete(cat.id)}>
                                    <FaTrash />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))}
                </div>

            )}

        </Box>
    );
};

export default BusinessCategories;
