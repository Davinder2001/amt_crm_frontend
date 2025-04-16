'use client';
import React, { useState } from 'react';

type ItemType = { name: string; price: number };
type Props = {
  items: ItemType[];
  onItemClick: (item: ItemType) => void;
};

export default function InvoiceItems({ items, onItemClick }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="centerArea">
      <input
        className="searchBar"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="itemGrid">
        {filteredItems.map((item) => (
          <div key={item.name} className="itemCard" onClick={() => onItemClick(item)}>
            <div>{item.name}</div>
            <div>₹{item.price}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .centerArea {
          flex: 1;
          padding: 10px;
          display: flex;
          flex-direction: column;
        }
        .searchBar {
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
        }
        .itemGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .itemCard {
          width: 150px;
          padding: 10px;
          background: white;
          border: 1px solid #ccc;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
