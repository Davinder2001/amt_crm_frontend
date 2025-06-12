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
  vendor_name: '',
  availability_stock: 0,
  cost_price: 0,
  regular_price: 0,
  selling_price: 0,
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
  const [vendors, setVendors] = useState<string[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [tabCompletion, setTabCompletion] = useState<boolean[]>([true, false, false, false, false]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (vendorsData) {
      setVendors(vendorsData.map((vendor: { vendor_name: string }) => vendor.vendor_name));
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
          (formData.selling_price ?? 0) > 0 &&
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
      if (key !== 'images' && key !== 'featured_image' && val !== null && val !== undefined) {
        if (key === 'brand_name' && formData.brand_id) {
          form.append('brand_id', formData.brand_id.toString());
        }
        form.append(key, val.toString());
      }
    });

    // Append images
    formData.images.forEach(img => form.append('images[]', img));
    if (formData.featured_image instanceof File) {
      form.append('featured_image', formData.featured_image);
    }

    // Append variants
    variants.forEach((variant, i) => {
      form.append(`variants[${i}][selling_price]`, variant.selling_price.toString());
      variant.attributes?.forEach((attr, attrIndex) => {
        form.append(`variants[${i}][attributes][${attrIndex}][attribute_id]`, attr.attribute_id.toString());
        form.append(`variants[${i}][attributes][${attrIndex}][attribute_value_id]`, attr.attribute_value_id.toString());
      });
    });

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
      setVendors={setVendors}
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