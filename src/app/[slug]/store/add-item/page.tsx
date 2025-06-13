'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useCreateStoreItemMutation } from '@/slices';
import { useRouter } from 'next/navigation';
import { useFetchVendorsQuery } from '@/slices';
import { useFetchMeasuringUnitsQuery, useFetchTaxesQuery } from '@/slices';
import { useCompany } from '@/utils/Company';
import StoreItemFields from '../components/StoreItemFields';
import { toast } from 'react-toastify';

const getDefaultFormData = (): CreateStoreItemRequest => ({
  name: '',
  quantity_count: 0,
  measurement: '',
  purchase_date: '',
  date_of_manufacture: '',
  date_of_expiry: '',
  replacement: '',
  category: '',
  vendor_id: null,
  vendor_name: '',
  availability_stock: 0,
  cost_price: 0,
  regular_price: 0,
  sale_price: 0,
  tax_id: 0,
  unit_id: 0,
  images: [],
  variants: [],
  categories: [],
  featured_image: null,
  product_type: 'simple_product'
})

const AddItem: React.FC = () => {
  const [createStoreItem, { isLoading: isCreating }] = useCreateStoreItemMutation();
  const { currentData: vendorsData } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();
  const { data: measuringUnits } = useFetchMeasuringUnitsQuery();
  const router = useRouter();
  const { companySlug } = useCompany();
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState<CreateStoreItemRequest>(getDefaultFormData());
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [tabCompletion, setTabCompletion] = useState<boolean[]>([true, false, false, false, false]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (vendorsData) {
      setVendors(vendorsData)
    }
  }, [vendorsData]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const warningText = 'You have unsaved changes - are you sure you wish to leave this page?';
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = warningText;
      return warningText;
    };

    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [hasUnsavedChanges]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    setHasUnsavedChanges(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 5);
      const updatedImages = [...formData.images, ...newImages].slice(-5);
      setFormData(prev => ({ ...prev, images: updatedImages }));
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const handleCategoryChange = (categories: Category[]) => {
    setSelectedCategories(categories);
    setHasUnsavedChanges(true);
  };

  const validateTab = useCallback((index: number): boolean => {
    switch (index) {
      case 0:
        return formData.name.trim() !== '' &&
          (formData.vendor_name?.trim() ?? '') !== '';
      case 1:
        return formData.cost_price > 0 &&
          (formData.regular_price ?? 0) > 0 &&
          (formData.sale_price ?? 0) > 0 &&
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

    if (!newTabCompletion[activeTab]) {
      const lastValidTab = newTabCompletion.lastIndexOf(true);
      setActiveTab(lastValidTab);
    }
  }, [formData, variants, selectedCategories, activeTab, validateTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();

    // Append simple fields
    Object.entries(formData).forEach(([key, val]) => {
      if (key !== 'images' && key !== 'featured_image' && key !== 'regular_price' && key !== 'sale_price' && val !== null && val !== undefined) {
        if (key === 'brand_name' && formData.brand_id) {
          form.append('brand_id', formData.brand_id.toString());
        }
        form.append(key, val.toString());
      }
    });

    // For simple products, append regular_price and sale_price
    if (formData.product_type === 'simple_product') {
      if (formData.regular_price) {
        form.append('regular_price', formData.regular_price.toString());
      }
      if (formData.sale_price) {
        form.append('sale_price', formData.sale_price.toString());
      }
    }

    // Append images
    formData.images.forEach(img => form.append('images[]', img));
    if (formData.featured_image instanceof File) {
      form.append('featured_image', formData.featured_image);
    }

    // For variable products, append variants
    if (formData.product_type === 'variable_product' && variants.length > 0) {
      variants.forEach((variant, i) => {
        form.append(`variants[${i}][regular_price]`, variant.regular_price.toString());
        form.append(`variants[${i}][sale_price]`, variant.sale_price.toString());
        variant.attributes?.forEach((attr, attrIndex) => {
          form.append(`variants[${i}][attributes][${attrIndex}][attribute_id]`, attr.attribute_id.toString());
          form.append(`variants[${i}][attributes][${attrIndex}][attribute_value_id]`, attr.attribute_value_id.toString());
        });
      });
    }

    // Append categories
    selectedCategories.forEach(cat => form.append('categories[]', cat.id.toString()));

    try {
      const response = await createStoreItem(form).unwrap();
      if (response.success === true) {
        toast.success(response.message || 'Item created successfully.');
        setFormData(getDefaultFormData());
        setHasUnsavedChanges(false);
        router.push(`/${companySlug}/store`);
      } else {
        toast.error(response.message || response.error || 'Failed to create item.');
      }
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

  return (
    <StoreItemFields
      formData={formData}
      setFormData={setFormData}
      vendors={vendors}
      selectedVendorId={formData.vendor_id || null}
      onVendorSelect={(vendorId) => {
        const vendor = vendors.find(v => v.id === vendorId);
        setFormData(prev => ({
          ...prev,
          vendor_id: vendorId,
          vendor_name: vendor?.vendor_name || ''
        }));
      }}
      onVendorAdded={(newVendor) => {
        setVendors(prev => [...prev, newVendor]);
        setFormData(prev => ({
          ...prev,
          vendor_id: newVendor.id,
          vendor_name: newVendor.vendor_name
        }));
      }}
      handleChange={handleChange}
      handleNumberChange={handleNumberChange}
      handleImageChange={handleImageChange}
      handleClearImages={() => setFormData(prev => ({ ...prev, images: [] }))}
      handleRemoveImage={handleRemoveImage}
      taxesData={taxesData}
      measuringUnits={measuringUnits}
      selectedCategories={selectedCategories}
      setSelectedCategories={handleCategoryChange}
      variants={variants}
      setVariants={setVariants}
      handleSubmit={handleSubmit}
      companySlug={companySlug}
      isLoading={isCreating}
      isEditMode={false}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabCompletion={tabCompletion}
    />
  );
};

export default AddItem;