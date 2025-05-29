'use client';
import { useParams, useRouter } from 'next/navigation';
import { useFetchCustomerByIdQuery } from '@/slices/customers/customer';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

function CustomerView() {
    const { id } = useParams();
    const router = useRouter();
    const { data, isLoading } = useFetchCustomerByIdQuery(Number(id));

    if (isLoading) return <p className="loading">Loading...</p>;
    if (!data || !data.customer) return <p className="error">Customer not found.</p>;

    const customer = data.customer;

    return (
        <div className="customer-view-container">
            <button onClick={() => router.back()} className="back-button">
                <FaArrowLeft size={18} />
            </button>

            <div className="customer-card">
                <h2>Customer Details</h2>
                <div className="info">
                    <p><strong>Name:</strong> {customer.name || 'N/A'}</p>
                    <p><strong>Phone Number:</strong> {customer.number || 'N/A'}</p>
                    <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
                    <p><strong>Company ID:</strong> {customer.company_id}</p>
                </div>
            </div>
        </div>
    );
}

export default CustomerView;
