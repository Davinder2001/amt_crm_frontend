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





// 'use client';
// import React, { useState } from 'react';
// import Link from 'next/link';
// import {
//   useFetchStoreQuery,
//   useDeleteStoreItemMutation,
// } from '@/slices/store/storeApi';
// import {
//   useAddToCatalogMutation,
//   useRemoveFromCatalogMutation,
// } from '@/slices/catalog/catalogApi';
// import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
// import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
// import ResponsiveTable from '@/components/common/ResponsiveTable';
// import TableToolbar from '@/components/common/TableToolbar';

// const Items: React.FC = () => {
//   const { data: selectedCompany } = useFetchSelectedCompanyQuery();
//   const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;

//   const { data: items, error, isLoading } = useFetchStoreQuery();
//   const storeItems: StoreItem[] = Array.isArray(items) ? items : [];

//   const [deleteStoreItem] = useDeleteStoreItemMutation();
//   const [addToCatalog] = useAddToCatalogMutation();
//   const [removeFromCatalog] = useRemoveFromCatalogMutation();

//   const [visibleColumns, setVisibleColumns] = useState<string[]>([
//     'item_code',
//     'name',
//     'purchase_date',
//     'date_of_manufacture',
//     'date_of_expiry',
//     'brand_name',
//     'replacement',
//     'quantity_count',
//     'actions',
//     'catalog',
//   ]);

//   const [filters, setFilters] = useState<Record<string, string[]>>({});

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteStoreItem(id).unwrap();
//     } catch (err) {
//       console.error('Error deleting item:', err);
//     }
//   };

//   const handleCatalogToggle = async (id: number, isInCatalog: boolean) => {
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

//   const allColumns = [
//     { label: 'Item Code', key: 'item_code' },
//     { label: 'Name', key: 'name' },
//     { label: 'Purchase Date', key: 'purchase_date' },
//     { label: 'Date of Manufacture', key: 'date_of_manufacture' },
//     { label: 'Date of Expiry', key: 'date_of_expiry' },
//     { label: 'Brand Name', key: 'brand_name' },
//     { label: 'Replacement', key: 'replacement' },
//     { label: 'Quantity', key: 'quantity_count' },
//     { label: 'Actions', key: 'actions' },
//     { label: 'Catalog', key: 'catalog' },
//   ];

//   const handleFilterChange = (field: string, value: string, checked: boolean) => {
//     setFilters((prev) => {
//       const current = new Set(prev[field] || []);
//       if (checked) current.add(value);
//       else current.delete(value);
//       return { ...prev, [field]: [...current] };
//     });
//   };

//   const toggleColumn = (key: string) => {
//     setVisibleColumns((prev) =>
//       prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
//     );
//   };

//   const filterData = (data: StoreItem[]): StoreItem[] => {
//     return data.filter((item) => {
//       return Object.entries(filters).every(([field, values]) => {
//         const itemValue = (item as any)[field];
//         if (Array.isArray(values) && values.length > 0) {
//           return values.includes(String(itemValue));
//         }
//         return true;
//       });
//     });
//   };

//   const filteredItems = filterData(storeItems);

//   const columns = allColumns
//     .filter((col) => visibleColumns.includes(col.key))
//     .map((col) => {
//       if (col.key === 'actions') {
//         return {
//           label: 'Actions',
//           render: (item: StoreItem) =>
//             companySlug && (
//               <div className="store-t-e-e-icons">
//                 <Link href={`/${companySlug}/store/view-item/${item.id}`}>
//                   <span>
//                     <FaEye color="#222" />
//                   </span>
//                 </Link>
//                 <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
//                   <FaEdit color="#222" />
//                 </Link>
//                 <span onClick={() => handleDelete(item.id)}>
//                   <FaTrash color="#222" />
//                 </span>
//               </div>
//             ),
//         };
//       }

//       if (col.key === 'catalog') {
//         return {
//           label: 'Catalog',
//           render: (item: StoreItem) => (
//             <button className="buttons" onClick={() => handleCatalogToggle(item.id, !!item.catalog)}>
//               {item.catalog ? 'Remove from Catalog' : 'Add to Catalog'}
//             </button>
//           ),
//         };
//       }

//       return col;
//     });

//   if (isLoading) return <p>Loading items...</p>;
//   if (error) return <p>Error fetching items.</p>;

//   return (
//     <div className="items-page">
//       <TableToolbar
//         filters={{
//           brand_name: [...new Set(storeItems.map((item) => item.brand_name))],
//           quantity_count: [...new Set(storeItems.map((item) => String(item.quantity_count)))],
//         }}
//         onFilterChange={handleFilterChange}
//         columns={allColumns}
//         visibleColumns={visibleColumns}
//         onColumnToggle={toggleColumn}
//         actions={[
//           { label: 'Export CSV', onClick: () => console.log('Exported!') },
//           { label: 'Bulk Delete', onClick: () => console.log('Bulk delete triggered') },
//         ]}
//       />
//       <ResponsiveTable data={filteredItems} columns={columns} />
//     </div>
//   );
// };

// export default Items;
