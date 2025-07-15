'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFetchMonthlyRevenueReportQuery } from '@/slices/reports/reportsApi';

const StoreStats = () => {
  const [timeRange, setTimeRange] = useState<'Monthly'>('Monthly');
  const [showDropdown, setShowDropdown] = useState(false);

  const { data, isLoading, error } = useFetchMonthlyRevenueReportQuery();

  const chartData =
    data?.data.map((entry) => ({
      name: entry.month,
      value: entry.total_revenue,
    })) || [];

  return (
    <div className="card store-stats">
      <div className="card-header">
        <h3>Store Revenue</h3>
        <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
          {timeRange} <span>▼</span>
          {showDropdown && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => {
                  setTimeRange('Monthly');
                  setShowDropdown(false);
                }}
              >
                Monthly
              </div>
              {/* Optional: Disable Yearly until backend supports it */}
              {/* <div
                className="dropdown-item"
                onClick={() => {
                  setTimeRange('Yearly');
                  setShowDropdown(false);
                }}
              >
                Yearly
              </div> */}
            </div>
          )}
        </div>
      </div>

      <div className="chart-placeholder">
        <ResponsiveContainer width="100%" height={225}>
          <LineChart
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: '#888', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString()}`}
              contentStyle={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
                fill: '#fff',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isLoading && <p className="text-sm mt-2 text-muted">Loading chart...</p>}
      {error && <p className="text-sm mt-2 text-red-500">Failed to load revenue data.</p>}

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
