'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchCompaniesQuery } from '@/slices/superadminSlices/company/companyApi';
import { toast } from 'react-toastify';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import Loader from '@/components/common/Loader';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

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

const paymentStatusOptions = ['pending', 'processing', 'completed', 'failed'];
const verificationStatusOptions = ['pending', 'under_review', 'verified', 'rejected'];

const CompanyComponent = () => {
  const { data, error, isLoading } = useFetchCompaniesQuery();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'company_id',
    'company_name',
    'company_slug',
    'payment_status',
    'verification_status'
  ]);
  const router = useRouter();
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('All Companies');
  }, [setTitle]);

  useEffect(() => {
    if (data?.data) setCompanies(data.data);
  }, [data]);

  const handlePaymentChange = (id: number, status: string) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, payment_status: status } : company
      )
    );
    toast.success(`Payment marked as "${status}"`);
  };

  const handleVerificationChange = (id: number, status: string) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, verification_status: status } : company
      )
    );
    toast.success(`Verification marked as "${status}"`);
  };

  const handleFilterChange = (field: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const current = new Set(prev[field] || []);
      if (checked) current.add(value);
      else current.delete(value);
      return { ...prev, [field]: [...current] };
    });
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const filterData = (data: Company[]): Company[] => {
    return data.filter((company) => {
      return Object.entries(filters).every(([field, values]) => {
        const value = company[field as keyof Company];
        return values.length === 0 || values.includes(String(value));
      });
    });
  };

  const columns = [
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
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
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
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      )
    }
  ].filter((col) => visibleColumns.includes(col.key as string));

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-500">Error loading companies.</p>;

  const filteredData = filterData(companies);

  return (
    <div className="company-table-outer">
      <TableToolbar
        filters={{
          payment_status: [...new Set(companies.map((c) => c.payment_status))],
          verification_status: [...new Set(companies.map((c) => c.verification_status))]
        }}
        onFilterChange={handleFilterChange}
        columns={columns}
        visibleColumns={visibleColumns}
        onColumnToggle={toggleColumn}
        actions={[]}
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
