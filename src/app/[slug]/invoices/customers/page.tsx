'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlus, FaUsers } from 'react-icons/fa';
import { useFetchAllCustomersQuery } from '@/slices/customers/customer';
import { useCompany } from '@/utils/Company';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import EmptyState from '@/components/common/EmptyState';
import LoadingState from '@/components/common/LoadingState';

const CustomerList = () => {
  const { data, isLoading, error } = useFetchAllCustomersQuery();
  const router = useRouter();
  const { companySlug } = useCompany();

  const customers = data?.customers ?? [];
  const noCustomers = !isLoading && !error && customers.length === 0;

  const columns: { label: string; key: keyof typeof customers[0] }[] = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Phone Number', key: 'number' },
  ];

  return (
    <div>
      <button onClick={() => router.back()} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </button>

      {isLoading && <LoadingState/>}

      {error && (
        <EmptyState
          icon="alert"
          title="Failed to load customers"
          message="Something went wrong while fetching customer data."
        />
      )}

      {noCustomers && (
        <EmptyState
          icon={<FaUsers className="empty-state-icon" />}
          title="No Customers Found"
          message="You haven't added any customers yet."
          action={
            <button
              className="buttons"
              onClick={() => router.push(`/${companySlug}/invoices/customers/add`)}
            >
              <FaPlus /> Add Customer
            </button>
          }
        />
      )}

      {customers.length > 0 && (
        <ResponsiveTable
          data={customers}
          columns={columns}
          onView={(id) => router.push(`/${companySlug}/invoices/customers/${id}`)}
          cardViewKey='name'
        />
      )}
    </div>
  );
};

export default CustomerList;
