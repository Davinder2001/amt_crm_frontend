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
            <Link href={`/${companySlug}/employee/store/view-item/${item.id}`}>
              <span>
                <FaEye color="#222" />
              </span>
            </Link>
            <Link href={`/${companySlug}/employee/store/edit-item/${item.id}`}>
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
