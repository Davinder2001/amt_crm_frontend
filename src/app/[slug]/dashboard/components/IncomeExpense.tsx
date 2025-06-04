// File: app/dashboard/components/IncomeExpense.tsx
import React, { useState } from 'react';

const IncomeExpense = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');

  const handleTabClick = (tab: 'income' | 'expense') => {
    setActiveTab(tab);
  };

  return (
    <div className="card income-expense">
      <div className="card-header">
        <div className="tabs">
          <button
            className={activeTab === 'income' ? 'active' : ''}
            onClick={() => handleTabClick('income')}
          >
            Income
          </button>
          <button
            className={activeTab === 'expense' ? 'active' : ''}
            onClick={() => handleTabClick('expense')}
          >
            Expense
          </button>
        </div>
        <div className="dropdown">Monthly <span>▼</span></div>
      </div>

      <div className="chart-placeholder">
        {activeTab === 'income' ? (
          <div>[Bar Chart: Income]</div>
        ) : (
          <div>[Bar Chart: Expense]</div>
        )}
      </div>
    </div>
  );
};

export default IncomeExpense;