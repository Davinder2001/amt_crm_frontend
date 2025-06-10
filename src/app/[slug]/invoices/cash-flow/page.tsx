'use client';

import React, { useState, useEffect } from 'react';
import OnlinePayments from '../components/payments/OnlinePayments';
import CashPayments from '../components/payments/CashPayments';
import CardPayments from '../components/payments/CardPayments';
import CreditPayments from '../components/payments/CreditPayments';
import SelfConsumption from '../components/payments/SelfConsumption';
import {
  FaGlobe,
  FaMoneyBillWave,
  FaCreditCard,
  FaHandHoldingUsd,
  FaLeaf
} from 'react-icons/fa';
const TABS = [
  {
    key: 'online',
    label: 'Online Payments',
    component: OnlinePayments,
    icon: <FaGlobe />,
  },
  {
    key: 'cash',
    label: 'Cash Payments',
    component: CashPayments,
    icon: <FaMoneyBillWave />,
  },
  {
    key: 'card',
    label: 'Card Payments',
    component: CardPayments,
    icon: <FaCreditCard />,
  },
  {
    key: 'credit',
    label: 'Credit Payments',
    component: CreditPayments,
    icon: <FaHandHoldingUsd />,
  },
  {
    key: 'selfConsumption',
    label: 'Self Consumption',
    component: SelfConsumption,
    icon: <FaLeaf />,
  },
];
export default function CashFlow() {
  const [activeTab, setActiveTab] = useState('online');
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const validTab = TABS.find(tab => tab.key === hash);
    if (validTab) {
      setActiveTab(hash);
    } else {
      const defaultTab = TABS[0].key;
      setActiveTab(defaultTab);
      window.history.replaceState(null, '', `#${defaultTab}`);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    window.history.replaceState(null, '', `#${tabKey}`);
  };

  const ActiveComponent = TABS.find(tab => tab.key === activeTab)?.component;

  return (
    <div className="cashflow-container">
      <div className="tabs-container">
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              aria-label={tab.label}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="active-indicator"></span>
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}