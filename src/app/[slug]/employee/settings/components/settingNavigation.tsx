import React, { useEffect } from 'react';
import {
  FaStore,
  FaUserClock,
  FaMoneyBillWave,
  FaUserShield,
  FaUmbrellaBeach,
  FaUniversity,
} from 'react-icons/fa';

const settingItems = [
  {
    label: 'Store Settings',
    id: 'store-settings',
    icon: <FaStore className="settings-icon" />,
    subLabel: 'Store configuration'
  },
  {
    label: 'Shifts',
    id: 'shifts',
    icon: <FaUserClock className="settings-icon" />,
    subLabel: 'Shift management'
  },
  {
    label: 'Taxes',
    id: 'taxes',
    icon: <FaMoneyBillWave className="settings-icon" />,
    subLabel: 'Tax settings'
  },
  {
    label: 'Permissions',
    id: 'permissions',
    icon: <FaUserShield className="settings-icon" />,
    subLabel: 'User permissions'
  },
  {
    label: 'Bank Accounts',
    id: 'bank-accounts',
    icon: <FaUniversity className="settings-icon" />,
    subLabel: 'Bank account management'
  },
  {
    label: 'Leaves and Holidays',
    id: 'leavs-and-holidays',
    icon: <FaUmbrellaBeach className="settings-icon" />,
    subLabel: 'Leaves and Holidays management'
  },
];

interface SettingNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SettingNavigation = ({ activeTab, onTabChange }: SettingNavigationProps) => {
  // Handle hash changes on component mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the #
      if (hash && settingItems.some(item => item.id === hash)) {
        onTabChange(hash);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onTabChange]);

  const handleTabClick = (tabId: string) => {
    // Update the URL hash
    window.location.hash = tabId;
    // Call the parent's tab change handler
    onTabChange(tabId);
  };

  return (
    <nav className="settings-nav">
      <ul className="settings-list">
        {settingItems.map((item) => (
          <li
            key={item.id}
            className={`settings-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <button
              onClick={() => handleTabClick(item.id)}
              className="settings-button"
            >
              <div className="settings-item-content">
                {item.icon}
                <div className="settings-text">
                  <span className="settings-label">{item.label}</span>
                  <span className="settings-sublabel">{item.subLabel}</span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

};

export default SettingNavigation;