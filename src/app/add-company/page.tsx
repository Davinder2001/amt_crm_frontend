'use client';
import React, { useState, useEffect } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import Loader from '@/components/common/Loader';
import AddCompanyForm from './components/addCompanyForm';
import Packages from './components/Packages';
import Link from 'next/link';

const Page = () => {
  const { data: plansData, isLoading: isPlansLoading } = useFetchPackagesPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : [];
  const { data: categoriesData } = useFetchBusinessCategoriesQuery();
  const categories = categoriesData ?? [];

  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('addCompany');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.packageId && parsed.limitId && parsed.variantType) {
        setSelectedPackage({
          packageId: parsed.packageId,
          limitId: parsed.limitId,
          variantType: parsed.variantType
        });
      }
      if (parsed.category_id) setSelectedCategoryId(parsed.category_id);
    }
  }, []);

  if (isPlansLoading) return <Loader />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  const hasValidSelection = selectedPackage !== null && selectedCategoryId !== null;

  return (
    <>
      {hasValidSelection ? (
        <>
          <Link href="/add-company" className="back-button" onClick={() => {
            setSelectedPackage(null);
            localStorage.removeItem('addCompany');
          }}>
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