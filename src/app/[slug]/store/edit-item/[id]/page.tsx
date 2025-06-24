// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useFetchStoreItemQuery, useUpdateStoreItemMutation } from '@/slices';
// import { useFetchMeasuringUnitsQuery, useFetchTaxesQuery } from '@/slices';
// import { useFetchVendorsQuery } from '@/slices/vendor/vendorApi';
// import { useCompany } from '@/utils/Company';
// import { toast } from 'react-toastify';
// import StoreItemFields from '../../components/StoreItemFields';
// import LoadingState from '@/components/common/LoadingState';

// const UpdateItem = () => {
//   const { id } = useParams();
//   const { companySlug } = useCompany();
//   const router = useRouter();
//   const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
//   const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
//   const { currentData: vendors } = useFetchVendorsQuery();
//   const { data: taxesData } = useFetchTaxesQuery();
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const { data: measuringUnitsResponse } = useFetchMeasuringUnitsQuery();
//   const measuringUnits = measuringUnitsResponse?.units || [];

//   const getDefaultFormData = (): UpdateStoreItemRequest => ({
//     id: Number(id),
//     name: '',
//     quantity_count: 0,
//     measurement: null,
//     purchase_date: '',
//     date_of_manufacture: '',
//     date_of_expiry: '',
//     brand_name: '',
//     brand_id: null,
//     replacement: '',
//     category: '',
//     vendor_name: '',
//     availability_stock: 0,
//     cost_price: 0,
//     regular_price: 0,
//     sale_price: 0,
//     tax_id: null,
//     unit_of_measure: 'pieces',
//     units_in_peace: null,
//     price_per_unit: null,
//     images: [],
//     categories: [],
//     featured_image: null,
//     product_type: 'simple_product',
//     vendor_id: null
//   });

//   const [formData, setFormData] = useState<UpdateStoreItemRequest>(getDefaultFormData());
//   const [originalItemData, setOriginalItemData] = useState<UpdateStoreItemRequest | null>(null);
//   const [vendorsList, setVendorsList] = useState<Vendor[]>([]);
//   const [variants, setVariants] = useState<variations[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
//   const [activeTab, setActiveTab] = useState(0);
//   const [removedImages, setRemovedImages] = useState<string[]>([]);

//   useEffect(() => {
//     if (vendors) {
//       setVendorsList(vendors)
//     }
//   }, [vendors]);

//   useEffect(() => {
//     if (item) {
//       const initialData = {
//         id: item.id,
//         name: item.name || '',
//         quantity_count: item.quantity_count || 0,
//         purchase_date: item.purchase_date || '',
//         date_of_manufacture: item.date_of_manufacture || '',
//         date_of_expiry: item.date_of_expiry || '',
//         brand_name: item.brand_name || '',
//         brand_id: item.brand_id || 0,
//         replacement: item.replacement || '',
//         category: item.category || '',
//         vendor_name: item.vendor_name || '',
//         availability_stock: item.availability_stock || 0,
//         cost_price: item.cost_price || 0,
//         regular_price: item.regular_price || 0,
//         sale_price: item.sale_price || 0,
//         tax_id: (item.taxes && item.taxes.length > 0 && item.taxes[0]?.id) ? item.taxes[0].id : 0,
//         measurement: item.measurement?.id || null,
//         unit_of_measure: item.unit_of_measure || 'pieces',
//         units_in_peace: item.units_in_peace ?? null,
//         price_per_unit: item.price_per_unit ?? null,
//         images: Array.isArray(item.images) ? item.images : [],
//         variants: item.variants || [],
//         categories: item.categories ? item.categories.map((cat: Category) => cat.id) : [],
//         featured_image: item.featured_image ?? null,
//         product_type: item.product_type || 'simple_product',
//         vendor_id: item.vendor_id != null ? item.vendor_id : null
//       };
//       setFormData(initialData);
//       setOriginalItemData(initialData);
//       setVariants(item.variants || []);
//       setSelectedCategories(item.categories || []);
//     }
//   }, [item]);

//   useEffect(() => {
//     const categoryIds = selectedCategories.map(cat => cat.id);
//     setFormData(prev => ({
//       ...prev,
//       categories: categoryIds
//     }));
//   }, [selectedCategories]);

