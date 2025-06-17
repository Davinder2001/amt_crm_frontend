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

  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'annual' | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // 🔄 Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('addCompany');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.subscription_type) setSubscriptionType(parsed.subscription_type);
      if (parsed.package_id) setSelectedPackageId(parsed.package_id);
      if (parsed.category_id) setSelectedCategoryId(parsed.category_id);
    }
  }, []);

  if (isPlansLoading) return <Loader />;
  if (!plans || !categories) return <div>No plans or categories available.</div>;

  const hasValidSelection = selectedPackageId !== null && selectedCategoryId !== null && subscriptionType !== null;

  return (
    <>
      {hasValidSelection ? (
        <>
          <Link href="/add-company" className="back-button" onClick={() => {
            setSelectedPackageId(null);
            setSelectedCategoryId(null);
            setSubscriptionType(null);
            localStorage.removeItem('addCompany');
          }}>
            ← Back
          </Link>
          <AddCompanyForm
            packageId={selectedPackageId}
            categoryId={selectedCategoryId}
            subscriptionType={subscriptionType}
          />
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
    </>
  );
};

export default Page;
