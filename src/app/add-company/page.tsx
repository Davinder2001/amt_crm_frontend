'use client';
import React, { useState } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import Loader from '@/components/common/Loader';
import AddCompanyForm from './components/addCompanyForm'
import Packages from './components/Packages';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';

const Page = () => {
  const { companySlug } = useCompany();
  const { data: plansData, isLoading: isPlansLoading } = useFetchPackagesPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : [];
  const { data: categoriesData } = useFetchBusinessCategoriesQuery();
  const categories = categoriesData ?? [];

  // Initialize from states
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  if (isPlansLoading) return <Loader />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  // ✅ If both are present, go directly to RegisterForm
  const hasValidSelection = selectedPackageId !== null && selectedCategoryId !== null;

  return (
    <div className='outer-div'>
      {hasValidSelection ? (
        <>
          <Link href={`/${companySlug}/my-account`} className="back-button">
            ← Back
          </Link>
          <AddCompanyForm packageId={selectedPackageId} categoryId={selectedCategoryId} />
        </>
      ) : (
        <Packages
          plans={plans}
          setSelectedPackageId={setSelectedPackageId}
          selectedPackageId={selectedPackageId}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      )}
    </div>
  )
}

export default Page