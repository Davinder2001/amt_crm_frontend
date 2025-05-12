// File: app/dashboard/components/IncomeExpense.tsx
import React from 'react';

const IncomeExpense = () => {
  return (
    <div className="card income-expense">
      <div className="card-header">
        <div>
          <button className="active">Income</button>
          <button>Expense</button>
        </div>
        <div className="dropdown">Monthly <span>▼</span></div>
      </div>
      <div className="chart-placeholder">[Bar Chart: Income]</div>
    </div>
  );
};

export default IncomeExpense;