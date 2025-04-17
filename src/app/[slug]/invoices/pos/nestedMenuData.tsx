// 'use client';

// import React, { useEffect, useState } from 'react';
// import CheckoutPanel from './CheckoutPanel';
// import InvoiceItems from './InvoiceItems';
// import CategoriesMenu from './CategoriesMenu';
// import { useFetchCategoriesAndItemsQuery } from '@/slices/store/storeApi';

// type ItemType = { name: string; price: number };
// type OrderItem = ItemType & { qty: number };
// type TabType = 'DineIn' | 'Delivery' | 'Pickup';

// type MenuNode = {
//     soreItems?: ItemType[];
//     [key: string]: any;
// };

// const MENU: Record<string, MenuNode> = {
//     Food: {
//         soreItems: [
//             { name: 'Veg Thali', price: 180 },
//             { name: 'Mixed Platter', price: 320 },
//         ],
//         NorthIndian: {
//             soreItems: [
//                 { name: 'Paneer Butter Masala', price: 210 },
//                 { name: 'Rajma Chawal', price: 150 },
//             ],
//             Punjabi: {
//                 soreItems: [
//                     { name: 'Sarson Da Saag', price: 180 },
//                     { name: 'Makki Di Roti', price: 80 },
//                 ],
//             },
//             Rajasthani: {
//                 soreItems: [
//                     { name: 'Dal Baati Churma', price: 220 },
//                     { name: 'Gatte ki Sabzi', price: 180 },
//                 ],
//             },
//         },
//         SouthIndian: {
//             soreItems: [
//                 { name: 'Masala Dosa', price: 120 },
//                 { name: 'Idli Vada', price: 90 },
//             ],
//             Tamil: {
//                 soreItems: [
//                     { name: 'Sambar Rice', price: 110 },
//                     { name: 'Rasam', price: 60 },
//                 ],
//             },
//         },
//         Chinese: {
//             soreItems: [
//                 { name: 'Veg Noodles', price: 130 },
//                 { name: 'Manchurian', price: 150 },
//             ],
//             StreetStyle: {
//                 soreItems: [
//                     { name: 'Chowmein', price: 120 },
//                     { name: 'Spring Roll', price: 100 },
//                 ],
//                 SpicyZone: {
//                     soreItems: [
//                         { name: 'Dragon Chicken', price: 200 },
//                         { name: 'Schezwan Noodles', price: 160 },
//                     ],
//                 },
//             },
//         },
//     },
//     Beverages: {
//         soreItems: [
//             { name: 'Mineral Water', price: 20 },
//             { name: 'Energy Drink', price: 100 },
//         ],
//         Hot: {
//             soreItems: [
//                 { name: 'Hot Chocolate', price: 90 },
//             ],
//             Tea: {
//                 soreItems: [
//                     { name: 'Masala Chai', price: 60 },
//                     { name: 'Ginger Tea', price: 50 },
//                 ],
//                 Herbal: {
//                     soreItems: [
//                         { name: 'Tulsi Tea', price: 70 },
//                         { name: 'Chamomile Tea', price: 80 },
//                     ],
//                 },
//             },
//             Coffee: {
//                 soreItems: [
//                     { name: 'Cappuccino', price: 150 },
//                     { name: 'Espresso', price: 100 },
//                 ],
//             },
//         },
//         Cold: {
//             soreItems: [
//                 { name: 'Iced Tea', price: 70 },
//                 { name: 'Cold Coffee', price: 90 },
//             ],
//             Juices: {
//                 soreItems: [
//                     { name: 'Mango Juice', price: 90 },
//                     { name: 'Apple Juice', price: 80 },
//                 ],
//                 FreshPressed: {
//                     soreItems: [
//                         { name: 'Carrot Beet Mix', price: 110 },
//                         { name: 'Orange Mint', price: 100 },
//                     ],
//                 },
//             },
//             SoftDrinks: {
//                 soreItems: [
//                     { name: 'Coca-Cola', price: 40 },
//                     { name: 'Sprite', price: 35 },
//                 ],
//             },
//         },
//     },
//     Desserts: {
//         soreItems: [
//             { name: 'Gajar Halwa', price: 120 },
//             { name: 'Rasgulla', price: 100 },
//         ],
//         IceCreams: {
//             soreItems: [
//                 { name: 'Vanilla', price: 120 },
//                 { name: 'Choco-Chip', price: 130 },
//             ],
//             Premium: {
//                 soreItems: [
//                     { name: 'Belgian Chocolate', price: 180 },
//                     { name: 'Strawberry Cheesecake', price: 170 },
//                 ],
//             },
//         },
//         Cakes: {
//             soreItems: [
//                 { name: 'Black Forest', price: 180 },
//                 { name: 'Red Velvet', price: 200 },
//             ],
//         },
//     },
//     Alcohol: {
//         soreItems: [
//             { name: 'Whiskey Shot', price: 180 },
//             { name: 'Mojito', price: 250 },
//         ],
//         Beer: {
//             soreItems: [
//                 { name: 'Kingfisher', price: 180 },
//                 { name: 'Heineken', price: 200 },
//             ],
//         },
//         Whiskey: {
//             soreItems: [
//                 { name: 'Jack Daniel’s', price: 500 },
//                 { name: 'Chivas Regal', price: 550 },
//             ],
//             Aged: {
//                 soreItems: [
//                     { name: 'Glenfiddich 15yr', price: 750 },
//                     { name: 'Macallan 18yr', price: 1200 },
//                 ],
//             },
//         },
//         Wine: {
//             soreItems: [
//                 { name: 'Sula Red', price: 350 },
//                 { name: 'Jacob’s Creek', price: 400 },
//             ],
//         },
//     },
// };

