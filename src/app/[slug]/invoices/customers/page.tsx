
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useFetchAllCustomersQuery } from '@/slices/customers/customer';
import { useCompany } from '@/utils/Company';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const CustomerList = () => {
  const { data } = useFetchAllCustomersQuery();
  const router = useRouter();
  const { companySlug } = useCompany();

  const customers = data?.customers ?? [];

  const columns: { label: string; key: keyof typeof customers[0] }[] = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Phone Number', key: 'number' },
  ];

  return (
    <div>
      <button onClick={() => router.back()} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </button>

      <ResponsiveTable
        data={customers}
        columns={columns}
        onView={(id) => router.push(`/${companySlug}/invoices/customers/${id}`)}
      />
    </div>
  );
};

export default CustomerList;
