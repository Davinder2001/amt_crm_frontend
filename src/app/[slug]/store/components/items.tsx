'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useFetchStoreQuery, useDeleteStoreItemMutation } from '@/slices/store/storeApi';
import { useAddToCatalogMutation, useRemoveFromCatalogMutation } from '@/slices/catalog/catalogApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { StoreItem } from '@/types/storeTypes';

const Items: React.FC = () => {
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;

  const { data: items, error, isLoading } = useFetchStoreQuery();
  const storeItems: StoreItem[] = Array.isArray(items) ? items : [];

  const [deleteStoreItem] = useDeleteStoreItemMutation();
  const [addToCatalog] = useAddToCatalogMutation();
  const [removeFromCatalog] = useRemoveFromCatalogMutation();

  const [catalogItems, setCatalogItems] = useState<{ [key: number]: boolean }>({});

  // Handle delete action.
  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteStoreItem(id).unwrap();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // Toggle catalog status for a given item.
  const handleCatalogToggle = async (id: number, isInCatalog: boolean): Promise<void> => {
    try {
      if (isInCatalog) {
        await removeFromCatalog(id).unwrap();
      } else {
        await addToCatalog(id).unwrap();
      }

      setCatalogItems((prev) => ({
        ...prev,
        [id]: !isInCatalog,
      }));
    } catch (err) {
      console.error('Error toggling catalog status:', err);
    }
  };

  if (isLoading) return <p>Loading items...</p>;
  if (error) return <p>Error fetching items.</p>;

  return (
    <>
      <h2>Items List</h2>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table border={1} cellPadding={8} cellSpacing={0}>
          <thead>
            <tr>
              <th>Item code</th>
              <th>Name</th>
              <th>Quantity Count</th>
              <th>Measurement</th>
              <th>Purchase Date</th>
              <th>Date of Manufacture</th>
              <th>Date of Expiry</th>
              <th>Brand Name</th>
              <th>Replacement</th>
              <th>Category</th>
              <th>Vendor Name</th>
              <th>Availability Stock</th>
              <th>Actions</th>
              <th>Catalog</th>
            </tr>
          </thead>
          <tbody>
            {storeItems.map((item: StoreItem) => (
              <tr key={item.id}>
                <td>{item.item_code}</td>
                <td>{item.name}</td>
                <td>{item.quantity_count}</td>
                <td>{item.measurement}</td>
                <td>{item.purchase_date}</td>
                <td>{item.date_of_manufacture}</td>
                <td>{item.date_of_expiry}</td>
                <td>{item.brand_name}</td>
                <td>{item.replacement}</td>
                <td>{item.category}</td>
                <td>{item.vendor_name}</td>
                <td>{item.availability_stock}</td>
                <td>
                  {companySlug && (
                    <>
                      <Link href={`/${companySlug}/store/view-item/${item.id}`}>
                        <button>View</button>
                      </Link>
                      <Link href={`/${companySlug}/store/edit-item/${item.id}`}>
                        <button>Edit</button>
                      </Link>
                    </>
                  )}
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => handleCatalogToggle(item.id, !!item.catalog)}>
                    {item.catalog ? 'Remove from Catalog' : 'Add to Catalog'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Items;
