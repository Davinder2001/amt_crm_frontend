'use client'
import React from 'react';
import { useFetchCompaniesQuery} from '@/slices/superadminSlices/company/companyApi';

interface PageProps {
  params: Promise<{ id: string }>;
}

const CompanyView = ({ params }: PageProps) => {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const { data, error, isLoading } = useFetchCompaniesQuery();

  if (isLoading) {
    return <div>Loading company details...</div>;
  }

  if (error) {
    return <div>Error loading companies.</div>;
  }

  const companies: Company[] = data?.data || [];
  const company = companies.find((comp) => String(comp.id) === id);

  if (!company) {
    return <div>Company not found.</div>;
  }

  return (
    <div>
      <h1>{company.company_name}</h1>
      <p>Company ID: {company.company_id}</p>
      <p>Slug: {company.company_slug}</p>
      <p>Verification Status: {company.verification_status}</p>
      <p>Payment Status: {company.payment_status}</p>
    </div>
  );
};

export default CompanyView;
