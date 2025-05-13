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
import ItemCategories from '../../components/ItemCategories';
import { FormInput } from '@/components/common/FormInput';

const UpdateItem = () => {
  const { id } = useParams() as { id: string };
  const { companySlug } = useCompany();
  const router = useRouter();
  const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
  const { currentData: vendors } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();

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
        images: Array.isArray(item.images) ? item.images.filter((img): img is File => img instanceof File) : [],
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

    // Append simple fields
    Object.entries(formData).forEach(([key, val]) => {
      if (key !== 'images' && val !== null && val !== undefined) {
        form.append(key, val.toString());
      }
    });

    // Append images
    formData.images.forEach(img => form.append('images[]', img));

    // Append variants
    variants.forEach((variant, i) => {
      form.append(`variants[${i}][price]`, variant.price.toString());
      variant.attributes?.forEach((attr, attrIndex) => {
        form.append(`variants[${i}][attributes][${attrIndex}][attribute_id]`, attr.attribute_id.toString());
        form.append(`variants[${i}][attributes][${attrIndex}][attribute_value_id]`, attr.attribute_value_id.toString());
      });
    });

    // Append categories
    selectedCategories.forEach(cat => form.append('categories[]', cat.id.toString()));

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
        tax_id: formData.tax_id,
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

            <FormInput
              label="Item Name*"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Samsung Monitor 24 inch"
              required
            />

            <FormInput
              label="Quantity Count*"
              name="quantity_count"
              type="number"
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
              images={formData.images}
              handleImageChange={handleImageChange}
              handleClearImages={handleClearImages}
              handleRemoveImage={handleRemoveImage}
            />


            <div>
              <ItemsTab
                setVariants={setVariants}
                variations={variants} setSelectedCategories={function (categories: Category[]): void {
                  throw new Error('Function not implemented.');
                }}
                selectedCategories={selectedCategories}
              />
            </div>
          </div>

          <ItemCategories
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

















// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices/store/storeApi';
// import { useParams, useRouter } from 'next/navigation';
// import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
// import { useFetchTaxesQuery } from '@/slices/company/companyApi';
// import { useCompany } from '@/utils/Company';
// import Link from 'next/link';
// import { FaArrowLeft } from 'react-icons/fa';
// import { FormInput } from '@/components/common/FormInput';
// import { FormSelect } from '@/components/common/FormSelect';
// import DatePickerField from '@/components/common/DatePickerField';
// import AddVendor from '../../components/AddVendor';
// import ImageUpload from '../../components/ImageUpload';
// import ItemsTab from '../ItemsTab';
// import AddCategory from '../UpdateCategory';
// const UpdateItem: React.FC = () => {
//   const { id } = useParams() as { id: string };
//   const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
//   const { currentData: vendorsData } = useFetchVendorsQuery();
//   const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
//   const { data: taxesData } = useFetchTaxesQuery();
//   const router = useRouter();
//   const { companySlug } = useCompany();
//   const [formData, setFormData] = useState<UpdateStoreItemRequest>({
//     id: Number(id),
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
//     tax_id: 0,
//     images: [],
//     variants: [],
//     categories: [],
//   });

//   const [vendors, setVendors] = useState<string[]>([]);
//   const [variants, setVariants] = useState<variations[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     if (vendorsData) {
//       setVendors(vendorsData.map((vendor: { vendor_name: string }) => vendor.vendor_name));
//     }
//   }, [vendorsData]);

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
//         brand_name: item.brand_name || '',
//         replacement: item.replacement || '',
//         category: item.category || '',
//         vendor_name: item.vendor_name || '',
//         availability_stock: item.availability_stock || 0,
//         cost_price: item.cost_price || 0,
//         selling_price: item.selling_price || 0,
//         tax_id: item.tax_id || 0,
//         images: item.images || [],
//         variants: item.variants || [],
//         categories: item.categories || [],
//       });
//       setVariants(item.variants || []);
//       setSelectedCategories(item.categories || []);
//     }
//   }, [item]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const numValue = value === '' ? 0 : Number(value);
//     setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files);
//       const newImages = selectedFiles.slice(0, 5);
//       const updatedImages = [...(formData.images || []), ...newImages].slice(-5);
//       setFormData(prev => ({ ...prev, images: updatedImages }));
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const form = new FormData();

//     // Append simple fields
//     Object.entries(formData).forEach(([key, val]) => {
//       if (key !== 'images' && val !== null && val !== undefined) {
//         form.append(key, val.toString());
//       }
//     });

//     // Append images
//     formData.images.forEach(img => form.append('images[]', img));

//     // Append variants
//     variants.forEach((variant, i) => {
//       form.append(`variants[${i}][price]`, variant.price.toString());
//       variant.attributes?.forEach((attr, attrIndex) => {
//         form.append(`variants[${i}][attributes][${attrIndex}][attribute_id]`, attr.attribute_id.toString());
//         form.append(`variants[${i}][attributes][${attrIndex}][attribute_value_id]`, attr.attribute_value_id.toString());
//       });
//     });

//     // Append categories
//     selectedCategories.forEach(cat => form.append('categories[]', cat.id.toString()));

//     try {
//       await updateStoreItem(form).unwrap();
//       router.push(`/${companySlug}/store`);
//     } catch (err) {
//       console.error('Error creating item:', err);
//     }
//   };

//   return (
//     <div className='store-add-item'>
//       <Link href={`/${companySlug}/store`} className='back-button'>
//         <FaArrowLeft size={20} color='#fff' />
//       </Link>

//       <form onSubmit={handleSubmit}>
//         <div className='categories-filds-outer'>
//           <div className='add-items-form-container'>
//             <FormInput
//               label="Item Name*"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g. Samsung Monitor 24 inch"
//               required
//             />

//             <FormInput
//               label="Quantity Count*"
//               name="quantity_count"
//               type="number"
//               value={formData.quantity_count || ''}
//               onChange={handleNumberChange}
//               placeholder="e.g. 100"
//               required
//             />

//             <FormInput
//               label="Measurement"
//               name="measurement"
//               value={formData.measurement || ''}
//               onChange={handleChange}
//               placeholder="e.g. kg, pcs, liters"
//             />

//             <DatePickerField
//               label="Purchase Date"
//               selectedDate={formData.purchase_date || null}
//               onChange={(date) => setFormData(prev => ({ ...prev, purchase_date: date }))}
//               maxDate={new Date()}
//             />

//             <DatePickerField
//               label="Date Of Manufacture*"
//               selectedDate={formData.date_of_manufacture || null}
//               onChange={(date) => setFormData(prev => ({ ...prev, date_of_manufacture: date }))}
//               maxDate={new Date()}
//               required
//             />

//             <DatePickerField
//               label="Date Of Expiry"
//               selectedDate={formData.date_of_expiry || null}
//               onChange={(date) => setFormData(prev => ({ ...prev, date_of_expiry: date }))}
//               minDate={new Date()}
//             />

//             <FormInput
//               label="Brand Name*"
//               name="brand_name"
//               value={formData.brand_name}
//               onChange={handleChange}
//               placeholder="e.g. Samsung, LG"
//               required
//             />

//             <FormInput
//               label="Replacement"
//               name="replacement"
//               value={formData.replacement || ''}
//               onChange={handleChange}
//               placeholder="e.g. Replace after 2 years"
//             />

//             <FormInput
//               label="Cost Price*"
//               name="cost_price"
//               type="number"
//               value={formData.cost_price || ''}
//               onChange={handleNumberChange}
//               placeholder="e.g. 250.00"
//               required
//             />

//             <FormInput
//               label="Selling Price*"
//               name="selling_price"
//               type="number"
//               value={formData.selling_price || ''}
//               onChange={handleNumberChange}
//               placeholder="e.g. 300.00"
//               required
//             />

//             <FormInput
//               label="Availability Stock"
//               name="availability_stock"
//               type="number"
//               value={formData.availability_stock || ''}
//               onChange={handleNumberChange}
//               placeholder="e.g. 50"
//             />

//             {taxesData?.data && (
//               <FormSelect<number>
//                 label="Tax"
//                 name="tax_id"
//                 value={formData.tax_id}
//                 onChange={(value) => setFormData(prev => ({ ...prev, tax_id: value }))}
//                 options={taxesData.data.map((tax: Tax) => ({
//                   value: tax.id,
//                   label: `${tax.name} - ${tax.rate}%`
//                 }))}
//               />
//             )}

//             <div className='add-items-form-input-label-container'>
//               <label>Vendor Name*</label>
//               <AddVendor
//                 vendors={vendors}
//                 selectedVendor={formData.vendor_name || ''}
//                 onVendorSelect={(vendorName) => setFormData(prev => ({ ...prev, vendor_name: vendorName }))}
//                 onVendorAdded={(vendorName) => {
//                   setVendors(prev => [...prev, vendorName]);
//                   setFormData(prev => ({ ...prev, vendor_name: vendorName }));
//                 }}
//               />
//             </div>

//             <ImageUpload
//               images={formData.images}
//               handleImageChange={handleImageChange}
//               handleClearImages={() => setFormData(prev => ({ ...prev, images: [] }))}
//               handleRemoveImage={handleRemoveImage}
//             />

//             <ItemsTab onChange={setVariants} variations={variants} />
//           </div>

//           <AddCategory
//             onCategoryChange={setSelectedCategories}
//             selectedCategories={selectedCategories}
//           />
//         </div>

//         <div className='save-cancel-button' style={{ flex: '1 1 100%', marginTop: '1rem' }}>
//           <button
//             type="button"
//             className='buttons'
//             style={{ marginLeft: '1rem' }}
//             onClick={() => router.push(`/${companySlug}/store`)}
//           >
//             Cancel
//           </button>
//           <button type="submit" className='buttons' disabled={isUpdating}>
//             {isUpdating ? 'Adding...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateItem;