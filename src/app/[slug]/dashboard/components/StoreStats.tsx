// File: app/dashboard/components/StoreStats.tsx
import React from 'react';

const StoreStats = () => {
  return (
    <div className="card store-stats">
      <div className="card-header">
        <h3>Store Statics</h3>
        <div className="dropdown">Monthly <span>▼</span></div>
      </div>
      <div className="chart-placeholder">[Line Chart]</div>
    </div>
  );
};

export default StoreStats;