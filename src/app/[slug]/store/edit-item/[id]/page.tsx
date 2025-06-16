'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices/store/storeApi';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useFetchTaxesQuery } from '@/slices/company/companyApi';
import { useCompany } from '@/utils/Company';
import { toast } from 'react-toastify';
import StoreItemFields from '../../components/StoreItemFields';
import LoadingState from '@/components/common/LoadingState';

const UpdateItem = () => {
  const { id } = useParams() as { id: string };
  const { companySlug } = useCompany();
  const router = useRouter();
  const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
  const { currentData: vendors } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const getDefaultFormData = (): UpdateStoreItemRequest => ({
    id: Number(id),
    name: '',
    quantity_count: 0,
    measurement: '',
    purchase_date: '',
    date_of_manufacture: '',
    date_of_expiry: '',
    brand_name: '',
    brand_id: null,
    replacement: '',
    category: '',
    vendor_name: '',
    availability_stock: 0,
    cost_price: 0,
    regular_price: 0,
    sale_price: 0,
    tax_id: 0,
    unit_id: 0,
    unit_of_measure: 'pieces',
    pieces_per_unit: null,
    per_unit_cost: null,
    images: [],
    variants: [],
    categories: [],
    featured_image: null,
    product_type: 'simple_product',
    vendor_id: null
  });

  const [formData, setFormData] = useState<UpdateStoreItemRequest>(getDefaultFormData());
  const [originalItemData, setOriginalItemData] = useState<UpdateStoreItemRequest | null>(null);
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    if (vendors) {
      setVendorsList(vendors)
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
        brand_id: item.brand_id || 0,
        replacement: item.replacement || '',
        category: item.category || '',
        vendor_name: item.vendor_name || '',
        availability_stock: item.availability_stock || 0,
        cost_price: item.cost_price || 0,
        regular_price: item.regular_price || 0,
        sale_price: item.sale_price || 0,
        tax_id: (item.taxes && item.taxes.length > 0 && item.taxes[0]?.id) ? item.taxes[0].id : 0,
        unit_id: (item.units && item.units.length > 0 && item.units[0]?.id) ? item.units[0].id : 0,
        unit_of_measure: item.unit_of_measure || 'pieces',
        pieces_per_unit: item.pieces_per_unit ?? null,
        per_unit_cost: item.per_unit_cost ?? null,
        images: Array.isArray(item.images) ? item.images : [],
        variants: item.variants || [],
        categories: item.categories ? item.categories.map((cat: Category) => cat.id) : [],
        featured_image: item.featured_image ?? null,
        product_type: item.product_type || 'simple_product',
        vendor_id: item.vendor_id != null ? item.vendor_id : null
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
  }, [hasUnsavedChanges, router, companySlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentImages = formData.images || [];
      const allowedFiles = files.slice(0, 5 - currentImages.length);
      const updatedImages = [...currentImages, ...allowedFiles];
      setFormData(prev => ({ ...prev, images: updatedImages }));
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageUrl = formData.images[index];
    if (typeof imageUrl === 'string') {
      setRemovedImages((prev) => [...prev, imageUrl]);
    }
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updatedImages };
    });
    setHasUnsavedChanges(true);
  };

  const handleClearImages = () => {
    setFormData(prev => ({ ...prev, images: [] }));
    setHasUnsavedChanges(true);
  };

  const isFormModified = (): boolean => {
    if (!originalItemData) return false;

    const primitiveFields: (keyof UpdateStoreItemRequest)[] = [
      'name', 'quantity_count', 'measurement', 'purchase_date',
      'date_of_manufacture', 'date_of_expiry', 'brand_name', 'brand_id',
      'replacement', 'category', 'vendor_name', 'availability_stock',
      'cost_price', 'sale_price', 'tax_id', 'product_type',
      'unit_of_measure', 'pieces_per_unit', 'per_unit_cost'
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
    const featuredImageChanged =
      (formData.featured_image instanceof File) ||
      (originalItemData.featured_image && !formData.featured_image) ||
      (typeof originalItemData.featured_image === 'string' &&
        typeof formData.featured_image === 'string' &&
        originalItemData.featured_image !== formData.featured_image);

    return categoriesChanged || variantsChanged || imagesChanged || featuredImageChanged;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originalItemData) return;

    const formdata = new FormData();
    formdata.append('_method', 'PUT');
    formdata.append('id', formData.id.toString());

    const primitiveFields = [
      'name', 'quantity_count', 'measurement', 'purchase_date',
      'date_of_manufacture', 'date_of_expiry', 'brand_name', 'brand_id',
      'replacement', 'category', 'vendor_name', 'availability_stock',
      'cost_price', 'sale_price', 'tax_id', 'product_type', 'unit_of_measure'
    ];

    primitiveFields.forEach((field) => {
      const key = field as keyof UpdateStoreItemRequest;
      const value = formData[key];
      const originalValue = originalItemData[key];

      if (value !== originalValue) {
        formdata.append(field, value?.toString() ?? '');
      }
    });

    if (formData.unit_of_measure === 'unit') {
      if (formData.pieces_per_unit !== originalItemData.pieces_per_unit) {
        formdata.append('pieces_per_unit', formData.pieces_per_unit?.toString() ?? '');
      }
      if (formData.per_unit_cost !== originalItemData.per_unit_cost) {
        formdata.append('per_unit_cost', formData.per_unit_cost?.toString() ?? '');
      }
    }

    formdata.delete('categories[]');
    formData.categories.forEach((catId) => {
      formdata.append('categories[]', catId.toString());
    });

    const newImages = formData.images.filter((img) => img instanceof File);
    if (newImages.length > 0) {
      newImages.forEach((img) => formdata.append('images[]', img));
    }

    if (formData.featured_image instanceof File) {
      formdata.append('featured_image', formData.featured_image);
    }

    removedImages.forEach((imageUrl) => formdata.append('removed_images[]', imageUrl));

    if (JSON.stringify(variants) !== JSON.stringify(originalItemData.variants)) {
      variants.forEach((variant, i) => {
        formdata.append(`variants[${i}][regular_price]`, variant.regular_price.toString());
        formdata.append(`variants[${i}][sale_price]`, variant.sale_price.toString());

        // Add unit-specific fields for variants when unit_of_measure is 'unit'
        if (formData.unit_of_measure === 'unit') {
          if (variant.stock !== undefined && variant.stock !== null) {
            formdata.append(`variants[${i}][stock]`, variant.stock.toString());
          }
          if (variant.pieces_per_unit !== undefined && variant.pieces_per_unit !== null) {
            formdata.append(`variants[${i}][pieces_per_unit]`, variant.pieces_per_unit.toString());
          }
          if (variant.per_unit_cost !== undefined && variant.per_unit_cost !== null) {
            formdata.append(`variants[${i}][per_unit_cost]`, variant.per_unit_cost.toString());
          }
        }

        variant.attributes?.forEach((attr, j) => {
          formdata.append(`variants[${i}][attributes][${j}][attribute_id]`, attr.attribute_id.toString());
          formdata.append(`variants[${i}][attributes][${j}][attribute_value_id]`, attr.attribute_value_id.toString());
        });
      });
    }

    try {
      await updateStoreItem({ id: formData.id, formdata }).unwrap();
      toast.success('Item updated successfully!');
      setHasUnsavedChanges(false);
      router.back();
    } catch (err) {
      console.error('Error updating item:', err);
      toast.error('Failed to update item.');
    }
  };

  if (isItemLoading) return <LoadingState />;

  return (
    <StoreItemFields
      formData={formData}
      setFormData={setFormData}
      vendors={vendorsList}
      selectedVendorId={formData.vendor_id || null}
      onVendorSelect={(vendorId) => {
        const vendor = vendorsList.find(v => v.id === vendorId);
        setFormData(prev => ({
          ...prev,
          vendor_id: vendorId,
          vendor_name: vendor?.vendor_name || ''
        }));
      }}
      onVendorAdded={(newVendor) => {
        setVendorsList(prev => [...prev, newVendor]);
        setFormData(prev => ({
          ...prev,
          vendor_id: newVendor.id,
          vendor_name: newVendor.vendor_name
        }));
      }}
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
      isEditMode={true}
      isFormModified={isFormModified}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};

export default UpdateItem;