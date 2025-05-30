'use client';
import { Tabs, Tab } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { FiXCircle } from 'react-icons/fi';
import Link from 'next/link';
import AddVendor from './AddVendor';
import ImageUpload from './ImageUpload';
import { FormInput } from '@/components/common/FormInput';
import { FormSelect } from '@/components/common/FormSelect';
import DatePickerField from '@/components/common/DatePickerField';
import ItemCategories from './ItemCategories';
import ItemsTab from './ItemsTab';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useRouter } from 'next/navigation';


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
    const router = useRouter();

    return (
        <form onSubmit={handleSubmit} className="store_outer_row">
            <div className="store-add-item">
                {/* Header + Tabs */}
                <div className="add-item-header">
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
                        style={{ backgroundColor: '#f1f9f9' }}
                        sx={{
                            '& .MuiTab-root': {
                                color: '#009693',
                                '&.Mui-disabled': { color: '#ccc' },
                                '&.Mui-selected': { color: '#009693' },
                            },
                            '& .MuiTabs-indicator': { backgroundColor: '#009693' },
                        }}
                    >
                        <Tab label="Basic Info" disabled={tabCompletion && !tabCompletion[0]} />
                        <Tab label="Pricing & Inventory" disabled={tabCompletion && !tabCompletion[1]} />
                        <Tab label="Media & Dates" disabled={tabCompletion && !tabCompletion[2]} />
                        <Tab label="Categories" disabled={tabCompletion && !tabCompletion[3]} />
                        <Tab label="Product Options" disabled={tabCompletion && !tabCompletion[4]} />
                    </Tabs>
                </div>

                {/* Basic Info */}
                <div className="store_left_column store_column">
                    <div className="add-items-form-container">
                        <h2 className="basic_label">Basic Name</h2>
                        <hr />
                        <div className="store_input_feilds">
                            <FormInput label="Item Name*" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Samsung Monitor 24 inch" required />
                            <FormInput label="Brand Name*" name="brand_name" value={formData.brand_name} onChange={handleChange} placeholder="e.g. Samsung, LG" required />
                            <FormInput label="Measurement" name="measurement" value={formData.measurement || ''} onChange={handleChange} placeholder="e.g. kg, pcs, liters" />
                            <FormInput label="Replacement" name="replacement" value={formData.replacement || ''} onChange={handleChange} placeholder="e.g. Replace after 2 years" />

                            <div className="add-items-form-input-label-container">
                                <label>Vendor Name*</label>
                                <AddVendor
                                    vendors={vendors}
                                    selectedVendor={formData.vendor_name || ''}
                                    onVendorSelect={(vendorName) => {
                                        const updated = { ...formData, vendor_name: vendorName };
                                        setFormData(updated);
                                        localStorage.setItem('STORE_ITEM_FORM', JSON.stringify(updated));
                                    }}
                                    onVendorAdded={(vendorName) => {
                                        setVendors((prev) => [...prev, vendorName]);
                                        const updated = { ...formData, vendor_name: vendorName };
                                        setFormData(updated);
                                        localStorage.setItem('STORE_ITEM_FORM', JSON.stringify(updated));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="add-items-form-container store_column">
                    <h2 className="basic_label">Pricing & Inventory</h2>
                    <hr />
                    <div className="store_input_feilds">
                        <FormInput label="Cost Price*" name="cost_price" type="number" value={formData.cost_price || ''} onChange={handleNumberChange} required placeholder="e.g. 250.00" />
                        <FormInput label="Selling Price*" name="selling_price" type="number" value={formData.selling_price || ''} onChange={handleNumberChange} required placeholder="e.g. 300.00" />
                        <FormInput label="Quantity Count*" name="quantity_count" type="number" value={formData.quantity_count || ''} onChange={handleNumberChange} required placeholder="e.g. 100" />
                        <FormInput label="Availability Stock" name="availability_stock" type="number" value={formData.availability_stock || ''} onChange={handleNumberChange} placeholder="e.g. 50" />

                        {taxesData?.data && (
                            <FormSelect<number>
                                label="Tax"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={(value) => {
                                    const updated = { ...formData, tax_id: value };
                                    setFormData(updated);
                                    localStorage.setItem('STORE_ITEM_FORM', JSON.stringify(updated));
                                }}
                                options={taxesData.data.map((tax) => ({
                                    value: tax.id,
                                    label: `${tax.name} - ${tax.rate}%`,
                                }))}
                            />
                        )}
                    </div>
                </div>

                {/* Media & Dates */}
                <div className="add-items-form-container store_column">
                    <h2 className="basic_label">Media & Dates</h2>
                    <hr />
                    <div className="store_input_feilds">
                        <ImageUpload images={formData.images || []} handleImageChange={handleImageChange} handleClearImages={handleClearImages} handleRemoveImage={handleRemoveImage} />
                        <DatePickerField label="Purchase Date" selectedDate={formData.purchase_date || null} onChange={(date) => {
                            const updated = { ...formData, purchase_date: date };
                            setFormData(updated);
                            localStorage.setItem('STORE_ITEM_FORM', JSON.stringify(updated));
                        }} maxDate={new Date()} />
                        <DatePickerField label="Date Of Manufacture*" selectedDate={formData.date_of_manufacture || null} onChange={(date) => {
                            const updated = { ...formData, date_of_manufacture: date };
                            setFormData(updated);
                            localStorage.setItem('STORE_ITEM_FORM', JSON.stringify(updated));
                        }} maxDate={new Date()} required />
                        <DatePickerField label="Date Of Expiry" selectedDate={formData.date_of_expiry || null} onChange={(date) => {
                            const updated = { ...formData, date_of_expiry: date };
                            setFormData(updated);
                            localStorage.setItem('STORE_ITEM_FORM', JSON.stringify(updated));
                        }} minDate={new Date()} />
                    </div>
                </div>

                {/* Attributes & Variants */}
                <div className="items-tab-container store_column">
                    <div className="add-items-form-container">
                        <h2 className="basic_label">Attributes & Variations</h2>
                        <hr />
                        <ItemsTab setVariants={setVariants} variants={variants} />
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

            <div className="right_sidebar_row">
                <div className="categories-container store_column">
                    <div className="store_input_feilds">
                        <ItemCategories setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories} />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default StoreItemFields;