//   // Warn user before leaving page with unsaved changes
//   useEffect(() => {
//     const warningText = 'You have unsaved changes - are you sure you wish to leave this page?';
//     const handleWindowClose = (e: BeforeUnloadEvent) => {
//       if (!hasUnsavedChanges) return;
//       e.preventDefault();
//       e.returnValue = warningText;
//       return warningText;
//     };

//     window.addEventListener('beforeunload', handleWindowClose);

//     return () => {
//       window.removeEventListener('beforeunload', handleWindowClose);
//     };
//   }, [hasUnsavedChanges, router, companySlug]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setHasUnsavedChanges(true);
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       const currentImages = formData.images || [];
//       const allowedFiles = files.slice(0, 5 - currentImages.length);
//       const updatedImages = [...currentImages, ...allowedFiles];
//       setFormData(prev => ({ ...prev, images: updatedImages }));
//       setHasUnsavedChanges(true);
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     const imageUrl = formData.images[index];
//     if (typeof imageUrl === 'string') {
//       setRemovedImages((prev) => [...prev, imageUrl]);
//     }
//     setFormData((prev) => {
//       const updatedImages = prev.images.filter((_, i) => i !== index);
//       return { ...prev, images: updatedImages };
//     });
//     setHasUnsavedChanges(true);
//   };

//   const handleClearImages = () => {
//     setFormData(prev => ({ ...prev, images: [] }));
//     setHasUnsavedChanges(true);
//   };

//   const isFormModified = (): boolean => {
//     if (!originalItemData) return false;

//     const primitiveFields: (keyof UpdateStoreItemRequest)[] = ['name', 'quantity_count', 'measurement', 'purchase_date', 'date_of_manufacture', 'date_of_expiry', 'brand_name', 'brand_id', 'replacement', 'category', 'vendor_id', 'vendor_name', 'availability_stock', 'cost_price', 'regular_price', 'sale_price', 'product_type', 'unit_of_measure', 'units_in_peace', 'price_per_unit', 'tax_id'];

//     for (const field of primitiveFields) {
//       if (formData[field] !== originalItemData[field]) {
//         return true;
//       }
//     }

//     const categoriesChanged =
//       JSON.stringify(formData.categories) !== JSON.stringify(originalItemData.categories);
//     const variantsChanged =
//       JSON.stringify(variants) !== JSON.stringify(originalItemData.variants);
//     const newImages = formData.images.filter((img) => img instanceof File);
//     const imagesChanged = newImages.length > 0 || removedImages.length > 0;
//     const featuredImageChanged =
//       (formData.featured_image instanceof File) ||
//       (originalItemData.featured_image && !formData.featured_image) ||
//       (typeof originalItemData.featured_image === 'string' &&
//         typeof formData.featured_image === 'string' &&
//         originalItemData.featured_image !== formData.featured_image);

//     return categoriesChanged || variantsChanged || imagesChanged || featuredImageChanged;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!originalItemData) return;

//     const formdata = new FormData();
//     formdata.append('_method', 'PUT');
//     formdata.append('id', formData.id.toString());

//     // Primitive fields to track changes and append
//     const primitiveFields: (keyof UpdateStoreItemRequest)[] = [
//       'name', 'quantity_count', 'measurement', 'purchase_date',
//       'date_of_manufacture', 'date_of_expiry', 'brand_name', 'brand_id',
//       'replacement', 'category', 'vendor_id', 'vendor_name', 'availability_stock',
//       'cost_price', 'regular_price', 'sale_price', 'product_type', 'unit_of_measure',
//       'units_in_peace', 'price_per_unit', 'tax_id'
//     ];

//     primitiveFields.forEach((field) => {
//       const value = formData[field];
//       const originalValue = originalItemData[field];

//       // Only append if changed
//       if (value !== originalValue) {
//         formdata.append(field as string, value?.toString() ?? '');
//       }
//     });

//     // Categories (clear + append updated)
//     formdata.delete('categories[]');
//     formData.categories.forEach((catId) => {
//       formdata.append('categories[]', catId.toString());
//     });

//     // New images only
//     const newImages = formData.images.filter((img) => img instanceof File);
//     newImages.forEach((img) => formdata.append('images[]', img as File));

//     // Featured image if it's a new File
//     if (formData.featured_image instanceof File) {
//       formdata.append('featured_image', formData.featured_image);
//     }

//     // Removed images
//     removedImages.forEach((imageUrl) => {
//       formdata.append('removed_images[]', imageUrl);
//     });

