'use client';
import React, { useEffect, useState } from 'react';
import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
import { useRouter } from 'next/navigation';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import { useCompany } from '@/utils/Company';
import Link from 'next/link';
import { useCallback } from "react";
import { FaArrowLeft } from 'react-icons/fa';
import { FormInput } from '@/components/common/FormInput';
import { FormSelect } from '@/components/common/FormSelect';
import DatePickerField from '@/components/common/DatePickerField';
import AddVendor from '../components/AddVendor';
import ImageUpload from '../components/ImageUpload';
import ItemsTab from '../components/ItemsTab';
import ItemCategories from '../components/ItemCategories';
import { Tabs, Tab } from '@mui/material';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { FiXCircle } from 'react-icons/fi';

const LOCAL_STORAGE_KEY = 'storeItemForm';

const getDefaultFormData = (): CreateStoreItemRequest => ({
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

const AddItem: React.FC = () => {
  const [createStoreItem, { isLoading }] = useCreateStoreItemMutation();
  const { currentData: vendorsData } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();
  const router = useRouter();
  const { companySlug } = useCompany();
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState<CreateStoreItemRequest>(getDefaultFormData());

  const [vendors, setVendors] = useState<string[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [tabCompletion, setTabCompletion] = useState<boolean[]>([true, false, false, false, false]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const savedFormData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedFormData) {
      const parsed = JSON.parse(savedFormData);
      delete parsed.images;
      setFormData(prev => ({ ...prev, ...parsed }));

      if (parsed.categories) {
        setSelectedCategories(parsed.categories);
      }
    }

    if (vendorsData) {
      setVendors(vendorsData.map((vendor: { vendor_name: string }) => vendor.vendor_name));
    }
  }, [vendorsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    const { ...rest } = updated;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rest));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    const newFormData = { ...formData, [name]: isNaN(numValue) ? 0 : numValue };
    setFormData(newFormData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newFormData));
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

  const handleCategoryChange = (categories: Category[]) => {
    setSelectedCategories(categories);

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    const updated = { ...existing, categories };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };



const validateTab = useCallback((index: number): boolean => {
  switch (index) {
    case 0:
      return formData.name.trim() !== '' &&
             formData.brand_name.trim() !== '' &&
             (formData.vendor_name?.trim() ?? '') !== '';
    case 1:
      return formData.cost_price > 0 &&
             formData.selling_price > 0 &&
             formData.quantity_count > 0;
    case 2:
      return formData.date_of_manufacture !== '';
    case 3:
      return selectedCategories.length > 0;
    case 4:
      return variants && variants.length > 0;
    default:
      return false;
  }
}, [formData, selectedCategories, variants]);


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
  }, [formData, variants, selectedCategories, activeTab, validateTab]);

  const handleClearForm = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setFormData(getDefaultFormData());
    setShowConfirm(false);
    setActiveTab(0)
  };
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
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setFormData(getDefaultFormData());
      router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  return (
  <div className='store_outer_row'>
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
            variant="scrollable"
            scrollButtons="auto"
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
            <Tab label="Categories" disabled={!tabCompletion[3]} />
            <Tab label="Product Options" disabled={!tabCompletion[4]} />
          </Tabs>


        </div>

      
          <div className='store_left_column store_column store_column'>
            <div className='add-items-form-container'>
              <h2 className='basic_label'>Basic Name</h2>
              <hr></hr>
              <div className='store_input_feilds'>
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
                  onVendorSelect={(vendorName) => {
                    setFormData(prev => {
                      const updated = { ...prev, vendor_name: vendorName };
                      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                      return updated;
                    });
                  }}
                  onVendorAdded={(vendorName) => {
                    setVendors(prev => [...prev, vendorName]);
                    setFormData(prev => {
                      const updated = { ...prev, vendor_name: vendorName };
                      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            </div>
            </div>
          

          
            <div className='add-items-form-container store_column'>
              <h2 className='basic_label'>Pricing & Inventory</h2>
              <hr></hr>
                <div className='store_input_feilds'>
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
                  onChange={(value) => {
                    const updated = { ...formData, tax_id: value };
                    setFormData(updated);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                  }}
                  options={taxesData.data.map((tax: Tax) => ({
                    value: tax.id,
                    label: `${tax.name} - ${tax.rate}%`
                  }))}
                />
              )}
            </div>
            </div>
         

          
            <div className='add-items-form-container store_column'>
              <h2 className='basic_label'>Media & Dates</h2>
              <hr></hr>
                <div className='store_input_feilds'>
              <ImageUpload
                images={formData.images}
                handleImageChange={handleImageChange}
                handleClearImages={() => setFormData(prev => ({ ...prev, images: [] }))}
                handleRemoveImage={handleRemoveImage}
              />

              <DatePickerField
                label="Purchase Date"
                selectedDate={formData.purchase_date || null}
                onChange={(date) => {
                  const updated = { ...formData, purchase_date: date };
                  setFormData(updated);
                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                }}
                maxDate={new Date()}
              />

              <DatePickerField
                label="Date Of Manufacture*"
                selectedDate={formData.date_of_manufacture || null}
                onChange={(date) => {
                  const updated = { ...formData, date_of_manufacture: date };
                  setFormData(updated);
                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                }}
                maxDate={new Date()}
                required
              />

              <DatePickerField
                label="Date Of Expiry"
                selectedDate={formData.date_of_expiry || null}
                onChange={(date) => {
                  const updated = { ...formData, date_of_expiry: date };
                  setFormData(updated);
                  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                }}
                minDate={new Date()}
              />
            </div>
            </div>
         

          
           
         

          
            <div className="items-tab-container store_column">
              <h2 className='basic_label'>Media & Dates</h2>
              <hr></hr>
              <ItemsTab setVariants={setVariants} variants={variants} />
            </div>
        

        <ConfirmDialog
          isOpen={showConfirm}
          message="Are you sure you want to clear the form?"
          onConfirm={handleClearForm}
          onCancel={() => setShowConfirm(false)}
          type="clear"
        />
        <span className="clear-button" onClick={() => setShowConfirm(true)}><FiXCircle /></span>

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

    <div className='right_sidebar_row'>

     <div className='categories-container store_column'>
              
               <div className='store_input_feilds'>
              <ItemCategories
                setSelectedCategories={handleCategoryChange}
                selectedCategories={selectedCategories}
              />
            </div>
            </div>
    </div>


    </div>  
  );
};

export default AddItem;