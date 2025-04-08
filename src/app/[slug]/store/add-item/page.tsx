// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
// import { useRouter } from 'next/navigation';
// import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
// import AddVendor from '../components/AddVendor';
// import ImageUpload from '../components/ImageUpload';
// import { useCompany } from '@/utils/Company';

// const AddItem: React.FC = () => {
//   const [createStoreItem, { isLoading }] = useCreateStoreItemMutation();
//   const { currentData } = useFetchVendorsQuery();
//   const router = useRouter();
//   const { companySlug } = useCompany();

//   const [formData, setFormData] = useState<CreateStoreItemRequest>({
//     name: '',
//     quantity_count: 0,
//     measurement: '',
//     purchase_date: '',
//     date_of_manufacture: '',
//     date_of_expiry: '',
//     brand_name: '',
//     replacement: '',
//     category: '',
//     vendor_name: '',
//     availability_stock: 0,
//     cost_price: 0,
//     selling_price: 0,
//     images: [],
//   });

//   const [vendors, setVendors] = useState<string[]>([]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   useEffect(() => {
//     if (currentData) {
//       const vendorNames = currentData.map((vendor: { vendor_name: string }) => vendor.vendor_name);
//       setVendors(vendorNames);
//     }
//   }, [currentData]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files);
//       const newImages = selectedFiles.slice(0, 5);
//       const updatedImages = [...(formData.images || []), ...newImages].slice(-5);
//       setFormData(prev => ({ ...prev, images: updatedImages }));
//     }
//   };

//   const handleClearImages = () => {
//     setFormData(prev => ({ ...prev, images: [] }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = new FormData();
//     form.append('name', formData.name);
//     form.append('quantity_count', formData.quantity_count.toString());
//     form.append('measurement', formData.measurement || '');
//     form.append('purchase_date', formData.purchase_date || '');
//     form.append('date_of_manufacture', formData.date_of_manufacture || '');
//     form.append('date_of_expiry', formData.date_of_expiry || '');
//     form.append('brand_name', formData.brand_name);
//     form.append('replacement', formData.replacement || '');
//     form.append('category', formData.category || '');
//     form.append('vendor_name', formData.vendor_name || '');
//     form.append('availability_stock', formData.availability_stock.toString());
//     form.append('cost_price', formData.cost_price.toString());
//     form.append('selling_price', formData.selling_price.toString());

//     formData.images?.forEach((img) => {
//       form.append('images[]', img);
//     });

//     try {
//       await createStoreItem(form).unwrap();
//       router.push(`/${companySlug}/store`);
//     } catch (err) {
//       console.error('Error creating item:', err);
//     }
//   };

//   const handleVendorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFormData(prev => ({ ...prev, vendor_name: e.target.value }));
//   };

//   const handleVendorAdded = (vendorName: string) => {
//     setVendors(prevVendors => [...prevVendors, vendorName]);
//     setFormData(prev => ({ ...prev, vendor_name: vendorName }));
//   };

//   return (
//     <div className='store-add-item'>
//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Name*</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Quantity Count*</label>
//           <input type="number" name="quantity_count" value={formData.quantity_count} onChange={handleChange} required />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Measurement</label>
//           <input type="text" name="measurement" value={formData.measurement} onChange={handleChange} />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Purchase Date</label>
//           <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Date Of Manufacture*</label>
//           <input type="date" name="date_of_manufacture" value={formData.date_of_manufacture} onChange={handleChange} required />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Date Of Expiry</label>
//           <input type="date" name="date_of_expiry" value={formData.date_of_expiry} onChange={handleChange} />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Brand Name*</label>
//           <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} required />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Replacement</label>
//           <input type="text" name="replacement" value={formData.replacement} onChange={handleChange} />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Category</label>
//           <input type="text" name="category" value={formData.category} onChange={handleChange} />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Cost Price*</label>
//           <input type="number" name="cost_price" value={formData.cost_price} onChange={handleChange} required />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Selling Price*</label>
//           <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} required />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Vendor Name*</label>
//           <select name="vendor_name" value={formData.vendor_name} onChange={handleVendorSelect} required>
//             <option value="">Select Vendor</option>
//             {vendors.length > 0 ? (
//               vendors.map((vendor, index) => (
//                 <option key={index} value={vendor}>
//                   {vendor}
//                 </option>
//               ))
//             ) : (
//               <option>No vendors available</option>
//             )}
//           </select>
//           <AddVendor onVendorAdded={handleVendorAdded} />
//         </div>

//         <div style={{ flex: '1 1 300px' }}>
//           <label>Availability Stock</label>
//           <input type="number" name="availability_stock" value={formData.availability_stock} onChange={handleChange} />
//         </div>

//         <div className='add-item-form-image'>
//         <ImageUpload images={formData.images} handleImageChange={handleImageChange} handleClearImages={handleClearImages} />

//         </div>
//         <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? 'Adding...' : 'Save'}
//           </button>
//           <button type="button" style={{ marginLeft: '1rem' }} onClick={() => router.push(`/${companySlug}/store`)}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddItem;













'use client';
import React, { useEffect, useState } from 'react';
import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
import { useRouter } from 'next/navigation';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import AddVendor from '../components/AddVendor';
import ImageUpload from '../components/ImageUpload';
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
    cost_price: 0,
    selling_price: 0,
    images: [],
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
      const selectedFiles = Array.from(e.target.files);
      const newImages = selectedFiles.slice(0, 5);
      const updatedImages = [...(formData.images || []), ...newImages].slice(-5);
      setFormData(prev => ({ ...prev, images: updatedImages }));
    }
  };

  const handleClearImages = () => {
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('quantity_count', formData.quantity_count.toString());
    form.append('measurement', formData.measurement || '');
    form.append('purchase_date', formData.purchase_date || '');
    form.append('date_of_manufacture', formData.date_of_manufacture || '');
    form.append('date_of_expiry', formData.date_of_expiry || '');
    form.append('brand_name', formData.brand_name);
    form.append('replacement', formData.replacement || '');
    form.append('category', formData.category || '');
    form.append('vendor_name', formData.vendor_name || '');
    form.append('availability_stock', formData.availability_stock.toString());
    form.append('cost_price', formData.cost_price.toString());
    form.append('selling_price', formData.selling_price.toString());

    formData.images?.forEach((img) => {
      form.append('images[]', img);
    });

    try {
      await createStoreItem(form).unwrap();
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
    <div className='store-add-item'>
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
        <div style={{ flex: '1 1 300px' }}>
          <label>Cost Price*</label>
          <input type="number" name="cost_price" value={formData.cost_price} onChange={handleChange} required />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <label>Selling Price*</label>
          <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} required />
        </div>
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
          <AddVendor onVendorAdded={handleVendorAdded} />
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <label>Availability Stock</label>
          <input type="number" name="availability_stock" value={formData.availability_stock} onChange={handleChange} />
        </div>

        <div className='add-item-form-image'>
        <ImageUpload images={formData.images} handleImageChange={handleImageChange} handleClearImages={handleClearImages} />

        </div>
        <div className='save-cancel-button' style={{ flex: '1 1 100%', marginTop: '1rem' }}>
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