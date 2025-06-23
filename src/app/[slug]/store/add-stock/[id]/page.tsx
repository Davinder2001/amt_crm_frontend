'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCreateItemBatchMutation, useFetchStoreItemQuery } from '@/slices';
import { useFetchMeasuringUnitsQuery, useFetchTaxesQuery } from '@/slices';
import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
import { useCompany } from '@/utils/Company';
import { toast } from 'react-toastify';
import StoreItemFields from '../../components/StoreItemFields';
import LoadingState from '@/components/common/LoadingState';

const Createbatch = () => {
  const { id } = useParams();
  const { companySlug } = useCompany();
  const router = useRouter();
  const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
  const [createItemBatch, { isLoading: isCreating }] = useCreateItemBatchMutation();
  const { currentData: vendors } = useFetchVendorsQuery();
  const { data: taxesData } = useFetchTaxesQuery();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { data: measuringUnitsResponse } = useFetchMeasuringUnitsQuery();
  const measuringUnits = measuringUnitsResponse?.units || [];

  const getDefaultFormData = (): StoreItemBatchRequest => ({
    id: Number(id),
    name: '',
    quantity_count: 0,
    measurement: null,
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
    tax_id: null,
    unit_of_measure: 'pieces',
    units_in_peace: null,
    price_per_unit: null,
    images: [],
    categories: [],
    featured_image: null,
    product_type: 'simple_product',
    vendor_id: null
  });

  const [formData, setFormData] = useState<StoreItemBatchRequest>(getDefaultFormData());
  const [originalItemData, setOriginalItemData] = useState<StoreItemBatchRequest | null>(null);
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
  const [variants, setVariants] = useState<variations[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0);

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
        measurement: item.measurement?.id || null,
        unit_of_measure: item.unit_of_measure || 'pieces',
        units_in_peace: item.units_in_peace ?? null,
        price_per_unit: item.price_per_unit ?? null,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originalItemData) return;
    const formdata = new FormData();
    formdata.append('item_id', formData.id.toString());

    // Primitive fields to track changes and append
    const primitiveFields: (keyof StoreItemBatchRequest)[] = [
      'quantity_count', 'purchase_date',
      'date_of_manufacture', 'date_of_expiry',
      'replacement', 'vendor_id', 'vendor_name', 'availability_stock',
      'cost_price', 'units_in_peace', 'price_per_unit',
    ];

    primitiveFields.forEach((field) => {
      const value = formData[field];
      const originalValue = originalItemData[field];

      // Only append if changed
      if (value !== originalValue) {
        formdata.append(field as string, value?.toString() ?? '');
      }
    });

    // Always send product_type
    formdata.append('product_type', formData.product_type?.toString() ?? '');
    formdata.append('unit_of_measure', formData.unit_of_measure?.toString() ?? '');

    // For simple products, append regular_price and sale_price
    if (formData.product_type === 'simple_product') {
      if (formData.regular_price) {
        formdata.append('regular_price', formData.regular_price.toString());
      }
      if (formData.sale_price) {
        formdata.append('sale_price', formData.sale_price.toString());
      }
    }

    // Variants (compare deeply then append if changed)
    if (JSON.stringify(variants) !== JSON.stringify(originalItemData.variants)) {
      variants.forEach((variant, i) => {
        formdata.append(`variants[${i}][variant_regular_price]`, variant.variant_regular_price.toString());
        formdata.append(`variants[${i}][variant_sale_price]`, variant.variant_sale_price.toString());
        formdata.append(`variants[${i}][variant_stock]`, variant.variant_stock.toString());

        if (formData.unit_of_measure === 'unit') {
          if (variant.variant_units_in_peace != null) {
            formdata.append(`variants[${i}][variant_units_in_peace]`, variant.variant_units_in_peace.toString());
          }
          if (variant.variant_price_per_unit != null) {
            formdata.append(`variants[${i}][variant_price_per_unit]`, variant.variant_price_per_unit.toString());
          }
        }

        variant.attributes?.forEach((attr, j) => {
          formdata.append(`variants[${i}][attributes][${j}][attribute_id]`, attr.attribute_id.toString());
          formdata.append(`variants[${i}][attributes][${j}][attribute_value_id]`, attr.attribute_value_id.toString());
        });
      });
    }

    // Submit
    try {
      await createItemBatch(formdata).unwrap();
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
      taxesData={taxesData}
      measuringUnits={measuringUnits}
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
      variants={variants}
      setVariants={setVariants}
      handleSubmit={handleSubmit}
      companySlug={companySlug}
      isLoading={isCreating}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isBatchMode={true}
    />
  );
};

export default Createbatch;