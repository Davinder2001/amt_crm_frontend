'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useFetchCompaniesQuery,
  useVerifyCompanyPaymentMutation,
  useVerifyCompanyStatusMutation
} from '@/slices/superadminSlices/company/companyApi';
import { toast } from 'react-toastify';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import Loader from '@/components/common/Loader';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { FaUniversity, FaHourglassHalf, FaUndoAlt } from 'react-icons/fa';
import EmptyState from '@/components/common/EmptyState';

interface Company {
  id: number;
  company_id: string;
  company_name: string;
  company_slug: string;
  payment_status: string;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

const COLUMN_STORAGE_KEY = 'visible_columns_company';
const paymentStatusOptions = ['pending', 'completed', 'failed'];
const verificationStatusOptions = ['pending', 'block', 'verified', 'rejected'];

const CompanyComponent = () => {
  const { data, error, isLoading } = useFetchCompaniesQuery();
  const [verifyPayment] = useVerifyCompanyPaymentMutation();
  const [verifyStatus] = useVerifyCompanyStatusMutation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : ['company_id', 'company_name', 'company_slug', 'payment_status', 'verification_status'];
    }
    return ['company_id', 'company_name', 'company_slug', 'payment_status', 'verification_status'];
  });

  const router = useRouter();
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('All Companies');
  }, [setTitle]);

  useEffect(() => {
    if (data?.data) setCompanies(data.data);
  }, [data]);

  const handlePaymentChange = async (id: number, status: string) => {
    try {
      await verifyPayment({ id, status }).unwrap();
      setCompanies(prev =>
        prev.map(company =>
          company.id === id ? { ...company, payment_status: status } : company
        )
      );
      toast.success(`Payment status set to "${status}"`);
    } catch (err) {
      toast.error('Failed to update payment status.');
      console.error(err);
    }
  };

  const handleVerificationChange = async (id: number, status: string) => {
    try {
      await verifyStatus({ id, status }).unwrap();
      setCompanies(prev =>
        prev.map(company =>
          company.id === id ? { ...company, verification_status: status } : company
        )
      );
      toast.success(`Verification status set to "${status}"`);
    } catch (err) {
      toast.error('Failed to update verification status.');
      console.error(err);
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const updated = prev.includes(key)
        ? prev.filter(col => col !== key)
        : [...prev, key];
      localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const onResetColumns = () => {
    const defaultCols = ['company_id', 'company_name', 'company_slug', 'payment_status', 'verification_status'];
    setVisibleColumns(defaultCols);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(defaultCols));
  };

  const allColumns = [
    {
      label: 'Company Code',
      key: 'company_id' as keyof Company,
    },
    {
      label: 'Name',
      key: 'company_name' as keyof Company,
    },
    {
      label: 'Slug',
      key: 'company_slug' as keyof Company,
    },
    {
      label: 'Payment Status',
      key: 'payment_status' as keyof Company,
      render: (company: Company) => (
        <select
          className={`payment-select ${company.payment_status}`}
          value={company.payment_status}
          onChange={(e) => handlePaymentChange(company.id, e.target.value)}
        >
          {paymentStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      )
    },
    {
      label: 'Verification Status',
      key: 'verification_status' as keyof Company,
      render: (company: Company) => (
        <select
          className={`verification-select ${company.verification_status}`}
          value={company.verification_status}
          onChange={(e) => handleVerificationChange(company.id, e.target.value)}
        >
          {verificationStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      )
    }
  ];

  const columns = allColumns.filter(col => visibleColumns.includes(col.key as string));

  const tableFilters = [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const
    },
  ];

  const filterData = (data: Company[]): Company[] => {
    return data.filter((company) => {
      // Search
      if (filters.search && filters.search.length > 0) {
        const searchTerm = filters.search[0].toLowerCase();
        const visibleFields = allColumns
          .filter(col => visibleColumns.includes(col.key as string))
          .map(col => col.key);

        const matchesSearch = visibleFields.some(key => {
          const value = String(company[key] ?? '').toLowerCase();
          return value.includes(searchTerm);
        });

        if (!matchesSearch) return false;
      }

      // Other filters (add more if needed)
      return Object.entries(filters)
        .filter(([key]) => key !== 'search')
        .every(([field, values]) => {
          if (!values || values.length === 0) return true;
          const value = String(company[field as keyof Company] ?? '').toLowerCase();
          return values.includes(value);
        });
    });
  };

  const filteredData = filterData(companies);

  if (isLoading) return <Loader />;
if (error)
        return (
            <EmptyState
                icon="alert"
                title="Error loading companies."
                message="Something went wrong while loading companies."
            />
        );
  return (
    <div className="company-table-outer">
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
        onResetColumns={onResetColumns}
        actions={[
          {
            label: 'All Companies',
            icon: <FaUniversity />,
            onClick: () => router.push('/superadmin/companies'),
          },
          {
            label: 'Pending Companies',
            icon: <FaHourglassHalf />,
            onClick: () => router.push('/superadmin/companies/pending'),
          },
          {
            label: 'Refunds',
            icon: <FaUndoAlt />,
            onClick: () => router.push('/superadmin/companies/refunds'),
          },
        ]}
      />
      <ResponsiveTable
        data={filteredData}
        columns={columns}
        onView={(id) => router.push(`/superadmin/companies/view/${id}`)}
      />
    </div>
  );
};

export default CompanyComponent;
