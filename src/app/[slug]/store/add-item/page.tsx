'use client';
import React, { useEffect, useState } from 'react';
import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
import { useRouter } from 'next/navigation';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { FormInput } from '@/components/common/FormInput';
import { FormSelect } from '@/components/common/FormSelect';
import DatePickerField from '@/components/common/DatePickerField';
import AddVendor from '../components/AddVendor';
import ImageUpload from '../components/ImageUpload';
import ItemsTab from '../components/ItemsTab';
import ItemCategories from '../components/ItemCategories';
import { Tabs, Tab, Box } from '@mui/material';

const AddItem: React.FC = () => {
  const [createStoreItem, { isLoading }] = useCreateStoreItemMutation();
  const { currentData: vendorsData } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();
  const router = useRouter();
  const { companySlug } = useCompany();
  const [activeTab, setActiveTab] = useState(0);

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
    tax_id: 0,
    images: [],
    variants: [],
    categories: [],
  });

  const [vendors, setVendors] = useState<string[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [tabCompletion, setTabCompletion] = useState<boolean[]>([true, false, false, false, false]);

  useEffect(() => {
    if (vendorsData) {
      setVendors(vendorsData.map((vendor: { vendor_name: string }) => vendor.vendor_name));
    }
  }, [vendorsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 5);
      const updatedImages = [...formData.images, ...newImages].slice(-5);
      setFormData(prev => ({ ...prev, images: updatedImages }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateTab = (index: number): boolean => {
    switch (index) {
      case 0:
        return formData.name.trim() !== '' && formData.brand_name.trim() !== '' && (formData.vendor_name?.trim() ?? '') !== '';
      case 1:
        return formData.cost_price > 0 && formData.selling_price > 0 && formData.quantity_count > 0;
      case 2:
        return formData.date_of_manufacture !== '';
      case 3:
        return variants && variants.length > 0;
      case 4:
        return selectedCategories.length > 0;
      default:
        return false;
    }
  };

  useEffect(() => {
    const newTabCompletion = [true]; // First tab is always enabled
    for (let i = 0; i < 4; i++) {
      if (validateTab(i)) {
        newTabCompletion[i + 1] = true;
      } else {
        break; // stop checking further if a previous tab is invalid
      }
    }

    setTabCompletion(newTabCompletion);

    // If current tab is no longer valid, go back to the last valid one
    if (!newTabCompletion[activeTab]) {
      const lastValidTab = newTabCompletion.lastIndexOf(true);
      setActiveTab(lastValidTab);
    }
  }, [formData, variants, selectedCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      await createStoreItem(form).unwrap();
      router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  return (
    <div className='store-add-item'>
      <form onSubmit={handleSubmit}>
        <div className="add-item-header">
          <Link href={`/${companySlug}/store`} className='back-button'>
            <FaArrowLeft size={16} color='#fff' />
          </Link>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              if (tabCompletion[newValue]) setActiveTab(newValue);
            }}
            style={{ backgroundColor: '#f1f9f9' }}
            sx={{
              '& .MuiTab-root': {
                color: '#009693',
                '&.Mui-disabled': {
                  color: '#ccc',
                },
                '&.Mui-selected': {
                  color: '#009693',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#009693',
              },
            }}
          >
            <Tab label="Basic Info" disabled={!tabCompletion[0]} />
            <Tab label="Pricing & Inventory" disabled={!tabCompletion[1]} />
            <Tab label="Media & Dates" disabled={!tabCompletion[2]} />
            <Tab label="Product Options" disabled={!tabCompletion[3]} />
            <Tab label="Categories" disabled={!tabCompletion[4]} />
          </Tabs>


        </div>

        <Box>
          {activeTab === 0 && (
            <div className='add-items-form-container'>
              <FormInput
                label="Item Name*"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Samsung Monitor 24 inch"
                required
              />

              <FormInput
                label="Brand Name*"
                name="brand_name"
                value={formData.brand_name}
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
                  vendors={vendors}
                  selectedVendor={formData.vendor_name || ''}
                  onVendorSelect={(vendorName) => setFormData(prev => ({ ...prev, vendor_name: vendorName }))}
                  onVendorAdded={(vendorName) => {
                    setVendors(prev => [...prev, vendorName]);
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
                value={formData.cost_price || ''}
                onChange={handleNumberChange}
                placeholder="e.g. 250.00"
                required
              />

              <FormInput
                label="Selling Price*"
                name="selling_price"
                type="number"
                value={formData.selling_price || ''}
                onChange={handleNumberChange}
                placeholder="e.g. 300.00"
                required
              />

              <FormInput
                label="Quantity Count*"
                name="quantity_count"
                type="number"
                value={formData.quantity_count || ''}
                onChange={handleNumberChange}
                placeholder="e.g. 100"
                required
              />

              <FormInput
                label="Availability Stock"
                name="availability_stock"
                type="number"
                value={formData.availability_stock || ''}
                onChange={handleNumberChange}
                placeholder="e.g. 50"
              />

              {taxesData?.data && (
                <FormSelect<number>
                  label="Tax"
                  name="tax_id"
                  value={formData.tax_id}
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
                images={formData.images}
                handleImageChange={handleImageChange}
                handleClearImages={() => setFormData(prev => ({ ...prev, images: [] }))}
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
            <div className="items-tab-container">
              <ItemsTab setVariants={setVariants} variants={variants} />
            </div>
          )}

          {activeTab === 4 && (
            <div className='categories-container'>
              <ItemCategories
                setSelectedCategories={setSelectedCategories}
                selectedCategories={selectedCategories}
              />
            </div>
          )}
        </Box>

        <div className='save-cancel-button' style={{ flex: '1 1 100%', marginTop: '1rem' }}>
          <button
            type="button"
            className='buttons'
            style={{ marginLeft: '1rem' }}
            onClick={() => router.push(`/${companySlug}/store`)}
          >
            Cancel
          </button>
          <button type="submit" className='buttons' disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;