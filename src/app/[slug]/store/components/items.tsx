'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useFetchStoreQuery, useDeleteStoreItemMutation } from '@/slices/store/storeApi';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';

const Items: React.FC = () => {
  // Fetch selected company data to get the company slug.
  const { data: selectedCompany } = useFetchSelectedCompanyQuery();
  const companySlug: string | undefined = selectedCompany?.selected_company?.company_slug;

  // Fetch store items. We assume the API returns an array of StoreItem objects.
  const { data: items, error, isLoading } = useFetchStoreQuery();
  // Ensure items is an array.
  const storeItems: StoreItem[] = Array.isArray(items) ? items : [];
  console.log('Fetched store items:', storeItems);

  const [deleteStoreItem] = useDeleteStoreItemMutation();
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
  const handleAddToCatalog = (id: number): void => {
    setCatalogItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    console.log(`Toggled catalog status for item ${id}: ${!catalogItems[id]}`);
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
                  <button onClick={() => handleAddToCatalog(item.id)}>
                    {catalogItems[item.id] ? 'Remove from Catalog' : 'Add to Catalog'}
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
