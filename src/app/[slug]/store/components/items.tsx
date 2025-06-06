// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { useMemo } from 'react';
// import {
//   useFetchStoreQuery,
//   useDeleteStoreItemMutation,
//   useLazyExportStoreItemsQuery,
//   useImportStoreItemsMutation,
// } from '@/slices/store/storeApi';
// // import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
// import { FaPlus, FaDownload, FaUpload, FaUsers, FaBoxOpen } from 'react-icons/fa';

// import ResponsiveTable from '@/components/common/ResponsiveTable';
// import TableToolbar from '@/components/common/TableToolbar';
// import { useRouter } from 'next/navigation';
// import { useCompany } from '@/utils/Company';
// import LoadingState from '@/components/common/LoadingState';
// import EmptyState from '@/components/common/EmptyState';
// import Modal from '@/components/common/Modal';

// // Add this type above your component or import it if defined elsewhere
// type StoreItem = {
//   id: number;
//   name?: string;
//   [key: string]: string | number | boolean | null | undefined | { name?: string; label?: string };
// };

// const Items: React.FC = () => {
//   // const { data: selectedCompany } = useFetchSelectedCompanyQuery();
//   const { companySlug } = useCompany();
//   const router = useRouter();

//   const { data: items, error, isLoading, refetch } = useFetchStoreQuery();
//   // Ensure storeItems is always StoreItem[]
//   const storeItems: StoreItem[] = useMemo(() => {
//     if (!Array.isArray(items)) return [];
//     return items
//       .filter((item: unknown): item is StoreItem =>
//         typeof item === 'object' &&
//         item !== null &&
//         'id' in item &&
//         typeof (item as { id?: unknown }).id === 'number'
//       )
//       .map((item) => item as unknown as StoreItem);
//   }, [items]);

//   const [deleteStoreItem] = useDeleteStoreItemMutation();
//   const [triggerExport] = useLazyExportStoreItemsQuery();
//   const [importStoreItems] = useImportStoreItemsMutation();

//   const [filters, setFilters] = useState<Record<string, string[]>>({});
//   const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
//   const [importModalVisible, setImportModalVisible] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (storeItems.length > 0) {
//       const dynamicKeys = Object.keys(storeItems[0]).filter((key) => key !== 'id');
//       setVisibleColumns(dynamicKeys);
//     }
//   }, [storeItems]);

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteStoreItem(id).unwrap();
//     } catch (err) {
//       console.error('Error deleting item:', err);
//     }
//   };

//   const handleFilterChange = (field: string, value: string, checked: boolean) => {
//     setFilters((prev) => {
//       const current = new Set(prev[field] || []);
//       if (checked) current.add(value);
//       else current.delete(value);
//       return { ...prev, [field]: Array.from(current) };
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
//         const itemValue = item[field];
//         if (Array.isArray(values) && values.length > 0) {
//           return values.includes(String(itemValue));
//         }
//         return true;
//       });
//     });
//   };

//   const handleExportDownload = async () => {
//     try {
//       const blob = await triggerExport().unwrap();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'items_export.xlsx';
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Export failed:', error);
//     }
//   };

//   const handleImportFile = async () => {
//     const file = fileInputRef.current?.files?.[0];
//     if (!file) return alert('Please select a file.');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const result = await importStoreItems(formData).unwrap();
//       if (result.success) {
//         alert('Import successful!');
//         setImportModalVisible(false);
//         refetch();
//       } else {
//         alert(result.message || 'Import failed.');
//       }
//     } catch (err) {
//       console.error('Import failed:', err);
//       alert('Import failed.');
//     }
//   };

//   const filteredItems = filterData(storeItems);

//   const columns = visibleColumns.map((key) => ({
//     label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
//     render: (item: StoreItem) => {
//       const value = item[key];
//       if (value === null || value === undefined) return '-';
//       if (typeof value === 'object') {
//         // Try to display a meaningful field
//         if (value && typeof value === 'object' && 'name' in value) return (value as { name?: string }).name;
//         if (value && typeof value === 'object' && 'label' in value) return (value as { label?: string }).label;
//         return JSON.stringify(value); // fallback
//       }
//       return value.toString();
//     }
//   }));


