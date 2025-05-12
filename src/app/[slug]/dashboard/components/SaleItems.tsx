// File: app/dashboard/components/SaleItems.tsx
import React from 'react';

const SaleItems = () => {
  const items = [
    { label: 'Jeans', percent: 70 },
    { label: 'Shirts', percent: 40 },
    { label: 'Belts', percent: 60 },
    { label: 'Caps', percent: 80 },
    { label: 'Others', percent: 20 },
  ];

  return (
    <div className="card sale-items">
      <h3>Most Sale Items</h3>
      <ul className="sale-list">
        {items.map((item, i) => (
          <li key={i} className="sale-item">
            <div className="label">{item.label}</div>
            <div className="progress">
              <div className="bar" style={{ width: `${item.percent}%` }}></div>
            </div>
            <div className="percent">{item.percent}%</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SaleItems;
