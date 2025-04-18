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
              <li
                key={item.id}
                onClick={() => onAddToCart(item)}
                style={{
                  borderLeft: '3px solid #009693', overflow: 'hidden', width: '100%',
                  padding: '10px',
                  textAlign: 'left',
                  background: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                <span style={{fontSize: 14, fontWeight: 'bold'}}>{item.name}</span>
                <p> ₹{item.selling_price}</p>
              </li>
            ))}
          </ul>
        )
      }
    </ >
  );
};

export default InvoiceItems;












// 'use client';

// import React, { useState } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import Image from 'next/image';
// import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// interface catMenuProps {
//   items: StoreItem[];
//   onAddToCart: (item: StoreItem) => void;
// }

// const InvoiceItems: React.FC<catMenuProps> = ({ items, onAddToCart }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const filteredItems = items.filter(item =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openModal = (item: StoreItem) => {
//     setSelectedItem(item);
//     setCurrentImageIndex(0);
//   };

//   const closeModal = () => {
//     setSelectedItem(null);
//     setCurrentImageIndex(0);
//   };

//   const nextImage = () => {
//     if (!selectedItem || !Array.isArray(selectedItem.images)) return;
//     setCurrentImageIndex((prev) => (prev + 1) % (selectedItem.images?.length || 1));
//   };

//   const prevImage = () => {
//     if (!selectedItem || !Array.isArray(selectedItem.images)) return;
//     setCurrentImageIndex((prev) =>
//       (prev - 1 + (selectedItem.images?.length || 0)) % (selectedItem.images?.length || 1)
//     );
//   };

//   return (
//     <>
//       {/* Search */}
//       <div className="searchbar-container" style={{
//         backgroundColor: '#fff',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '5px',
//         border: '1px solid #ccc',
//         padding: '0px 10px'
//       }}>
//         <FaSearch />
//         <input
//           type="text"
//           placeholder="Search items..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//           style={{
//             width: '100%',
//             border: 'none',
//             padding: 0
//           }}
//         />
//       </div>

//       {/* Item List */}
//       {
//         filteredItems.length === 0 ? (
//           <p style={{ padding: '20px', textAlign: 'center' }}>No items found</p>
//         ) : (
//           <ul style={{
//             listStyle: 'none',
//             padding: '20px 10px',
//             display: 'grid',
//             gridTemplateColumns: 'repeat(4, 1fr)',
//             gap: '10px',
//           }}>
//             {filteredItems.map(item => {
//               const firstImage = Array.isArray(item.images) && item.images.length > 0
//                 ? (typeof item.images[0] === 'string' ? item.images[0] : URL.createObjectURL(item.images[0]))
//                 : null;

//               return (
//                 <li
//                   key={`item-${item.id}`}

//                   style={{
//                     borderLeft: '3px solid #009693',
//                     padding: '10px',
//                     background: '#fff',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '10px',
//                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                     borderRadius: 1
//                   }}
//                 >
//                   {firstImage && (
//                     <Image
//                       src={firstImage}
//                       alt={item.name}
//                       width={120}
//                       height={100}
//                       style={{ objectFit: 'cover', borderRadius: 4 }}
//                       onClick={() => openModal(item)}
//                     />
//                   )}
//                   <div onClick={() => onAddToCart(item)}>
//                     <span style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</span>
//                     <p style={{ margin: 0 }}>₹{item.selling_price}</p>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )
//       }

//       {/* Modal */}
//       {selectedItem && (
//         <div style={{
//           position: 'fixed',
//           top: 0, left: 0,
//           width: '100vw',
//           height: '100vh',
//           backgroundColor: 'rgba(0,0,0,0.7)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 9999
//         }}>
//           <div style={{
//             background: '#fff',
//             padding: 20,
//             borderRadius: 8,
//             width: '90%',
//             maxWidth: 600,
//             position: 'relative',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center'
//           }}>
//             <button onClick={closeModal} style={{
//               position: 'absolute',
//               top: 10,
//               right: 10,
//               background: 'transparent',
//               border: 'none',
//               fontSize: 24,
//               cursor: 'pointer'
//             }}>
//               <FiX />
//             </button>

//             {Array.isArray(selectedItem.images) && selectedItem.images.length > 0 ? (
//               <div style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <button onClick={prevImage} style={{ position: 'absolute', left: 0, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer' }}>
//                   <FiChevronLeft />
//                 </button>
//                 <Image
//                   src={
//                     typeof selectedItem.images[currentImageIndex] === 'string'
//                       ? selectedItem.images[currentImageIndex]
//                       : URL.createObjectURL(selectedItem.images[currentImageIndex])
//                   }
//                   alt={`Item Image ${currentImageIndex + 1}`}
//                   width={400}
//                   height={300}
//                   style={{ objectFit: 'contain', borderRadius: 6 }}
//                 />
//                 <button onClick={nextImage} style={{ position: 'absolute', right: 0, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer' }}>
//                   <FiChevronRight />
//                 </button>
//               </div>
//             ) : (
//               <p>No images available.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default InvoiceItems;
