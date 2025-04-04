'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices/store/storeApi';


interface FormData {
  name: string;
  quantity_count: string;
  measurement: string;
  purchase_date: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  description: string;
  brand_name: string;
  replacement: string;
  category: string;
  vendor_name: string;
  availability_stock: string;
}

const Page = () => {
  const { id, companySlug } = useParams() as { id: string; companySlug: string };
  const router = useRouter();

  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    quantity_count: '',
    measurement: '',
    purchase_date: '',
    date_of_manufacture: '',
    date_of_expiry: '',
    description: '',
    brand_name: '',
    replacement: '',
    category: '',
    vendor_name: '',
    availability_stock: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        quantity_count: item.quantity_count !== undefined ? item.quantity_count.toString() : '',
        measurement: item.measurement || '',
        purchase_date: item.purchase_date || '',
        date_of_manufacture: item.date_of_manufacture || '',
        date_of_expiry: item.date_of_expiry || '',
        description: item.description || '',
        brand_name: item.brand_name || '',
        replacement: item.replacement || '',
        category: item.category || '',
        vendor_name: item.vendor_name || '',
        availability_stock: item.availability_stock !== undefined ? item.availability_stock.toString() : '',
      });
    }
  }, [item]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Destructure numeric fields to convert them from strings to numbers.
    const { quantity_count, availability_stock, ...rest } = formData;
    const payload: UpdateStoreItemRequest = {
      id: Number(id),
      ...rest,
      quantity_count: parseInt(quantity_count, 10),
      availability_stock: parseInt(availability_stock, 10),
    };

    try {
      await updateStoreItem(payload).unwrap();
      router.push(`/${companySlug}/store/view-item/${id}`);
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  if (isLoading) return <p>Loading item details...</p>;
  if (error) return <p>Error loading item details.</p>;

  return (
    <div>
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: '1 1 300px' }}>
          <label>Name*</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Quantity Count*</label>
          <input type="number" name="quantity_count" value={formData.quantity_count} onChange={handleChange} required />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Measurement</label>
          <input type="text" name="measurement" value={formData.measurement} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Purchase Date</label>
          <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Date Of Manufacture*</label>
          <input type="date" name="date_of_manufacture" value={formData.date_of_manufacture} onChange={handleChange} required />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Date Of Expiry</label>
          <input type="date" name="date_of_expiry" value={formData.date_of_expiry} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Brand Name*</label>
          <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} required />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Replacement</label>
          <input type="text" name="replacement" value={formData.replacement} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Vendor Name</label>
          <input type="text" name="vendor_name" value={formData.vendor_name} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Availability Stock</label>
          <input type="number" name="availability_stock" value={formData.availability_stock} onChange={handleChange} />
        </div>
        <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Item'}
          </button>
          <button type="button" style={{ marginLeft: '1rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