//   if (isLoading) return <LoadingState />;
//   if (error) return (
//     <EmptyState
//       icon="alert"
//       title="Failed to load items"
//       message="We encountered an error while loading your store items. Please try again later."
//     />
//   );
//   if (storeItems.length === 0) return (
//     <EmptyState
//       icon={<FaBoxOpen className="empty-state-icon" />}
//       title="No items found"
//       message="You haven't added any items yet. Start by creating your first store item."
//       action={
//         <button
//           className="buttons"
//           onClick={() => router.push(`/${companySlug}/store/add-item`)}
//         >
//           <FaPlus size={18} /> Add New Item
//         </button>
//       }
//     />
//   );

//   return (
//     <div className="items-page">
//       <div className="items-page-outer">
//         <TableToolbar
//           onFilterChange={handleFilterChange}
//           columns={columns.map((col) => ({ label: col.label, key: col.label }))}
//           visibleColumns={visibleColumns}
//           onColumnToggle={toggleColumn}
//           downloadActions={[
//             { label: 'Download Excel', icon: <FaDownload />, onClick: handleExportDownload },
//             { label: 'Import Excel', icon: <FaUpload />, onClick: () => setImportModalVisible(true) },
//           ]}
//           actions={[
//             ...(storeItems.length > 0
//               ? [{ label: 'Create item', icon: <FaPlus />, onClick: () => router.push(`/${companySlug}/store/add-item`) }]
//               : []),
//           ]}
//           extraLinks={[
//             {
//               label: 'Add Purchase Bill',
//               icon: <FaPlus />,
//               onClick: () => router.push(`/${companySlug}/store/vendors/add-as-vendor`),
//             },
//             { label: 'Vendors', icon: <FaUsers />, onClick: () => router.push(`/${companySlug}/store/vendors`) },
//           ]}
//         />

//         <ResponsiveTable
//           data={filteredItems}
//           columns={columns}
//           storageKey="store_table_page"
//           onDelete={(id) => handleDelete(id)}
//           onEdit={(id) => router.push(`/${companySlug}/store/edit-item/${id}`)}
//           onView={(id) => router.push(`/${companySlug}/store/view-item/${id}`)}
//         />

//         <Modal
//           isOpen={importModalVisible}
//           onClose={() => setImportModalVisible(false)}
//           title="Import Items Excel"
//           width="400px"
//         >
//           <div className="import-items-modal">
//             <div className="import-items-modal-content">
//               <input
//                 type="file"
//                 accept=".xlsx, .xls"
//                 ref={fileInputRef}
//                 className="import-items-file-input"
//               />
//               <div className="import-items-actions">
//                 <button
//                   className="import-items-cancel-button"
//                   onClick={() => setImportModalVisible(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="import-items-upload-button"
//                   onClick={handleImportFile}
//                 >
//                   Upload
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>

//       </div>
//     </div>
//   );
// };

// export default Items;


















'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  useFetchStoreQuery,
  useDeleteStoreItemMutation,
  useImportStoreItemsMutation,
  useLazyExportStoreItemsQuery,
} from '@/slices/store/storeApi';
import {
  useAddToCatalogMutation,
  useRemoveFromCatalogMutation,
} from '@/slices/catalog/catalogApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaEdit, FaEye, FaTrash, FaPlus, FaUsers, FaDownload, FaUpload } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';

