'use client';
import React from 'react';

type Props = {
  menu: Record<string, Record<string, { name: string; price: number }[]>>;
  mainCategory: string;
  selectedSubCat: string;
  onMainCatChange: (cat: string) => void;
  onSubCatChange: (sub: string) => void;
};

export default function CategoriesMenu({
  menu,
  mainCategory,
  selectedSubCat,
  onMainCatChange,
  onSubCatChange,
}: Props) {
  const subCategories = Object.keys(menu[mainCategory]);

  return (
    <div className="leftPanel">
      <select value={mainCategory} onChange={(e) => onMainCatChange(e.target.value)}>
        {Object.keys(menu).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <div className="subTabs">
        {subCategories.map((sub) => (
          <button
            key={sub}
            className={`subTabBtn ${selectedSubCat === sub ? 'active' : ''}`}
            onClick={() => onSubCatChange(sub)}
          >
            {sub}
          </button>
        ))}
      </div>

      <style jsx>{`
        .leftPanel {
          width: 180px;
          background: #f1f1f1;
          padding: 10px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #ccc;
        }
        select {
          padding: 6px;
          border: 1px solid #ccc;
        }
        .subTabs {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .subTabBtn {
          background: white;
          border: 1px solid #ccc;
          padding: 6px;
          text-align: left;
          cursor: pointer;
        }
        .subTabBtn.active {
          background: #009688;
          color: white;
        }
      `}</style>
    </div>
  );
}
