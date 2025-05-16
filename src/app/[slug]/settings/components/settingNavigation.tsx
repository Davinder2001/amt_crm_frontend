import React from 'react';
import Link from 'next/link';
import { FaCog } from 'react-icons/fa';

const settingItems = [
  { label: 'Store Settings', href: './settings/store-settings' },
  { label: 'Shifts', href: './settings/shifts' },
  { label: 'Taxes', href: './settings/taxes' },
];

const SettingNavigation = () => {
  return (
    <div className="settings-wrapper">
      <ul className="settings-list">
        {settingItems.map((item) => (
          <li key={item.href} className="settings-item">
            <Link href={item.href} className="settings-link">
              <div className="settings-info-inner">
                <span className="settings-label">{item.label}</span>
                <div className="settings-btn-outer">
                  <FaCog className="settings-icon" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingNavigation;
