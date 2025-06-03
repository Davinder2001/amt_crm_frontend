'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useMemo } from 'react';
import {
  useFetchStoreQuery,
  useDeleteStoreItemMutation,
  useLazyExportStoreItemsQuery,
  useImportStoreItemsMutation,
} from '@/slices/store/storeApi';
// import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaPlus, FaDownload, FaUpload, FaUsers, FaBoxOpen } from 'react-icons/fa';

import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';

// Add this type above your component or import it if defined elsewhere
type StoreItem = {
  id: number;
  name?: string;
  [key: string]: string | number | boolean | null | undefined | { name?: string; label?: string };
};

const Items: React.FC = () => {
  // const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const { companySlug } = useCompany();
  const router = useRouter();

  const { data: items, error, isLoading, refetch } = useFetchStoreQuery();
  // Ensure storeItems is always StoreItem[]
  const storeItems: StoreItem[] = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items
      .filter((item: unknown): item is StoreItem =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof (item as { id?: unknown }).id === 'number'
      )
      .map((item) => item as unknown as StoreItem);
  }, [items]);

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
      return { ...prev, [field]: Array.from(current) };
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
    render: (item: StoreItem) => {
      const value = item[key];
      if (value === null || value === undefined) return '-';
      if (typeof value === 'object') {
        // Try to display a meaningful field
        if (value && typeof value === 'object' && 'name' in value) return (value as { name?: string }).name;
        if (value && typeof value === 'object' && 'label' in value) return (value as { label?: string }).label;
        return JSON.stringify(value); // fallback
      }
      return value.toString();
    }
  }));


  if (isLoading) return <LoadingState />;
  if (error) return (
    <EmptyState
      icon="alert"
      title="Failed to load items"
      message="We encountered an error while loading your store items. Please try again later."
    />
  );
  if (storeItems.length === 0) return (
    <EmptyState
      icon={<FaBoxOpen className="empty-state-icon" />}
      title="No items found"
      message="You haven't added any items yet. Start by creating your first store item."
      action={
        <button
          className="buttons"
          onClick={() => router.push(`/${companySlug}/store/add-item`)}
        >
          <FaPlus size={18} /> Add New Item
        </button>
      }
    />
  );

  return (
    <div className="items-page">
      <div className="items-page-outer">
        <TableToolbar
          onFilterChange={handleFilterChange}
          columns={columns.map((col) => ({ label: col.label, key: col.label }))}
          visibleColumns={visibleColumns}
          onColumnToggle={toggleColumn}
          downloadActions={[
            { label: 'Download Excel', icon: <FaDownload />, onClick: handleExportDownload },
            { label: 'Import Excel', icon: <FaUpload />, onClick: () => setImportModalVisible(true) },
          ]}
          actions={[
            { label: 'Vendors', icon: <FaUsers />, onClick: () => router.push(`/${companySlug}/store/vendors`) },
            {
              label: 'Add Purchase Bill',
              icon: <FaPlus />,
              onClick: () => router.push(`/${companySlug}/store/vendors/add-as-vendor`),
            },
            ...(storeItems.length > 0
              ? [{ label: 'Create item', icon: <FaPlus />, onClick: () => router.push(`/${companySlug}/store/add-item`) }]
              : []),
          ]}
        />

        <ResponsiveTable
          data={filteredItems}
          columns={columns}
          storageKey="store_table_page"
          onDelete={(id) => handleDelete(id)}
          onEdit={(id) => router.push(`/${companySlug}/store/edit-item/${id}`)}
          onView={(id) => router.push(`/${companySlug}/store/view-item/${id}`)}
        />

        {importModalVisible && (
          <div className="import-items-modal-backdrop">
            <div className="import-items-modal">
              <div className="import-items-modal-content">
                <h3 className="import-items-title">Import Items from Excel</h3>
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
          </div>
        )}

      </div>
    </div>
  );
};

export default Items;
