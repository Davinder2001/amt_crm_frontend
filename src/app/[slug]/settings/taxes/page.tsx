'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useFetchTaxesQuery,
    useCreateTaxMutation,
    useUpdateTaxMutation,
    useDeleteTaxMutation,
} from '@/slices/company/companyApi';
import { FaArrowLeft } from 'react-icons/fa';

function TaxesPage() {
    const { data: taxesData, isLoading } = useFetchTaxesQuery();
    const [createTax] = useCreateTaxMutation();
    const [updateTax] = useUpdateTaxMutation();
    const [deleteTax] = useDeleteTaxMutation();
    const router = useRouter();

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
        <div className="tax-page-outer-container">
            <div className='tax-page-header'>
            <button className="back-button" onClick={() => router.back()}>
                <FaArrowLeft size={20} color="#fff" />
            </button>
               

            </div>
            <div className='tax-page-inner-container'>
            <div className="create-tax-section">
                    <h3>Add New Tax</h3>
                    <div className='create-tax-inputs'>
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
                    </div>
                    <div className='create-tax-button'>
                        <button onClick={handleCreate}>Create</button>
                    </div>
                </div>
                <div className='taxes-list-outer'>
                    <ul>
                        {taxesData?.data.map((tax) => (
                            <li key={tax.id}>
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
                                        <div className='text-edit-buttons'>
                                        <button onClick={() => handleUpdate(tax.id)}>Save</button>
                                        <button className="cancel" onClick={() => setEditingTaxId(null)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <strong>{tax.name}</strong>
                                        <div className='texrate-buttons-outer'>
                                            <div className='texrate-buttons-inner'>
                                                <div className='tex-wrapper'>
                                                    - {tax.rate}%
                                                </div>

                                                <div className='text-card-outer'>
                                                    <button onClick={() => {
                                                        setEditingTaxId(tax.id);
                                                        setEditTax({ name: tax.name, rate: tax.rate.toString() });
                                                    }}>Edit</button>
                                                    <button onClick={() => handleDelete(tax.id)}>Delete</button>

                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TaxesPage;
