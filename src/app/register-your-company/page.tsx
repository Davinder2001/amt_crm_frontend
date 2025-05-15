'use client';

import React, { useState, useEffect } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import Packages from './components/Packages';
import RegisterForm from './components/registerForm';
import Loader from '@/components/common/Loader';

function Page() {
  const { data: plansData, isLoading } = useFetchPackagesPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : [];

  const { data: categoriesData } = useFetchBusinessCategoriesQuery();
  const categories = categoriesData ?? [];

  // Initialize from localStorage
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(() => {
    const stored = localStorage.getItem('packageId');
    return stored ? Number(stored) : null;
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(() => {
    const stored = localStorage.getItem('categoryId');
    return stored ? Number(stored) : null;
  });

  // Store packageId in localStorage
  useEffect(() => {
    if (selectedPackageId !== null) {
      localStorage.setItem('packageId', selectedPackageId.toString());
    }
  }, [selectedPackageId]);

  // Store categoryId in localStorage
  useEffect(() => {
    if (selectedCategoryId !== null) {
      localStorage.setItem('categoryId', selectedCategoryId.toString());
    }
  }, [selectedCategoryId]);

  if (isLoading) return <Loader />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  // ✅ If both are present, go directly to RegisterForm
  const hasValidSelection = selectedPackageId !== null && selectedCategoryId !== null;

  const handleBackToPackages = () => {
    localStorage.removeItem('packageId');
    localStorage.removeItem('categoryId');
    localStorage.removeItem('adminregistration');
    setSelectedPackageId(null);
    setSelectedCategoryId(null);
  };

  return (
    <>
      {hasValidSelection ? (
        <RegisterForm packageId={selectedPackageId} categoryId={selectedCategoryId} onBack={handleBackToPackages} />
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
  );
}

export default Page;
