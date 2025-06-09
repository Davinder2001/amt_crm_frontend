
// 'use client';
// import React, { useRef, useState } from 'react';
// import Link from 'next/link';
// import {
//   useFetchStoreQuery,
//   useDeleteStoreItemMutation,
//   useImportStoreItemsMutation,
//   useLazyExportStoreItemsQuery,
// } from '@/slices/store/storeApi';
// import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
// import { FaEdit, FaEye, FaTrash, FaPlus, FaUsers, FaDownload, FaUpload } from 'react-icons/fa';
// import ResponsiveTable from '@/components/common/ResponsiveTable';
// import TableToolbar from '@/components/common/TableToolbar';
// import { useRouter } from 'next/navigation';
// import Modal from '@/components/common/Modal';
// import ConfirmDialog from '@/components/common/ConfirmDialog';
// import { toast } from 'react-toastify';
// import Image from 'next/image';
// import { placeholderImg } from '@/assets/useImage';

// const COLUMN_STORAGE_KEY = 'visible_columns_store';

// const Items: React.FC = () => {
//   const { data: selectedCompany } = useFetchSelectedCompanyQuery();
//   const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;
//   const router = useRouter();
//   const [importModalVisible, setImportModalVisible] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [importStoreItems] = useImportStoreItemsMutation();
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
//   const [itemToDeleteName, setItemToDeleteName] = useState<string>('');

//   const { data: items, error, isLoading, refetch } = useFetchStoreQuery();
//   const storeItems: StoreItem[] = Array.isArray(items)
//     ? items.map((item) => ({
//       ...item,
//       purchase_date: item.purchase_date || '',
//       date_of_manufacture: item.date_of_manufacture || '',
//       date_of_expiry: item.date_of_expiry || '',
//       catalog: item.catalog ? Boolean(item.catalog) : undefined,
//     }))
//     : [];

//   const [deleteStoreItem] = useDeleteStoreItemMutation();
//   const [triggerExport] = useLazyExportStoreItemsQuery();

//   const [filters, setFilters] = useState<Record<string, string[]>>({});

//   // Modify your handleDelete function
//   const handleDelete = async (id: number) => {
//     try {
//       const response = await deleteStoreItem(id).unwrap();
//       toast.success(response.message);
//       refetch(); // Refresh the data after deletion
//     } catch (err) {
//       console.error('Error deleting item:', err);
//     } finally {
//       setShowDeleteConfirm(false);
//       setItemToDelete(null);
//       setItemToDeleteName('');
//     }
//   };

//   // Add this function to handle delete click
//   const handleDeleteClick = (id: number, name: string = '') => {
//     setItemToDelete(id);
//     setItemToDeleteName(name);
//     setShowDeleteConfirm(true);
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


//   const allColumns = [
//     { label: 'Brand Name', key: 'brand_name' as keyof StoreItem },
//     { label: 'Name', key: 'name' as keyof StoreItem },
//     { label: 'Date of Manufacture', key: 'date_of_manufacture' as keyof StoreItem },
//     { label: 'Date of Expiry', key: 'date_of_expiry' as keyof StoreItem },
//     { label: 'Selling Price', key: 'selling_price' as keyof StoreItem },
//     { label: 'Stock Avaible', key: 'availability_stock' as keyof StoreItem },
//   ];

//   const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
//     const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
//     return saved ? JSON.parse(saved) : allColumns.map((col) => col.key as string);
//   });

//   const onResetColumns = () => {
//     const defaultColumns = allColumns.map((col) => col.key as string);
//     setVisibleColumns(defaultColumns);
//     localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(defaultColumns));
//   };

//   const handleFilterChange = (field: string, value: string, checked: boolean) => {
//     setFilters((prev) => {
//       const current = new Set(prev[field] || []);
//       if (checked) current.add(value);
//       else current.delete(value);
//       return { ...prev, [field]: [...current] };
//     });
//   };

//   const toggleColumn = (key: string) => {
//     setVisibleColumns((prev) => {
//       const updated = prev.includes(key)
//         ? prev.filter((col) => col !== key)
//         : [...prev, key];

//       localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const filterData = (data: StoreItem[]): StoreItem[] => {
//     return data.filter((item) => {
//       return Object.entries(filters).every(([field, values]) => {
//         const itemValue = item[field as keyof StoreItem];
//         if (Array.isArray(values) && values.length > 0) {
//           return values.includes(String(itemValue));
//         }
//         return true;
//       });
//     });
//   };

//   const filteredItems = filterData(storeItems);

