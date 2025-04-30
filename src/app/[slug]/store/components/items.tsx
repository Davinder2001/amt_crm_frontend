'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  useFetchStoreQuery,
  useDeleteStoreItemMutation,
} from '@/slices/store/storeApi';
import {
  useAddToCatalogMutation,
  useRemoveFromCatalogMutation,
} from '@/slices/catalog/catalogApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';

const Items: React.FC = () => {
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;
  const router = useRouter();

  const { data: items, error, isLoading } = useFetchStoreQuery();
  interface StoreItem {
    id: number;
    item_code: string;
    name: string;
    purchase_date: string;
    date_of_manufacture: string;
    date_of_expiry: string;
    brand_name: string;
    quantity_count: number;
    catalog?: boolean;
    taxes?: { name: string; rate: number }[]; // Added taxes property
  }
  
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
  const [removeFromCatalog] = useRemoveFromCatalogMutation();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'item_code',
    'name',
    'purchase_date',
    'date_of_manufacture',
    'date_of_expiry',
    'brand_name',
    'taxes',
    'quantity_count',
    'actions',
    'catalog',
  ]);

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

  const allColumns = [
    { label: 'Item Code', key: 'item_code' as keyof StoreItem },
    { label: 'Name', key: 'name' as keyof StoreItem },
    { label: 'Purchase Date', key: 'purchase_date' as keyof StoreItem },
    { label: 'Date of Manufacture', key: 'date_of_manufacture' as keyof StoreItem },
    { label: 'Date of Expiry', key: 'date_of_expiry' as keyof StoreItem },
    { label: 'Brand Name', key: 'brand_name' as keyof StoreItem },
    { label: 'Taxes', key: 'taxes' as keyof StoreItem }, // ✅ taxes here instead of replacement
    { label: 'Quantity', key: 'quantity_count' as keyof StoreItem },
    { label: 'Actions', key: 'actions' as keyof StoreItem },
    // { label: 'Catalog', key: 'catalog' as keyof StoreItem },
  ];

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
              return item.taxes.map((tax: any) => `${tax.name} (${tax.rate}%)`).join(', ');
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
        actions={[
          { label: 'Add Item', onClick: () => router.push(`/${companySlug}/store/add-item`) },
          { label: 'Add a Vendor', onClick: () => router.push(`/${companySlug}/store/vendors/add-vendor`) },
          { label: 'Add As a Vendor', onClick: () => router.push(`/${companySlug}/store/vendors/add-as-vendor`) },
          { label: 'View All Vendor', onClick: () => router.push(`/${companySlug}/store/vendors`) },
        ]}
      />
      <ResponsiveTable
        data={filteredItems}
        columns={columns}
        onDelete={(id) => handleDelete(id)}
        onEdit={(id) => router.push(`/${companySlug}/store/edit-item/${id}`)}
        onView={(id) => router.push(`/${companySlug}/store/view-item/${id}`)}
      />
    </div>
  );
};

export default Items;
