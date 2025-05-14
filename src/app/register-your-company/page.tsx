'use client';

import React, { useState } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import Packages from './components/Packages';
import RegisterForm from './components/registerForm';
import Loader from '@/components/common/Loader';

function Page() {
  const { data: plansData, isLoading } = useFetchPackagesPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : [];

  // Ensure categories is always an array (default to empty array if undefined)
  const { data: categoriesData } = useFetchBusinessCategoriesQuery();
  const categories = categoriesData ?? []; // Default to empty array if undefined

  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  if (isLoading) return <Loader />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  return (
    <>
      {selectedPackageId ?
        <RegisterForm packageId={selectedPackageId} categoryId={selectedCategoryId}/> :
        <Packages
          plans={plans}
          setSelectedPackageId={setSelectedPackageId}
          selectedPackageId={selectedPackageId}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />}
    </>
  );
}

export default Page;
