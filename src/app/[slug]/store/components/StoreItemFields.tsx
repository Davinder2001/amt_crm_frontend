'use client';
import React, { useRef, useState } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import AddVendor from './AddVendor';
import ImageUpload from './ImageUpload';
import { FormInput } from '@/components/common/FormInput';
import DatePickerField from '@/components/common/DatePickerField';
import ItemCategories from './ItemCategories';
import ItemsTab from './ItemsTab';
import { useRouter } from 'next/navigation';
import FeaturedImageUpload from './FeaturedImageUpload';
import ItemBrands from './ItemBrands';
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import AddTax from './AddTax';
import useStickyWithOffset from '@/utils/StickyWithOffset';
import MeasuringUnits from './MeasuringUnits';


interface StoreItemFieldsProps<T extends StoreItemFormData> {
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    vendors: Vendor[];
    selectedVendorId: number | null;
    onVendorSelect: (vendorId: number) => void;
    onVendorAdded: (vendor: Vendor) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearImages?: () => void;
    handleRemoveImage?: (index: number) => void;
    taxesData?: {
        data?: Array<{
            id: number;
            name: string;
            rate: number;
        }>;
    };
    measuringUnits?: MeasuringUnit[];
    selectedCategories: Category[];
    setSelectedCategories: (categories: Category[]) => void;
    variants: variations[];
    setVariants: React.Dispatch<React.SetStateAction<variations[]>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    companySlug: string;
    isLoading: boolean;
    isEditMode?: boolean;
    isFormModified?: () => boolean;
    showConfirm?: boolean;
    setShowConfirm?: React.Dispatch<React.SetStateAction<boolean>>;
    handleClearForm?: () => void;
    isBatchMode?: boolean;
    isEditingBatch?: boolean;
    pageTitle?: string;
}

