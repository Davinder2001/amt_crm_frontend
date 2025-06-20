'use client';
import React, { useState } from 'react';
import { useSelectedItem } from '@/provider/SelectedItemContext';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaSpinner } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';
import { useCreateItemBatchMutation } from '@/slices';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

function CreateNewBatch() {
    const { itemId } = useSelectedItem();
    const { companySlug } = useCompany();
    const router = useRouter();
    const [createBatch, { isLoading }] = useCreateItemBatchMutation();
    const [formData, setFormData] = useState({
        batch_number: '',
        cost_price: '',
        quantity_count: '',
        item_id: itemId || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await createBatch({
                item_id: Number(formData.item_id),
                batch_number: formData.batch_number || undefined,
                cost_price: Number(formData.cost_price),
                quantity_count: Number(formData.quantity_count)
            }).unwrap();

            if (response.success) {
                toast.success('Batch created successfully!');
                router.push(`/${companySlug}/store`);
            } else {
                toast.error(response.message || 'Failed to create batch');
            }
        } catch (error) {
            toast.error('An error occurred while creating the batch');
            console.error('Create batch error:', error);
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <div style={{ maxWidth: 672, margin: '0 auto', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <Link href={`/${companySlug}/store`} style={{ display: 'flex', alignItems: 'center', color: '#384B70', textDecoration: 'none' }}>
                        <FaArrowLeft style={{ marginRight: 8 }} />
                        Back to Store
                    </Link>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>Create New Batch</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input type="hidden" name="item_id" value={formData.item_id} />

                    <div>
                        <label htmlFor="batch_number" style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                            Batch Number (Optional)
                        </label>
                        <input
                            type="text"
                            id="batch_number"
                            name="batch_number"
                            value={formData.batch_number}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6 }}
                            placeholder="Enter batch number"
                        />
                    </div>

                    <div>
                        <label htmlFor="cost_price" style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                            Cost Price *
                        </label>
                        <input
                            type="number"
                            id="cost_price"
                            name="cost_price"
                            value={formData.cost_price}
                            onChange={handleChange}
                            required
                            min="0.01"
                            step="0.01"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6 }}
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label htmlFor="quantity_count" style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                            Quantity *
                        </label>
                        <input
                            type="number"
                            id="quantity_count"
                            name="quantity_count"
                            value={formData.quantity_count}
                            onChange={handleChange}
                            required
                            min="1"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6 }}
                            placeholder="Enter quantity"
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px 16px',
                                backgroundColor: '#384B70',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer',
                                opacity: isLoading ? 0.5 : 1
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FaPlus style={{ marginRight: 8 }} />
                                    Create Batch
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateNewBatch;