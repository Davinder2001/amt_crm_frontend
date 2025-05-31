'use client';
import React, { useState } from 'react';
import { useFetchBusinessCategoriesQuery, useFetchPackagesPlansQuery } from '@/slices/users/userApi';
import Loader from '@/components/common/Loader';
import AddCompanyForm from './components/addCompanyForm'
import Packages from './components/Packages';
import Link from 'next/link';

const Page = () => {
  const { data: plansData, isLoading: isPlansLoading } = useFetchPackagesPlansQuery();
  const plans = Array.isArray(plansData) ? plansData : [];
  const { data: categoriesData } = useFetchBusinessCategoriesQuery();
  const categories = categoriesData ?? [];

  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'annually' | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  if (isPlansLoading) return <Loader />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  // ✅ If both are present, go directly to RegisterForm
  const hasValidSelection = selectedPackageId !== null && selectedCategoryId !== null && subscriptionType !== null;

  return (
    <div className='outer-div'>
      {hasValidSelection ? (
      <>
        <Link href="/add-company" className="back-button" onClick={() => {
        setSelectedPackageId(null);
        setSelectedCategoryId(null);
        setSubscriptionType(null);
        }}>
        ← Back
        </Link>
        <AddCompanyForm packageId={selectedPackageId} categoryId={selectedCategoryId} subscriptionType={subscriptionType} />
      </>
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
    </div>
  )
}

export default Page