//     // Variants (compare deeply then append if changed)
//     if (JSON.stringify(variants) !== JSON.stringify(originalItemData.variants)) {
//       variants.forEach((variant, i) => {
//         formdata.append(`variants[${i}][variant_regular_price]`, variant.variant_regular_price.toString());
//         formdata.append(`variants[${i}][variant_sale_price]`, variant.variant_sale_price.toString());
//         formdata.append(`variants[${i}][variant_stock]`, variant.variant_stock.toString());

//         if (formData.unit_of_measure === 'unit') {
//           if (variant.variant_units_in_peace != null) {
//             formdata.append(`variants[${i}][variant_units_in_peace]`, variant.variant_units_in_peace.toString());
//           }
//           if (variant.variant_price_per_unit != null) {
//             formdata.append(`variants[${i}][variant_price_per_unit]`, variant.variant_price_per_unit.toString());
//           }
//         }

//         variant.attributes?.forEach((attr, j) => {
//           formdata.append(`variants[${i}][attributes][${j}][attribute_id]`, attr.attribute_id.toString());
//           formdata.append(`variants[${i}][attributes][${j}][attribute_value_id]`, attr.attribute_value_id.toString());
//         });
//       });
//     }

//     // Submit
//     try {
//       await updateStoreItem({ id: formData.id, formdata }).unwrap();
//       toast.success('Item updated successfully!');
//       setHasUnsavedChanges(false);
//       router.back();
//     } catch (err) {
//       console.error('Error updating item:', err);
//       toast.error('Failed to update item.');
//     }
//   };

//   if (isItemLoading) return <LoadingState />;

//   return (
//     <StoreItemFields
//       formData={formData}
//       setFormData={setFormData}
//       vendors={vendorsList}
//       selectedVendorId={formData.vendor_id || null}
//       onVendorSelect={(vendorId) => {
//         const vendor = vendorsList.find(v => v.id === vendorId);
//         setFormData(prev => ({
//           ...prev,
//           vendor_id: vendorId,
//           vendor_name: vendor?.vendor_name || ''
//         }));
//       }}
//       onVendorAdded={(newVendor) => {
//         setVendorsList(prev => [...prev, newVendor]);
//         setFormData(prev => ({
//           ...prev,
//           vendor_id: newVendor.id,
//           vendor_name: newVendor.vendor_name
//         }));
//       }}
//       handleChange={handleChange}
//       handleNumberChange={handleChange}
//       handleImageChange={handleImageChange}
//       handleClearImages={handleClearImages}
//       handleRemoveImage={handleRemoveImage}
//       taxesData={taxesData}
//       measuringUnits={measuringUnits}
//       selectedCategories={selectedCategories}
//       setSelectedCategories={setSelectedCategories}
//       variants={variants}
//       setVariants={setVariants}
//       handleSubmit={handleSubmit}
//       companySlug={companySlug}
//       isLoading={isUpdating}
//       isEditMode={true}
//       isFormModified={isFormModified}
//       activeTab={activeTab}
//       setActiveTab={setActiveTab}
//     />
//   );
// };

// export default UpdateItem;














'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFetchMeasuringUnitsQuery, useFetchStoreItemQuery, useFetchTaxesQuery, useUpdateStoreItemMutation } from '@/slices';
import { useCompany } from '@/utils/Company';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { IconButton, Tooltip } from '@mui/material';
import useStickyWithOffset from '@/utils/StickyWithOffset';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { FormInput } from '@/components/common/FormInput';
import AddTax from '../../components/AddTax';
import MeasuringUnits from '../../components/MeasuringUnits';
import FeaturedImageUpload from '../../components/FeaturedImageUpload';
import ItemCategories from '../../components/ItemCategories';
import ItemBrands from '../../components/ItemBrands';
import ImageUpload from '../../components/ImageUpload';
import { useParams } from 'next/navigation';
import LoadingState from '@/components/common/LoadingState';

