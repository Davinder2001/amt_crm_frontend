'use client';
import React, { useState } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import AddCompanyForm from './components/addCompanyForm';
import Packages from './components/Packages';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import LoadingState from '@/components/common/LoadingState';

const Page = () => {
  const { data: plansData, isLoading: isPlansLoading } = useFetchPackagesPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : [];
  const { data: categoriesData } = useFetchBusinessCategoriesQuery();
  const categories = categoriesData ?? [];

  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const clearSelection = () => {
    setSelectedPackage(null);
    setSelectedCategoryId(null);
  };

  if (isPlansLoading) return <LoadingState />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  const hasValidSelection = selectedPackage !== null && selectedCategoryId !== null;

  return (
    <>
      {hasValidSelection ? (
        <>
          <div className='add-company-form-nav'>
            <Link href="/add-company" className="back-button" onClick={clearSelection}>
              <FaArrowLeft />
            </Link>
          </div>
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
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
        />
      )}
    </>
  );
};

export default Page;