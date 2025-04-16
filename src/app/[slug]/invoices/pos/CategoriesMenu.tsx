// 'use client';
// import React from 'react';

// type Props = {
//   menu: Record<string, Record<string, { name: string; price: number }[]>>;
//   mainCategory: string;
//   selectedSubCat: string;
//   onMainCatChange: (cat: string) => void;
//   onSubCatChange: (sub: string) => void;
// };

// export default function CategoriesMenu({
//   menu,
//   mainCategory,
//   selectedSubCat,
//   onMainCatChange,
//   onSubCatChange,
// }: Props) {
//   const subCategories = Object.keys(menu[mainCategory]);

//   return (
//     <div className="leftPanel">
//       <select value={mainCategory} onChange={(e) => onMainCatChange(e.target.value)}>
//         {Object.keys(menu).map((cat) => (
//           <option key={cat} value={cat}>{cat}</option>
//         ))}
//       </select>

//       <div className="subTabs">
//         {subCategories.map((sub) => (
//           <button
//             key={sub}
//             className={`subTabBtn ${selectedSubCat === sub ? 'active' : ''}`}
//             onClick={() => onSubCatChange(sub)}
//           >
//             {sub}
//           </button>
//         ))}
//       </div>

//       <style jsx>{`
//         .leftPanel {
//           width: 180px;
//           background: #f1f1f1;
//           padding: 10px;
//           display: flex;
//           flex-direction: column;
//           border-right: 1px solid #ccc;
//         }
//         select {
//           padding: 6px;
//           border: 1px solid #ccc;
//         }
//         .subTabs {
//           margin-top: 12px;
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }
//         .subTabBtn {
//           background: white;
//           border: 1px solid #ccc;
//           padding: 6px;
//           text-align: left;
//           cursor: pointer;
//         }
//         .subTabBtn.active {
//           background: #009688;
//           color: white;
//         }
//       `}</style>
//     </div>
//   );
// }









'use client';
import React, { useState } from 'react';

type MenuNode = {
  soreItems?: { name: string; price: number }[];
  [key: string]: any;
};

type Props = {
  menu: Record<string, MenuNode>;
  mainCategory: string;
  selectedPath: string[];
  onMainCatChange: (cat: string) => void;
  onPathChange: (path: string[]) => void;
};

export default function CategoriesMenu({
  menu,
  mainCategory,
  selectedPath,
  onMainCatChange,
  onPathChange,
}: Props) {
  const [expandedPaths, setExpandedPaths] = useState<string[][]>([]);

  const toggleExpand = (path: string[]) => {
    const exists = expandedPaths.some((p) => p.join('/') === path.join('/'));
    if (exists) {
      setExpandedPaths(expandedPaths.filter((p) => p.join('/') !== path.join('/')));
    } else {
      setExpandedPaths([...expandedPaths, path]);
    }
  };

  const isExpanded = (path: string[]) =>
    expandedPaths.some((p) => p.join('/') === path.join('/'));

  const renderSubTree = (node: MenuNode, path: string[]) => {
    return Object.entries(node)
      .filter(([key]) => key !== 'soreItems')
      .map(([key, value]) => {
        const currentPath = [...path, key];
        const hasChildren = Object.keys(value).some((k) => k !== 'soreItems');
        const selected = selectedPath.join('/') === currentPath.join('/');
        const hasItems = value.soreItems?.length > 0;

        return (
          <div key={key} style={{ marginLeft: path.length * 10 }}>
            <button
              className={`subTabBtn ${selected ? 'active' : ''}`}
              onClick={() => {
                if (selected) {
                  // Unselect the current subcategory and show its parent items
                  onPathChange(path.slice(0, path.length - 1)); // Parent path
                } else {
                  onPathChange(currentPath); // Select current subcategory
                }
              }}
            >
              {key} {hasChildren && <span onClick={(e) => {
                e.stopPropagation();
                toggleExpand(currentPath);
              }}>+</span>}
            </button>
            {hasChildren && isExpanded(currentPath) && renderSubTree(value, currentPath)}
          </div>
        );
      });
  };

  return (
    <div className="leftPanel">
      <select value={mainCategory} onChange={(e) => onMainCatChange(e.target.value)}>
        {Object.keys(menu).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <div className="subTabs">
        {renderSubTree(menu[mainCategory], [])}
      </div>

      <style jsx>{`
        .leftPanel {
          width: 180px;
          background: #f1f1f1;
          padding: 10px;
          border-right: 1px solid #ccc;
        }
        select {
          padding: 6px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
        }
        .subTabs {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .subTabBtn {
          background: white;
          border: 1px solid #ccc;
          padding: 5px 10px;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }
        .subTabBtn.active {
          background: #009688;
          color: white;
        }
      `}</style>
    </div>
  );
}
