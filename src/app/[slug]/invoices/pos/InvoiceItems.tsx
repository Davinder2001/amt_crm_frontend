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
    <div style={{ flex: 1, width: '100%', background: '#fff'
    }}>

      <div className="searchbar-container" style={{ backgroundColor: '#eee' }}>
        {/* Search Input */}
        < input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '8px',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      {
        filteredItems.length === 0 ? (
          <p style={{padding: '20px', textAlign: 'center'}}>No items found</p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: '20px 10px',
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
        )
      }
    </div >
  );
};

export default InvoiceItems;
