'use client';
import React, { useEffect, useState } from 'react';
import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
import { useRouter } from 'next/navigation';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import AddVendor from '../components/AddVendor';
import ImageUpload from '../components/ImageUpload'; // Import the new ImageUpload component
import { useCompany } from '@/utils/Company';

const AddItem: React.FC = () => {
  const [createStoreItem, { isLoading }] = useCreateStoreItemMutation();
  const { currentData } = useFetchVendorsQuery();
  const router = useRouter();
  const { companySlug } = useCompany();

  const [formData, setFormData] = useState<CreateStoreItemRequest>({
    name: '',
    quantity_count: 0,
    measurement: '',
    purchase_date: '',
    date_of_manufacture: '',
    date_of_expiry: '',
    brand_name: '',
    replacement: '',
    category: '',
    vendor_name: '',
    availability_stock: 0,
    images: [], // Initial state for images
  });

  const [vendors, setVendors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (currentData) {
      const vendorNames = currentData.map((vendor: { vendor_name: string }) => vendor.vendor_name);
      setVendors(vendorNames);
    }
  }, [currentData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files); // Convert FileList to array

      // If more than 5 images are selected, only consider the first 5 images
      const newImages = selectedFiles.slice(0, 5); // Limit to 5 selected images

      // Combine the new images with the previously selected images, ensuring a max of 5 images
      const updatedImages: File[] = [
        ...(formData.images || []),
        ...newImages,
      ].slice(-5); // Only keep the last 5 images

      // Update the formData with the new images (limit to 5)
      setFormData((prev) => ({
        ...prev,
        images: updatedImages.length > 0 ? updatedImages : [], // Update state with the latest images
      }));
    }
  };

  const handleClearImages = () => {
    // Clear images and reset input field
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure that all form data is in the correct format to send to the mutation
    const itemData: CreateStoreItemRequest = {
      name: formData.name,
      quantity_count: formData.quantity_count,
      measurement: formData.measurement,
      purchase_date: formData.purchase_date,
      date_of_manufacture: formData.date_of_manufacture,
      date_of_expiry: formData.date_of_expiry,
      brand_name: formData.brand_name,
      replacement: formData.replacement,
      category: formData.category,
      vendor_name: formData.vendor_name,
      availability_stock: formData.availability_stock,
      images: formData.images, // Directly use the images array
    };

    // Send the plain object (itemData) to the API using the mutation
    try {
      await createStoreItem(itemData).unwrap();
      router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  const handleVendorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, vendor_name: e.target.value }));
  };

  const handleVendorAdded = (vendorName: string) => {
    setVendors(prevVendors => [...prevVendors, vendorName]);
    setFormData(prev => ({ ...prev, vendor_name: vendorName }));
  };

  return (
    <div>
      <h1>Add New Item</h1>
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

        {/* Vendor Selection */}
        <div style={{ flex: '1 1 300px' }}>
          <label>Vendor Name*</label>
          <select name="vendor_name" value={formData.vendor_name} onChange={handleVendorSelect} required>
            <option value="">Select Vendor</option>
            {vendors.length > 0 ? (
              vendors.map((vendor, index) => (
                <option key={index} value={vendor}>
                  {vendor}
                </option>
              ))
            ) : (
              <option>No vendors available</option>
            )}
          </select>
          {/* AddVendor Component */}
          <AddVendor onVendorAdded={handleVendorAdded} />
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <label>Availability Stock</label>
          <input type="number" name="availability_stock" value={formData.availability_stock} onChange={handleChange} />
        </div>

        {/* Image Upload Component */}
        <ImageUpload images={formData.images} handleImageChange={handleImageChange} handleClearImages={handleClearImages} />

        <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Save'}
          </button>
          <button type="button" style={{ marginLeft: '1rem' }} onClick={() => router.push(`/${companySlug}/store`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
