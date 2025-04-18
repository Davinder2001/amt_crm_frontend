'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

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
    <>
      <div className="searchbar-container" style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid #ccc', padding: '0px 10px' }}>
        {/* Search Input */}
        <FaSearch />
        < input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            padding: 0
          }}
        />
      </div>

      {
        filteredItems.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>No items found</p>
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
              <li key={item.id} style={{ borderLeft: '3px solid #009693', overflow: 'hidden' }}>
                <button
                  onClick={() => onAddToCart(item)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    textAlign: 'left',
                    background: '#f9f9f9',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <strong>{item.name}</strong>
                  <p> ₹{item.selling_price}</p>
                </button>
              </li>
            ))}
          </ul>
        )
      }
    </ >
  );
};

export default InvoiceItems;
