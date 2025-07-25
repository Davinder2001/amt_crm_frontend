'use client';
import React, { useState } from 'react';
import SettingNavigation from './components/settingNavigation';
import StoreSettings from './components/Attributes';
import Attributes from './components/Attributes';
import Shifts from './components/Shifts';
import CreateTax from './components/Taxes';
import RoleList from './components/permissions/roleList';
import BankAccountList from './components/accounts/BankAccountList';
import LeavesAndHolidays from './components/LeavesAndHolidays';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('store-settings');

  const renderContent = () => {
    switch (activeTab) {
      case 'store-settings':
        return <Attributes />;
      case 'shifts':
        return <Shifts />;
      case 'taxes':
        return <CreateTax />;
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
      {/* Responsive navigation: sidebar on desktop, topbar on mobile */}
      <div className="settings-navigation">
        <SettingNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;
