// File: app/dashboard/page.tsx
"use client";
import React, { useEffect } from 'react';
import TotalRevenue from './components/TotalRevenue';
import StoreStats from './components/StoreStats';
import IncomeExpense from './components/IncomeExpense';
import Employees from './components/Employees';
import SaleItems from './components/SaleItems';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import ListOverview from './components/ListOverview';
import UserActivity from './components/UserActivity';
import CustomerReview from './components/CustomerReview';
import TotalEarnings from './components/TotalEarnings';

function Page() {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Overview');
  }, [setTitle]);

  return (
    <>
      <div className="dashboard-page">
        <ListOverview />
        <div className="stat-revenue-container">
          <TotalRevenue />
          <StoreStats />
        </div>
        <div className="expenses-sale-container">
          <IncomeExpense />
          <Employees />
          <SaleItems />
        </div>
        <div className='earning-review-container'>
          <UserActivity />
          <CustomerReview />
          <TotalEarnings />
        </div>
      </div>
    </>
  );
}

export default Page;