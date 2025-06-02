'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useCompany } from '@/utils/Company';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import Link from 'next/link';

const Page: React.FC = () => {
  const { data: vendors, error, isLoading } = useFetchVendorsQuery() as { data: Vendor[] | undefined, error: undefined, isLoading: boolean };
  const { companySlug } = useCompany();
  const router = useRouter();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      const excludedFields = [ 'id', 'company_id', 'created_at', 'updated_at'];
      const keys = Object.keys(vendors[0]).filter((key) => !excludedFields.includes(key));
      setVisibleColumns(keys);
    }
  }, [vendors]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const handleFilterChange = (field: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const current = new Set(prev[field] || []);
      if (checked) current.add(value);
      else current.delete(value);
      return { ...prev, [field]: [...current] };
    });
  };

  const filterData = (data: Vendor[]): Vendor[] => {
    return data.filter((item) =>
      Object.entries(filters).every(([field, values]) => {
        const itemValue = item[field as keyof Vendor];
        if (Array.isArray(values) && values.length > 0) {
          return values.includes(String(itemValue));
        }
        return true;
      })
    );
  };

  if (isLoading) return <p>Loading vendors...</p>;
  if (error) return <p>Error fetching vendors.</p>;
  if (!vendors || vendors.length === 0) return <p>No vendors found.</p>;

  const filteredVendors = filterData(vendors);

  const columns = visibleColumns.map((key) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    render: (item: Vendor) => item[key as keyof Vendor]?.toString() || '-'
  }));

  return (
    <div className="vendors-page-outer">
      <Link href={`/${companySlug}/store`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
    <div className="vendors-page">
      <div className="vendors-page-outer">
        <TableToolbar
          filters={{}}
          onFilterChange={handleFilterChange}
          columns={columns.map((col) => ({ label: col.label, key: col.label }))}
          visibleColumns={visibleColumns}
          onColumnToggle={toggleColumn}
          actions={[
            {
              label: 'Add Vendor',
              icon: <FaPlus />,
              onClick: () => router.push(`/${companySlug}/store/vendors/add-vendor`),
            },
           

          ]}
        />

        <ResponsiveTable
          data={filteredVendors}
          columns={columns}
          onView={(id: number) => router.push(`/${companySlug}/store/vendors/${id}`)}
        />
      </div>
    </div>
    </div>
  );
};

export default Page;
