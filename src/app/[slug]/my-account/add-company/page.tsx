'use client';
import React, { useState, useEffect } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import Loader from '@/components/common/Loader';
import AddCompanyForm from '../components/addCompanyForm'
import Packages from '../components/Packages';

const Page = () => {
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
    <>
      <>
        {hasValidSelection ? (
          <AddCompanyForm packageId={selectedPackageId} categoryId={selectedCategoryId} />
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
      </>
    </>
  )
}

export default Page