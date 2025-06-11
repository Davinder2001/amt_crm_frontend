'use client';
import React, { useRef, useState } from 'react';
import { Tabs, Tab, Tooltip, IconButton } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { FiXCircle } from 'react-icons/fi';
import Link from 'next/link';
import AddVendor from './AddVendor';
import ImageUpload from './ImageUpload';
import { FormInput } from '@/components/common/FormInput';
import DatePickerField from '@/components/common/DatePickerField';
import ItemCategories from './ItemCategories';
import ItemsTab from './ItemsTab';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useRouter } from 'next/navigation';
import FeaturedImageUpload from './FeaturedImageUpload';
import ItemBrands from './ItemBrands';
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi';
import AddTax from './AddTax';
import useStickyWithOffset from '@/utils/StickyWithOffset';


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
    showConfirm,
    setShowConfirm,
    handleClearForm,
}: StoreItemFieldsProps<T>) => {

    const headerRef = useRef<HTMLDivElement>(null);
    useStickyWithOffset(headerRef, 30);

    const router = useRouter();
    const sectionKeys = ['basicInfo', 'pricingInventory', 'mediaDates', 'attributesVariations', 'featuredImage', 'categories', 'brands'];
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
                                    <FormInput label="Measuring Unit" name="measurement" value={formData.measurement || ''} onChange={handleChange} placeholder="e.g. kg, pcs, liters" />
                                    <FormInput label="Replacement" name="replacement" value={formData.replacement || ''} onChange={handleChange} placeholder="e.g. Replace after 2 years" />

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
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="add-items-form-container store_column">
                        <div className="basic_label_header">
                            <h2 className="basic_label">Pricing & Inventory</h2>
                            <span
                                onClick={() => toggleSection('pricingInventory')}
                                style={{
                                    color: '#384b70',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                aria-label="Toggle pricing Inventory Section"
                            >
                                {collapsedSections['pricingInventory'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                            </span>
                        </div>
                        {!collapsedSections['pricingInventory'] && (
                            <div className="store_input_feilds fields-wrapper">
                                <FormInput label="Cost Price" name="cost_price" type="number" value={formData.cost_price || ''} onChange={handleNumberChange} required placeholder="e.g. 250.00" />
                                <FormInput label="Selling Price" name="selling_price" type="number" value={formData.selling_price || ''} onChange={handleNumberChange} required placeholder="e.g. 300.00" />
                                <FormInput label="Add fresh Stock" name="quantity_count" type="number" value={formData.quantity_count || ''} onChange={handleNumberChange} required placeholder="e.g. 100" />
                                <FormInput label="Availability Stock" name="availability_stock" type="number" value={formData.availability_stock || ''} onChange={handleNumberChange} placeholder="e.g. 50" />

                                <div className="add-items-form-input-label-container">
                                    <label>Tax</label>
                                    {taxesData?.data && (
                                        <AddTax
                                            taxes={taxesData.data}
                                            selectedTaxId={typeof formData.tax_id === 'number' ? formData.tax_id : null}
                                            onTaxSelect={(taxId) => {
                                                const updated = { ...formData, tax_id: taxId };
                                                setFormData(updated);
                                            }}
                                            onTaxAdded={(newTax) => {
                                                setFormData((prev) => ({ ...prev, tax_id: newTax.id }));
                                            }}
                                        />
                                    )}
                                </div>

                            </div>
                        )}
                    </div>

                    {/* Media & Dates */}
                    <div className="add-items-form-container store_column">
                        <div className="basic_label_header">
                            <h2 className="basic_label">Media & Dates</h2>
                            <span
                                onClick={() => toggleSection('mediaDates')}
                                style={{
                                    color: '#384b70',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                aria-label="Toggle media and dates Section"
                            >
                                {collapsedSections['mediaDates'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                            </span>
                        </div>
                        {!collapsedSections['mediaDates'] && (
                            <div className="store_input_feilds fields-wrapper">
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
                                <ImageUpload images={formData.images || []} handleImageChange={handleImageChange} handleClearImages={handleClearImages} handleRemoveImage={handleRemoveImage} />
                            </div>
                        )}
                    </div>

                    {/* Attributes & Variants */}
                    <div className="items-tab-container store_column">
                        <div className="add-items-form-container">
                            <ItemsTab setVariants={setVariants} variants={variants} collapsedSections={collapsedSections}
                                toggleSection={toggleSection} />
                        </div>
                    </div>

                    {/* Confirmation Dialog */}
                    {showConfirm && (
                        <ConfirmDialog
                            isOpen={showConfirm}
                            message="Are you sure you want to clear the form?"
                            onConfirm={handleClearForm ?? (() => { })}
                            onCancel={() => setShowConfirm && setShowConfirm(false)}
                            type="clear"
                        />
                    )}

                    <span className="clear-button" onClick={() => setShowConfirm && setShowConfirm(true)}>
                        <FiXCircle />
                    </span>

                </div>

                <div className="right_sidebar_row">
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

                    <div className="add-items-form-container store_column">
                        <ItemCategories setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories} collapsedSections={collapsedSections}
                            toggleSection={toggleSection} />
                    </div>

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

                    {(isFormModified?.() || !isEditMode) && (
                        <div className="save-cancel-button" style={{ flex: '1 1 100%', marginTop: '1rem' }}>
                            <button type="button" className="buttons" style={{ marginLeft: '1rem' }} onClick={() => router.push(`/${companySlug}/store`)}>
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