// const getItemsForPath = (path: string[], menu: MenuNode): ItemType[] => {
//     let current = menu;
//     for (const segment of path) {
//         if (!current[segment]) return [];
//         current = current[segment];
//     }

//     if (current.soreItems?.length) return current.soreItems;

//     for (const key in current) {
//         if (key === 'soreItems') continue;
//         const items = getItemsForPath([...path, key], menu);
//         if (items.length) return items;
//     }

//     return [];
// };

// export default function POSPage() {
//     const [mainCategory, setMainCategory] = useState<string>('Food');
//     const [selectedPath, setSelectedPath] = useState<string[]>([]);
//     const [activeTab, setActiveTab] = useState<TabType>('DineIn');
//     const [carts, setCarts] = useState<Record<TabType, OrderItem[]>>({
//         DineIn: [],
//         Delivery: [],
//         Pickup: [],
//     });
//     const { data } = useFetchCategoriesAndItemsQuery();
//     console.log('cat-with-data', data);


//     useEffect(() => {
//         const initialPath = findFirstPathWithItems(MENU[mainCategory]);
//         if (initialPath) setSelectedPath(initialPath);
//     }, [mainCategory]);

//     const findFirstPathWithItems = (node: MenuNode, path: string[] = []): string[] | null => {
//         if (node.soreItems?.length) return path;

//         for (const key in node) {
//             if (key === 'soreItems') continue;
//             const result = findFirstPathWithItems(node[key], [...path, key]);
//             if (result) return result;
//         }
//         return null;
//     };

//     const addItemToCart = (item: ItemType) => {
//         setCarts((prev) => {
//             const updated = [...prev[activeTab]];
//             const found = updated.find((i) => i.name === item.name);
//             if (found) {
//                 return {
//                     ...prev,
//                     [activeTab]: updated.map((i) =>
//                         i.name === item.name ? { ...i, qty: i.qty + 1 } : i
//                     ),
//                 };
//             } else {
//                 return {
//                     ...prev,
//                     [activeTab]: [...updated, { ...item, qty: 1 }],
//                 };
//             }
//         });
//     };

