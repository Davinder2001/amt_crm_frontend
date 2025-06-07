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
    IconButton,
    TextField,
} from '@mui/material';
import { FaPlus, FaTrash, FaEdit, FaTasks } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';

// Types
type Tax = {
    id: number;
    name: string;
    rate: number;
};

type ApiResponse = {
    status?: boolean;
    message?: string;
    data?: unknown;
    error?: string;
};

type ApiError = {
    data?: {
        message?: string;
        error?: string;
        errors?: Record<string, string[]>;
    };
};

const TaxesPage = () => {
    const { setTitle } = useBreadcrumb();
    const { data: taxesData, isLoading, isError, refetch } = useFetchTaxesQuery();
    const [createTax] = useCreateTaxMutation();
    const [updateTax] = useUpdateTaxMutation();
    const [deleteTax] = useDeleteTaxMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [form, setForm] = useState<{ id: number | null; name: string; rate: string }>({
        id: null,
        name: '',
        rate: '',
    });

    useEffect(() => {
        setTitle('All Taxes');
    }, [setTitle]);

    const handleOpen = () => {
        setForm({ id: null, name: '', rate: '' });
        setModalOpen(true);
    };

    const handleEdit = (tax: Tax) => {
        setForm({ id: tax.id, name: tax.name, rate: tax.rate.toString() });
        setModalOpen(true);
    };

    const handleClose = () => {
        setForm({ id: null, name: '', rate: '' });
        setModalOpen(false);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.rate) return;

        try {
            setIsUpdating(true);

            if (form.id) {
                // Update tax
                const response: ApiResponse = await updateTax({
                    id: form.id,
                    name: form.name,
                    rate: parseFloat(form.rate),
                }).unwrap();

                toast.success(response.message || 'Tax updated successfully');
                handleClose(); // ✅ close after update
                refetch();

            } else {
                // Create tax
                const response: ApiResponse = await createTax({
                    name: form.name,
                    rate: parseFloat(form.rate),
                }).unwrap();

                toast.success(response.message || 'Tax created successfully');
                handleClose(); // ✅ close after create
                refetch();
            }

        } catch (err: unknown) {
            const error = err as ApiError;
            toast.error(error?.data?.message || error?.data?.error || 'Something went wrong');
        } finally {
            setIsUpdating(false);
        }
    };


    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tax?')) return;

        try {
            const response: ApiResponse = await deleteTax(id).unwrap();
            if (response.status) {
                toast.success(response.message);
                refetch();
            } else {
                toast.error(response.message || response.error || 'Failed to delete tax');
            }
        } catch (err: unknown) {
            const error = err as ApiError;
            toast.error(error?.data?.message || error?.data?.error || 'Failed to delete tax');
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

    const columns = [
        { label: 'Tax Name', key: 'name' as keyof Tax },
        { label: 'Rate (%)', render: (tax: Tax) => `${tax.rate}%` },
        {
            label: 'Actions',
            render: (tax: Tax) => (
                <Box display="flex" gap={1} className="action-buttons">
                    <IconButton onClick={() => handleEdit(tax)} className="edit-btn"><FaEdit /></IconButton>
                    <IconButton onClick={() => handleDelete(tax.id)} className="delete-btn"><FaTrash /></IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box className="tax-page">
            <ToastContainer />

            {(taxesData?.data?.length ?? 0) > 0 && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <button className="buttons" onClick={handleOpen}>
                        <FaPlus /> Add New Tax
                    </button>
                </Box>
            )}

            {(taxesData?.data?.length ?? 0) === 0 ? (
                <EmptyState
                    icon={<FaTasks className="empty-state-icon" />}
                    title="No taxes found"
                    message="You haven't created any tax entries yet."
                    action={
                        <button className="buttons" onClick={handleOpen}>
                            <FaPlus size={16} /> Add New Tax
                        </button>
                    }
                />
            ) : (
                <ResponsiveTable data={taxesData?.data || []} columns={columns} />
            )}

            <Modal
                isOpen={modalOpen}
                onClose={handleClose}
                title={form.id ? 'Update Tax' : 'Add New Tax'}
                width="400px"
            >
                <Box sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Tax Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Tax Rate (%)"
                        value={form.rate}
                        onChange={(e) => setForm({ ...form, rate: e.target.value })}
                        variant="outlined"
                        type="number"
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <button onClick={handleClose} className="buttons cancel-btn">Cancel</button>
                        <button className="buttons" onClick={handleSubmit} disabled={isUpdating}>
                            {form.id ? (isUpdating ? 'Updating...' : 'Update') : 'Add Tax'}
                        </button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default TaxesPage;
