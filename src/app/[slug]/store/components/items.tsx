'use client';
import React, { useState, useRef } from 'react';
// import Link from 'next/link';
import {
  useFetchStoreQuery,
  useDeleteStoreItemMutation,
  useLazyExportStoreItemsQuery,
  useImportStoreItemsMutation,
} from '@/slices/store/storeApi';
import {
  // useAddToCatalogMutation,
  // useRemoveFromCatalogMutation,
} from '@/slices/catalog/catalogApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import {
  // FaEdit,
  // FaEye,
  // FaTrash,
  FaPlus,
  FaUserPlus,
  FaFileInvoice,
  FaUsers,
  FaDownload,
  FaUpload,
} from 'react-icons/fa';

import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';

const Items: React.FC = () => {
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;
  const router = useRouter();

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
  // const [addToCatalog] = useAddToCatalogMutation();
  // const [removeFromCatalog] = useRemoveFromCatalogMutation();
  const [triggerExport] = useLazyExportStoreItemsQuery();
  const [importStoreItems] = useImportStoreItemsMutation();

  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name',
    'date_of_manufacture',
    'date_of_expiry',
    'taxes',
    'selling_price',
    'availability_stock',
  ]);

  const [importModalVisible, setImportModalVisible] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteStoreItem(id).unwrap();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // const handleCatalogToggle = async (id: number, isInCatalog: boolean) => {
  //   try {
  //     if (isInCatalog) {
  //       await removeFromCatalog(id).unwrap();
  //     } else {
  //       await addToCatalog(id).unwrap();
  //     }
  //   } catch (error) {
  //     console.error('Error updating catalog status:', error);
  //   }
  // };

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

  const filteredItems = filterData(storeItems);

  const allColumns = [
    { label: 'Name', key: 'name' as keyof StoreItem },
    { label: 'Date of Manufacture', key: 'date_of_manufacture' as keyof StoreItem },
    { label: 'Date of Expiry', key: 'date_of_expiry' as keyof StoreItem },
    { label: 'Taxes', key: 'taxes' as keyof StoreItem },
    { label: 'Selling Price', key: 'selling_price' as keyof StoreItem },
    { label: 'Stock Avaible', key: 'availability_stock' as keyof StoreItem },
  ];

  const columns = allColumns
    .filter((col) => visibleColumns.includes(col.key))
    .map((col) => {
      if (col.key === 'taxes') {
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

  if (isLoading) return <Loader />;
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
        actions={[
          {
            label: 'Create New Item',
            icon: <FaPlus />,
            onClick: () => router.push(`/${companySlug}/store/add-item`),
          },
          {
            label: 'Create New Vendor',
            icon: <FaUserPlus />,
            onClick: () => router.push(`/${companySlug}/store/vendors/add-vendor`),
          },
          {
            label: 'Add Purchased Bill',
            icon: <FaFileInvoice />,
            onClick: () => router.push(`/${companySlug}/store/vendors/add-as-vendor`),
          },
          {
            label: 'View All Vendors',
            icon: <FaUsers />,
            onClick: () => router.push(`/${companySlug}/store/vendors`),
          },
          {
            label: 'Download Excel',
            icon: <FaDownload />,
            onClick: handleExportDownload,
          },
          {
            label: 'Import Excel',
            icon: <FaUpload />,
            onClick: () => setImportModalVisible(true),
          },
        ]}
      />

      <ResponsiveTable
        data={filteredItems}
        columns={columns}
        onDelete={(id) => handleDelete(id)}
        onEdit={(id) => router.push(`/${companySlug}/store/edit-item/${id}`)}
        onView={(id) => router.push(`/${companySlug}/store/view-item/${id}`)}
      />

      {importModalVisible && (
        <div className="modal-backdrop">
          <div className="popup-modal">
            <div className="popup-modal-content">
              <h3 className="text-lg font-semibold mb-4">Import Items from Excel</h3>
              <input
                type="file"
                accept=".xlsx, .xls"
                ref={fileInputRef}
                className="mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setImportModalVisible(false)}>
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleImportFile}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>

      )}
      <style jsx>{`
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .popup-modal {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }

      .popup-modal-content {
        display: flex;
        flex-direction: column;
      }

      .popup-modal input[type='file'] {
        border: 1px solid #ddd;
        padding: 0.5rem;
        border-radius: 4px;
      }

      .popup-modal button {
        transition: all 0.2s ease;
      }

      .popup-modal button:hover {
        opacity: 0.9;
      }
    `}</style>
    </div>
  );
};

export default Items;