//     const updateQty = (itemName: string, delta: number) => {
//         setCarts((prev) => {
//             const updated = prev[activeTab]
//                 .map((i) =>
//                     i.name === itemName ? { ...i, qty: i.qty + delta } : i
//                 )
//                 .filter((i) => i.qty > 0);
//             return { ...prev, [activeTab]: updated };
//         });
//     };

//     const items = getItemsForPath([mainCategory, ...selectedPath], MENU);

//     return (
//         <div className="container">
//             <CategoriesMenu
//                 menu={MENU}
//                 mainCategory={mainCategory}
//                 selectedPath={selectedPath}
//                 onMainCatChange={(cat) => {
//                     setMainCategory(cat);
//                 }}
//                 onPathChange={setSelectedPath}
//             />
//             <InvoiceItems items={items} onItemClick={addItemToCart} />
//             <CheckoutPanel
//                 activeTab={activeTab}
//                 onTabChange={setActiveTab}
//                 cart={carts[activeTab]}
//                 onQtyChange={updateQty}
//             />

//             <style jsx>{`
//         .container {
//           display: flex;
//         }
//       `}</style>
//         </div>
//     );
// }


















// 'use client';
// import React, { useState } from 'react';

// type MenuNode = {
//     soreItems?: { name: string; price: number }[];
//     [key: string]: any;
// };

// type Props = {
//     menu: Record<string, MenuNode>;
//     mainCategory: string;
//     selectedPath: string[];
//     onMainCatChange: (cat: string) => void;
//     onPathChange: (path: string[]) => void;
// };

// export default function CategoriesMenu({
//     menu,
//     mainCategory,
//     selectedPath,
//     onMainCatChange,
//     onPathChange,
// }: Props) {
//     const [expandedPaths, setExpandedPaths] = useState<string[][]>([]);

//     const toggleExpand = (path: string[]) => {
//         const exists = expandedPaths.some((p) => p.join('/') === path.join('/'));
//         if (exists) {
//             setExpandedPaths(expandedPaths.filter((p) => p.join('/') !== path.join('/')));
//         } else {
//             setExpandedPaths([...expandedPaths, path]);
//         }
//     };

//     const isExpanded = (path: string[]) =>
//         expandedPaths.some((p) => p.join('/') === path.join('/'));

//     const renderSubTree = (node: MenuNode, path: string[]) => {
//         return Object.entries(node)
//             .filter(([key]) => key !== 'soreItems')
//             .map(([key, value]) => {
//                 const currentPath = [...path, key];
//                 const hasChildren = Object.keys(value).some((k) => k !== 'soreItems');
//                 const selected = selectedPath.join('/') === currentPath.join('/');
//                 const hasItems = value.soreItems?.length > 0;

//                 return (
//                     <div key={key} style={{ marginLeft: path.length * 10 }}>
//                         <button
//                             className={`subTabBtn ${selected ? 'active' : ''}`}
//                             onClick={() => {
//                                 if (selected) {
//                                     // Unselect the current subcategory and show its parent items
//                                     onPathChange(path.slice(0, path.length - 1)); // Parent path
//                                 } else {
//                                     onPathChange(currentPath); // Select current subcategory
//                                 }
//                             }}
//                         >
//                             {key} {hasChildren && <span onClick={(e) => {
//                                 e.stopPropagation();
//                                 toggleExpand(currentPath);
//                             }}>+</span>}
//                         </button>
//                         {hasChildren && isExpanded(currentPath) && renderSubTree(value, currentPath)}
//                     </div>
//                 );
//             });
//     };

//     return (
//         <div className="leftPanel">
//             <select value={mainCategory} onChange={(e) => onMainCatChange(e.target.value)}>
//                 {Object.keys(menu).map((cat) => (
//                     <option key={cat} value={cat}>{cat}</option>
//                 ))}
//             </select>

//             <div className="subTabs">
//                 {renderSubTree(menu[mainCategory], [])}
//             </div>

