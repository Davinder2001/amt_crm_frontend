'use client';

import React, { useState, useEffect } from 'react';
import OnlinePayments from '../components/payments/OnlinePayments';
import CashPayments from '../components/payments/CashPayments';
import CardPayments from '../components/payments/CardPayments';
import CreditPayments from '../components/payments/CreditPayments';
import SelfConsumption from '../components/payments/SelfConsumption';

const TABS = [
  { key: 'online', label: 'Online Payments', component: OnlinePayments },
  { key: 'cash', label: 'Cash Payments', component: CashPayments },
  { key: 'card', label: 'Card Payments', component: CardPayments },
  { key: 'credit', label: 'Credit Payments', component: CreditPayments },
  { key: 'selfConsumption', label: 'Self Consumption', component: SelfConsumption },
];

export default function CashFlow() {
  const [activeTab, setActiveTab] = useState('online');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const validTab = TABS.find(tab => tab.key === hash);
    if (validTab) {
      setActiveTab(hash);
    } else {
      // Set default tab in URL if no valid hash exists
      const defaultTab = TABS[0].key;
      setActiveTab(defaultTab);
      window.history.replaceState(null, '', `#${defaultTab}`);
    }
  }, []);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    window.history.replaceState(null, '', `#${tabKey}`);
  };

  const ActiveComponent = TABS.find(tab => tab.key === activeTab)?.component;

  return (
    <div>
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
