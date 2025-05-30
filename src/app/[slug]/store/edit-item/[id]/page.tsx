'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices/store/storeApi';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import { useCompany } from '@/utils/Company';
import { toast } from 'react-toastify';
import StoreItemFields from '../../components/StoreItemFields';

const UpdateItem = () => {
  const { id } = useParams() as { id: string };
  const { companySlug } = useCompany();
  const router = useRouter();
  const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, {isLoading : isUpdating}] = useUpdateStoreItemMutation();
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

  const isFormModified = (): boolean => {
    if (!originalItemData) return false;

    const primitiveFields: (keyof UpdateStoreItemRequest)[] = [
      'name', 'quantity_count', 'measurement', 'purchase_date',
      'date_of_manufacture', 'date_of_expiry', 'brand_name',
      'replacement', 'category', 'vendor_name', 'availability_stock',
      'cost_price', 'selling_price', 'tax_id'
    ];

    for (const field of primitiveFields) {
      if (formData[field] !== originalItemData[field]) {
        return true;
      }
    }

    const categoriesChanged =
      JSON.stringify(formData.categories) !== JSON.stringify(originalItemData.categories);
    const variantsChanged =
      JSON.stringify(variants) !== JSON.stringify(originalItemData.variants);
    const newImages = formData.images.filter((img) => img instanceof File);
    const imagesChanged = newImages.length > 0 || removedImages.length > 0;

    return categoriesChanged || variantsChanged || imagesChanged;
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
      router.back(); // 
      // router.push(`/${companySlug}/store`);
    } catch (err) {
      console.error('Error updating item:', err);
      toast.error('Failed to update item.');
    }
  };


  if (isItemLoading) return <p>Loading item details...</p>;

  return (
    <>
      <StoreItemFields
        formData={formData}
        setFormData={setFormData}
        vendors={vendorsList}
        setVendors={setVendorsList}
        handleChange={handleChange}
        handleNumberChange={handleChange}
        handleImageChange={handleImageChange}
        handleClearImages={handleClearImages}
        handleRemoveImage={handleRemoveImage}
        taxesData={taxesData}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        variants={variants}
        setVariants={setVariants}
        handleSubmit={handleSubmit}
        companySlug={companySlug}
        isLoading={isUpdating}
        isEditMode={true} // or false
        isFormModified={isFormModified}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </>
  );
};

export default UpdateItem;