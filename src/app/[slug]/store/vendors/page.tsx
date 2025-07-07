'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlus, FaUserTie } from 'react-icons/fa';
import { useFetchVendorsQuery } from '@/slices';
import { useCompany } from '@/utils/Company';
import TableToolbar from '@/components/common/TableToolbar';
import Link from 'next/link';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import CreateVendor from './components/CreateVendor';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const Page: React.FC = () => {
  const { data: vendors, error, isLoading, refetch } = useFetchVendorsQuery() as {
    data: Vendor[] | undefined;
    error: unknown;
    isLoading: boolean;
    refetch: () => void;
  };
  const { companySlug } = useCompany();
  const router = useRouter();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [addVendorModalOpen, setAddVendorModalOpen] = useState(false);

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      const excludedFields = ['id', 'company_id', 'created_at', 'updated_at'];
      const keys = Object.keys(vendors[0]).filter((key) => !excludedFields.includes(key));
      setVisibleColumns(keys);
    }
  }, [vendors]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
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

  if (isLoading) return <LoadingState />;

  if (error)
    return (
      <EmptyState
        icon="alert"
        title="Failed to load vendors"
        message="We encountered an error while loading your vendors. Please try again later."
      />
    );

  if (!vendors || vendors.length === 0)
    return (
      <EmptyState
        icon={<FaUserTie className="empty-state-icon" />}
        title="No vendors found"
        message="You haven't added any vendors yet. Start by creating your first vendor."
        action={
          <button className="buttons" onClick={() => setAddVendorModalOpen(true)}>
            <FaPlus size={18} /> Add New Vendor
          </button>
        }
      />
    );

  const filteredVendors = filterData(vendors);

  const columns = visibleColumns.map((key) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    render: (item: Vendor) => item[key as keyof Vendor]?.toString() || '-',
  }));

  return (
    <div className="vendors-page-outer">
      <Link href={`/${companySlug}/store`} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </Link>
      <div className="vendors-page">
        <div className="vendors-page-outer">
          <TableToolbar
            onFilterChange={(field, value, type) => {
              if (type === 'search') {
                setFilters((prev) => ({
                  ...prev,
                  [field]: value && typeof value === 'string' ? [value] : [],
                }));
              } else {
                setFilters((prev) => ({
                  ...prev,
                  [field]: Array.isArray(value) ? value : [value],
                }));
              }
            }}
            columns={columns.map((col) => ({ label: col.label, key: col.label }))}
            visibleColumns={visibleColumns}
            onColumnToggle={toggleColumn}
            introKey='vendors_intro'
            actions={[
              {
                label: 'Add Vendor',
                icon: <FaPlus />,
                onClick: () => setAddVendorModalOpen(true),
              },
            ]}
          />

          <ResponsiveTable
            data={filteredVendors}
            columns={columns}
            onView={(id: number) => router.push(`/${companySlug}/store/vendors/${id}`)}
          />

          <Modal
            isOpen={addVendorModalOpen}
            onClose={() => setAddVendorModalOpen(false)}
            title="Add New Vendor"
            width="800px"
          >
            <CreateVendor
              onSuccess={() => {
                refetch(); // Refresh vendor list
                setAddVendorModalOpen(false);
              }}
              onClose={() => setAddVendorModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Page;
