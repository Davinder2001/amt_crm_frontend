'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchAdminsQuery, useUpdateAdminStatusMutation } from '@/slices/superadminSlices/adminManagement/adminManageApi';
import Loader from '@/components/common/Loader';
import TableToolbar from '@/components/common/TableToolbar';
import EmptyState from '@/components/common/EmptyState';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { FaTriangleExclamation } from 'react-icons/fa6';

const statusOptions = ['active', 'blocked'];
const COLUMN_STORAGE_KEY = 'visible_columns_admins';

const AdminList = () => {
  const { data, isLoading, error } = useFetchAdminsQuery();
  const [updateAdminStatus] = useUpdateAdminStatusMutation();
  const router = useRouter();

  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : ['uid', 'name', 'email', 'number', 'email_verified', 'status'];
    }
    return ['uid', 'name', 'email', 'number', 'email_verified', 'status'];
  });

  const allColumns = [
    { label: 'UID', key: 'uid' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Number', key: 'number' },
    { label: 'Email Verified', key: 'email_verified' },
    { label: 'Status', key: 'status' },
  ];

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key];
      localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const onResetColumns = () => {
    const defaultColumns = ['uid', 'name', 'email', 'number', 'email_verified', 'status'];
    setVisibleColumns(defaultColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(defaultColumns));
  };

  const handleStatusChange = (id: string, status: string) => {
    updateAdminStatus({ id, status });
  };

  const filterData = (admins: Admin[]) => {
    return admins.filter((admin) => {
      // Handle "search" filter
      if (filters.search && filters.search.length > 0) {
        const searchTerm = filters.search[0].toLowerCase();

        const visibleFields = allColumns
          .filter(col => visibleColumns.includes(col.key))
          .map(col => col.key);

        const matchesSearch = visibleFields.some(key => {
          const value = String(admin[key as keyof Admin] ?? '').toLowerCase();
          return value.includes(searchTerm);
        });

        if (!matchesSearch) return false;
      }

      // Handle other filters
      return Object.entries(filters)
        .filter(([field]) => field !== 'search')
        .every(([field, values]) => {
          if (!values || values.length === 0) return true;

          const adminValue = String(admin[field as keyof Admin] ?? '').toLowerCase();
          const normalizedValues = values.map(v => v.toLowerCase());

          return normalizedValues.includes(adminValue);
        });
    });
  };

  const columns = allColumns
    .filter((col) => visibleColumns.includes(col.key))
    .map((col) => {
      if (col.key === 'email_verified') {
        return {
          label: 'Email Verified',
          key: 'email_verified_at' as const,
          render: (admin: Admin) => (admin.email_verified_at ? 'Yes' : 'No'),
        };
      }

      if (col.key === 'status') {
        return {
          label: 'Status',
          key: 'user_status' as const,
          render: (admin: Admin) => (
            <select
              value={admin.user_status}
              onChange={(e) => handleStatusChange(String(admin.id), e.target.value)}
              style={{
                padding: '3px 11px',
                borderRadius: '50px',
                fontWeight: 500,
                cursor: 'pointer',
                border: `1px solid ${admin.user_status === 'active' ? '#22c55e' : '#ef4444'}`,
                color: admin.user_status === 'active' ? '#22c55e' : '#ef4444',
                backgroundColor: admin.user_status === 'active' ? '#f0fdf4' : '#fef2f2',
              }}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          ),
        };
      }

      return {
        label: col.label,
        key: col.key as keyof Admin,
      };
    });

  const admins = data?.admins || [];

  const filteredAdmins = filterData(admins).map((admin) => ({
    ...admin,
    id: typeof admin.id === 'string' ? Number(admin.id) : admin.id,
  }));

  const tableFilters = [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const,
    },
  ];

  if (isLoading) return <Loader />;
  if (error) return (
    <EmptyState
      icon={<FaTriangleExclamation className='empty-state-icon' />}
      title="Failed to fetch admins."
      message="Something went wrong while fetch admins."
    />);
  return (
    <div className="items-page">
      <TableToolbar
        filters={tableFilters}
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
        columns={allColumns}
        visibleColumns={visibleColumns}
        onColumnToggle={toggleColumn}
        onResetColumns={onResetColumns}
        actions={[]}
        introKey='admin_list_intro'
      />

      <ResponsiveTable
        data={filteredAdmins}
        columns={columns}
        onView={(id) => router.push(`/superadmin/admins/view-admin/${id}`)}
        cardView={(admin) => (
          <>
            <div className="card-row">
              <h5>{admin.name}</h5>
              <p>{admin.email}</p>
            </div>
            <div className="card-row">
              <p>UID: {admin.uid}</p>
              <p>Status: {admin.user_status}</p>
            </div>
          </>
        )}
      />
    </div>
  );
};

export default AdminList;