const Items: React.FC = () => {
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;
  const router = useRouter();
  const [importModalVisible, setImportModalVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStoreItems] = useImportStoreItemsMutation();

  const { data: items, error, isLoading, refetch } = useFetchStoreQuery();
  const storeItems: StoreItem[] = Array.isArray(items)
    ? items.map((item) => ({
      ...item,
      purchase_date: item.purchase_date || '',
      date_of_manufacture: item.date_of_manufacture || '',
      date_of_expiry: item.date_of_expiry || '',
      catalog: item.catalog ? Boolean(item.catalog) : undefined,
    }))
    : [];

  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [addToCatalog] = useAddToCatalogMutation();
  const [triggerExport] = useLazyExportStoreItemsQuery();
  const [removeFromCatalog] = useRemoveFromCatalogMutation();

  const [filters, setFilters] = useState<Record<string, string[]>>({});

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


  const handleImportFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await importStoreItems(formData).unwrap();
      if (result.success) {
        alert('Import successful!');
        setImportModalVisible(false);
        refetch();
      } else {
        alert(result.message || 'Import failed.');
      }
    } catch (err) {
      console.error('Import failed:', err);
      alert('Import failed.');
    }
  };


  const handleExportDownload = async () => {
    try {
      const blob = await triggerExport().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'items_export.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };


  const allColumns = [
    { label: 'Brand Name', key: 'brand_name' as keyof StoreItem },
    { label: 'HSN Code', key: 'item_code' as keyof StoreItem },
    { label: 'Name', key: 'name' as keyof StoreItem },
    // { label: 'Purchase Date', key: 'purchase_date' as keyof StoreItem },
    { label: 'Date of Manufacture', key: 'date_of_manufacture' as keyof StoreItem },
    { label: 'Date of Expiry', key: 'date_of_expiry' as keyof StoreItem },
    { label: 'Taxes', key: 'taxes' as keyof StoreItem }, // ✅ taxes here instead of replacement
    { label: 'Selling Price', key: 'selling_price' as keyof StoreItem },
    // { label: 'Quantity', key: 'quantity_count' as keyof StoreItem },
    { label: 'Stock Avaible', key: 'availability_stock' as keyof StoreItem },
    // { label: 'Actions', key: 'actions' as keyof StoreItem },
    // { label: 'Catalog', key: 'catalog' as keyof StoreItem },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map((col) => col.key as string)
  );

  const handleFilterChange = (field: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const current = new Set(prev[field] || []);
      if (checked) current.add(value);
      else current.delete(value);
      return { ...prev, [field]: [...current] };
    });
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const filterData = (data: StoreItem[]): StoreItem[] => {
    return data.filter((item) => {
      return Object.entries(filters).every(([field, values]) => {
        const itemValue = item[field as keyof StoreItem];
        if (Array.isArray(values) && values.length > 0) {
          return values.includes(String(itemValue));
        }
        return true;
      });
    });
  };

  const filteredItems = filterData(storeItems);

  const columns = allColumns
    .filter((col) => visibleColumns.includes(col.key))
    .map((col) => {
      if (col.key === 'actions' as string) {
        return {
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
            ),
        };
      }

      if (col.key === 'catalog') {
        return {
          label: 'Catalog',
          render: (item: StoreItem) => (
            <button className="buttons" onClick={() => handleCatalogToggle(item.id, !!item.catalog)}>
              {item.catalog ? 'Remove from Catalog' : 'Add to Catalog'}
            </button>
          ),
        };
      }

      if (col.key === 'taxes' as string) {
        return {
          label: 'Taxes',
          render: (item: StoreItem) => {
            if (Array.isArray(item.taxes) && item.taxes.length > 0) {
              return item.taxes.map((tax) => `${tax.name} (${tax.rate}%)`).join(', ');
            }
            return '-';
          },
        };
      }

      return col;
    });

  if (isLoading) return <p>Loading items...</p>;
  if (error) return <p>Error fetching items.</p>;

  return (
    <div className="items-page">
      <TableToolbar
        filters={{
          brand_name: [...new Set(storeItems.map((item) => item.brand_name))],
          quantity_count: [...new Set(storeItems.map((item) => String(item.quantity_count)))],
        }}
        onFilterChange={handleFilterChange}
        columns={allColumns}
        visibleColumns={visibleColumns}
        onColumnToggle={toggleColumn}
        downloadActions={[
          { label: 'Download Excel', icon: <FaDownload />, onClick: handleExportDownload },
          { label: 'Import Excel', icon: <FaUpload />, onClick: () => setImportModalVisible(true) },
        ]}
        actions={[
          ...(storeItems.length > 0
            ? [{ label: 'Create item', icon: <FaPlus />, onClick: () => router.push(`/${companySlug}/store/add-item`) }]
            : []),
        ]}
        extraLinks={[
          {
            label: 'Add Purchase Bill',
            icon: <FaPlus />,
            onClick: () => router.push(`/${companySlug}/store/vendors/add-as-vendor`),
          },
          { label: 'Vendors', icon: <FaUsers />, onClick: () => router.push(`/${companySlug}/store/vendors`) },
        ]}
      />
      <ResponsiveTable
        data={filteredItems}
        columns={columns}
        onDelete={(id) => handleDelete(id)}
        onEdit={(id) => router.push(`/${companySlug}/store/edit-item/${id}`)}
        onView={(id) => router.push(`/${companySlug}/store/view-item/${id}`)}
      />

      <Modal
        isOpen={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        title="Import Items Excel"
        width="400px"
      >
        <div className="import-items-modal">
          <div className="import-items-modal-content">
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              className="import-items-file-input"
            />
            <div className="import-items-actions">
              <button
                className="import-items-cancel-button"
                onClick={() => setImportModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="import-items-upload-button"
                onClick={handleImportFile}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Items;