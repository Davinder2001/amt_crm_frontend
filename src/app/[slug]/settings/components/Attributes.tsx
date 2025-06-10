'use client';

import React, { useState } from 'react';
import {
    useFetchAttributesQuery,
    useCreateAttributeMutation,
    useDeleteAttributeMutation,
    useToggleAttributeStatusMutation,
    useUpdateAttributeMutation,
} from '@/slices/store/storeApi';
import { FaPlus, FaTrash, FaTimes, FaTasks, FaEdit } from 'react-icons/fa';
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
    const [updateAttribute] = useUpdateAttributeMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAttributeName, setNewAttributeName] = useState('');
    const [values, setValues] = useState<string[]>(['']);
    const [editAttributeId, setEditAttributeId] = useState<number | null>(null);

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

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewAttributeName('');
        setValues(['']);
        setEditAttributeId(null);
    };

    const handleCreate = async () => {
        if (!newAttributeName.trim()) return;
        const filteredValues = values.filter((v) => v.trim() !== '');
        if (filteredValues.length === 0) return;

        try {
            if (editAttributeId !== null) {
                await updateAttribute({
                    id: editAttributeId,
                    data: {
                        name: newAttributeName,
                        values: filteredValues, // ✅ Send only strings
                    },
                }).unwrap();
                toast.success('Attribute updated');
            } else {
                await createAttribute({
                    name: newAttributeName,
                    values: filteredValues,
                }).unwrap();
                toast.success('Attribute created');
            }
            handleModalClose();
        } catch {
            toast.error(editAttributeId ? 'Failed to update attribute' : 'Failed to create attribute');
        }
    };

    const handleEdit = (id: number) => {
        const attr = attributes?.find(a => a.id === id);
        if (!attr) return;

        setNewAttributeName(attr.name);
        setValues(attr.values?.map(v => v.value) || ['']);
        setEditAttributeId(id);
        setIsModalOpen(true);
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
                <select
                    value={attr.status}
                    onChange={() => handleStatusChange(attr.id)}
                    className={`status-dropdown ${attr.status === 'active' ? 'active' : 'inactive'}`}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            ),
        },
        {
            label: 'Actions',
            render: (attr: Attribute) => (
                <>
                    <div className="attribute-actions-btn-outer">
                        <button onClick={() => handleEdit(attr.id)} className="edit-btn">
                            <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(attr.id)} className="delete-btn">
                            <FaTrash />
                        </button>
                    </div>
                </>
            ),
        },
    ];

    return (
        <div className="attribute-form-outer">
            {(attributes?.length ?? 0) > 0 && (
                <div className="modal-actions">
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
                <div className="attributes-wrapper">
                    <ResponsiveTable
                        data={[...(attributes || [])].sort((a, b) =>
                            a.status === 'active' && b.status !== 'active' ? -1 : 1
                        )}
                        columns={columns}
                        cardViewKey='name'
                    />
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={editAttributeId ? 'Edit Attribute' : 'Create New Attribute'}
                width="500px"
            >
                <Typography variant="subtitle2" gutterBottom>
                    Attribute Name
                </Typography>
                <TextField
                    fullWidth
                    value={newAttributeName}
                    onChange={(e) => setNewAttributeName(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                    placeholder="Enter attribute name"
                />

                <Typography variant="subtitle2" gutterBottom>
                    Attribute Values
                </Typography>

                <div className="values-scroll-container">
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

                <button onClick={addNewValueField} className="value-add-button">
                    <FaPlus /> Add Another Value
                </button>

                <div className="modal-actions">
                    <button onClick={handleModalClose} className="buttons">
                        Cancel
                    </button>
                    <button onClick={handleCreate} className="buttons">
                        {editAttributeId ? 'Update Attribute' : 'Add Attribute'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Attributes;
