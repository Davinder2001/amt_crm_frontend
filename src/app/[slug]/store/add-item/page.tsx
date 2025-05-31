'use client';
import React, { useEffect, useState } from 'react';
import { useCreateStoreItemMutation } from '@/slices/store/storeApi';
import { useRouter } from 'next/navigation';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import { useCompany } from '@/utils/Company';
import { useCallback } from "react";
import StoreItemFields from '../components/StoreItemFields';

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
  const [createStoreItem, { isLoading: isCreating }] = useCreateStoreItemMutation();
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
    <>
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
        selectedCategories={selectedCategories}
        setSelectedCategories={handleCategoryChange}
        variants={variants}
        setVariants={setVariants}
        handleSubmit={handleSubmit}
        companySlug={companySlug}
        isLoading={isCreating}
        isEditMode={false} // or false
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCompletion={tabCompletion}
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        handleClearForm={handleClearForm}
      />

    </>
  );
};

export default AddItem;