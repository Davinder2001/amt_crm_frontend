'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  useFetchStoreQuery,
  useDeleteStoreItemMutation,
  useLazyExportStoreItemsQuery,
  useImportStoreItemsMutation,
} from '@/slices/store/storeApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaPlus, FaDownload, FaUpload } from 'react-icons/fa';

import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';

const Items: React.FC = () => {
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;
  const router = useRouter();

  const { data: items, error, isLoading, refetch } = useFetchStoreQuery();
  const storeItems = Array.isArray(items) ? items : [];

  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [triggerExport] = useLazyExportStoreItemsQuery();
  const [importStoreItems] = useImportStoreItemsMutation();

  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [importModalVisible, setImportModalVisible] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (storeItems.length > 0) {
      const dynamicKeys = Object.keys(storeItems[0]).filter((key) => key !== 'id');
      setVisibleColumns(dynamicKeys);
    }
  }, [storeItems]);

  const handleDelete = async (id: number) => {
    try {
      await deleteStoreItem(id).unwrap();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

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

  const filterData = (data: typeof storeItems): typeof storeItems => {
    return data.filter((item) => {
      return Object.entries(filters).every(([field, values]) => {
        const itemValue = item[field];
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

  const columns = visibleColumns.map((key) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    render: (item: any) => item[key] ?? '-',
  }));

  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching items.</p>;

  return (
    <div className="items-page">
      <TableToolbar
        filters={{}}
        onFilterChange={handleFilterChange}
        columns={columns.map((col) => ({ label: col.label, key: col.label }))}
        visibleColumns={visibleColumns}
        onColumnToggle={toggleColumn}
        downloadActions={[
          { label: 'Download Excel', icon: <FaDownload />, onClick: handleExportDownload },
          { label: 'Import Excel', icon: <FaUpload />, onClick: () => setImportModalVisible(true) },
        ]}
        actions={[{ label: 'Create', icon: <FaPlus />, onClick: () => router.push(`/${companySlug}/store/add-item`) }]}
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
              <input type="file" accept=".xlsx, .xls" ref={fileInputRef} className="mb-4" />
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
