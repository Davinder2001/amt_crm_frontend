// components/ExpenseForm.tsx
'use client';

import { useState } from 'react';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Stack
} from '@mui/material';
import { useCreateExpenseMutation, useUpdateExpenseMutation } from '@/slices';

interface ExpenseFormProps {
    expense?: Expense | null;
    onSuccess: () => void;
    onCancel?: () => void;
}

export default function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
    const [createExpense] = useCreateExpenseMutation();
    const [updateExpense] = useUpdateExpenseMutation();
    const [heading, setHeading] = useState(expense?.heading || '');
    const [description, setDescription] = useState(expense?.description || '');
    const [price, setPrice] = useState(expense?.price.toString() || '');
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!heading) newErrors.heading = 'Heading is required';
        if (!price || isNaN(Number(price))) newErrors.price = 'Valid price is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (expense) {
                // Update existing expense
                await updateExpense({
                    id: expense.id,
                    data: {
                        heading,
                        description: description || null,
                        price: Number(price),
                        file: file || null,
                    },
                }).unwrap();
            } else {
                // Create new expense
                if (!file) {
                    setErrors({ ...errors, file: 'File is required' });
                    return;
                }

                await createExpense({
                    heading,
                    description: description || null,
                    price: Number(price),
                    file,
                }).unwrap();
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving expense:', error);
            setErrors({ form: 'An error occurred while saving the expense' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
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
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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

                <FormControl fullWidth error={!!errors.price}>
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
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
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

                <FormControl fullWidth error={!!errors.file}>
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
                            {file ? file.name : expense?.file_path ? 'Change File' : 'Upload File'}
                        </Button>
                    </label>
                    {errors.file && <FormHelperText>{errors.file}</FormHelperText>}
                    {expense?.file_path && !file && (
                        <FormHelperText>Current file: {expense.file_path}</FormHelperText>
                    )}
                </FormControl>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10}}>
                    {onCancel && (
                        <button
                            type="button"
                            className='buttons'
                            onClick={() => {
                                // Clear form state when canceling
                                setHeading('');
                                setDescription('');
                                setPrice('');
                                setFile(null);
                                setErrors({});
                                onCancel();
                            }}
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
                </div>
            </Stack>
        </form>
    );
}