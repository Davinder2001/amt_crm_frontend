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
import ItemsTab from '../../components/ItemsTab';
import ItemCategories from '../../components/ItemCategories';
import { FormInput } from '@/components/common/FormInput';
import DatePickerField from '@/components/common/DatePickerField';
import { FormSelect } from '@/components/common/FormSelect';
import { Tabs, Tab, Box } from '@mui/material';
import { toast } from 'react-toastify';

const UpdateItem = () => {
  const { id } = useParams() as { id: string };
  const { companySlug } = useCompany();
  const router = useRouter();
  const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
  const { currentData: vendors } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();

  const getDefaultFormData = (): UpdateStoreItemRequest => ({
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
  })

  const [formData, setFormData] = useState<UpdateStoreItemRequest>(getDefaultFormData());
  const [originalItemData, setOriginalItemData] = useState<UpdateStoreItemRequest | null>(null);
  const [vendorsList, setVendorsList] = useState<string[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    if (vendors) {
      const vendorNames = vendors.map((vendor: { vendor_name: string }) => vendor.vendor_name);
      setVendorsList(vendorNames);
    }
  }, [vendors]);

  useEffect(() => {
    if (item) {
      const initialData = {
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
        tax_id: (item.taxes && item.taxes.length > 0 && item.taxes[0]?.id) ? item.taxes[0].id : 0,
        images: Array.isArray(item.images) ? item.images : [],
        variants: item.variants || [],
        categories: item.categories ? item.categories.map((cat: Category) => cat.id) : [],
      };
      setFormData(initialData);
      setOriginalItemData(initialData);
      setVariants(item.variants || []);
      setSelectedCategories(item.categories || []);
    }
  }, [item]);

  useEffect(() => {
    const categoryIds = selectedCategories.map(cat => cat.id);
    setFormData(prev => ({
      ...prev,
      categories: categoryIds
    }));
  }, [selectedCategories]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentImages = formData.images || [];

      // Count how many are already in state
      const existingImageCount = currentImages.length;

      // Only allow new files up to 5 - existingImageCount
      const allowedFiles = files.slice(0, 5 - existingImageCount);

      // Combine and update
      const updatedImages = [...currentImages, ...allowedFiles];
      setFormData(prev => ({ ...prev, images: updatedImages }));
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageUrl = formData.images[index];  // Get the URL of the image to be removed
    if (typeof imageUrl === 'string') {
      setRemovedImages((prev) => [...prev, imageUrl]);  // Store the removed image URL
    }

    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updatedImages };
    });
  };

  const handleClearImages = () => {
    setFormData(prev => ({ ...prev, images: [] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originalItemData) return;

    const formdata = new FormData();

    // Always include method and id
    formdata.append('_method', 'PUT');
    formdata.append('id', formData.id.toString());

    // Add primitive fields only if they changed
    const primitiveFields = [
      'name', 'quantity_count', 'measurement', 'purchase_date',
      'date_of_manufacture', 'date_of_expiry', 'brand_name',
      'replacement', 'category', 'vendor_name', 'availability_stock',
      'cost_price', 'selling_price', 'tax_id'
    ];

    primitiveFields.forEach((field) => {
      const key = field as keyof UpdateStoreItemRequest;
      const value = formData[key];
      const originalValue = originalItemData[key];

      if (value !== originalValue) {
        formdata.append(field, value?.toString() ?? '');
      }
    });

    // ✅ Always include categories[]
    formdata.delete('categories[]');
    formData.categories.forEach((catId) => {
      formdata.append('categories[]', catId.toString());
    });

    // ✅ Only include new images (File objects)
    const newImages = formData.images.filter((img) => img instanceof File);
    if (newImages.length > 0) {
      newImages.forEach((img) => formdata.append('images[]', img));
    }

    // Add the removed images to the form data
    removedImages.forEach((imageUrl) => formdata.append('removed_images[]', imageUrl));

    // ✅ Only send variants if changed
    if (JSON.stringify(variants) !== JSON.stringify(originalItemData.variants)) {
      variants.forEach((variant, i) => {
        formdata.append(`variants[${i}][price]`, variant.price.toString());
        variant.attributes?.forEach((attr, j) => {
          formdata.append(`variants[${i}][attributes][${j}][attribute_id]`, attr.attribute_id.toString());
          formdata.append(`variants[${i}][attributes][${j}][attribute_value_id]`, attr.attribute_value_id.toString());
        });
      });
    }

    // Submit update
    try {
      await updateStoreItem({ id: formData.id, formdata }).unwrap();
      toast.success('Item updated successfully!');
      // router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error updating item:', err);
      toast.error('Failed to update item.');
    }
  };


  if (isItemLoading) return <p>Loading item details...</p>;

  return (
    <div className='store-add-item'>

      <form onSubmit={handleSubmit}>
        <div className="add-item-header">
          <Link href={`/${companySlug}/store`} className='back-button'>
            <FaArrowLeft size={16} color='#fff' />
          </Link>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            style={{
              backgroundColor: '#f1f9f9',
            }}
            sx={{
              '& .MuiTab-root': {
                color: '#009693',
                '&.Mui-selected': {
                  color: 'var(--primary-color)',

                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#009693',
              },
            }}
          >
            <Tab label="Basic Info" />
            <Tab label="Pricing & Inventory" />
            <Tab label="Media & Dates" />
            <Tab label="Categories" />
            <Tab label="Product Options" />
          </Tabs>
        </div>

        <Box>
          {activeTab === 0 && (
            <div className='add-items-form-container'>
              <FormInput
                label="Item Name*"
                name="name"
                type="text"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="e.g. Samsung Monitor 24 inch"
                required
              />

              <FormInput
                label="Brand Name*"
                name="brand_name"
                value={formData.brand_name || ''}
                onChange={handleChange}
                placeholder="e.g. Samsung, LG"
                required
              />

              <FormInput
                label="Measurement"
                name="measurement"
                value={formData.measurement || ''}
                onChange={handleChange}
                placeholder="e.g. kg, pcs, liters"
              />

              <FormInput
                label="Replacement"
                name="replacement"
                value={formData.replacement || ''}
                onChange={handleChange}
                placeholder="e.g. Replace after 2 years"
              />

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
            </div>
          )}

          {activeTab === 1 && (
            <div className='add-items-form-container'>
              <FormInput
                label="Cost Price*"
                name="cost_price"
                type="number"
                value={formData.cost_price === 0 || formData.cost_price === undefined ? '' : formData.cost_price}
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

              <FormInput
                label="Selling Price*"
                name="selling_price"
                type="number"
                value={formData.selling_price === 0 || formData.selling_price === undefined ? '' : formData.selling_price}
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



              <FormInput
                label="Quantity Count*"
                name="quantity_count"
                type="number"
                value={formData.quantity_count === 0 || formData.quantity_count === undefined ? '' : formData.quantity_count}
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

              <FormInput
                label="Availability Stock"
                name="availability_stock"
                type="number"
                value={formData.availability_stock === 0 || formData.availability_stock === undefined ? '' : formData.availability_stock}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    availability_stock: isNaN(val) ? 0 : val,
                  }));
                }}
                placeholder="e.g. 50"
              />

              {taxesData?.data && (
                <FormSelect<number>
                  label="Tax"
                  name="tax_id"
                  value={formData.tax_id ?? 0}
                  onChange={(value) => setFormData(prev => ({ ...prev, tax_id: value }))}
                  options={taxesData.data.map((tax: Tax) => ({
                    value: tax.id,
                    label: `${tax.name} - ${tax.rate}%`
                  }))}
                />
              )}

            </div>
          )}

          {activeTab === 2 && (
            <div className='add-items-form-container'>
              <ImageUpload
                images={formData.images ?? []}
                handleImageChange={handleImageChange}
                handleClearImages={handleClearImages}
                handleRemoveImage={handleRemoveImage}
              />

              <DatePickerField
                label="Purchase Date"
                selectedDate={formData.purchase_date || null}
                onChange={(date) => setFormData(prev => ({ ...prev, purchase_date: date }))}
                maxDate={new Date()}
              />

              <DatePickerField
                label="Date Of Manufacture*"
                selectedDate={formData.date_of_manufacture || null}
                onChange={(date) => setFormData(prev => ({ ...prev, date_of_manufacture: date }))}
                maxDate={new Date()}
                required
              />

              <DatePickerField
                label="Date Of Expiry"
                selectedDate={formData.date_of_expiry || null}
                onChange={(date) => setFormData(prev => ({ ...prev, date_of_expiry: date }))}
                minDate={new Date()}
              />
            </div>
          )}

          {activeTab === 3 && (
            <div className='categories-container'>
              <ItemCategories
                setSelectedCategories={setSelectedCategories}
                selectedCategories={selectedCategories}
              />
            </div>
          )}

          {activeTab === 4 && (
            <div className="items-tab-container">
              <ItemsTab setVariants={setVariants} variants={variants} />
            </div>
          )}
        </Box>

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