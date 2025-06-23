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
    Typography,
} from '@mui/material';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const Attributes = () => {
    const { data: response, isLoading, error } = useFetchAttributesQuery();
    const attributes = response?.data || [];
    const [createAttribute] = useCreateAttributeMutation();
    const [deleteAttribute] = useDeleteAttributeMutation();
    const [toggleStatus] = useToggleAttributeStatusMutation();
    const [updateAttribute] = useUpdateAttributeMutation();
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
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
    const promptDelete = (id: number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteId === null) return;
        try {
            await deleteAttribute(deleteId).unwrap();
            toast.success('Attribute deleted');
        } catch {
            toast.error('Error deleting attribute');
        } finally {
            setShowConfirm(false);
            setDeleteId(null);
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
                        <button onClick={() => handleEdit(attr.id)} className="edit-btn" type='button'>
                            <FaEdit />
                        </button>
                        <button onClick={() => promptDelete(attr.id)} className="delete-btn" type='button'>
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
                    <button className="buttons" onClick={() => setIsModalOpen(true)} type='button'>
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
                        <button className="buttons" onClick={() => setIsModalOpen(true)} type='button'>
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
                <div className='attribute-outer-wrapper'>

                    <div>
                        <Typography variant="subtitle2" gutterBottom>
                            Attribute Name
                        </Typography>
                        <input
                            value={newAttributeName}
                            onChange={(e) => setNewAttributeName(e.target.value)}
                            placeholder="Enter attribute name"
                        />
                    </div>

                    <div>
                        <Typography variant="subtitle2" gutterBottom>
                            Attribute Values
                        </Typography>

                        <div className="values-scroll-container">
                            {values.map((val, index) => (
                                <div key={index} className="value-row">
                                    <input
                                        value={val}
                                        onChange={(e) => handleValueChange(index, e.target.value)}
                                        placeholder={`val ${index + 1}`}
                                    />
                                    {index > 0 && (
                                        <span onClick={() => removeValueField(index)}>
                                            <FaTimes />
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                <button onClick={addNewValueField} className="value-add-button" type='button'>
                    <FaPlus /> Add Another Value
                </button>

                <div className="modal-actions">
                    <button onClick={handleModalClose} className="cancel-btn buttons buttons" type='button'>
                        Cancel
                    </button>
                    <button onClick={handleCreate} className="buttons">
                        {editAttributeId ? 'Update Attribute' : 'Add Attribute'}
                    </button>
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={showConfirm}
                message="Are you sure you want to delete this attribute?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowConfirm(false);
                    setDeleteId(null);
                }}
                type="delete"
            />
        </div>
    );
};

export default Attributes;
