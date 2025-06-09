'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchAdminsQuery, useUpdateAdminStatusMutation } from '@/slices/superadminSlices/adminManagement/adminManageApi';
import Loader from '@/components/common/Loader';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';

const statusOptions = ['active', 'blocked'];

const AdminList = () => {
  const { data, isLoading, error } = useFetchAdminsQuery();
  const [updateAdminStatus] = useUpdateAdminStatusMutation();
  const router = useRouter();

  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'uid', 'name', 'email', 'number', 'email_verified', 'status'
  ]);

  const handleStatusChange = (id: string, status: string) => {
    updateAdminStatus({ id, status });
  };

  const allColumns = [
    { label: 'UID', key: 'uid' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Number', key: 'number' },
    { label: 'Email Verified', key: 'email_verified' },
    { label: 'Status', key: 'status' },
  ];

  const filterData = (admins: Admin[]) => {
    return admins.filter((admin) => {
      return Object.entries(filters).every(([field, values]) => {
        const adminValue = admin[field as keyof Admin];
        if (Array.isArray(values) && values.length > 0) {
          return values.includes(String(adminValue));
        }
        return true;
      });
    });
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const columns = allColumns
    .filter((col) => visibleColumns.includes(col.key))
    .map((col) => {
      if (col.key === 'roles') {
        return {
          label: 'Roles',
          key: 'roles' as const,
          render: (admin: Admin) =>
            admin.roles?.map((role) => role.company_id).join(', ') || '-',
        };
      }

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
                border: `1px solid ${admin.user_status === 'active' ? '#22c55e' : '#ef4444'
                  }`,
                color: admin.user_status === 'active' ? '#22c55e' : '#ef4444',
                backgroundColor:
                  admin.user_status === 'active' ? '#f0fdf4' : '#fef2f2',
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
        key: col.key as
          | "number"
          | "uid"
          | "name"
          | "email"
          | "id"
          | "companies"
          | "created_at"
          | "email_verified_at"
          | "user_status",
      };
    });

  const admins = data?.admins || [];
  // Ensure all ids are numbers for ResponsiveTable
  const filteredAdmins = filterData(admins).map((admin) => ({
    ...admin,
    id: typeof admin.id === 'string' ? Number(admin.id) : admin.id,
  }));

  const tableFilters = [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const
    },
  ];


  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Failed to fetch admins.</p>;

  return (
    <div className="items-page">
      <TableToolbar
        filters={tableFilters}
        onFilterChange={(field, value, type) => {
          if (type === 'search') {
            setFilters(prev => ({
              ...prev,
              [field]: value && typeof value === 'string' ? [value] : []
            }));
          } else {
            setFilters(prev => ({
              ...prev,
              [field]: Array.isArray(value) ? value : [value]
            }));
          }
        }}
        columns={allColumns}
        visibleColumns={visibleColumns}
        onColumnToggle={toggleColumn}
        actions={[]}

      />
      <ResponsiveTable
        data={filteredAdmins}
        columns={columns}
        onView={(id) => router.push(`/superadmin/admins/view-admin/${id}`)}
      />
    </div>
  );
};

export default AdminList;




















