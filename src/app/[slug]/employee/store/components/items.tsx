'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useFetchStoreQuery, useDeleteStoreItemMutation, useImportStoreItemsMutation, useLazyExportStoreItemsQuery, useBulkDeleteStoreItemsMutation, useFetchSelectedCompanyQuery } from '@/slices';
import { FaEdit, FaTrash, FaPlus, FaUsers, FaDownload, FaUpload, FaBoxOpen, FaSearch } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { placeholderImg } from '@/assets/useImage';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { useSelectedItem } from '@/provider/SelectedItemContext';
import { STORE_ITEM_COUNT } from '@/utils/Company';

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
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCreateItemModal, setShowCreateItemModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { setItemId } = useSelectedItem();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(STORE_ITEM_COUNT);
  const { data, error, isLoading, refetch } = useFetchStoreQuery({
    page: currentPage,
    per_page: itemsPerPage,
  });
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  // Add these handler functions
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const storeItems: StoreItem[] = Array.isArray(items)
    ? items.map((item) => ({
      ...item,
      brand_name: item.brand?.name || '',
      categories: item.categories || [],
      purchase_date: item.purchase_date || '',
      date_of_manufacture: item.date_of_manufacture || '',
      date_of_expiry: item.date_of_expiry || '',
      catalog: item.catalog ? Boolean(item.catalog) : undefined,
    }))
    : [];

  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [bulkDeleteStoreItems] = useBulkDeleteStoreItemsMutation();
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

  const handleBulkDelete = async (item_id: number[]) => {
    try {
      const response = await bulkDeleteStoreItems(item_id).unwrap();
      toast.success(response.message);
      refetch();
    } catch (err) {
      console.error('Error bulk deleting items:', err);
      toast.error('Failed to delete selected items');
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
    { label: 'Name', key: 'name' },
    { label: 'Brand', key: 'brand_name' },
    { label: 'Category', key: 'category' },
    { label: 'Stock', key: 'availability_stock' },
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
      key: 'category',
      label: 'Category',
      type: 'multi-select' as const,
      options: [...new Set(storeItems.flatMap((item) => item.categories.map(cat => cat.name)))].filter(Boolean) as string[]
    },
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

          // Special handling for categories
          if (field === 'category') {
            const categoryNames = item.categories?.map(cat => cat.name) || [];
            return values.some(value => categoryNames.includes(value));
          }

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
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <Image
            src={placeholderImg}
            alt="no-image"
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        )
      ),
    },
    ...allColumns
      .filter((col) => visibleColumns.includes(col.key as string))
      .map((col) => {
        if (col.key === 'brand') {
          return {
            label: col.label,
            render: (item: StoreItem) => item.brand?.name || 'N/A',
            key: col.key,
          };
        }
        if (col.key === 'category') {
          return {
            label: col.label,
            render: (item: StoreItem) => item.categories?.map(cat => cat.name).join(', ') || 'N/A',
            key: col.key,
          };
        }
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
            <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
              <FaEdit color="var(--primary-color)" />
            </Link>
            <span onClick={() => handleDeleteClick(item.id, item.name)}>
              <FaTrash color="var(--primary-color)" />
            </span>
          </div>
        ),
    },
  ];

  if (isLoading) return <LoadingState />;
  if (error) return (
    <EmptyState
      icon={<FaTriangleExclamation className="empty-state-icon" />}
      title="Failed to load items"
      message="We encountered an error while loading your store items. Please try again later."
    />
  );

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
        showBulkActions={showBulkActions}
        onToggleBulkActions={setShowBulkActions}
        hasBulkActions={true}
        columns={allColumns}
        visibleColumns={visibleColumns}
        onResetColumns={onResetColumns}
        onColumnToggle={toggleColumn}
        introKey='store_intro'
        downloadActions={[
          { label: 'Download Excel', icon: <FaDownload />, onClick: handleExportDownload },
          { label: 'Import Excel', icon: <FaUpload />, onClick: () => setImportModalVisible(true) },
        ]}
        extraLinks={[
          {
            label: 'Add Purchase Bill',
            icon: <FaPlus />,
            onClick: () => router.push(`/${companySlug}/store/vendors/add-as-vendor`),
          },
          { label: 'Vendors', icon: <FaUsers />, onClick: () => router.push(`/${companySlug}/store/vendors`) },
        ]}
        actions={[
          ...(storeItems.length > 0
            ? [{ label: 'Add item', icon: <FaPlus />, onClick: () => setShowCreateItemModal(true) }]
            : []),
        ]}
      />
      {storeItems.length > 0 ?
        <ResponsiveTable
          data={filteredItems}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          counts={STORE_ITEM_COUNT}
          columns={columns}
          onDelete={(id) => handleDelete(id)}
          onBulkDelete={handleBulkDelete}
          onEdit={(id) => router.push(`/${companySlug}/store/edit-item/${id}`)}
          onView={(id) => router.push(`/${companySlug}/store/view-item/${id}`)}
          showBulkActions={showBulkActions}
          cardView={(item) => (
            <>
              <div className="card-row">
                <h5>{item.name}</h5>
                <Image
                  src={item.featured_image || placeholderImg}
                  alt={item.name}
                  width={30}
                  height={30}
                />
              </div>
              <div className="card-row">
                <p>Brand : {item.brand_name}</p>
                <p>Stock : {item.availability_stock}</p>
              </div>
              {item.description && (
                <div className="custom-description">
                  {item.description}
                </div>
              )}
            </>
          )}
        />
        :
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
      }

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
                className="import-items-cancel-button cancel-btn"
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

      <Modal
        isOpen={showCreateItemModal}
        onClose={() => setShowCreateItemModal(false)}
        title="Add New Item"
        width="600px"
      >
        <div className="create-item-modal">
          <div className="" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: '1rem', }}>
            <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #efefef', padding: '8px 12px', borderRadius: '5px', width: '100%', }}>
              <FaSearch className='search-bar-icon' />
              <input
                type="text"
                placeholder="Search existing items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', padding: 0, fontSize: '16px', borderRadius: 0, width: '100%' }}
              />
            </div>
          </div>

          <div className="existing-items-list" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
            {storeItems
              .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(item => (
                <Link key={item.id} className="existing-item" style={{
                  padding: '10px 0px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                  cursor: 'pointer',
                  color: '#384B70',
                  textDecoration: 'none'
                }}
                  href={`/${companySlug}/store/add-stock/${item.id}`}
                  onClick={() => {
                    setItemId(item.id);
                  }}
                >
                  <span
                    style={{
                      width: '100%',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                  >{item.name}</span>
                </Link>
              ))}
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>Total Items: <strong>{data?.items.length}</strong></p>
            <button
              onClick={() => router.push(`/${companySlug}/store/add-item`)}
              className='buttons'
            >
              <FaPlus /> Add New Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Items;