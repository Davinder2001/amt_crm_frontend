// components/ExpenseForm.tsx
'use client';

import { memo, useState } from 'react';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Stack,
    Select,
    Chip,
    Box,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '@/slices';
import { FaPlus } from 'react-icons/fa';

interface ExpenseFormProps {
    expense?: Expense | null;
    onSuccess: () => void;
    onCancel?: () => void;
}

export default memo(function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
    const [createExpense] = useCreateExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [tagError, setTagError] = useState('');
    const [tagInput, setTagInput] = useState('');

    const [formData, setFormData] = useState<ExpenseCreateRequest | ExpenseUpdateRequest>({
        heading: expense?.heading || '',
        description: expense?.description || '',
        price: expense?.price.toString() || '',
        file: null,
        tags: expense?.tags || [],
        status: expense?.status || 'pending'
    });

    const handleChange = (
        field: keyof typeof formData,
        value: string | number | File | null | { name: string }[] // specify possible types
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (!trimmedTag) return;

        if (formData.tags.some(tag => tag.name === trimmedTag)) {
            setTagError('This tag already exists');
            return;
        }

        handleChange('tags', [...formData.tags, { name: trimmedTag }]);
        setTagInput('');
        setTagError('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        handleChange('tags', formData.tags.filter(tag => tag.name !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.heading) newErrors.heading = 'Heading is required';
        if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Valid price is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Create FormData object for binary file upload
            const formDataPayload = new FormData();

            // Append all fields to FormData
            formDataPayload.append('heading', formData.heading);
            formDataPayload.append('description', formData.description || '');
            formDataPayload.append('price', Number(formData.price).toString());
            formDataPayload.append('status', formData.status);

            // Append tags as JSON string
            formDataPayload.append('tags', JSON.stringify(formData.tags));

            // Append file if it exists
            if (formData.file) {
                formDataPayload.append('file', formData.file as File);
            }

            if (expense) {
                // Update existing expense
                await updateExpense({
                    id: expense.id,
                    formdata: formDataPayload as unknown as ExpenseUpdateRequest
                }).unwrap();
            } else {
                // Create new expense
                if (!formData.file) {
                    setErrors({ ...errors, file: 'File is required' });
                    return;
                }
                await createExpense({ formdata: formDataPayload as unknown as ExpenseCreateRequest }).unwrap();
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving expense:', error);
            setErrors({ form: 'An error occurred while saving the expense' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleChange('file', e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                {errors.form && (
                    <FormHelperText error>{errors.form}</FormHelperText>
                )}

                <TextField
                    label="Heading"
                    size="small"
                    value={formData.heading}
                    onChange={(e) => handleChange('heading', e.target.value)}
                    error={!!errors.heading}
                    helperText={errors.heading}
                    fullWidth
                    InputLabelProps={{
                        sx: {
                            color: 'var(--primary-color)',
                            '&.Mui-focused': {
                                color: 'var(--primary-color)',
                            },
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'var(--primary-color)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--primary-color)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-color)',
                            },
                        },
                    }}
                />

                <TextField
                    label="Description"
                    size="small"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    InputLabelProps={{
                        sx: {
                            color: 'var(--primary-color)',
                            '&.Mui-focused': {
                                color: 'var(--primary-color)',
                            },
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'var(--primary-color)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--primary-color)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-color)',
                            },
                        },
                    }}
                />

                <FormControl fullWidth error={!!errors.price} size="small">
                    <InputLabel
                        sx={{
                            color: 'var(--primary-color)',
                            '&.Mui-focused': {
                                color: 'var(--primary-color)',
                            },
                        }}
                    >
                        Price
                    </InputLabel>
                    <OutlinedInput
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        label="Price"
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--primary-color)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--primary-color)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--primary-color)',
                            }
                        }}
                    />
                    {errors.price && <FormHelperText>{errors.price}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel id="status-select-label"
                        sx={{
                            color: 'var(--primary-color)',
                            '&.Mui-focused': {
                                color: 'var(--primary-color)',
                            },
                        }}
                    >Status</InputLabel>
                    <Select
                        native
                        labelId="status-select-label"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        label="Status"
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--primary-color)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--primary-color)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--primary-color)',
                            }
                        }}
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <TextField
                        label="Add Tags"
                        size="small"
                        value={tagInput}
                        onChange={(e) => {
                            setTagInput(e.target.value);
                            // Clear error when user starts typing
                            if (tagError) setTagError('');
                        }}
                        onKeyDown={handleKeyDown}
                        error={!!tagError}
                        helperText={tagError}
                        InputLabelProps={{
                            sx: {
                                color: 'var(--primary-color)',
                                '&.Mui-focused': {
                                    color: 'var(--primary-color)',
                                },
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: tagError ? 'red' : 'var(--primary-color)',
                                },
                                '&:hover fieldset': {
                                    borderColor: tagError ? 'red' : 'var(--primary-color)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: tagError ? 'red' : 'var(--primary-color)',
                                },
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleAddTag}
                                        sx={{ color: 'var(--primary-color)' }}
                                    >
                                        <FaPlus />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {formData.tags.map((tag) => (
                            <Chip
                                key={tag.name}
                                label={tag.name}
                                onDelete={() => handleRemoveTag(tag.name)}
                                sx={{
                                    backgroundColor: 'rgba(56, 75, 112, 0.1)',
                                    color: 'var(--primary-color)',
                                    '& .MuiChip-deleteIcon': {
                                        color: 'var(--primary-color)',
                                        '&:hover': {
                                            color: 'var(--primary-color)',
                                        }
                                    }
                                }}
                            />
                        ))}
                    </Box>
                    <FormHelperText sx={{ color: 'var(--primary-color)' }}>
                        Add tags to categorize your expense
                    </FormHelperText>
                </FormControl>

                <FormControl fullWidth error={!!errors.file} size="small">
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload">
                        <Button variant="outlined" component="span" fullWidth
                            sx={{
                                color: 'var(--primary-color)',
                                borderColor: 'var(--primary-color)',
                                '&:hover': {
                                    borderColor: 'var(--primary-color)',
                                    backgroundColor: 'rgba(56, 75, 112, 0.04)'
                                }
                            }}
                        >
                            {formData.file ? (formData.file as File).name : expense?.file_path ? 'Change File' : 'Upload File'}
                        </Button>
                    </label>
                    {errors.file && <FormHelperText>{errors.file}</FormHelperText>}
                    {expense?.file_path && !formData.file && (
                        <FormHelperText>Current file: {expense.file_path}</FormHelperText>
                    )}
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    {onCancel && (
                        <button
                            onClick={() => {
                                setFormData({
                                    heading: '',
                                    description: '',
                                    price: '',
                                    file: null,
                                    tags: [],
                                    status: 'pending'
                                });
                                setErrors({});
                                onCancel();
                            }}
                            className='buttons'
                            style={{ backgroundColor: '#f5f5f5', color: '#333' }}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className='buttons'
                    >
                        {expense ? 'Update Expense' : 'Add Expense'}
                    </button>
                </Box>
            </Stack>
        </form>
    );
});