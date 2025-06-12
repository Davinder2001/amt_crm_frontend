'use client';
import React, { useRef, useState } from 'react';
import { Tabs, Tab, Tooltip, IconButton } from '@mui/material';
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
    vendors: string[];
    setVendors: React.Dispatch<React.SetStateAction<string[]>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearImages: () => void;
    handleRemoveImage: (index: number) => void;
    taxesData?: {
        data?: Array<{
            id: number;
            name: string;
            rate: number;
        }>;
    };
    measuringUnits?: {
        data?: Array<{
            id: number;
            name: string;
        }>;
    };
    selectedCategories: Category[];
    setSelectedCategories: (categories: Category[]) => void;
    variants: variations[];
    setVariants: React.Dispatch<React.SetStateAction<variations[]>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    companySlug: string;
    isLoading: boolean;
    isEditMode?: boolean;
    isFormModified?: () => boolean;
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    tabCompletion?: boolean[];
    showConfirm?: boolean;
    setShowConfirm?: React.Dispatch<React.SetStateAction<boolean>>;
    handleClearForm?: () => void;
}

const StoreItemFields = <T extends StoreItemFormData>({
    formData,
    setFormData,
    vendors,
    setVendors,
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
    activeTab,
    setActiveTab,
    tabCompletion,
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
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => {
                                if (!tabCompletion || tabCompletion[newValue]) setActiveTab(newValue);
                            }}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    color: '#384b70',

                                    '&.Mui-disabled': { color: '#ccc' },
                                    '&.Mui-selected': { color: '#384b70', fontWeight: 'bold', },
                                },
                                '& .MuiTabs-indicator': { backgroundColor: '#384b70' },
                            }}
                        >
                            <Tab label="Basic Info" disabled={tabCompletion && !tabCompletion[0]} />
                            <Tab label="Pricing & Inventory" disabled={tabCompletion && !tabCompletion[1]} />
                            <Tab label="Media & Dates" disabled={tabCompletion && !tabCompletion[2]} />
                            <Tab label="Categories" disabled={tabCompletion && !tabCompletion[3]} />
                            <Tab label="Product Options" disabled={tabCompletion && !tabCompletion[4]} />
                        </Tabs>
                        <Tooltip title={sectionKeys.some(key => !collapsedSections[key]) ? "Collapse all" : "Expand all"}>
                            <IconButton
                                onClick={() => {
                                    const anyOpen = sectionKeys.some(key => !collapsedSections[key]);
                                    toggleAllSections(anyOpen);
                                }}
                                className="header-icon"
                                color="default"
                                sx={{ color: '#384b70' }}
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
                                    style={{
                                        color: '#384b70',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    aria-label="Toggle Basic Info Section"
                                >
                                    {collapsedSections['basicInfo'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                                </span>
                            </div>
                            {!collapsedSections['basicInfo'] && (
                                <div className="store_input_feilds fields-wrapper">
                                    <FormInput label="Item Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Samsung Monitor 24 inch" required />
                                    {/* <FormInput label="Measuring Unit" name="measurement" value={formData.measurement || ''} onChange={handleChange} placeholder="e.g. kg, pcs, liters" /> */}
                                    <div className="add-items-form-input-label-container">
                                        <label>Measuring Unit</label>
                                        <MeasuringUnits
                                            units={measuringUnits?.data ?? []}
                                            selectedUnit={typeof formData.unit_id === 'number' ? formData.unit_id : null}
                                            onUnitSelect={(unitId) => {
                                                const updated = { ...formData, unit_id: unitId };
                                                setFormData(updated);
                                            }}
                                            onUnitAdded={(newUnit) => {
                                                setFormData((prev) => ({ ...prev, unit_id: newUnit.id }));
                                            }}
                                        />
                                    </div>
                                    <FormInput label="Quantity Count" name="quantity_count" type="number" value={formData.quantity_count || ''} onChange={handleNumberChange} required placeholder="e.g. 100" />
                                    <FormInput label="Cost Price" name="cost_price" type="number" value={formData.cost_price || ''} onChange={handleNumberChange} required placeholder="e.g. 250.00" />
                                    <div className="add-items-form-input-label-container">
                                        <label>Vendor Name*</label>
                                        <AddVendor
                                            vendors={vendors}
                                            selectedVendor={formData.vendor_name || ''}
                                            onVendorSelect={(vendorName) => {
                                                const updated = { ...formData, vendor_name: vendorName };
                                                setFormData(updated);
                                            }}
                                            onVendorAdded={(vendorName) => {
                                                setVendors((prev) => [...prev, vendorName]);
                                                const updated = { ...formData, vendor_name: vendorName };
                                                setFormData(updated);
                                            }}
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
                                style={{
                                    color: '#384b70',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                aria-label="Toggle pricing Inventory Section"
                            >
                                {collapsedSections['inventoryAndDates'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                            </span>
                        </div>
                        {!collapsedSections['inventoryAndDates'] && (
                            <div className="store_input_feilds fields-wrapper">
                                <FormInput label="Replacement" name="replacement" value={formData.replacement || ''} onChange={handleChange} placeholder="e.g. Replace after 2 years" />
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
                                }} minDate={new Date()} />
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
                                {/* <FormInput label="Availability Stock" name="availability_stock" type="number" value={formData.availability_stock || ''} onChange={handleNumberChange} placeholder="e.g. 50" /> */}
                            </div>
                        )}
                    </div>

                    {/* pricing */}
                    {formData.product_type === 'simple_product' && (
                        <>
                            <div className="add-items-form-container store_column">
                                <div className="basic_label_header">
                                    <h2 className="basic_label">Pricing</h2>
                                    <span
                                        onClick={() => toggleSection('pricing')}
                                        style={{
                                            color: '#384b70',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        aria-label="Toggle pricing Section"
                                    >
                                        {collapsedSections['pricing'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                                    </span>
                                </div>
                                {!collapsedSections['pricing'] && (
                                    <div className="store_input_feilds fields-wrapper">
                                        <FormInput label="Regular Price" name="regular_price" type="number" value={formData.regular_price || ''} onChange={handleNumberChange} required placeholder="e.g. 280.00" />
                                        <FormInput label="Sale Price" name="sale_price" type="number" value={formData.sale_price || ''} onChange={handleNumberChange} required placeholder="e.g. 300.00" />
                                    </div>
                                )}
                            </div>

                        </>)}

                    {/* Attributes & Variants */}
                    {formData.product_type === 'variable_product' && (
                        <div className="items-tab-container store_column">
                            <div className="add-items-form-container">
                                <ItemsTab setVariants={setVariants} variants={variants} collapsedSections={collapsedSections}
                                    toggleSection={toggleSection} />
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
                                style={{
                                    color: '#384b70',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
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
                                style={{
                                    color: '#384b70',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
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

                    {(isFormModified?.() || !isEditMode) && (
                        <div className="save-cancel-button" style={{ flex: '1 1 100%', marginTop: '1rem' }}>
                            <button type="button" className="buttons cancel-btn" style={{ marginLeft: '1rem' }} onClick={() => router.push(`/${companySlug}/store`)}>
                                Cancel
                            </button>
                            <button type="submit" className="buttons" disabled={isLoading}>
                                {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update' : 'Save')}
                            </button>
                        </div>
                    )}
                </div>
            </form >
        </>
    );
};

export default StoreItemFields;