//   const columns = [
//     // Visible & filtered columns
//     {
//       label: 'Image',
//       key: 'featured_image_url' as keyof StoreItem,
//       render: (item: StoreItem) => (
//         item.featured_image ? (
//           <Image
//             src={item.featured_image}
//             alt={item.name}
//             width={60}
//             height={60}
//             objectFit='cover'
//           />
//         ) : (
//           <Image
//             src={placeholderImg}
//             alt="no-image"
//             width={60}
//             height={60}
//             objectFit='cover'
//           />
//         )
//       ),
//     },
//     ...allColumns
//       .filter((col) => visibleColumns.includes(col.key as string))
//       .map((col) => {
//         if (col.key === 'taxes') {
//           return {
//             label: 'Taxes',
//             key: col.key,
//             render: (item: StoreItem) => {
//               if (Array.isArray(item.taxes) && item.taxes.length > 0) {
//                 return item.taxes.map((tax) => `${tax.name} (${tax.rate}%)`).join(', ');
//               }
//               return '-';
//             },
//           };
//         }

//         return {
//           label: col.label,
//           key: col.key,
//         };
//       }),

//     // ✅ Always include Actions column
//     {
//       label: 'Actions',
//       render: (item: StoreItem) =>
//         companySlug && (
//           <div className="table-actions-wrapper">
//             <Link href={`/${companySlug}/store/view-item/${item.id}`}>
//               <span>
//                 <FaEye color="#222" />
//               </span>
//             </Link>
//             <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
//               <FaEdit color="#222" />
//             </Link>
//             <span onClick={() => handleDeleteClick(item.id, item.name)}>
//               <FaTrash color="#222" />
//             </span>
//           </div>
//         ),
//     },
//   ];

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
//         onResetColumns={onResetColumns}
//         onColumnToggle={toggleColumn}
//         downloadActions={[
//           { label: 'Download Excel', icon: <FaDownload />, onClick: handleExportDownload },
//           { label: 'Import Excel', icon: <FaUpload />, onClick: () => setImportModalVisible(true) },
//         ]}
//         actions={[
//           ...(storeItems.length > 0
//             ? [{ label: 'Create item', icon: <FaPlus />, onClick: () => router.push(`/${companySlug}/store/add-item`) }]
//             : []),
//         ]}
//         extraLinks={[
//           {
//             label: 'Add Purchase Bill',
//             icon: <FaPlus />,
//             onClick: () => router.push(`/${companySlug}/store/vendors/add-as-vendor`),
//           },
//           { label: 'Vendors', icon: <FaUsers />, onClick: () => router.push(`/${companySlug}/store/vendors`) },
//         ]}
//       />
//       <ResponsiveTable
//         data={filteredItems}
//         columns={columns}
//         onDelete={(id) => handleDelete(id)}
//         onEdit={(id) => router.push(`/${companySlug}/store/edit-item/${id}`)}
//         onView={(id) => router.push(`/${companySlug}/store/view-item/${id}`)}
//         storageKey="store_table_page"
//       />

//       <Modal
//         isOpen={importModalVisible}
//         onClose={() => setImportModalVisible(false)}
//         title="Import Items Excel"
//         width="400px"
//       >
//         <div className="import-items-modal">
//           <div className="import-items-modal-content">
//             <input
//               type="file"
//               accept=".xlsx, .xls"
//               ref={fileInputRef}
//               className="import-items-file-input"
//             />
//             <div className="import-items-actions">
//               <button
//                 className="import-items-cancel-button"
//                 onClick={() => setImportModalVisible(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="import-items-upload-button"
//                 onClick={handleImportFile}
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       </Modal>
//       <ConfirmDialog
//         isOpen={showDeleteConfirm}
//         message={`Are you sure you want to delete ${itemToDeleteName ? `"${itemToDeleteName}"` : 'this item'}?`}
//         onConfirm={() => {
//           if (itemToDelete !== null) {
//             return handleDelete(itemToDelete);
//           }
//         }}
//         onCancel={() => {
//           setShowDeleteConfirm(false);
//           setItemToDelete(null);
//           setItemToDeleteName('');
//         }}
//         type="delete"
//       />
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
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaEdit, FaEye, FaTrash, FaPlus, FaUsers, FaDownload, FaUpload } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { placeholderImg } from '@/assets/useImage';

// interface StoreItem {
//   id: number;
//   name: string;
//   brand_name: string;
//   date_of_manufacture: string;
//   date_of_expiry: string;
//   selling_price: number;
//   availability_stock: number;
//   featured_image?: string;
//   featured_image_url?: string;
//   quantity_count?: number;
//   taxes?: Array<{ name: string; rate: number }>;
//   catalog?: boolean;
//   purchase_date?: string;
// }

const COLUMN_STORAGE_KEY = 'visible_columns_store';

