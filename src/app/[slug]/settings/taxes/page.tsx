'use client';
import React, { useState } from 'react';
import {
    useFetchTaxesQuery,
    useCreateTaxMutation,
    useUpdateTaxMutation,
    useDeleteTaxMutation,
} from '@/slices/company/companyApi';

function TaxesPage() {
    const { data: taxesData, isLoading } = useFetchTaxesQuery();
    const [createTax] = useCreateTaxMutation();
    const [updateTax] = useUpdateTaxMutation();
    const [deleteTax] = useDeleteTaxMutation();

    const [newTax, setNewTax] = useState({ name: '', rate: '' });
    const [editingTaxId, setEditingTaxId] = useState<number | null>(null);
    const [editTax, setEditTax] = useState({ name: '', rate: '' });

    const handleCreate = async () => {
        if (!newTax.name || !newTax.rate) return;

        await createTax({ name: newTax.name, rate: parseFloat(newTax.rate) });
        setNewTax({ name: '', rate: '' });
    };

    const handleUpdate = async (id: number) => {
        await updateTax({ id, name: editTax.name, rate: parseFloat(editTax.rate) });
        setEditingTaxId(null);
        setEditTax({ name: '', rate: '' });
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this tax?')) {
            await deleteTax(id);
        }
    };

    if (isLoading) return <p>Loading taxes...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Taxes List</h2>

            <ul>
                {taxesData?.data.map((tax) => (
                    <li key={tax.id} style={{ marginBottom: '10px' }}>
                        {editingTaxId === tax.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editTax.name}
                                    onChange={(e) => setEditTax({ ...editTax, name: e.target.value })}
                                    placeholder="Tax name"
                                />
                                <input
                                    type="number"
                                    value={editTax.rate}
                                    onChange={(e) => setEditTax({ ...editTax, rate: e.target.value })}
                                    placeholder="Tax rate"
                                />
                                <button onClick={() => handleUpdate(tax.id)}>Save</button>
                                <button onClick={() => setEditingTaxId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <strong>{tax.name}</strong> - {tax.rate}%
                                <button onClick={() => {
                                    setEditingTaxId(tax.id);
                                    setEditTax({ name: tax.name, rate: tax.rate.toString() });
                                }}>Edit</button>
                                <button onClick={() => handleDelete(tax.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <h3>Add New Tax</h3>
            <input
                type="text"
                value={newTax.name}
                onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                placeholder="Tax name"
            />
            <input
                type="number"
                value={newTax.rate}
                onChange={(e) => setNewTax({ ...newTax, rate: e.target.value })}
                placeholder="Tax rate"
            />
            <button onClick={handleCreate}>Create</button>
        </div>
    );
}

export default TaxesPage;
