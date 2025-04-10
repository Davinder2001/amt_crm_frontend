// 'use client'
// import React from 'react';
// import Link from 'next/link';
// import { useFetchStoreQuery, useDeleteStoreItemMutation } from '@/slices/store/storeApi';
// import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
// import {
//   useAddToCatalogMutation,
//   useRemoveFromCatalogMutation,
// } from '@/slices/catalog/catalogApi';
// import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';


// const Items: React.FC = () => {
//   const { data: selectedCompany } = useFetchSelectedCompanyQuery();
//   const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;

//   const { data: items, error, isLoading } = useFetchStoreQuery();
//   const storeItems: StoreItem[] = Array.isArray(items) ? items : [];

//   const [deleteStoreItem] = useDeleteStoreItemMutation();
//   const [addToCatalog] = useAddToCatalogMutation();
//   const [removeFromCatalog] = useRemoveFromCatalogMutation();

//   const handleDelete = async (id: number): Promise<void> => {
//     try {
//       await deleteStoreItem(id).unwrap();
//     } catch (err) {
//       console.error('Error deleting item:', err);
//     }
//   };

//   const handleCatalogToggle = async (id: number, isInCatalog: boolean): Promise<void> => {
//     try {
//       if (isInCatalog) {
//         await removeFromCatalog(id).unwrap();
//       } else {
//         await addToCatalog(id).unwrap();
//       }
//     } catch (error) {
//       console.error('Error updating catalog status:', error);
//     }
//   };

//   if (isLoading) return <p>Loading items...</p>;
//   if (error) return <p>Error fetching items.</p>;

//   return (
//     <>
//       <div style={{ width: '100%', overflowX: 'auto' }} className='tables-container'>
//         <table border={1} cellPadding={8} cellSpacing={0}>
//           <thead>
//             <tr>
//               <th>Item code</th>
//               <th>Name</th>
//               <th>Purchase Date</th>
//               <th>Date of Manufacture</th>
//               <th>Date of Expiry</th>
//               <th>Brand Name</th>
//               <th>Replacement</th>
//               <th>Quantity</th>
//               <th>Actions</th>
//               <th>Catalog</th>
//             </tr>
//           </thead>
//           <tbody>
//             {storeItems.map((item: StoreItem) => (
//               <tr key={item.id}>
//                 <td>{item.item_code}</td>
//                 <td>{item.name}</td>
//                 <td>{item.purchase_date}</td>
//                 <td>{item.date_of_manufacture}</td>
//                 <td>{item.date_of_expiry}</td>
//                 <td>{item.brand_name}</td>
//                 <td>{item.replacement}</td>
//                 <td>{item.quantity_count}</td>
//                 <td>
//                   {companySlug && (
//                     <>
//                     <div className="store-t-e-e-icons">

//                       <Link href={`/${companySlug}/store/view-item/${item.id}`}>
//                         <span ><FaEye color='#222' /></span>
//                       </Link>
//                       <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
//                         <FaEdit color='#222' />

//                       </Link>
//                   <span onClick={() => handleDelete(item.id)}>
//                     <FaTrash color='#222' />
//                   </span>
//                     </div>
//                     </>
//                   )}
//                 </td>
//                 <td>
//                   <button className='buttons' onClick={() => handleCatalogToggle(item.id, !!item.catalog)}>
//                     {item.catalog ? 'Remove from Catalog' : 'Add to Catalog'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default Items;








'use client';
import React from 'react';
import Link from 'next/link';
import {
  useFetchStoreQuery,
  useDeleteStoreItemMutation
} from '@/slices/store/storeApi';
import {
  useAddToCatalogMutation,
  useRemoveFromCatalogMutation
} from '@/slices/catalog/catalogApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';

const Items: React.FC = () => {
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined =
    selectedCompany?.selected_company?.company_slug;

  const { data: items, error, isLoading } = useFetchStoreQuery();
  const storeItems: StoreItem[] = Array.isArray(items) ? items : [];

  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [addToCatalog] = useAddToCatalogMutation();
  const [removeFromCatalog] = useRemoveFromCatalogMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteStoreItem(id).unwrap();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleCatalogToggle = async (id: number, isInCatalog: boolean) => {
    try {
      if (isInCatalog) {
        await removeFromCatalog(id).unwrap();
      } else {
        await addToCatalog(id).unwrap();
      }
    } catch (error) {
      console.error('Error updating catalog status:', error);
    }
  };

  if (isLoading) return <p>Loading items...</p>;
  if (error) return <p>Error fetching items.</p>;

  const columns = [
    { label: 'Item Code', key: 'item_code' as keyof StoreItem },
    { label: 'Name', key: 'name' as keyof StoreItem },
    { label: 'Purchase Date', key: 'purchase_date' as keyof StoreItem },
    { label: 'Date of Manufacture', key: 'date_of_manufacture' as keyof StoreItem },
    { label: 'Date of Expiry', key: 'date_of_expiry' as keyof StoreItem },
    { label: 'Brand Name', key: 'brand_name' as keyof StoreItem },
    { label: 'Replacement', key: 'replacement' as keyof StoreItem },
    { label: 'Quantity', key: 'quantity_count' as keyof StoreItem },
    {
      label: 'Actions',
      render: (item: StoreItem) =>
        companySlug && (
          <div className="store-t-e-e-icons">
            <Link href={`/${companySlug}/store/view-item/${item.id}`}>
              <span>
                <FaEye color="#222" />
              </span>
            </Link>
            <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
              <FaEdit color="#222" />
            </Link>
            <span onClick={() => handleDelete(item.id)}>
              <FaTrash color="#222" />
            </span>
          </div>
        )
    },
    {
      label: 'Catalog',
      render: (item: StoreItem) => (
        <button
          className="buttons"
          onClick={() => handleCatalogToggle(item.id, !!item.catalog)}
        >
          {item.catalog ? 'Remove from Catalog' : 'Add to Catalog'}
        </button>
      )
    }
  ];

  return <ResponsiveTable data={storeItems} columns={columns} />;
};

export default Items;
