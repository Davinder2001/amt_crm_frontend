'use client';
import React, { useState } from 'react';
import {
    useFetchAttributesQuery,
    useCreateAttributeMutation,
    useDeleteAttributeMutation,
    useToggleAttributeStatusMutation,
} from '@/slices/store/storeApi';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';

const Attributes = () => {
    const { data: attributes, isLoading, isError } = useFetchAttributesQuery();
    const [createAttribute] = useCreateAttributeMutation();
    const [deleteAttribute] = useDeleteAttributeMutation();
    const [toggleStatus] = useToggleAttributeStatusMutation();

    const [newAttributeName, setNewAttributeName] = useState('');
    const [values, setValues] = useState<string[]>(['']);
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);

    const handleValueChange = (index: number, newValue: string) => {
        const updated = [...values];
        updated[index] = newValue;
        setValues(updated);
    };

    const addNewValueField = () => {
        setValues([...values, '']);
    };

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
            setNewAttributeName('');
            setValues(['']);
            setIsCanvasOpen(false); // Close canvas after successful creation
        } catch (error) {
            console.error('Error creating attribute:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this attribute?')) {
            try {
                await deleteAttribute(id).unwrap();
            } catch (error) {
                console.error('Error deleting attribute:', error);
            }
        }
    };

    const handleStatusChange = async (id: number) => {
        try {
            await toggleStatus(id).unwrap();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    if (isLoading) return <p>Loading attributes...</p>;
    if (isError) return <p>Failed to load attributes.</p>;

    return (
        <>
            <h1 className="title">Variations</h1>

            {/* Open Canvas Button */}
            <div className="add-attribute-button-container">
            <button
                type="button"
                onClick={() => setIsCanvasOpen(true)}
                className='buttons floting-attributes-button' title='Add New Attribute'
            >
                <FaPlus />
            </button>
            </div>

            {/* Sliding Canvas */}
            <div
                className={`canvas ${isCanvasOpen ? 'open' : ''}`}
            >
                <div className="canvas-content">
                    <h2 className="canvas-title  create-attribute-title">Create New Attribute</h2>
                    {/* Create Attribute Form */}
                    <div className="form-container">
                        <label className="label">Add New Attribute</label>
                        <input
                            type="text"
                            value={newAttributeName}
                            onChange={(e) => setNewAttributeName(e.target.value)}
                            placeholder="New attribute name"
                            className="input"
                        />

                        {/* Multiple Values Input */}
                        <div className="values-container">
                            <label className="label">Attribute Values</label>
                            {values.map((val, index) => (
                                <div key={index} className="value-row">
                                    <input
                                        type="text"
                                        value={val}
                                        onChange={(e) => handleValueChange(index, e.target.value)}
                                        placeholder={`Value ${index + 1}`}
                                        className="input"
                                    />
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeValueField(index)}
                                            className="remove-btns "
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addNewValueField}
                                className="buttons add-Another-value-btn"
                            >
                                <FaPlus /> Add Another value
                            </button>
                        </div>

                        <button type="button" onClick={handleCreate} className="buttons">
                            Add Attribute
                        </button>
                        <button type="button" onClick={() => setIsCanvasOpen(false)} className="close-btn">
                            <FaTimes />
                        </button>

                    </div>
                </div>
            </div>

            {/* Attributes Table */}
            <div className="attributes-table">
                {attributes?.map((attribute) => (
                    <div key={attribute.id} className="attribute-card">
                        <h3>{attribute.name}</h3>
                        <div className="values">{attribute.values?.map(v => v.value).join(', ') || '—'}</div>
                        <div className='selector-and-active-inactive-outer'>
                            <div className={`status-pill ${attribute.status === 'active' ? 'active-option' : 'inactive-option'}`}>
                                {attribute.status}
                            </div>
                            <div
                                className={`toggle-switch ${attribute.status === 'active' ? 'active' : 'inactive'}`}
                                onClick={() => handleStatusChange(attribute.id)}
                            >
                                <div className="toggle-thumb" />
                            </div>


                        </div>
                        <button
                            type="button"
                            onClick={() => handleDelete(attribute.id)}
                            className="delete-btn"
                        >
                            <FaTrash />
                        </button>

                    </div>
                ))}
            </div>
        </>

    );
};

export default Attributes;