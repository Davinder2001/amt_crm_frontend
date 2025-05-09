// 'use client'
// import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices/store/storeApi';
// import { toast } from 'react-toastify';
// import Link from 'next/link';
// import { FaArrowLeft } from 'react-icons/fa';
// import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
// import ItemsTab from '../ItemsTab';
// import { useCompany } from '@/utils/Company';

// const UpdateItem = () => {
//   const { id } = useParams() as { id: string; };
//   const { companySlug } = useCompany();
//   const router = useRouter();
//   const { data: item, error, isLoading } = useFetchStoreItemQuery(Number(id));
//   const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
//   const { data: vendors } = useFetchVendorsQuery();

//   const [variants, setVariants] = useState<variations[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

//   const [formData, setFormData] = useState<UpdateStoreItemRequest>({
//     id: Number(id),
//     name: '',
//     quantity_count: 0,
//     measurement: '',
//     purchase_date: '',
//     date_of_manufacture: '',
//     date_of_expiry: '',
//     description: '',
//     brand_name: '',
//     replacement: '',
//     vendor_name: '',
//     availability_stock: 0,
//     variants: [],
//     categories: [],
//   });

//   useEffect(() => {
//     if (item) {
//       setFormData({
//         id: item.id,
//         name: item.name || '',
//         quantity_count: item.quantity_count || 0,
//         measurement: item.measurement || '',
//         purchase_date: item.purchase_date || '',
//         date_of_manufacture: item.date_of_manufacture || '',
//         date_of_expiry: item.date_of_expiry || '',
//         description: item.description || '',
//         brand_name: item.brand_name || '',
//         replacement: item.replacement || '',
//         cost_price: item.cost_price || 0,
//         selling_price: item.selling_price || 0,
//         availability_stock: item.availability_stock || 0,
//         vendor_name: item.vendor_name || '',
//         variants: item.variants || [],
//         categories: item.categories || [],
//       });
//       setVariants(item.variants || []);
//       setSelectedCategories(item.categories || []);
//     }
//   }, [item]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'cost_price' || name === 'selling_price' || name === 'availability_stock' || name === 'quantity_count'
//         ? Number(value)
//         : value,
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       await updateStoreItem({
//         ...formData,
//         id: Number(id),
//         // If API supports categories and variants in update, include them
//         categories: selectedCategories,
//         variants: variants,
//       }).unwrap(); // Adjust typing as needed for API shape

//       toast.success('Item updated successfully');
//       router.push(`/${companySlug}/store/view-item/${id}`);
//     } catch (err) {
//       console.error('Error updating item:', err);
//       toast.error('Failed to update item');
//     }
//   };

//   if (isLoading) return <p>Loading item details...</p>;
//   if (error) return <p>Error loading item details.</p>;

//   return (
//     <div className="form-wrapper">
//       <Link href={`/${companySlug}/store`} className='back-button'>
//         <FaArrowLeft size={20} color='#fff' />
//       </Link>
//       <form onSubmit={handleSubmit} className="item-form">
//         <div className="form-group">
//           <label>Item Name*</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Quantity Count*</label>
//           <input type="number" name="quantity_count" value={formData.quantity_count} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Measurement*</label>
//           <input type="text" name="measurement" value={formData.measurement || ''} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Purchase Date*</label>
//           <input type="date" name="purchase_date" value={formData.purchase_date || ''} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Date Of Manufacture*</label>
//           <input type="date" name="date_of_manufacture" value={formData.date_of_manufacture || ''} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Date Of Expiry*</label>
//           <input type="date" name="date_of_expiry" value={formData.date_of_expiry || ''} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Brand Name*</label>
//           <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Replacement*</label>
//           <input type="text" name="replacement" value={formData.replacement || ''} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Cost Price*</label>
//           <input type="number" name="cost_price" value={formData.cost_price || 0} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Selling Price*</label>
//           <input type="number" name="selling_price" value={formData.selling_price || 0} onChange={handleChange} required />
//         </div>

//         <div className="form-group">
//           <label>Availability Stock</label>
//           <input type="number" name="availability_stock" value={formData.availability_stock || 0} onChange={handleChange} />
//         </div>

//         <div className="form-group">
//           <label>Vendor Name</label>
//           <select name="vendor_name" value={formData.vendor_name || ''} onChange={handleChange} required>
//             <option value="">Select a Vendor</option>
//             {vendors?.map((vendor) => (
//               <option key={vendor.id} value={vendor.vendor_name}>
//                 {vendor.vendor_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <ItemsTab
//             setVariants={setVariants}
//             variations={variants}
//             setSelectedCategories={setSelectedCategories}
//             selectedCategories={selectedCategories}
//           />
//         </div>

//         <div className="form-actions">
//           <button type="submit" disabled={isUpdating}>
//             {isUpdating ? 'Updating...' : 'Update Item'}
//           </button>
//           <button
//             type="button"
//             className="cancel-btn"
//             onClick={() => router.push(`/${companySlug}/store/view-item/${id}`)}
//           >
//             Cancel
//           </button>

//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateItem;










'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices/store/storeApi';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import AddVendor from '../../components/AddVendor';
import ImageUpload from '../../components/ImageUpload';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import ItemsTab from '../ItemsTab';
import AddCategory from '../../add-item/AddCategory';

const UpdateItem = () => {
  const { id } = useParams() as { id: string };
  const { companySlug } = useCompany();
  const router = useRouter();
  const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
  const { currentData: vendors } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();

  interface UpdateStoreItemRequest {
    id: number;
    name: string;
    quantity_count: number;
    measurement: string;
    purchase_date: string;
    date_of_manufacture: string;
    date_of_expiry: string;
    brand_name: string;
    replacement: string;
    category: string;
    vendor_name: string;
    availability_stock: number;
    cost_price: number;
    selling_price: number;
    tax_id: number; // Added tax_id here
    images: (File | string)[];
    variants: variations[];
    categories: Category[];
  }

  const [formData, setFormData] = useState<UpdateStoreItemRequest>({
    id: Number(id),
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
    tax_id: 0,
    images: [],
    variants: [],
    categories: [],
  });

  const [vendorsList, setVendorsList] = useState<string[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (vendors) {
      const vendorNames = vendors.map((vendor: { vendor_name: string }) => vendor.vendor_name);
      setVendorsList(vendorNames);
    }
  }, [vendors]);

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
        brand_name: item.brand_name || '',
        replacement: item.replacement || '',
        category: item.category || '',
        vendor_name: item.vendor_name || '',
        availability_stock: item.availability_stock || 0,
        cost_price: item.cost_price || 0,
        selling_price: item.selling_price || 0,
        tax_id: item.tax_id || 0,
        images: item.images || [],
        variants: item.variants || [],
        categories: item.categories || [],
      });
      setVariants(item.variants || []);
      setSelectedCategories(item.categories || []);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = selectedFiles.slice(0, 5);
      const updatedImages = [...(formData.images || []), ...newImages].slice(-5);
      setFormData(prev => ({ ...prev, images: updatedImages }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const imagesArray = Array.isArray(prev.images) ? prev.images : [];
      const updatedImages = [...imagesArray];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
  };


  const handleClearImages = () => {
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append('id', formData.id.toString());
    form.append('name', formData.name);
    form.append('quantity_count', formData.quantity_count.toString());
    form.append('measurement', formData.measurement || '');
    form.append('purchase_date', formData.purchase_date || '');
    form.append('date_of_manufacture', formData.date_of_manufacture);
    form.append('date_of_expiry', formData.date_of_expiry || '');
    form.append('brand_name', formData.brand_name);
    form.append('replacement', formData.replacement || '');
    form.append('category', formData.category || '');
    form.append('vendor_name', formData.vendor_name || '');
    form.append('availability_stock', formData.availability_stock.toString());
    form.append('cost_price', formData.cost_price.toString());
    form.append('selling_price', formData.selling_price.toString());
    form.append('tax_id', formData.tax_id.toString());

    // Ensure formData.images is always treated as an array.
const images = Array.isArray(formData.images) ? formData.images : [];

images.forEach((img) => {
  if (img instanceof File) {
    form.append('images[]', img);
  } else if (typeof img === 'string') {
    // Handle existing image URLs if needed
    form.append('existing_images[]', img);
  }
});


    // Attach variants
    variants.forEach((variant, i) => {
      form.append(`variants[${i}][price]`, variant.price.toString());

      variant.attributes.forEach((attr, attrIndex) => {
        form.append(`variants[${i}][attributes][${attrIndex}][attribute_id]`, attr.attribute_id.toString());
        form.append(`variants[${i}][attributes][${attrIndex}][attribute_value_id]`, attr.attribute_value_id.toString());
      });

      Object.entries(variant).forEach(([key, val]) => {
        if (!['price', 'attributes'].includes(key)) {
          form.append(`variants[${i}][${key}]`, val.toString());
        }
      });
    });

    // Send category IDs
    selectedCategories.forEach((category, index) => {
      form.append(`categories[${index}]`, category.id.toString());
    });

    try {
      await updateStoreItem({
        id: formData.id,
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
        cost_price: formData.cost_price,
        selling_price: formData.selling_price,
        images: formData.images,
        variants: variants,
        categories: selectedCategories,
      }).unwrap();
      router.push(`/${companySlug}/store/view-item/${id}`);
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  if (isItemLoading) return <p>Loading item details...</p>;

  return (
    <div className='store-add-item'>
      <Link href={`/${companySlug}/store`} className='back-button'>
        <FaArrowLeft size={20} color='#fff' />
      </Link>

      <form onSubmit={handleSubmit}>
        <div className='categories-filds-outer'>
          <div className='add-items-form-container'>
            <div className='add-items-form-input-label-container'>
              <label>Item Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Samsung Monitor 24 inch"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Quantity Count*</label>
              <input
                type="number"
                name="quantity_count"
                value={formData.quantity_count === 0 ? '' : formData.quantity_count}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    quantity_count: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 100"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Measurement</label>
              <input
                type="text"
                name="measurement"
                value={formData.measurement}
                onChange={handleChange}
                placeholder="e.g. kg, pcs, liters"
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Purchase Date</label>
              <input
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                placeholder="Select purchase date"
                onFocus={(e) => e.target.showPicker?.()}
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Date Of Manufacture*</label>
              <input
                type="date"
                name="date_of_manufacture"
                value={formData.date_of_manufacture}
                onChange={handleChange}
                placeholder="Select manufacture date"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Date Of Expiry</label>
              <input
                type="date"
                name="date_of_expiry"
                value={formData.date_of_expiry}
                onChange={handleChange}
                placeholder="Select expiry date"
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Brand Name*</label>
              <input
                type="text"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                placeholder="e.g. Samsung, LG"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Replacement</label>
              <input
                type="text"
                name="replacement"
                value={formData.replacement}
                onChange={handleChange}
                placeholder="e.g. Replace after 2 years"
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Cost Price*</label>
              <input
                type="number"
                name="cost_price"
                value={formData.cost_price === 0 ? '' : formData.cost_price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    cost_price: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 250.00"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Selling Price*</label>
              <input
                type="number"
                name="selling_price"
                value={formData.selling_price === 0 ? '' : formData.selling_price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    selling_price: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 300.00"
                required
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Availability Stock</label>
              <input
                type="number"
                name="availability_stock"
                value={formData.availability_stock === 0 ? '' : formData.availability_stock}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    availability_stock: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 50"
              />
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Tax</label>
              <select
                name="tax_id"
                value={formData.tax_id}
                onChange={(e) => setFormData(prev => ({ ...prev, tax_id: parseInt(e.target.value) }))}
              >
                <option value="">Select Tax</option>
                {taxesData?.data?.map((tax: Tax) => (
                  <option key={tax.id} value={tax.id}>
                    {tax.name} - {tax.rate}%
                  </option>
                ))}
              </select>
            </div>

            <div className='add-items-form-input-label-container'>
              <label>Vendor Name*</label>
              <AddVendor
                vendors={vendorsList}
                selectedVendor={formData.vendor_name || ''}
                onVendorSelect={(vendorName) =>
                  setFormData(prev => ({ ...prev, vendor_name: vendorName }))
                }
                onVendorAdded={(vendorName) => {
                  setVendorsList(prev => [...prev, vendorName]);
                  setFormData(prev => ({ ...prev, vendor_name: vendorName }));
                }}
              />
            </div>

            <ImageUpload
              images={
                Array.isArray(formData.images)
                  ? formData.images.filter((img): img is File => img instanceof File)
                  : []
              }
              handleImageChange={handleImageChange}
              handleClearImages={handleClearImages}
              handleRemoveImage={handleRemoveImage}
            />


            <div>
              <ItemsTab
                setVariants={setVariants}
                variations={variants} setSelectedCategories={function (categories: Category[]): void {
                  throw new Error('Function not implemented.');
                }} selectedCategories={[]} />
            </div>
          </div>

          <AddCategory
            onCategoryChange={setSelectedCategories}
            selectedCategories={selectedCategories}
          />
        </div>

        <div className='save-cancel-button' style={{ flex: '1 1 100%', marginTop: '1rem' }}>
          <button
            className='buttons'
            type="button"
            style={{ marginLeft: '1rem' }}
            onClick={() => router.push(`/${companySlug}/store`)}
          >
            Cancel
          </button>
          <button className='buttons' type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateItem;