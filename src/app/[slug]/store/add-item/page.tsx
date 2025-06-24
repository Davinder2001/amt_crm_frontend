// 'use client';
// import React, { useEffect, useState, useCallback } from 'react';
// import { useCreateStoreItemMutation } from '@/slices';
// import { useRouter } from 'next/navigation';
// import { useFetchVendorsQuery } from '@/slices';
// import { useFetchMeasuringUnitsQuery, useFetchTaxesQuery } from '@/slices';
// import { useCompany } from '@/utils/Company';
// import StoreItemFields from '../components/StoreItemFields';
// import { toast } from 'react-toastify';

// const getDefaultFormData = (): CreateStoreItemRequest => ({
//   name: '',
//   quantity_count: 0,
//   measurement: null,
//   purchase_date: '',
//   date_of_manufacture: '',
//   date_of_expiry: '',
//   replacement: '',
//   category: '',
//   vendor_id: null,
//   vendor_name: '',
//   availability_stock: 0,
//   cost_price: 0,
//   regular_price: 0,
//   sale_price: 0,
//   tax_id: null,
//   unit_of_measure: 'pieces',
//   units_in_peace: null,
//   price_per_unit: null,
//   images: [],
//   categories: [],
//   featured_image: null,
//   product_type: 'simple_product',
// })

// const AddItem: React.FC = () => {
//   const [createStoreItem, { isLoading: isCreating }] = useCreateStoreItemMutation();
//   const { currentData: vendorsData } = useFetchVendorsQuery();
//   const { data: taxesData } = useFetchTaxesQuery();
//   const { data: measuringUnitsResponse } = useFetchMeasuringUnitsQuery();
//   const measuringUnits = measuringUnitsResponse?.units || [];
//   const router = useRouter();
//   const { companySlug } = useCompany();
//   const [activeTab, setActiveTab] = useState(0);

