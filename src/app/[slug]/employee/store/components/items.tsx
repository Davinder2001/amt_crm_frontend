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
import { FaEdit, FaEye, FaTrash, FaPlus, FaUserPlus, FaFileInvoice, FaUsers } from 'react-icons/fa';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import TableToolbar from '@/components/common/TableToolbar';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';

const Items: React.FC = () => {
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;
  const router = useRouter();

  const { data: items, error, isLoading } = useFetchStoreQuery();
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
    // { label: 'Brand Name', key: 'brand_name' as keyof StoreItem },
    // { label: 'HSN Code', key: 'item_code' as keyof StoreItem },
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
            onClick: () => router.push(`/${companySlug}/store/add-item`)
          },
          {
            label: 'Create New Vendor',
            icon: <FaUserPlus />,
            onClick: () => router.push(`/${companySlug}/store/vendors/add-vendor`)
          },
          {
            label: 'Add Purchased Bill',
            icon: <FaFileInvoice />,
            onClick: () => router.push(`/${companySlug}/store/vendors/add-as-vendor`)
          },
          {
            label: 'View All Vendors',
            icon: <FaUsers />,
            onClick: () => router.push(`/${companySlug}/store/vendors`)
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
    </div>
  );
};

export default Items;
