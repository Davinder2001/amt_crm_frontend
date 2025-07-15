'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFetchMonthlySalesReportQuery } from '@/slices/reports/reportsApi';

const MonthlySalesChart = () => {
  const { data, isLoading, error } = useFetchMonthlySalesReportQuery();

  const salesData = data?.data.map((entry) => ({
    name: entry.month,
    sales: entry.total_sales,
  })) || [];

  return (
    <div className="card total-revenue">
      <div className="card-header">
        <h3>Monthly Sales</h3>
        <span className="revenue-value">
          ₹{salesData.reduce((sum, s) => sum + s.sales, 0).toFixed(1)}{' '}
          <small className="green">Total this year</small>
        </span>
      </div>

      <div className="chart-placeholder">
        <ResponsiveContainer width="100%" height={225}>
          <BarChart
            data={salesData}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              style={{ fontSize: '12px', fill: '#384B70' }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              style={{ fontSize: '12px', fill: '#384B70' }}
              width={50}
            />
            <Tooltip formatter={(value: number) => `₹${value}`} />
            <Bar
              dataKey="sales"
              fill="var(--primary-color)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isLoading && <p className="text-sm mt-2 text-muted">Loading sales chart...</p>}
      {error && <p className="text-sm mt-2 text-red-500">Failed to load chart.</p>}
    </div>
  );
};

export default MonthlySalesChart;