//             <style jsx>{`
//         .leftPanel {
//           width: 180px;
//           background: #f1f1f1;
//           padding: 10px;
//           border-right: 1px solid #ccc;
//         }
//         select {
//           padding: 6px;
//           margin-bottom: 10px;
//           border: 1px solid #ccc;
//         }
//         .subTabs {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }
//         .subTabBtn {
//           background: white;
//           border: 1px solid #ccc;
//           padding: 5px 10px;
//           text-align: left;
//           cursor: pointer;
//           transition: background-color 0.3s, color 0.3s;
//         }
//         .subTabBtn.active {
//           background: #009688;
//           color: white;
//         }
//       `}</style>
//         </div>
//     );
// }









// 'use client';
// import React, { useState } from 'react';

// type ItemType = { name: string; price: number };
// type Props = {
//   items: ItemType[];
//   onItemClick: (item: ItemType) => void;
// };

// export default function InvoiceItems({ items, onItemClick }: Props) {
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredItems = items.filter((item) =>
//     item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="centerArea">
//       <input
//         className="searchBar"
//         placeholder="Search..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />

//       <div className="itemGrid">
//         {filteredItems.map((item) => (
//           <div key={item.name} className="itemCard" onClick={() => onItemClick(item)}>
//             <div>{item.name}</div>
//             <div>₹{item.price}</div>
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .centerArea {
//           flex: 1;
//           padding: 10px;
//           display: flex;
//           flex-direction: column;
//         }
//         .searchBar {
//           padding: 8px;
//           margin-bottom: 10px;
//           border: 1px solid #ccc;
//         }
//         .itemGrid {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 10px;
//         }
//         .itemCard {
//           width: 150px;
//           padding: 10px;
//           background: white;
//           border: 1px solid #ccc;
//           cursor: pointer;
//         }
//       `}</style>
//     </div>
//   );
// }














// 'use client';

// import React, { useState } from 'react';

// type ItemType = { id: number; name: string; price: number; qty: number };

// type Props = {
//     activeTab: TabType;
//     onTabChange: (tab: TabType) => void;
//     cart: ItemType[];
//     onQtyChange: (itemId: number, delta: number) => void;
// };

// const tabs: TabType[] = ['DineIn', 'Delivery', 'Pickup'];

// export default function CheckoutPanel({ activeTab, onTabChange, cart, onQtyChange }: Props) {
//     const [showPaymentDetails, setShowPaymentDetails] = useState(true);
//     const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

//     return (
//         <div className="checkout">
//             <div className="tabs">
//                 {tabs.map((tab) => (
//                     <button
//                         key={tab}
//                         className={`tab ${tab === activeTab ? 'active' : ''}`}
//                         onClick={() => onTabChange(tab)}
//                     >
//                         {tab}
//                     </button>
//                 ))}
//             </div>

//             <div className="content">
//                 {activeTab === 'DineIn' && (
//                     <>
//                         {cart.length > 0 && (
//                             <table className="cartTable">
//                                 <thead>
//                                     <tr>
//                                         <th>Item</th>
//                                         <th>Qty</th>
//                                         <th>Price</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cart.map((item) => (
//                                         <tr key={item.id}>
//                                             <td>{item.name}</td>
//                                             <td>
//                                                 <button onClick={() => onQtyChange(item.id, -1)}>-</button>
//                                                 {item.qty}
//                                                 <button onClick={() => onQtyChange(item.id, 1)}>+</button>
//                                             </td>
//                                             <td>₹{item.qty * item.price}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}

//                         <div className="sectionToggle" onClick={() => setShowPaymentDetails(!showPaymentDetails)}>
//                             <span>{showPaymentDetails ? '▼' : '▲'}</span>
//                             <span>Discounts & Payment</span>
//                         </div>

//                         {showPaymentDetails && (
//                             <div className="discounts">
//                                 <div className="checkboxGroup">
//                                     <label><input type="checkbox" /> Bogo</label>
//                                     <label><input type="checkbox" /> Complimentary</label>
//                                 </div>
//                                 <div className="radioGroup">
//                                     <label><input type="radio" name="pay" /> Cash</label>
//                                     <label><input type="radio" name="pay" /> Card</label>
//                                     <label><input type="radio" name="pay" /> Due</label>
//                                 </div>
//                             </div>
//                         )}

//                         <div className="total">
//                             Total: <strong>₹{total}</strong>
//                         </div>

//                         <div className="actions">
//                             <button className="btn">Save</button>
//                             <button className="btn">Print</button>
//                             <button className="btn">KOT</button>
//                         </div>
//                     </>
//                 )}

//                 {activeTab === 'Delivery' && (
//                     <div className="form">
//                         <h4>Delivery Details</h4>
//                         <input type="text" placeholder="Customer Name" />
//                         <input type="text" placeholder="Phone Number" />
//                         <textarea placeholder="Delivery Address" />
//                         <div className="actions">
//                             <button className="btn">Save</button>
//                             <button className="btn">Send</button>
//                         </div>
//                     </div>
//                 )}

//                 {activeTab === 'Pickup' && (
//                     <div className="form">
//                         <h4>Pickup Details</h4>
//                         <input type="text" placeholder="Customer Name" />
//                         <input type="text" placeholder="Phone Number" />
//                         <div className="actions">
//                             <button className="btn">Save</button>
//                             <button className="btn">Notify</button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <style jsx>{`
//                 .checkout {
//                     width: 350px;
//                     background: #fff;
//                     border-left: 1px solid #ccc;
//                     display: flex;
//                     flex-direction: column;
//                     height: 100%;
//                     font-family: sans-serif;
//                 }

//                 .tabs {
//                     display: flex;
//                     border-bottom: 1px solid #ccc;
//                 }

//                 .tab {
//                     flex: 1;
//                     padding: 10px;
//                     border: none;
//                     background: #eee;
//                     cursor: pointer;
//                     font-weight: bold;
//                 }

//                 .tab.active {
//                     background: #009688;
//                     color: white;
//                 }

//                 .content {
//                     padding: 12px;
//                     overflow-y: auto;
//                     flex: 1;
//                     display: flex;
//                     flex-direction: column;
//                     gap: 16px;
//                 }

//                 .cartTable {
//                     width: 100%;
//                     border-collapse: collapse;
//                     font-size: 14px;
//                 }

//                 .cartTable th,
//                 .cartTable td {
//                     padding: 6px;
//                     border-bottom: 1px solid #ddd;
//                     text-align: left;
//                 }

//                 .cartTable button {
//                     margin: 0 4px;
//                     padding: 2px 6px;
//                 }

//                 .sectionToggle {
//                     display: flex;
//                     align-items: center;
//                     gap: 8px;
//                     cursor: pointer;
//                     font-weight: bold;
//                     background: #f1f1f1;
//                     padding: 8px;
//                     border-radius: 4px;
//                 }

//                 .discounts {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 10px;
//                     padding: 8px;
//                     border: 1px solid #ddd;
//                     border-radius: 5px;
//                     background: #fafafa;
//                 }

//                 .checkboxGroup,
//                 .radioGroup {
//                     display: flex;
//                     gap: 12px;
//                     flex-wrap: wrap;
//                 }

//                 .total {
//                     text-align: right;
//                     font-size: 16px;
//                 }

//                 .actions {
//                     display: flex;
//                     gap: 10px;
//                 }

//                 .btn {
//                     flex: 1;
//                     padding: 10px;
//                     background: #009688;
//                     color: white;
//                     border: none;
//                     border-radius: 4px;
//                     font-weight: bold;
//                     cursor: pointer;
//                 }

//                 .form {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 10px;
//                 }

//                 .form input,
//                 .form textarea {
//                     padding: 8px;
//                     border: 1px solid #ccc;
//                     border-radius: 4px;
//                 }

//                 .form textarea {
//                     resize: vertical;
//                 }
//             `}</style>
//         </div>
//     );
// }
