'use client';

import React, { useState } from 'react';

interface catMenuProps {
  items: StoreItem[];
  onAddToCart: (item: StoreItem) => void;
}

const InvoiceItems: React.FC<catMenuProps> = ({ items, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1rem', flex: 1, width: '100%' }}>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          marginBottom: '1rem',
          padding: '8px',
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />

      {filteredItems.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: '10px',
          }}
        >
          {filteredItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onAddToCart(item)}
                style={{
                  width: '100%',
                  padding: '10px',
                  textAlign: 'left',
                  background: '#f9f9f9',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <strong>{item.name}</strong> <p>- ₹{item.selling_price}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvoiceItems;
