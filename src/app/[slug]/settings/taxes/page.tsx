'use client';
import React, { useState, useEffect } from 'react';
import {
    useFetchTaxesQuery,
    useCreateTaxMutation,
    useUpdateTaxMutation,
    useDeleteTaxMutation,
} from '@/slices/company/companyApi';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useBreadcrumb } from '@/provider/BreadcrumbContext';


function TaxesPage() {
    const { data: taxesData, isLoading, isError } = useFetchTaxesQuery();
    const [createTax] = useCreateTaxMutation();
    const [updateTax] = useUpdateTaxMutation();
    const [deleteTax] = useDeleteTaxMutation();
    const [isUpdating, setIsUpdating] = useState(false);
    const { setTitle } = useBreadcrumb();

    useEffect(() => {
        setTitle('All Taxes');
    }, [setTitle]);

    const [form, setForm] = useState({ id: null as number | null, name: '', rate: '' });

    const handleSubmit = async () => {
        if (!form.name || !form.rate) return;

        try {
            if (form.id) {
                setIsUpdating(true);
                await updateTax({ id: form.id, name: form.name, rate: parseFloat(form.rate) });
            } else {
                await createTax({ name: form.name, rate: parseFloat(form.rate) });
            }
            setForm({ id: null, name: '', rate: '' });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleEdit = (tax: Tax) => {
        setForm({ id: tax.id, name: tax.name, rate: tax.rate.toString() });
    };

    const handleCancel = () => {
        setForm({ id: null, name: '', rate: '' });
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this tax?")) {
            await deleteTax(id);
        }
    };

    return (
        <Box className="tax-page">
            <Paper className="glass-form">
                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Tax Name"
                        variant="outlined"
                        size="small"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        InputLabelProps={{ sx: { color: '#009693' } }}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        fullWidth
                        label="Tax Rate (%)"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={form.rate}
                        onChange={(e) => setForm({ ...form, rate: e.target.value })}
                        InputLabelProps={{ sx: { color: '#009693' } }}
                        sx={{ flex: 1 }}
                    />
                </Box>

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
                        {form.id ? (isUpdating ? "Updating..." : "Update") : "Add Tax"}
                    </Button>
                </Box>
            </Paper>

            {isLoading ? (
                <Box className="loading-center">
                    <CircularProgress />
                </Box>
            ) : isError ? (
                <Typography color="error">Failed to load taxes.</Typography>
            ) : (
                <div className="tax-grid">
                    {taxesData?.data?.map((tax: Tax) => (
                        <Paper key={tax.id} className="tax-box">
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography className="tax-name">{tax.name}</Typography>
                                <Typography className="tax-rate">{tax.rate}%</Typography>
                            </Box>
                            <Box className="action-buttons">
                                <IconButton className="edit-btn" onClick={() => handleEdit(tax)}>
                                    <FaEdit />
                                </IconButton>
                                <IconButton className="delete-btn" onClick={() => handleDelete(tax.id)}>
                                    <FaTrash />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))}
                </div>
            )}
        </Box>
    );
}

export default TaxesPage;