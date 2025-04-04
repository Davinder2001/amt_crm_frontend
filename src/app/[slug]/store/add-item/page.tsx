// 'use client'
// import React, { useEffect, useState } from 'react';
// import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
// import { useRouter } from 'next/navigation';
// import { CreateStoreItemRequest } from '@/types/StoreItem';
// import Image from 'next/image';
// import { useCreateVendorMutation, useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
// import AddVendor from '../components/AddVendor';

// interface FormData {
//   name: string;
//   quantity_count: string;
//   measurement: string;
//   purchase_date: string;
//   date_of_manufacture: string;
//   date_of_expiry: string;
//   brand_name: string;
//   replacement: string;
//   category: string;
//   vendor_name: string;
//   availability_stock: string;
//   images: File[] | null; // Adjusted to accept File[]
// }

// const AddItem: React.FC = () => {
//   const [createStoreItem, { isLoading }] = useCreateStoreItemMutation();
//   const { currentData } = useFetchVendorsQuery();
//   console.log(currentData, 'currentData...')
//   const router = useRouter();

//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     quantity_count: '',
//     measurement: '',
//     purchase_date: '',
//     date_of_manufacture: '',
//     date_of_expiry: '',
//     brand_name: '',
//     replacement: '',
//     category: '',
//     vendor_name: '',
//     availability_stock: '',
//     images: null, // Initial state for images
//   });
//   const [vendors, setVendors] = useState<string[]>([]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
//   useEffect(() => {
//     if (currentData) {
//       // Map over the vendor data and extract the vendor names
//       const vendorNames = currentData.map((vendor: { vendor_name: string }) => vendor.vendor_name);
//       setVendors(vendorNames);
//     }
//   }, [currentData]);
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
//       const currentImages = formData.images ? Array.from(formData.images) : [];

//       // Combine existing images with the newly selected ones, but only take the first 5 images
//       const newImages = [...currentImages, ...selectedFiles].slice(0, 5); // Limit to 5 images

//       // Update the formData with the new images
//       setFormData(prev => ({
//         ...prev,
//         images: newImages.length > 0 ? newImages : null, // Store only up to 5 images
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const { quantity_count, availability_stock, images, ...rest } = formData;

//     const payload: CreateStoreItemRequest = {
//       ...rest,
//       quantity_count: parseInt(quantity_count, 10),
//       availability_stock: parseInt(availability_stock, 10),
//       images: images ? images : [], // If there are images, include them
//     };

//     try {
//       await createStoreItem(payload).unwrap();
//       router.push('/store/items');
//     } catch (err) {
//       console.error('Error creating item:', err);
//     }
//   };

//   console.log('images...', formData.images);


//   const handleVendorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFormData(prev => ({ ...prev, vendor_name: e.target.value }));
//   };

//   const handleVendorAdded = (vendorName: string) => {
//     // Update the vendors list with the new vendor
//     setVendors(prevVendors => [...prevVendors, vendorName]);

//     // Set the newly added vendor as the selected vendor
//     setFormData(prev => ({ ...prev, vendor_name: vendorName }));
//   };



//   return (
//     <div>
//       <h1>Add New Item</h1>
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
//         {/* <div style={{ flex: '1 1 300px' }}>
//           <label>Vendor Name</label>
//           <input type="text" name="vendor_name" value={formData.vendor_name} onChange={handleChange} />
//         </div> */}
//         {/* Vendor Selection */}
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

//           {/* AddVendor Component */}
//           <AddVendor onVendorAdded={handleVendorAdded} />
//         </div>
//         <div style={{ flex: '1 1 300px' }}>
//           <label>Availability Stock</label>
//           <input type="number" name="availability_stock" value={formData.availability_stock} onChange={handleChange} />
//         </div>

//         {/* Image Upload Section */}
//         <div style={{ flex: '1 1 100%' }}>
//           <label>Upload Images (up to 5)*</label>
//           <input
//             type="file"
//             name="images"
//             accept="image/*"
//             multiple
//             onChange={handleImageChange}
//           />
//           {formData.images && formData.images.length > 0 && (
//             <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
//               {Array.from(formData.images).map((file, index) => (
//                 <Image
//                   key={index}
//                   src={URL.createObjectURL(file)}
//                   alt={`preview-${index}`}
//                   width={100}
//                   height={100}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? 'Adding...' : 'Save'}
//           </button>
//           <button type="button" style={{ marginLeft: '1rem' }}>
//             Cancel
//           </button>
//         </div>
//       </form>

//       <style jsx>{`
//         form {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 1rem;
//         }
//         form div {
//           flex: 1 1 300px;
//         }
//         button {
//           padding: 10px 20px;
//           background-color: #0070f3;
//           color: white;
//           border: none;
//           cursor: pointer;
//         }
//         button:disabled {
//           background-color: #ccc;
//         }
//         input[type='file'] {
//           padding: 5px;
//         }
//         input[type='file']::file-selector-button {
//           padding: 5px 10px;
//           background-color: #0070f3;
//           color: white;
//           border: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AddItem;













'use client'
import React, { useEffect, useState } from 'react';
import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
import { useRouter } from 'next/navigation';
import { CreateStoreItemRequest } from '@/types/StoreItem';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import AddVendor from '../components/AddVendor';
import ImageUpload from '../components/ImageUpload'; // Import the new ImageUpload component

interface FormData {
  name: string;
  quantity_count: string;
  measurement: string;
  purchase_date: string;
  date_of_manufacture: string;
  date_of_expiry: string;
  brand_name: string;
  replacement: string;
  category: string;
  vendor_name: string;
  availability_stock: string;
  images: File[] | null; // Adjusted to accept File[] type
}

const AddItem: React.FC = () => {
  const [createStoreItem, { isLoading }] = useCreateStoreItemMutation();
  const { currentData } = useFetchVendorsQuery();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    quantity_count: '',
    measurement: '',
    purchase_date: '',
    date_of_manufacture: '',
    date_of_expiry: '',
    brand_name: '',
    replacement: '',
    category: '',
    vendor_name: '',
    availability_stock: '',
    images: null, // Initial state for images
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
      const selectedFiles = Array.from(e.target.files); // Convert FileList to an array

      // Limit the number of images to 5
      const newImages = selectedFiles.slice(0, 5); // Only take the first 5 files

      // Set the images in state
      setFormData(prev => ({
        ...prev,
        images: newImages.length > 0 ? newImages : null, // Store up to 5 images
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { quantity_count, availability_stock, images, ...rest } = formData;

    const payload: CreateStoreItemRequest = {
      ...rest,
      quantity_count: parseInt(quantity_count, 10),
      availability_stock: parseInt(availability_stock, 10),
      images: images ? images.map(image => image) : [], // Send actual File objects
    };

    try {
      await createStoreItem(payload).unwrap();
      router.push('/store/items');
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
        <ImageUpload images={formData.images} handleImageChange={handleImageChange} />

        <div style={{ flex: '1 1 100%', marginTop: '1rem' }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Save'}
          </button>
          <button type="button" style={{ marginLeft: '1rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
