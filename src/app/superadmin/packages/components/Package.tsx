'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
    FiChevronDown,
    FiCheck,
    FiX,
    FiMessageSquare,
    FiClipboard,
    FiUser,
} from 'react-icons/fi';
import {
    useCreatePackageMutation,
    useFetchSinglePackageQuery,
    useUpdatePackageMutation
} from '@/slices/superadminSlices/packages/packagesApi';
import { useGetBusinessCategoriesQuery } from '@/slices/superadminSlices/businessCategory/businesscategoryApi';
import { useRouter } from 'next/navigation';
import { useClickOutside } from '@/components/common/useClickOutside';
import LoadingState from '@/components/common/LoadingState';
import { useFetchAdminsQuery } from '@/slices/superadminSlices/adminManagement/adminManageApi';

interface PackagePlan {
    id?: number;
    name: string;
    annual_price: number;
    three_years_price: number;
    employee_limit: number;
    package_type: 'general' | 'specific';
    user_id: number | null;
    task?: boolean;
    chat?: boolean;
    hr?: boolean;
    business_categories: BusinessCategory[];
}

interface BusinessCategory {
    id: number;
    name?: string;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}


interface PackageProps {
    mode?: "add" | "edit";
    packageId?: number;
}

const Package: React.FC<PackageProps> = ({ mode = 'add', packageId }) => {
    const initialFormData: PackagePlan = {
        name: '',
        annual_price: 0,
        three_years_price: 0,
        employee_limit: 0,
        package_type: 'general',
        user_id: null,
        task: false,
        chat: false,
        hr: false,
        business_categories: [],
    };

    const [formData, setFormData] = useState<PackagePlan>(initialFormData);
    const { data: adminData } = useFetchAdminsQuery();
    const admins: Admin[] = adminData?.admins || [];

    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setShowDropdown(false));

    const [showDropdown, setShowDropdown] = useState(false);

    const { data: categories } = useGetBusinessCategoriesQuery();
    const [createPackage] = useCreatePackageMutation();
    const [updatePackage] = useUpdatePackageMutation();
    const { data: packageData, isLoading: isPackageLoading } = useFetchSinglePackageQuery(
        packageId ? String(packageId) : "",
        { skip: mode !== 'edit' || !packageId }
    );

    // Set form data when in edit mode and package data is available
    useEffect(() => {
        if (mode === 'edit' && packageData) {
            setFormData({
                id: packageData.id,
                name: packageData.name,
                annual_price: packageData.annual_price,
                three_years_price: packageData.three_years_price,
                employee_limit: packageData.employee_limit,
                package_type: packageData.package_type,
                user_id: packageData.user_id,
                task: packageData.task || false,
                chat: packageData.chat || false,
                hr: packageData.hr || false,
                business_categories: packageData.business_categories || [],
            });
        }
    }, [mode, packageData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === 'annual_price' || name === 'three_years_price' || name === 'employee_limit') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
            setFormData(prev => ({
                ...prev,
                [name]: digitsOnly ? Number(digitsOnly) : 0,
            }));
            return;
        }

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked,
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleCategory = (category: BusinessCategory) => {
        setFormData(prev => {
            const exists = prev.business_categories.some(c => c.id === category.id);
            const updatedCategories = exists
                ? prev.business_categories.filter(c => c.id !== category.id)
                : [...prev.business_categories, category];
            return { ...prev, business_categories: updatedCategories };
        });
    };

    const prepareFormData = (): FormData => {
        const formDataToSubmit = new FormData();

        // Always include these fields
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('annual_price', formData.annual_price.toString());
        formDataToSubmit.append('three_years_price', formData.three_years_price.toString());
        formDataToSubmit.append('employee_limit', formData.employee_limit.toString());
        formDataToSubmit.append('package_type', formData.package_type);

        // Include module flags
        formDataToSubmit.append('task', formData.task ? 'true' : 'false');
        formDataToSubmit.append('chat', formData.chat ? 'true' : 'false');
        formDataToSubmit.append('hr', formData.hr ? 'true' : 'false');

        // Handle business categories
        formData.business_categories.forEach(category => {
            formDataToSubmit.append('business_category_ids[]', category.id.toString());
        });

        // Only include user_id if package is specific
        if (formData.package_type === 'specific' && formData.user_id) {
            formDataToSubmit.append('user_id', formData.user_id.toString());
        }

        return formDataToSubmit;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSubmit = prepareFormData();

        try {
            if (mode === 'edit' && packageId) {

                const updateData: PackagePlan = {
                    name: formData.name,
                    annual_price: formData.annual_price,
                    three_years_price: formData.three_years_price,
                    employee_limit: formData.employee_limit,
                    package_type: formData.package_type,
                    user_id: formData.user_id,
                    task: formData.task,
                    chat: formData.chat,
                    hr: formData.hr,
                    business_categories: formData.business_categories.map(c => ({ id: c.id })),
                };

                await updatePackage({
                    id: packageId,
                    formData: updateData,
                }).unwrap();
                router.back();
            } else {
                await createPackage(formDataToSubmit).unwrap();
                alert('Package created successfully!');
                setFormData(initialFormData);
            }
        } catch (error) {
            alert(`Error ${mode === 'edit' ? 'updating' : 'creating'} package`);
            console.error('Error:', error);
        }
    };

    if (mode === 'edit' && isPackageLoading) return <LoadingState />;

    return (
        <div className="add-packages-conatiner">
            <form onSubmit={handleSubmit} className="form">
                <div className="form-section">
                    <h2 className="section-title">Basic Information</h2>
                    <div className='form-group-outer'>
                        <div className="form-group">
                            <label className="form-label">Package Name <span className="required">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Premium Business Package"
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Applicable Categories</label>
                            <div className="multi-select" ref={dropdownRef}>
                                <div className="dropdown-container">
                                    <button
                                        type="button"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="dropdown-toggle"
                                    >
                                        <span>Select categories</span>
                                        <FiChevronDown className={`dropdown-icon ${showDropdown ? 'open' : ''}`} />
                                    </button>
                                    {showDropdown && (
                                        <div className="dropdown-menu">
                                            {categories?.map(category => (
                                                <div
                                                    key={category.id}
                                                    className="dropdown-item"
                                                    onClick={() => toggleCategory(category)}
                                                >
                                                    <div className="checkbox-container">
                                                        {formData.business_categories.some(c => c.id === category.id) ? (
                                                            <FiCheck className="checkbox checked" />
                                                        ) : (
                                                            <div className="checkbox unchecked" />
                                                        )}
                                                    </div>
                                                    <span>{category.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='form-group bc-group-span'>
                            <div className="selected-items">
                                {formData.business_categories.map(category => (
                                    <span key={category.id} className="selected-item">
                                        {category.name}
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory(category)}
                                            className="remove-item"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Package Type <span className="required">*</span>
                            </label>
                            <select
                                className="form-input"
                                name="package_type"
                                value={formData.package_type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="general">General</option>
                                <option value="specific">Specific</option>
                            </select>
                        </div>

                        {formData.package_type === 'specific' && (
                            <div className="form-group">
                                <label className="form-label">
                                    Select Admin <span className="required">*</span>
                                </label>
                                <select
                                    className="form-input"
                                    name="user_id"
                                    value={formData.user_id || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Choose an admin</option>
                                    {admins.map((admin) => (
                                        <option key={admin.id} value={admin.id}>
                                            {admin.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">
                                Annual Price <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="annual_price"
                                value={formData.annual_price || ''}
                                onChange={handleInputChange}
                                placeholder="Enter annual price"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Three Years Price <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="three_years_price"
                                value={formData.three_years_price || ''}
                                onChange={handleInputChange}
                                placeholder="Enter three years price"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Employee Limit <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="employee_limit"
                                value={formData.employee_limit || ''}
                                onChange={handleInputChange}
                                placeholder="Enter employee limit"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="limit-checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="task"
                                    checked={formData.task || false}
                                    onChange={handleInputChange}
                                />
                                <FiClipboard className="icon" /> Task Module
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="chat"
                                    checked={formData.chat || false}
                                    onChange={handleInputChange}
                                />
                                <FiMessageSquare className="icon" /> Chat Module
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="hr"
                                    checked={formData.hr || false}
                                    onChange={handleInputChange}
                                />
                                <FiUser className="icon" /> HR Module
                            </label>
                        </div>
                    </div>
                </div>

                <div className="package-action">
                    <button
                        type="submit"
                        className="buttons"
                    >
                        {mode === 'edit' ? 'Update Package' : 'Create Package'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Package;