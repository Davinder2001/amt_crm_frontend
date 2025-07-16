'use client';

import React, { useState } from 'react';
import {
    useFetchTaxesQuery,
    useCreateTaxMutation,
    useUpdateTaxMutation,
    useDeleteTaxMutation,
} from '@/slices';
import {
    Box,
    IconButton,
} from '@mui/material';
import { FaPlus, FaTrash, FaEdit, FaTasks } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';

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

const CreateTax = () => {
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

    const [deleteState, setDeleteState] = useState<{
        id: number | null;
        name: string;
        showDialog: boolean;
    }>({
        id: null,
        name: "",
        showDialog: false
    });

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


    const deleteTaxCore = async (id: number) => {
        try {
            await deleteTax(id).unwrap();
            toast.success('Tax deleted successfully!');
            refetch();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete tax');
        }
    };

    const promptDelete = (id: number, name: string) => {
        setDeleteState({
            id,
            name,
            showDialog: true
        });
    };

    const confirmDelete = async () => {
        if (deleteState.id) {
            await deleteTaxCore(deleteState.id);
            setDeleteState({
                id: null,
                name: "",
                showDialog: false
            });
        }
    };

    const handleDelete = async (id: number) => {
        await deleteTaxCore(id);
    };

    if (isLoading) return <LoadingState />;
    if (isError) {
        return (
            <EmptyState
                icon={<FaTriangleExclamation className='empty-state-icon' />}
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
                    <IconButton onClick={() => promptDelete(tax.id, tax.name)} className="delete-btn"><FaTrash /></IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box className="tax-page">
            <ToastContainer />

            {(taxesData?.data?.length ?? 0) > 0 && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <button className="buttons" onClick={handleOpen} type='button'>
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
                        <button className="buttons" onClick={handleOpen} type='button'>
                            <FaPlus size={16} /> Add New Tax
                        </button>
                    }
                />
            ) : (
                <ResponsiveTable
                    data={taxesData?.data || []}
                    columns={columns}
                    onDelete={handleDelete}
                    onEdit={(id) => {
                        const tax = taxesData?.data.find(t => t.id === id);
                        if (tax) handleEdit(tax);
                    }}
                    cardView={(tax) => (
                        <>
                            <div className="card-row">
                                <h5>{tax.name}</h5>
                                <p className="tax-rate">{tax.rate}%</p>
                            </div>
                        </>
                    )}
                />
            )}

            <Modal
                isOpen={modalOpen}
                onClose={handleClose}
                title={form.id ? 'Update Tax' : 'Add New Tax'}
                width="400px"
            >
                <div className="tax-form-wrapper">
                    <div>
                        <label>Tax Name</label>
                        <input
                            placeholder='tax name'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Tax Rate (%)</label>
                        <input
                            placeholder='tax rate'
                            value={form.rate}
                            onChange={(e) => setForm({ ...form, rate: e.target.value })}
                            type="number"
                        />
                    </div>
                    <div className='create-tax-action-wrapper'>
                        <button onClick={handleClose} className="buttons cancel-btn">Cancel</button>
                        <button className="buttons" onClick={handleSubmit} disabled={isUpdating}>
                            {form.id ? (isUpdating ? 'Updating...' : 'Update') : 'Add Tax'}
                        </button>
                    </div>
                </div>
            </Modal>
            <ConfirmDialog
                isOpen={deleteState.showDialog}
                message={`Are you sure you want to delete the tax "${deleteState.name}"?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteState({
                    id: null,
                    name: "",
                    showDialog: false
                })}
                type="delete"
            />
        </Box>
    );
};

export default CreateTax;
