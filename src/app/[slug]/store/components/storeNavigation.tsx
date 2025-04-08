'use client'
import Link from 'next/link'
import React from 'react'
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaFolderPlus, FaPlus } from 'react-icons/fa';

const StoreNavigation = () => {
  // Fetch selected company data to get the company slug.
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug = selectedCompany?.selected_company?.company_slug;

  return (
    <div className="store-nav-outer">
    <nav className='store_nav'>
      <ul>
        <li>
          <Link href={companySlug ? `/${companySlug}/store/add-item` : "/store/add-items"}>
          <FaPlus /> Add Item
          </Link>
        </li>
        <li>
          <Link href={companySlug ? `/${companySlug}/store/vendors/add-vendor` : "/store/add-vendor"}>
          <FaPlus /> Add a Vendor
          </Link>
        </li>
        <li>
          <Link href={companySlug ? `/${companySlug}/store/vendors/add-as-vendor` : "/store/add-as-vendor"}>
          <FaPlus /> Add As a Vendor
          </Link>
        </li>
        <li>
          <Link href={companySlug ? `/${companySlug}/store/vendors` : "/store/add-as-vendor"}>
            View All Vendor
          </Link>
        </li>
      </ul>
    </nav>
    </div>
  );
}

export default StoreNavigation;