const Items: React.FC = () => {
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;
  const router = useRouter();
  const [importModalVisible, setImportModalVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStoreItems] = useImportStoreItemsMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [itemToDeleteName, setItemToDeleteName] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});

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
  const [triggerExport] = useLazyExportStoreItemsQuery();

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteStoreItem(id).unwrap();
      toast.success(response.message);
      refetch();
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setItemToDeleteName('');
    }
  };

  const handleDeleteClick = (id: number, name: string = '') => {
    setItemToDelete(id);
    setItemToDeleteName(name);
    setShowDeleteConfirm(true);
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

  const allColumns: { label: string; key: keyof StoreItem }[] = [
    { label: 'Brand Name', key: 'brand_name' },
    { label: 'Name', key: 'name' },
    { label: 'Date of Manufacture', key: 'date_of_manufacture' },
    { label: 'Date of Expiry', key: 'date_of_expiry' },
    { label: 'Selling Price', key: 'selling_price' },
    { label: 'Stock Available', key: 'availability_stock' },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
    return saved ? JSON.parse(saved) : allColumns.map((col) => col.key);
  });

  const onResetColumns = () => {
    const defaultColumns = allColumns.map((col) => col.key);
    setVisibleColumns(defaultColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(defaultColumns));
  };

  const tableFilters = [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const
    },
    {
      key: 'brand_name',
      label: 'Brand',
      type: 'multi-select' as const,
      options: [...new Set(storeItems.map((item) => item.brand_name))].filter(Boolean) as string[]
    },
    {
      key: 'selling_price',
      label: 'Selling Price',
      type: 'multi-select' as const,
      options: [...new Set(storeItems.map((item) => String(item.selling_price)))].filter(Boolean) as string[]
    }
  ];

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key];

      localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Update the filterData function in the Items component
  const filterData = (data: StoreItem[]): StoreItem[] => {
    return data.filter((item) => {
      // Handle search separately - search across all visible columns
      if (filters.search && filters.search.length > 0) {
        const searchTerm = filters.search[0].toLowerCase();
        const visibleColumnKeys = allColumns
          .filter(col => visibleColumns.includes(col.key))
          .map(col => col.key);

        // Check if any of the visible columns contain the search term
        const matchesSearch = visibleColumnKeys.some(key => {
          const value = String(item[key as keyof StoreItem] || '').toLowerCase();
          return value.includes(searchTerm);
        });

        if (!matchesSearch) return false;
      }

      // Handle other filters normally
      return Object.entries(filters)
        .filter(([field]) => field !== 'search') // exclude search from regular filtering
        .every(([field, values]) => {
          if (!values || values.length === 0) return true;

          const itemValue = item[field as keyof StoreItem];
          if (itemValue === undefined) return false;

          return values.includes(String(itemValue));
        });
    });
  };

  const filteredItems = filterData(storeItems);

  type Column<T> = {
    label: string;
    key?: keyof T;
    render?: (item: T) => React.ReactNode;
  };

  const columns: Column<StoreItem>[] = [
    {
      label: 'Image',
      key: 'featured_image_url' as keyof StoreItem,
      render: (item: StoreItem) => (
        item.featured_image ? (
          <Image
            src={item.featured_image}
            alt={item.name}
            width={60}
            height={60}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Image
            src={placeholderImg}
            alt="no-image"
            width={60}
            height={60}
            style={{ objectFit: 'cover' }}
          />
        )
      ),
    },
    ...allColumns
      .filter((col) => visibleColumns.includes(col.key as string))
      .map((col) => {
        return {
          label: col.label,
          key: col.key,
        };
      }),
    {
      label: 'Actions',
      key: undefined,
      render: (item: StoreItem) =>
        companySlug && (
          <div className="table-actions-wrapper">
            <Link href={`/${companySlug}/store/view-item/${item.id}`}>
              <span>
                <FaEye color="#222" />
              </span>
            </Link>
            <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
              <FaEdit color="#222" />
            </Link>
            <span onClick={() => handleDeleteClick(item.id, item.name)}>
              <FaTrash color="#222" />
            </span>
          </div>
        ),
    },
  ];

  if (isLoading) return <p>Loading items...</p>;
  if (error) return <p>Error fetching items.</p>;

  return (
    <div className="items-page">
      <TableToolbar
        filters={tableFilters}
        onFilterChange={(field, value, type) => {
          if (type === 'search') {
            setFilters(prev => ({
              ...prev,
              [field]: value && typeof value === 'string' ? [value] : []
            }));
          } else {
            setFilters(prev => ({
              ...prev,
              [field]: Array.isArray(value) ? value : [value]
            }));
          }
        }}
        columns={allColumns}
        visibleColumns={visibleColumns}
        onResetColumns={onResetColumns}
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
        storageKey="store_table_page"
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
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message={`Are you sure you want to delete ${itemToDeleteName ? `"${itemToDeleteName}"` : 'this item'}?`}
        onConfirm={() => {
          if (itemToDelete !== null) {
            return handleDelete(itemToDelete);
          }
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
          setItemToDeleteName('');
        }}
        type="delete"
      />
    </div>
  );
};

export default Items;