const AddItem: React.FC = () => {
  const { id } = useParams();
  const { companySlug } = useCompany();
  const router = useRouter();
  const { data: item, isLoading: isItemLoading } = useFetchStoreItemQuery(Number(id));
  const [updateStoreItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();
  const { data: taxesData } = useFetchTaxesQuery();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { data: measuringUnitsResponse } = useFetchMeasuringUnitsQuery();
  const measuringUnits = measuringUnitsResponse?.units || [];

  const getDefaultFormData = (): UpdateStoreItemRequest => ({
    id: Number(id),
    name: '',
    measurement: null,
    tax_id: null,
    images: [],
    categories: [],
    featured_image: null,
  });

  const [formData, setFormData] = useState<UpdateStoreItemRequest>(getDefaultFormData());
  const [originalItemData, setOriginalItemData] = useState<UpdateStoreItemRequest | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  useStickyWithOffset(headerRef, 30);

  useEffect(() => {
    if (item) {
      const initialData = {
        id: item.id,
        name: item.name || '',
        brand_id: item.brand_id || 0,
        tax_id: (item.taxes && item.taxes.length > 0 && item.taxes[0]?.id) ? item.taxes[0].id : 0,
        measurement: item.measurement?.id || null,
        images: Array.isArray(item.images) ? item.images : [],
        categories: item.categories ? item.categories.map((cat: Category) => cat.id) : [],
        featured_image: item.featured_image ?? null,
        vendor_id: item.vendor_id != null ? item.vendor_id : null
      };
      setFormData(initialData);
      setOriginalItemData(initialData);
      setSelectedCategories(item.categories || []);
    }
  }, [item]);


  const sectionKeys = ['basicInfo', 'featuredImage', 'categories', 'brands', 'media',];
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleAllSections = (shouldCollapse: boolean) => {
    const newState: Record<string, boolean> = {};
    sectionKeys.forEach(key => {
      newState[key] = shouldCollapse;
    });
    setCollapsedSections(newState);
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

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

    const primitiveFields: (keyof UpdateStoreItemRequest)[] = ['name', 'measurement', 'brand_id', 'tax_id', 'categories'];

    for (const field of primitiveFields) {
      if (formData[field] !== originalItemData[field]) {
        return true;
      }
    }

    const categoriesChanged =
      JSON.stringify(formData.categories) !== JSON.stringify(originalItemData.categories);
    const newImages = formData.images.filter((img) => img instanceof File);
    const imagesChanged = newImages.length > 0 || removedImages.length > 0;
    const featuredImageChanged =
      (formData.featured_image instanceof File) ||
      (originalItemData.featured_image && !formData.featured_image) ||
      (typeof originalItemData.featured_image === 'string' &&
        typeof formData.featured_image === 'string' &&
        originalItemData.featured_image !== formData.featured_image);
    return categoriesChanged || imagesChanged || featuredImageChanged;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!originalItemData) return;

    const formdata = new FormData();
    formdata.append('_method', 'PUT');
    formdata.append('id', formData.id.toString());

    // Primitive fields to track changes and append
    const primitiveFields: (keyof UpdateStoreItemRequest)[] = [
      'name', 'measurement', 'brand_id', 'tax_id', 'categories'
    ];

    primitiveFields.forEach((field) => {
      const value = formData[field];
      const originalValue = originalItemData[field];

      // Only append if changed
      if (value !== originalValue) {
        formdata.append(field as string, value?.toString() ?? '');
      }
    });

    // Categories (clear + append updated)
    formdata.delete('categories[]');
    formData.categories.forEach((catId) => {
      formdata.append('categories[]', catId.toString());
    });

    // New images only
    const newImages = formData.images.filter((img) => img instanceof File);
    newImages.forEach((img) => formdata.append('images[]', img as File));

    // Featured image if it's a new File
    if (formData.featured_image instanceof File) {
      formdata.append('featured_image', formData.featured_image);
    }

    // Removed images
    removedImages.forEach((imageUrl) => {
      formdata.append('removed_images[]', imageUrl);
    });

    // Submit
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
    <form onSubmit={handleSubmit} className="store_outer_row">
      <div className="store-add-item">
        {/* Header + Tabs */}
        <div className="add-item-header store_column" ref={headerRef}>
          <Link href={`/${companySlug}/store`} className="back-button">
            <FaArrowLeft size={16} color="#fff" />
          </Link>
          <Tooltip title={sectionKeys.some(key => !collapsedSections[key]) ? "Collapse all" : "Expand all"}>
            <IconButton
              onClick={() => {
                const anyOpen = sectionKeys.some(key => !collapsedSections[key]);
                toggleAllSections(anyOpen);
              }}
              className="header-icon"
              color="primary"
              sx={{ color: 'var(--primary-color)' }}
            >
              {sectionKeys.some(key => !collapsedSections[key]) ? <FiMinusCircle size={20} /> : <FiPlusCircle size={20} />}
            </IconButton>
          </Tooltip>
        </div>

        {/* Basic Info */}
        <div className="store_left_column store_column">
          <div className="add-items-form-container">
            <div className="basic_label_header">
              <h2 className="basic_label">Basic Info</h2>
              <span
                onClick={() => toggleSection('basicInfo')}
                aria-label="Toggle Basic Info Section"
              >
                {collapsedSections['basicInfo'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
              </span>
            </div>
            {!collapsedSections['basicInfo'] && (
              <div className="store_input_feilds fields-wrapper">
                <FormInput label="Item Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Samsung Monitor 24 inch" required />

                <div className="add-items-form-input-label-container">
                  <label>Tax</label>
                  <AddTax
                    taxes={taxesData?.data ?? []}
                    selectedTaxId={typeof formData.tax_id === 'number' ? formData.tax_id : null}
                    onTaxSelect={(taxId) => {
                      const updated = { ...formData, tax_id: taxId };
                      setFormData(updated);
                    }}
                    onTaxAdded={(newTax) => {
                      setFormData((prev) => ({ ...prev, tax_id: newTax.id }));
                    }}
                  />
                </div>
                <div className="add-items-form-input-label-container">
                  <label>Measuring Unit</label>
                  <MeasuringUnits
                    units={measuringUnits ?? []}
                    selectedUnit={formData.measurement}
                    onUnitSelect={(unitId) => {
                      const updated = { ...formData, measurement: unitId };
                      setFormData(updated);
                    }}
                    onUnitAdded={(newUnit) => {
                      setFormData((prev) => ({ ...prev, measurement: newUnit.id }));
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Brands */}
        <div className="add-items-form-container store_column">
          <ItemBrands
            selectedBrand={formData.brand_name || ''}
            selectedBrandId={formData.brand_id ?? null}
            onBrandSelect={(brandName, brandId) => {
              const updated = {
                ...formData,
                brand_name: brandName,
                brand_id: brandId || null,
              };
              setFormData(updated);
            }}
            collapsedSections={collapsedSections}
            toggleSection={toggleSection}
          />
        </div>

        {/* Media */}
        <div className="add-items-form-container store_column">
          <div className="basic_label_header">
            <h2 className="basic_label">Media</h2>
            <span
              onClick={() => toggleSection('media')}
              aria-label="Toggle media and dates Section"
            >
              {collapsedSections['media'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
            </span>
          </div>
          {!collapsedSections['media'] && (
            <div className="fields-wrapper">

              <ImageUpload images={formData.images || []} handleImageChange={handleImageChange} handleClearImages={handleClearImages} handleRemoveImage={handleRemoveImage} />
            </div>
          )}
        </div>

      </div>

      <div className="right_sidebar_row">

        {/* Featured image */}
        <div className="add-items-form-container store_column">
          <div className="basic_label_header">
            <h2 className="basic_label">Featured Image</h2>
            <span
              onClick={() => toggleSection('featuredImage')}
              aria-label="Toggle featured image Section"
            >
              {collapsedSections['featuredImage'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
            </span>
          </div>
          {!collapsedSections['featuredImage'] && (
            <div className="fields-wrapper">
              <FeaturedImageUpload
                featuredImage={formData.featured_image || null}
                onFeaturedImageChange={(file) => {
                  const updated = { ...formData, featured_image: file };
                  setFormData(updated);
                }}
                onRemoveFeaturedImage={() => {
                  const updated = { ...formData, featured_image: null };
                  setFormData(updated);
                }}
              />
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="add-items-form-container store_column">
          <ItemCategories setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories} collapsedSections={collapsedSections}
            toggleSection={toggleSection} />
        </div>

        {(isFormModified?.()) && (
          <div className="save-cancel-button" style={{ flex: '1 1 100%', marginTop: '1rem' }}>
            <button type="button" className="buttons cancel-btn" style={{ marginLeft: '1rem' }} onClick={() => router.push(`/${companySlug}/store`)}>
              Cancel
            </button>
            <button type="submit" className="buttons" disabled={isUpdating} style={{ cursor: isUpdating ? 'not-allowed' : 'pointer' }}>
              {isUpdating ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        )}

      </div>
    </form >
  );
};

export default AddItem;