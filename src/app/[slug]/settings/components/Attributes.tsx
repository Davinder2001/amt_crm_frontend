'use client';

import React, { useState } from 'react';
import {
    useFetchAttributesQuery,
    useCreateAttributeMutation,
    useDeleteAttributeMutation,
    useToggleAttributeStatusMutation,
} from '@/slices/store/storeApi';
import { FaPlus, FaTrash, FaTimes, FaTasks } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import { toast } from 'react-toastify';
import {
    Box,
    TextField,
    Typography,
} from '@mui/material';

const Attributes = () => {
    const { data: attributes, isLoading, error } = useFetchAttributesQuery();
    const [createAttribute] = useCreateAttributeMutation();
    const [deleteAttribute] = useDeleteAttributeMutation();
    const [toggleStatus] = useToggleAttributeStatusMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAttributeName, setNewAttributeName] = useState('');
    const [values, setValues] = useState<string[]>(['']);

    const handleValueChange = (index: number, newValue: string) => {
        const updated = [...values];
        updated[index] = newValue;
        setValues(updated);
    };

    const addNewValueField = () => setValues([...values, '']);
    const removeValueField = (index: number) => {
        const updated = [...values];
        updated.splice(index, 1);
        setValues(updated);
    };

    const handleCreate = async () => {
        if (!newAttributeName.trim()) return;
        const filteredValues = values.filter((v) => v.trim() !== '');
        if (filteredValues.length === 0) return;

        try {
            await createAttribute({ name: newAttributeName, values: filteredValues }).unwrap();
            toast.success('Attribute created');
            setNewAttributeName('');
            setValues(['']);
            setIsModalOpen(false);
        } catch {
            toast.error('Failed to create attribute');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this attribute?')) return;
        try {
            await deleteAttribute(id).unwrap();
            toast.success('Attribute deleted');
        } catch {
            toast.error('Error deleting attribute');
        }
    };

    const handleStatusChange = async (id: number) => {
        try {
            await toggleStatus(id).unwrap();
            toast.success('Status updated');
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Error toggling status');
        }
    };

    if (isLoading) return <LoadingState />;
    if (error) {
        toast.error('Failed to load attributes');
        return <div>Error loading attributes.</div>;
    }

    const columns = [
        { label: 'Attribute Name', key: 'name' as keyof Attribute },
        {
            label: 'Values',
            render: (attr: Attribute) => attr.values?.map((v) => v.value).join(', ') || '—',
        },
        {
            label: 'Status',
            render: (attr: Attribute) => (
                <span className={`status-pill ${attr.status === 'active' ? 'active-option' : 'inactive-option'}`}>
                    {attr.status}
                </span>
            ),
        },
        {
            label: 'Toggle',
            render: (attr: Attribute) => (
                <div
                    className={`toggle-switch ${attr.status === 'active' ? 'active' : 'inactive'}`}
                    onClick={() => handleStatusChange(attr.id)}
                    title="Click to toggle"
                >
                    <div className="toggle-thumb" />
                </div>
            ),
        },
        {
            label: 'Actions',
            render: (attr: Attribute) => (
                <button onClick={() => handleDelete(attr.id)} className="delete-btn">
                    <FaTrash />
                </button>
            ),
        },
    ];

    return (
        <div className="Attribute-form-outer">
            {(attributes?.length ?? 0) > 0 && (
                <div className="navigation-buttons">
                    <button className="buttons" onClick={() => setIsModalOpen(true)}>
                        <FaPlus /> Add Attribute
                    </button>
                </div>
            )}

            {(attributes?.length ?? 0) === 0 ? (
                <EmptyState
                    icon={<FaTasks className="empty-state-icon" />}
                    title="No attributes found"
                    message="You haven't created any attributes yet."
                    action={
                        <button className="buttons" onClick={() => setIsModalOpen(true)}>
                            <FaPlus size={18} /> Add Attribute
                        </button>
                    }
                />
            ) : (
                <ResponsiveTable data={attributes || []} columns={columns} />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Attribute"
                width="500px"
            >
                <TextField
                    fullWidth
                    label="Attribute Name"
                    value={newAttributeName}
                    onChange={(e) => setNewAttributeName(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" gutterBottom>
                    Attribute Values
                </Typography>

                <div className="values-scroll-container" >
                    {values.map((val, index) => (
                        <Box key={index} className="value-row">
                            <TextField
                                fullWidth
                                value={val}
                                onChange={(e) => handleValueChange(index, e.target.value)}
                                placeholder={`val ${index + 1}`}
                                size="small"
                            />
                            {index > 0 && (
                                <span onClick={() => removeValueField(index)}>
                                    <FaTimes />
                                </span>
                            )}
                        </Box>
                    ))}
                </div>

                <button
                onClick={addNewValueField}
                className="value-add-button "
                >
                <FaPlus />
                Add Another Value
            </button>

            <div className="modal-actions">
                <button onClick={handleCreate} className="buttons" >
                    Add Attribute
                </button>
                <button onClick={() => setIsModalOpen(false)} className="buttons">
                    Cancel
                </button>
            </div>
        </Modal>
        </div >
    );
};

export default Attributes;
