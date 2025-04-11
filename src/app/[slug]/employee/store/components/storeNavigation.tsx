'use client'
import { useCompany } from '@/utils/Company';
import Link from 'next/link'
import React from 'react'
import { FaPlus } from 'react-icons/fa';

const StoreNavigation = () => {
  const {companySlug} = useCompany();
  return (
    <nav  className="store-nav-outer">
    <div className='store_nav'>
      <ul>
        <li>
          <Link href={`/${companySlug}/employee/store/add-item`}>
          <FaPlus /> Add Item
          </Link>
        </li>
        <li>
          <Link href={`/${companySlug}employee/store/vendors/add-vendor`}>
          <FaPlus /> Add a Vendor
          </Link>
        </li>
        <li>
          <Link href={`/${companySlug}employee/store/vendors/add-as-vendor`}>
          <FaPlus /> Add As a Vendor
          </Link>
        </li>
        <li>
          <Link href={`/${companySlug}/employee/store/vendors`}>
            View All Vendor
          </Link>
        </li>
      </ul>
    </div>
    </nav>
  );
}

export default StoreNavigation;
