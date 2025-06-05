'use client';

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { FaEdit, FaTrash, FaPlus, FaTasks } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';

type Tax = {
    id: number;
    name: string;
    rate: number;
};

function TaxesPage() {
    const { data: taxesData, isLoading, isError, refetch } = useFetchTaxesQuery();
    const [createTax] = useCreateTaxMutation();
    const [updateTax] = useUpdateTaxMutation();
    const [deleteTax] = useDeleteTaxMutation();
    const [isUpdating, setIsUpdating] = useState(false);
    const { setTitle } = useBreadcrumb();
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState<{ id: number | null; name: string; rate: string }>({
        id: null,
        name: '',
        rate: '',
    });

    useEffect(() => {
        setTitle('All Taxes');
    }, [setTitle]);

    const handleSubmit = async () => {
        if (!form.name || !form.rate) return;

        try {
            if (form.id) {
                setIsUpdating(true);
                await updateTax({ id: form.id, name: form.name, rate: parseFloat(form.rate) }).unwrap();
                toast.success('Tax updated successfully');
            } else {
                await createTax({ name: form.name, rate: parseFloat(form.rate) }).unwrap();
                toast.success('Tax created successfully');
            }
            setForm({ id: null, name: '', rate: '' });
            setShowForm(false);
            refetch();
        } finally {
            setIsUpdating(false);
        }
    };

    const handleEdit = (tax: Tax) => {
        setForm({ id: tax.id, name: tax.name, rate: tax.rate.toString() });
        setShowForm(true);
    };

    const handleCancel = () => {
        setForm({ id: null, name: '', rate: '' });
        setShowForm(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this tax?')) {
            try {
                await deleteTax(id).unwrap();
                toast.success('Tax deleted successfully');
                refetch();
            } catch {
                toast.error('Failed to delete tax');
            }
        }
    };

    if (isLoading) return <LoadingState />;

    if (isError) {
        return (
            <EmptyState
                icon="alert"
                title="Failed to load taxes"
                message="We encountered an error while loading taxes. Please try again later."
            />
        );
    }

    if (!taxesData?.data || taxesData.data.length === 0) {
        return (
            <EmptyState
                icon={<FaTasks className="empty-state-icon" />}
                title="No taxes found"
                message="You haven't created any tax entries yet."
                action={
                    <Button className="buttons" onClick={() => setShowForm(true)}>
                        <FaPlus size={18} /> Add New Tax
                    </Button>
                }
            />
        );
    }

    return (
        <Box className="tax-page">
            <ToastContainer />

            {/* Top right Add New Tax button */}
            <Box className="top-bar-actions" display="flex" justifyContent="flex-end" mb={2}>
                {!showForm && (
                    <Button
                        className="add-tax-btn"
                        startIcon={<FaPlus />}
                        onClick={() => setShowForm(true)}
                    >
                        Add New Tax
                    </Button>
                )}
            </Box>


            {showForm && (
                <Paper className="glass-form" sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Tax Name"
                            variant="outlined"
                            size="small"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Tax Rate (%)"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={form.rate}
                            onChange={(e) => setForm({ ...form, rate: e.target.value })}
                        />
                    </Box>
                    <Box className="form-actions">
                        <Button className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            className="buttons update-add-btn"
                            onClick={handleSubmit}
                            startIcon={!form.id ? <FaPlus /> : null}
                            disabled={isUpdating}
                        >
                            {form.id ? (isUpdating ? 'Updating...' : 'Update') : 'Add Tax'}
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Tax Items */}
            <div className="tax-grid">
                {taxesData.data.map((tax: Tax) => (
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
        </Box>
    );
}

export default TaxesPage;
