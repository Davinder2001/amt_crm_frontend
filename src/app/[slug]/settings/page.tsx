'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect, useState } from 'react';
import SettingNavigation from './components/settingNavigation';
import StoreSettings from './components/Attributes';
import Attributes from './components/Attributes';
import Shifts from './components/Shifts';
import TaxesPage from './components/Taxes';
import RoleList from './components/permissions/roleList';
import BankAccountList from './components/accounts/BankAccountList';
import LeavesAndHolidays from './components/LeavesAndHolidays';

const SettingsPage = () => {
  const { setTitle } = useBreadcrumb();
  const [activeTab, setActiveTab] = useState('store-settings');

  useEffect(() => {
    setTitle('Settings');
  }, [setTitle]);

  const renderContent = () => {
    switch (activeTab) {
      case 'store-settings':
        return <Attributes />;
      case 'shifts':
        return <Shifts />;
      case 'taxes':
        return <TaxesPage />;
      case 'permissions':
        return <RoleList />;
      case 'bank-accounts':
        return <BankAccountList />;
      case 'leavs-and-holidays':
        return <LeavesAndHolidays />;
      default:
        return <StoreSettings />;
    }
  };
  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <SettingNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;