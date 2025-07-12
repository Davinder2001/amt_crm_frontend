'use client';
import React, { useState } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import AddCompanyForm from './components/addCompanyForm';
import Packages from './components/Packages';
import Link from 'next/link';
import LoadingState from '@/components/common/LoadingState';
import { FaArrowLeft } from 'react-icons/fa';

const Page = () => {
  const { data: plansData, isLoading: isPlansLoading } = useFetchPackagesPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : [];
  const { data: categoriesData } = useFetchBusinessCategoriesQuery();
  const categories = categoriesData ?? [];

  const [subscriptionType, setSubscriptionType] = useState<'annual' | 'three_years'>('annual');
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  if (isPlansLoading) return <LoadingState />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  const hasValidSelection = selectedPackageId !== null && selectedCategoryId !== null;

  return (
    <>
      {hasValidSelection ? (
        <div className='add-c-form-outer'>
          <div className="add-c-header">
            <div className="add-c-header-inner">
              <Link href="/add-company" className="back-to-pkgs" onClick={() => {
                setSelectedPackageId(null);
                setSelectedCategoryId(null);
              }}>
                <FaArrowLeft />
              </Link>
            </div>
          </div>
          <AddCompanyForm
            packageId={selectedPackageId}
            categoryId={selectedCategoryId}
            subscriptionType={subscriptionType}
          />
        </div>
      ) : (
        <Packages
          plans={plans}
          setSelectedPackageId={setSelectedPackageId}
          selectedPackageId={selectedPackageId}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          subscriptionType={subscriptionType}
          setSubscriptionType={setSubscriptionType}
        />
      )}
    </>
  );
};

export default Page;