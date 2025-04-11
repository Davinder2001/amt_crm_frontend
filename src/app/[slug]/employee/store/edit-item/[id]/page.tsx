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
      router.push(`/${companySlug}/employee/store/view-item/${id}`);
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  if (isLoading) return <p>Loading item details...</p>;
  if (error) return <p>Error loading item details.</p>;

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label>Item Name*</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Item Code" required />
        </div>

        <div className="form-group">
          <label>Quantity Count*</label>
          <input type="number" name="quantity_count" value={formData.quantity_count} onChange={handleChange} placeholder="Quantity Count" required />
        </div>

        <div className="form-group">
          <label>Measurement*</label>
          <input type="text" name="measurement" value={formData.measurement} onChange={handleChange} placeholder="Measurement" required />
        </div>

        <div className="form-group">
          <label>Purchase Date*</label>
          <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date Of Manufacture*</label>
          <input type="date" name="date_of_manufacture" value={formData.date_of_manufacture} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date Of Expiry*</label>
          <input type="date" name="date_of_expiry" value={formData.date_of_expiry} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Item Description" />
        </div>

        <div className="form-group">
          <label>Brand Name*</label>
          <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} placeholder="Brand Name" required />
        </div>

        <div className="form-group">
          <label>Replacement*</label>
          <input type="text" name="replacement" value={formData.replacement} onChange={handleChange} placeholder="Replacement Item Name" required />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Product Category" />
        </div>

        <div className="form-group">
          <label>Vendor Name</label>
          <input type="text" name="vendor_name" value={formData.vendor_name} onChange={handleChange} placeholder="Vendor Name" />
        </div>

        <div className="form-group">
          <label>Availability Stock</label>
          <input type="number" name="availability_stock" value={formData.availability_stock} onChange={handleChange} placeholder="Available Quantity" />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Item'}
          </button>
          <button type="button" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>


  );
};

export default Page;
