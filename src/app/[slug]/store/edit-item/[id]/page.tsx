'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices/store/storeApi';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import ItemsTab from '../ItemsTab';
import { useCompany } from '@/utils/Company';

const UpdateItem = () => {
  const { id } = useParams() as { id: string; };
  const { companySlug } = useCompany();
  const router = useRouter();
  const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
  const { data: vendors } = useFetchVendorsQuery();

  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<UpdateStoreItemRequest>({
    id: Number(id),
    name: '',
    quantity_count: 0,
    measurement: '',
    purchase_date: '',
    date_of_manufacture: '',
    date_of_expiry: '',
    description: '',
    brand_name: '',
    replacement: '',
    vendor_name: '',
    availability_stock: 0,
    variants: [],
    categories: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name || '',
        quantity_count: item.quantity_count || 0,
        measurement: item.measurement || '',
        purchase_date: item.purchase_date || '',
        date_of_manufacture: item.date_of_manufacture || '',
        date_of_expiry: item.date_of_expiry || '',
        description: item.description || '',
        brand_name: item.brand_name || '',
        replacement: item.replacement || '',
        cost_price: item.cost_price || 0,
        selling_price: item.selling_price || 0,
        availability_stock: item.availability_stock || 0,
        vendor_name: item.vendor_name || '',
        variants: item.variants || [],
        categories: item.categories || [],
      });
      setVariants(item.variants || []);
      setSelectedCategories(item.categories || []);
    }
  }, [item]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost_price' || name === 'selling_price' || name === 'availability_stock' || name === 'quantity_count'
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateStoreItem({
        ...formData,
        id: Number(id),
        // If API supports categories and variants in update, include them
        categories: selectedCategories,
        variants: variants,
      }).unwrap(); // Adjust typing as needed for API shape

      toast.success('Item updated successfully');
      router.push(`/${companySlug}/store/view-item/${id}`);
    } catch (err) {
      console.error('Error updating item:', err);
      toast.error('Failed to update item');
    }
  };

  if (isLoading) return <p>Loading item details...</p>;
  if (error) return <p>Error loading item details.</p>;

  return (
    <div className="form-wrapper">
      <Link href={`/${companySlug}/store`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label>Item Name*</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Quantity Count*</label>
          <input type="number" name="quantity_count" value={formData.quantity_count} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Measurement*</label>
          <input type="text" name="measurement" value={formData.measurement || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Purchase Date*</label>
          <input type="date" name="purchase_date" value={formData.purchase_date || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date Of Manufacture*</label>
          <input type="date" name="date_of_manufacture" value={formData.date_of_manufacture || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date Of Expiry*</label>
          <input type="date" name="date_of_expiry" value={formData.date_of_expiry || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Brand Name*</label>
          <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Replacement*</label>
          <input type="text" name="replacement" value={formData.replacement || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Cost Price*</label>
          <input type="number" name="cost_price" value={formData.cost_price || 0} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Selling Price*</label>
          <input type="number" name="selling_price" value={formData.selling_price || 0} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Availability Stock</label>
          <input type="number" name="availability_stock" value={formData.availability_stock || 0} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Vendor Name</label>
          <select name="vendor_name" value={formData.vendor_name || ''} onChange={handleChange} required>
            <option value="">Select a Vendor</option>
            {vendors?.map((vendor) => (
              <option key={vendor.id} value={vendor.vendor_name}>
                {vendor.vendor_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <ItemsTab
            setVariants={setVariants}
            variations={variants}
            setSelectedCategories={setSelectedCategories}
            selectedCategories={selectedCategories}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Item'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => router.push(`/${companySlug}/store/view-item/${id}`)}
          >
            Cancel
          </button>

        </div>
      </form>
    </div>
  );
};

export default UpdateItem;