//   const [formData, setFormData] = useState<CreateStoreItemRequest>(getDefaultFormData());
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [variants, setVariants] = useState<variations[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
//   const [tabCompletion, setTabCompletion] = useState<boolean[]>([true, false, false, false, false]);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

//   useEffect(() => {
//     if (vendorsData) {
//       setVendors(vendorsData)
//     }
//   }, [vendorsData]);

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
//   }, [hasUnsavedChanges]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setHasUnsavedChanges(true);
//   };

//   const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const numValue = value === '' ? 0 : Number(value);
//     setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
//     setHasUnsavedChanges(true);
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newImages = Array.from(e.target.files).slice(0, 5);
//       const updatedImages = [...formData.images, ...newImages].slice(-5);
//       setFormData(prev => ({ ...prev, images: updatedImages }));
//       setHasUnsavedChanges(true);
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//     setHasUnsavedChanges(true);
//   };

//   const handleCategoryChange = (categories: Category[]) => {
//     setSelectedCategories(categories);
//     setHasUnsavedChanges(true);
//   };

//   const validateTab = useCallback((index: number): boolean => {
//     switch (index) {
//       case 0:
//         return formData.name.trim() !== '' &&
//           (formData.vendor_name?.trim() ?? '') !== '';
//       case 1:
//         return formData.cost_price > 0 &&
//           (formData.regular_price ?? 0) > 0 &&
//           (formData.sale_price ?? 0) > 0 &&
//           formData.quantity_count > 0;
//       case 2:
//         return formData.date_of_manufacture !== '';
//       case 3:
//         return selectedCategories.length > 0;
//       case 4:
//         return variants && variants.length > 0;
//       default:
//         return false;
//     }
//   }, [formData, selectedCategories, variants]);

//   useEffect(() => {
//     const newTabCompletion = [true]; // First tab is always enabled
//     for (let i = 0; i < 4; i++) {
//       if (validateTab(i)) {
//         newTabCompletion[i + 1] = true;
//       } else {
//         break; // stop checking further if a previous tab is invalid
//       }
//     }

//     setTabCompletion(newTabCompletion);

//     if (!newTabCompletion[activeTab]) {
//       const lastValidTab = newTabCompletion.lastIndexOf(true);
//       setActiveTab(lastValidTab);
//     }
//   }, [formData, variants, selectedCategories, activeTab, validateTab]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const form = new FormData();

//     // Append simple fields (with unit handling)
//     Object.entries(formData).forEach(([key, val]) => {
//       if (key === 'images' || key === 'featured_image' || key === 'regular_price' || key === 'sale_price') return;

//       // Always send unit_of_measure
//       if (key === 'unit_of_measure') {
//         form.append('unit_of_measure', val.toString());
//         return;
//       }
//       // Always send product_type
//       if (key === 'product_type') {
//         form.append('product_type', val.toString());
//         return;
//       }

//       // Conditionally send unit breakdown only if unit_of_measure === 'unit'
//       if (formData.unit_of_measure === 'unit') {
//         if (key === 'units_in_peace' && val !== null && val !== undefined && val !== 0) {
//           form.append('units_in_peace', val.toString());
//         }
//         if (key === 'price_per_unit' && val !== null && val !== undefined && val !== 0) {
//           form.append('price_per_unit', val.toString());
//         }
//       }

//       // Skip pieces_per_unit and units_per_piece if unit_of_measure !== 'unit'
//       if ((key === 'units_in_peace' || key === 'price_per_unit') && formData.unit_of_measure !== 'unit') {
//         return;
//       }

//       // Append all other fields
//       if (val !== null && val !== undefined) {
//         if (key === 'brand_name' && formData.brand_id) {
//           form.append('brand_id', formData.brand_id.toString());
//         }
//         form.append(key, val.toString());
//       }
//     });

//     // For simple products, append regular_price and sale_price
//     if (formData.product_type === 'simple_product') {
//       if (formData.regular_price) {
//         form.append('regular_price', formData.regular_price.toString());
//       }
//       if (formData.sale_price) {
//         form.append('sale_price', formData.sale_price.toString());
//       }
//     }

//     // Append images
//     formData.images.forEach(img => form.append('images[]', img));
//     if (formData.featured_image instanceof File) {
//       form.append('featured_image', formData.featured_image);
//     }

//     // For variable products, append variants
//     if (formData.product_type === 'variable_product' && variants.length > 0) {
//       variants.forEach((variant, i) => {
//         form.append(`variants[${i}][variant_regular_price]`, variant.variant_regular_price.toString());
//         form.append(`variants[${i}][variant_sale_price]`, variant.variant_sale_price.toString());
//         form.append(`variants[${i}][variant_stock]`, variant.variant_stock.toString());

//         // Add unit fields only when unit_of_measure is 'unit'
//         if (formData.unit_of_measure === 'unit') {
//           if (variant.variant_units_in_peace !== null && variant.variant_units_in_peace !== undefined) {
//             form.append(`variants[${i}][variant_units_in_peace]`, variant.variant_units_in_peace.toString());
//           }
//           if (variant.variant_price_per_unit !== null && variant.variant_price_per_unit !== undefined) {
//             form.append(`variants[${i}][variant_price_per_unit]`, variant.variant_price_per_unit.toString());
//           }
//         }
//         variant.attributes?.forEach((attr, attrIndex) => {
//           form.append(`variants[${i}][attributes][${attrIndex}][attribute_id]`, attr.attribute_id.toString());
//           form.append(`variants[${i}][attributes][${attrIndex}][attribute_value_id]`, attr.attribute_value_id.toString());
//         });
//       });
//     }

//     // Append categories
//     selectedCategories.forEach(cat => form.append('categories[]', cat.id.toString()));

//     try {
//       const response = await createStoreItem(form).unwrap();
//       if (response.success === true) {
//         toast.success(response.message || 'Item created successfully.');
//         setFormData(getDefaultFormData());
//         setHasUnsavedChanges(false);
//         router.push(`/${companySlug}/store`);
//       } else {
//         toast.error(response.message || response.error || 'Failed to create item.');
//       }
//     } catch (err) {
//       console.error('Error creating item:', err);
//     }
//   };

//   return (
//     <StoreItemFields
//       formData={formData}
//       setFormData={setFormData}
//       vendors={vendors}
//       selectedVendorId={formData.vendor_id || null}
//       onVendorSelect={(vendorId) => {
//         const vendor = vendors.find(v => v.id === vendorId);
//         setFormData(prev => ({
//           ...prev,
//           vendor_id: vendorId,
//           vendor_name: vendor?.vendor_name || ''
//         }));
//       }}
//       onVendorAdded={(newVendor) => {
//         setVendors(prev => [...prev, newVendor]);
//         setFormData(prev => ({
//           ...prev,
//           vendor_id: newVendor.id,
//           vendor_name: newVendor.vendor_name
//         }));
//       }}
//       handleChange={handleChange}
//       handleNumberChange={handleNumberChange}
//       handleImageChange={handleImageChange}
//       handleClearImages={() => setFormData(prev => ({ ...prev, images: [] }))}
//       handleRemoveImage={handleRemoveImage}
//       taxesData={taxesData}
//       measuringUnits={measuringUnits}
//       selectedCategories={selectedCategories}
//       setSelectedCategories={handleCategoryChange}
//       variants={variants}
//       setVariants={setVariants}
//       handleSubmit={handleSubmit}
//       companySlug={companySlug}
//       isLoading={isCreating}
//       isEditMode={false}
//       activeTab={activeTab}
//       setActiveTab={setActiveTab}
//       tabCompletion={tabCompletion}
//     />
//   );
// };

// export default AddItem;






















'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useCreateStoreItemMutation } from '@/slices';
import { useRouter } from 'next/navigation';
import { useFetchMeasuringUnitsQuery, useFetchTaxesQuery } from '@/slices';
import { useCompany } from '@/utils/Company';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { IconButton, Tooltip } from '@mui/material';
import useStickyWithOffset from '@/utils/StickyWithOffset';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { FormInput } from '@/components/common/FormInput';
import AddTax from '../components/AddTax';
import MeasuringUnits from '../components/MeasuringUnits';
import FeaturedImageUpload from '../components/FeaturedImageUpload';
import ItemCategories from '../components/ItemCategories';
import ItemBrands from '../components/ItemBrands';
import ImageUpload from '../components/ImageUpload';

const getDefaultFormData = (): CreateStoreItemRequest => ({
  name: '',
  measurement: null,
  tax_id: null,
  images: [],
  categories: [],
  featured_image: null,
})

const AddItem: React.FC = () => {
  const [createStoreItem, { isLoading: isCreating }] = useCreateStoreItemMutation();
  const { data: taxesData } = useFetchTaxesQuery();
  const { data: measuringUnitsResponse } = useFetchMeasuringUnitsQuery();
  const measuringUnits = measuringUnitsResponse?.units || [];
  const router = useRouter();
  const { companySlug } = useCompany();

  const [formData, setFormData] = useState<CreateStoreItemRequest>(getDefaultFormData());
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  useStickyWithOffset(headerRef, 30);

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
  }, [hasUnsavedChanges]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();

    // Append simple fields (with unit handling)
    Object.entries(formData).forEach(([key, val]) => {
      if (key === 'images' || key === 'featured_image') return;

      // Append all other fields
      if (val !== null && val !== undefined) {
        form.append(key, val.toString());
      }
    });

    // Append images
    formData.images.forEach(img => form.append('images[]', img));
    if (formData.featured_image instanceof File) {
      form.append('featured_image', formData.featured_image);
    }

    // Append categories
    selectedCategories.forEach(cat => form.append('categories[]', cat.id.toString()));

    try {
      const response = await createStoreItem(form).unwrap();
      if (response.success === true) {
        toast.success(response.message || 'Item created successfully.');
        setFormData(getDefaultFormData());
        setHasUnsavedChanges(false);
        router.push(`/${companySlug}/store/add-stock/${response.item.id}`);
      } else {
        toast.error(response.message || response.error || 'Failed to create item.');
      }
    } catch (err) {
      console.error('Error creating item:', err);
    }
  };

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

              <ImageUpload images={formData.images || []} handleImageChange={handleImageChange} handleClearImages={() => setFormData(prev => ({ ...prev, images: [] }))} handleRemoveImage={handleRemoveImage} />
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
          <ItemCategories setSelectedCategories={handleCategoryChange} selectedCategories={selectedCategories} collapsedSections={collapsedSections}
            toggleSection={toggleSection} />
        </div>






        <div className="save-cancel-button" style={{ flex: '1 1 100%', marginTop: '1rem' }}>
          <button type="button" className="buttons cancel-btn" style={{ marginLeft: '1rem' }} onClick={() => router.push(`/${companySlug}/store`)}>
            Cancel
          </button>
          <button type="submit" className="buttons" disabled={isCreating} style={{ cursor: isCreating ? 'not-allowed' : 'pointer' }}>
            {isCreating ? 'Creating...' : 'Create Item'}
          </button>
        </div>

      </div>
    </form >
  );
};

export default AddItem;