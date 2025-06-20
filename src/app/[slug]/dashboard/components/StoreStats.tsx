// // File: app/dashboard/components/StoreStats.tsx
// import React from 'react';

// const StoreStats = () => {
//   return (
//     <div className="card store-stats">
//       <div className="card-header">
//         <h3>Store Statics</h3>
//         <div className="dropdown">Monthly <span>▼</span></div>
//       </div>
//       <div className="chart-placeholder">[Line Chart]</div>
//     </div>
//   );
// };

// export default StoreStats;










// File: app/dashboard/components/StoreStats.tsx
"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { name: 'Jan', value: 20 },
  { name: 'Feb', value: 50 },
  { name: 'Mar', value: 60 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 80 },
  { name: 'Jun', value: 100 },
  { name: 'Jul', value: 80 },
  { name: 'Aug', value: 60 },
  { name: 'Sep', value: 50 },
];

const yearlyData = [
  { name: 'Jan', value: 20 },
  { name: 'Feb', value: 40 },
  { name: 'Mar', value: 60 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 80 },
  { name: 'Jun', value: 60 },
  { name: 'Jul', value: 70 },
  { name: 'Aug', value: 90 },
  { name: 'Sep', value: 50 },
  { name: 'Oct', value: 30 },
  { name: 'Nov', value: 20 },
  { name: 'Dec', value: 40 },
];

const StoreStats = () => {
  const [timeRange, setTimeRange] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [showDropdown, setShowDropdown] = useState(false);

  const data = timeRange === 'Monthly' ? monthlyData : yearlyData;

  return (
    <div className="card store-stats">
      <div className="card-header">
        <h3>Store Statics</h3>
        <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
          {timeRange} <span>▼</span>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => { setTimeRange('Monthly'); setShowDropdown(false); }}>Monthly</div>
              <div className="dropdown-item" onClick={() => { setTimeRange('Yearly'); setShowDropdown(false); }}>Yearly</div>
            </div>
          )}
        </div>
      </div>
      <div className="chart-placeholder">
        <ResponsiveContainer width="100%" height='100%'>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--primary-color)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                stroke: 'var(--primary-color)',
                strokeWidth: 2,
                fill: '#fff'
              }}
            />
          </LineChart>
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

export default StoreStats;