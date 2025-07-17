'use client';

import React from 'react';
import { useFetchTopSellingItemsQuery } from '@/slices/reports/reportsApi';

const SaleItems = () => {
  const { data, isLoading, error } = useFetchTopSellingItemsQuery();

  // Normalize percentages based on top-selling item
  const items = data?.top_items || [];
  const maxQuantity = Math.max(...items.map(i => i.total_quantity || 0), 1); // avoid divide by zero

  return (
    <div className="card sale-items">
      <h3>Top Selling Items</h3>

      {isLoading && <p className="text-sm text-muted">Loading...</p>}
      {error && <p className="text-sm text-red-500">Failed to load top items</p>}

      <ul className="sale-list">
        {items.map((item, i) => {
          const percent = Math.round((item.total_quantity / maxQuantity) * 100);
          return (
            <li key={i} className="sale-item">
              <div className="label">{item.item_name}</div>
              <div className="progress">
                <div className="bar" style={{ width: `${percent}%` }}></div>
              </div>
              <div className="percent">{percent}%</div>
            </li>
          );
        })}
      </ul>

      <style>{`
        .sale-list {
          list-style: none;
          padding: 0;
          margin: 16px 0 0;
        }
        .sale-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .label {
          width: 80px;
          font-size: 14px;
          font-weight: 500;
        }
        .progress {
          flex-grow: 1;
          height: 8px;
          background: #f1f5f9;
          margin: 0 10px;
          border-radius: 4px;
          overflow: hidden;
        }
        .bar {
          height: 100%;
          background-color: var(--primary-color);
          transition: width 0.4s ease;
        }
        .percent {
          font-size: 13px;
          color: #64748b;
          width: 40px;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default SaleItems;
