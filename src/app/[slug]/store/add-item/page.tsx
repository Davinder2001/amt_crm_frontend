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
                <FormInput label="Item Name" name="name" value={formData.name} onChange={handleChange} placeholder="Samsung Monitor 24 inch" required />

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