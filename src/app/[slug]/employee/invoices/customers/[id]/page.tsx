'use client';
import { useParams, useRouter } from 'next/navigation';
import { useFetchCustomerByIdQuery } from '@/slices/customers/customerApi';
import React from 'react';
import { useCompany } from '@/utils/Company';

function CustomerView() {
    const { id } = useParams(); // Get the customer ID from the URL params
    const router = useRouter();
    const { companySlug } = useCompany();

    // Fetch customer data by ID
    const { data: customer } = useFetchCustomerByIdQuery(Number(id));

    if (!customer) return <div>Customer not found.</div>;

    // Log the customer object to make sure data is available
    console.log(customer);  // For debugging purposes

    return (
        <div>
            <h1>Customer Details</h1>
            {/* Only render fields if they are available */}
            <p><strong>Name:</strong> {customer.name || 'N/A'}</p>
            <p><strong>Phone Number:</strong> {customer.number || 'N/A'}</p>
            <p><strong>Email:</strong> {customer.email ? customer.email : 'N/A'}</p> {/* Handle null email case */}
            <p><strong>Company Id:</strong> {customer.company_id}</p>

            {/* Back Button */}
            <button onClick={() => router.push(`/${companySlug}/employee/invoices/customers`)}>Back to Customers</button>
        </div>
    );
}

export default CustomerView;
