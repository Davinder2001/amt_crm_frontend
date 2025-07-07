// File: app/dashboard/components/IncomeExpense.tsx
"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const incomeMonthlyData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 62 },
  { name: 'Mar', value: 78 },
  { name: 'Apr', value: 55 },
  { name: 'May', value: 92 },
  { name: 'Jun', value: 115 },
  { name: 'Jul', value: 105 },
  { name: 'Aug', value: 88 },
  { name: 'Sep', value: 73 },
  { name: 'Oct', value: 65 },
  { name: 'Nov', value: 58 },
  { name: 'Dec', value: 95 }
];

const expenseMonthlyData = [
  { name: 'Jan', value: 32 },
  { name: 'Feb', value: 48 },
  { name: 'Mar', value: 53 },
  { name: 'Apr', value: 41 },
  { name: 'May', value: 67 },
  { name: 'Jun', value: 85 },
  { name: 'Jul', value: 72 },
  { name: 'Aug', value: 63 },
  { name: 'Sep', value: 57 },
  { name: 'Oct', value: 49 },
  { name: 'Nov', value: 38 },
  { name: 'Dec', value: 71 }
];

const incomeYearlyData = [
  { year: '2019', value: 820 },
  { year: '2020', value: 780 },
  { year: '2021', value: 950 },
  { year: '2022', value: 1120 },
  { year: '2023', value: 1350 },
  { year: '2024', value: 1520 }
];

const expenseYearlyData = [
  { year: '2019', value: 580 },
  { year: '2020', value: 620 },
  { year: '2021', value: 710 },
  { year: '2022', value: 850 },
  { year: '2023', value: 920 },
  { year: '2024', value: 1050 }
];

const IncomeExpense = () => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const [timeRange, setTimeRange] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [showDropdown, setShowDropdown] = useState(false);

  const getChartData = () => {
    if (activeTab === 'income') {
      return timeRange === 'Monthly' ? incomeMonthlyData : incomeYearlyData;
    } else {
      return timeRange === 'Monthly' ? expenseMonthlyData : expenseYearlyData;
    }
  };

  const data = getChartData();
  const isMonthly = timeRange === 'Monthly';
  const barColor = activeTab === 'income' ? 'var(--primary-color)' : 'var(--primary-light)';

  return (
    <div className="card income-expense">
      <div className="card-header">
        <div className="tabs">
          <button
            className={activeTab === 'income' ? 'active' : ''}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
          <button
            className={activeTab === 'expense' ? 'active' : ''}
            onClick={() => setActiveTab('expense')}
          >
            Expense
          </button>
        </div>
        <div
          className="dropdown"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {timeRange} <span>▼</span>
          {showDropdown && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setTimeRange('Monthly');
                  setShowDropdown(false);
                }}
              >
                Monthly
              </div>
              <div
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setTimeRange('Yearly');
                  setShowDropdown(false);
                }}
              >
                Yearly
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chart-placeholder">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={isMonthly ? "name" : "year"}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
              width={40}
              tickFormatter={(value) => `${value}k`}
            />
            <Tooltip
              formatter={(value) => [`₹${value}k`, activeTab]}
              labelFormatter={isMonthly ? (label) => label : (label) => `Year ${label}`}
            />
            <Bar
              dataKey="value"
              fill={barColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        .dropdown {
          position: relative;
          display: inline-block;
          padding: 4px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          cursor: pointer;
          user-select: none;
          font-size: 14px;
        }
        .dropdown span {
          margin-left: 4px;
          font-size: 10px;
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 10;
          min-width: 100px;
        }
        .dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
        }
        .dropdown-item:hover {
          background-color: #f8fafc;
        }
        .chart-placeholder {
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default IncomeExpense;