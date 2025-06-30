'use client';
import React, { useState, useEffect } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import Loader from '@/components/common/Loader';
import AddCompanyForm from './components/addCompanyForm';
import Packages from './components/Packages';
import Link from 'next/link';

const LOCAL_STORAGE_KEY = 'addCompanyData';

const Page = () => {
  const { data: plansData, isLoading: isPlansLoading } = useFetchPackagesPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : [];
  const { data: categoriesData } = useFetchBusinessCategoriesQuery();
  const categories = categoriesData ?? [];

  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.packageId && parsed.limitId && parsed.variantType) {
          setSelectedPackage({
            packageId: parsed.packageId,
            limitId: parsed.limitId,
            variantType: parsed.variantType
          });
        }
        if (parsed.category_id) {
          setSelectedCategoryId(parsed.category_id);
        }
      } catch (e) {
        console.error('Failed to parse stored data', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  const clearSelection = () => {
    setSelectedPackage(null);
    setSelectedCategoryId(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  if (isPlansLoading) return <Loader />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  const hasValidSelection = selectedPackage !== null && selectedCategoryId !== null;

  return (
    <>
      {hasValidSelection ? (
        <>
          <Link href="/add-company" className="back-button" onClick={clearSelection}>
            ← Back
          </Link>
          <AddCompanyForm
            packageId={selectedPackage.packageId}
            limitId={selectedPackage.limitId}
            variantType={selectedPackage.variantType}
            categoryId={selectedCategoryId}
          />
        </>
      ) : (
        <Packages
          plans={plans}
          setSelectedPackage={setSelectedPackage}
          selectedPackage={selectedPackage}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      )}
    </>
  );
};

export default Page;