const StoreItemFields = <T extends StoreItemFormData>({
    formData,
    setFormData,
    vendors,
    onVendorAdded,
    onVendorSelect,
    handleChange,
    handleNumberChange,
    handleImageChange,
    handleClearImages,
    handleRemoveImage,
    taxesData,
    measuringUnits,
    selectedCategories,
    setSelectedCategories,
    variants,
    setVariants,
    handleSubmit,
    companySlug,
    isLoading,
    isEditMode = false,
    isFormModified,
    isBatchMode,
    isEditingBatch = false,
    pageTitle,
}: StoreItemFieldsProps<T>) => {

    const headerRef = useRef<HTMLDivElement>(null);
    useStickyWithOffset(headerRef, 30);

    const router = useRouter();
    const sectionKeys = ['basicInfo', 'inventoryAndDates', 'pricing', 'attributesVariations', 'featuredImage', 'categories', 'brands', 'media',];
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


    return (
        <>
            <form onSubmit={handleSubmit} className="store_outer_row">
                <div className="store-add-item">
                    {/* Header + Tabs */}
                    <div className="add-item-header store_column" ref={headerRef}>
                        <Link href={`/${companySlug}/store`} className="back-button">
                            <FaArrowLeft size={16} color="#fff" />
                        </Link>
                        <h4 className='store_page_heading'>
                            {pageTitle}
                        </h4>
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
                                    <FormInput label="Item Name" name="name" value={formData.name} onChange={handleChange} placeholder="Samsung Monitor 24 inch" required disabled={isBatchMode} />
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
                                            disabled={isBatchMode}
                                        />
                                    </div>


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
                                            disabled={isBatchMode}
                                        />
                                    </div>


                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inventory & Dates */}
                    <div className="add-items-form-container store_column">
                        <div className="basic_label_header">
                            <h2 className="basic_label">Inventory & Dates</h2>
                            <span
                                onClick={() => toggleSection('inventoryAndDates')}
                                aria-label="Toggle pricing Inventory Section"
                            >
                                {collapsedSections['inventoryAndDates'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                            </span>
                        </div>
                        {!collapsedSections['inventoryAndDates'] && (
                            <div className="store_input_feilds fields-wrapper">
                                <FormInput label="Quantity Count" name="quantity_count" type="number" value={formData.quantity_count || ''} onChange={handleNumberChange} required placeholder="100" />
                                <FormInput label="Cost Price" name="cost_price" type="number" value={formData.cost_price || ''} onChange={handleNumberChange} required placeholder="250.00" />
                                <FormInput label="Replacement" name="replacement" value={formData.replacement || ''} onChange={handleChange} placeholder="Replace after 2 years" />
                                <DatePickerField label="Purchase Date" selectedDate={formData.purchase_date || null} onChange={(date) => {
                                    const updated = { ...formData, purchase_date: date };
                                    setFormData(updated);
                                }} maxDate={new Date()} />
                                <DatePickerField label="Date Of Manufacture" selectedDate={formData.date_of_manufacture || null} onChange={(date) => {
                                    const updated = { ...formData, date_of_manufacture: date };
                                    setFormData(updated);
                                }} maxDate={new Date()} required />
                                <DatePickerField label="Date Of Expiry" selectedDate={formData.date_of_expiry || null} onChange={(date) => {
                                    const updated = { ...formData, date_of_expiry: date };
                                    setFormData(updated);
                                }} />
                                <div className="add-items-form-input-label-container">
                                    <label>Vendor Name*</label>
                                    <AddVendor
                                        vendors={vendors}
                                        selectedVendorId={formData.vendor_id || null}
                                        onVendorSelect={onVendorSelect}
                                        onVendorAdded={onVendorAdded}
                                        disabled={isBatchMode}
                                    />
                                </div>
                                <div className="add-items-form-input-label-container">
                                    <label>Product Type*</label>
                                    <select
                                        value={formData.product_type}
                                        onChange={(e) => {
                                            const updated = {
                                                ...formData,
                                                product_type: e.target.value as 'simple_product' | 'variable_product'
                                            };
                                            setFormData(updated);
                                        }}
                                        className="form-select"
                                        required
                                    >
                                        <option value="simple_product">Simple Product</option>
                                        <option value="variable_product">Variable Product</option>
                                    </select>
                                </div>
                                <div className="add-items-form-input-label-container">
                                    <label>Unit of Measure*</label>
                                    <select
                                        value={formData.unit_of_measure}
                                        onChange={(e) => {
                                            const value = e.target.value as 'unit' | 'pieces';
                                            setFormData(prev => ({
                                                ...prev,
                                                unit_of_measure: value,
                                                units_in_peace: value === 'unit' ? prev.units_in_peace : null,
                                                price_per_unit: value === 'unit' ? prev.price_per_unit : null
                                            }));
                                        }}
                                        className="form-select"
                                        required
                                    >
                                        <option value="pieces">Pieces</option>
                                        <option value="unit">Unit</option>
                                    </select>
                                </div>
                                {/* <FormInput label="Availability Stock" name="availability_stock" type="number" value={formData.availability_stock || ''} onChange={handleNumberChange} placeholder="50" /> */}
                                <div className="add-items-form-input-label-container">
                                    <label>Tax Type</label>
                                    <select
                                        value={formData.tax_type}
                                        onChange={(e) => {
                                            const value = e.target.value as 'include' | 'exclude';
                                            setFormData(prev => ({
                                                ...prev,
                                                tax_type: value
                                            }));
                                        }}
                                        className="form-select"
                                        required
                                    >
                                        <option value="exclude">Exclude</option>
                                        <option value="include">Include</option>
                                    </select>
                                </div>
                                <FormInput label='Invoice Number' name="invoice_number" value={formData.invoice_number || ''} onChange={handleChange} placeholder="INV-12345" />
                            </div>
                        )}
                    </div>

                    {formData.product_type === 'simple_product' && (
                        <div className="add-items-form-container store_column">
                            <div className="basic_label_header">
                                <h2 className="basic_label">Pricing</h2>
                                <span
                                    onClick={() => toggleSection('pricing')}
                                    aria-label="Toggle pricing Section"
                                >
                                    {collapsedSections['pricing'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                                </span>
                            </div>
                            {!collapsedSections['pricing'] && (
                                <div className="store_input_feilds fields-wrapper">
                                    <FormInput
                                        label="Regular Price"
                                        name="regular_price"
                                        type="number"
                                        value={formData.regular_price || ''}
                                        onChange={handleNumberChange}
                                        required
                                        placeholder="280.00"
                                    />
                                    <FormInput
                                        label="Sale Price"
                                        name="sale_price"
                                        type="number"
                                        value={formData.sale_price || ''}
                                        onChange={handleNumberChange}
                                        required
                                        placeholder="300.00"
                                    />

                                    {/* Show only if unit_of_measure is "unit" */}
                                    {formData.unit_of_measure === 'unit' && (
                                        <>
                                            <FormInput
                                                label="Pieces per Unit"
                                                name="units_in_peace"
                                                type="number"
                                                value={formData.units_in_peace || ''}
                                                onChange={handleNumberChange}
                                                placeholder="10"
                                            />
                                            <FormInput
                                                label="Per Unit Price"
                                                name="price_per_unit"
                                                type="number"
                                                value={formData.price_per_unit || ''}
                                                onChange={handleNumberChange}
                                                placeholder="0.1"
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Attributes & Variants */}
                    {formData.product_type === 'variable_product' && (
                        <div className="items-tab-container store_column">
                            <div className="add-items-form-container">
                                <ItemsTab setVariants={setVariants} variants={variants} collapsedSections={collapsedSections}
                                    toggleSection={toggleSection} unit_of_measure={formData.unit_of_measure} />
                            </div>
                        </div>
                    )}
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
                                    disabled={isBatchMode}
                                />
                            </div>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="add-items-form-container store_column">
                        <ItemCategories setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories} collapsedSections={collapsedSections}
                            toggleSection={toggleSection} disabled={isBatchMode} />
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
                            disabled={isBatchMode}
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
                                <ImageUpload
                                    images={formData.images || []}
                                    handleImageChange={handleImageChange ?? (() => { })}
                                    handleClearImages={handleClearImages ?? (() => { })}
                                    handleRemoveImage={handleRemoveImage ?? (() => { })}
                                    disabled={isBatchMode}
                                />
                            </div>
                        )}
                    </div>

                    {(isFormModified?.() || !isEditMode) && (
                        <div className="save-cancel-button" style={{ flex: '1 1 100%', marginTop: '1rem' }}>
                            <button type="button" className="buttons cancel-btn" style={{ marginLeft: '1rem' }} onClick={() => router.push(`/${companySlug}/store`)}>
                                Cancel
                            </button>
                            <button type="submit" className="buttons" disabled={isLoading}>
                                {isLoading
                                    ? (isEditingBatch ? 'Updating Batch...' : (isEditMode ? 'Updating...' : 'Adding...'))
                                    : (isEditingBatch ? 'Update Batch' : (isEditMode ? 'Update' : 'Save'))
                                }
                            </button>
                        </div>
                    )}
                </div>
            </form >
        </>
    );
};

export default StoreItemFields;
