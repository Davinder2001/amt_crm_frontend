// // app/dashboard/components/TotalEarnings.tsx
// import React from 'react';

// const TotalEarnings = () => {
//     return (
//         <div className="card total-earnings">
//             <div className="card-header">
//                 <h3>Earnings</h3>
//                 <div className="dropdown">Today <span>▼</span></div>
//             </div>
//             <div className="chart-placeholder">[Line Chart: Paid vs Unpaid]</div>
//             <div className="legend">
//                 <span className="dot paid"></span> Paid
//                 <span className="dot unpaid"></span> Unpaid
//             </div>
//         </div>
//     );
// };

// export default TotalEarnings;








// app/dashboard/components/TotalEarnings.tsx
"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const earningsData = [
  { date: 'Dec 1', paid: 4200, unpaid: 1800 },
  { date: 'Dec 8', paid: 4800, unpaid: 2200 },
  { date: 'Dec 15', paid: 5200, unpaid: 1500 },
  { date: 'Dec 22', paid: 4900, unpaid: 2100 },
  { date: 'Dec 29', paid: 5500, unpaid: 1900 },
];

const TotalEarnings = () => {
  const [timeRange, setTimeRange] = useState<'Today' | 'Weekly' | 'Monthly'>('Today');
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="card total-earnings">
      <div className="card-header">
        <h3>Total Earnings</h3>
        <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
          {timeRange} <span>▼</span>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => { setTimeRange('Today'); setShowDropdown(false); }}>
                Today
              </div>
              <div className="dropdown-item" onClick={() => { setTimeRange('Weekly'); setShowDropdown(false); }}>
                Weekly
              </div>
              <div className="dropdown-item" onClick={() => { setTimeRange('Monthly'); setShowDropdown(false); }}>
                Monthly
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="chart-placeholder" style={{height: 200}}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888' }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip 
              formatter={(value, name) => [`₹${value}`, name === 'paid' ? 'Paid' : 'Unpaid']}
              labelFormatter={(label) => label}
              contentStyle={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="paid" 
              stroke="#384B70" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: '#384B70', strokeWidth: 2, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="unpaid" 
              stroke="#9CB9D0" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: '#9CB9D0', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="legend">
        <span className="dot paid"></span> Paid
        <span className="dot unpaid"></span> Unpaid
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
          margin: 16px 0;
          height: 250px;
        }
        
        .legend {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 14px;
          color: #4a5568;
        }
        
        .legend .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 4px;
        }
        
        .legend .dot.paid {
          background-color: #384B70;
        }
        
        .legend .dot.unpaid {
          background-color: #9CB9D0;
        }
      `}</style>
    </div>
  );
};

export default TotalEarnings;