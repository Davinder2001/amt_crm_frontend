'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    FiChevronDown,
    FiCheck,
    FiX,
    FiUsers,
    FiBox,
    FiCheckCircle,
    FiFileText,
    FiTag
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import {
    useCreatePackageMutation,
    useFetchSinglePackageQuery,
    useUpdatePackageMutation
} from '@/slices/superadminSlices/packages/packagesApi';
import { useGetBusinessCategoriesQuery } from '@/slices/superadminSlices/businessCategory/businesscategoryApi';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useRouter } from 'next/navigation';

interface PackageProps {
    mode?: "add" | "edit";
    packageId?: number;
}

const Package: React.FC<PackageProps> = ({ mode = 'add', packageId }) => {
    const [formData, setFormData] = useState<PackagePlan>({
        name: '',
        employee_numbers: 0,
        items_number: 0,
        daily_tasks_number: 0,
        invoices_number: 0,
        price: 0,
        business_categories: [],
        package_type: 'monthly',
    });
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const { setTitle } = useBreadcrumb();

    // API Hooks
    const { data: categories } = useGetBusinessCategoriesQuery();
    const [createPackage] = useCreatePackageMutation();
    const [updatePackage] = useUpdatePackageMutation();
    const { data: packageData, isLoading: isPackageLoading } = useFetchSinglePackageQuery(
        packageId ? String(packageId) : "",
        { skip: mode !== 'edit' || !packageId }
    );

    useEffect(() => {
        if (mode === 'edit' && packageData) {
            setFormData({
                ...packageData,
                business_categories: packageData.business_categories || [],
                package_type: packageData.package_type || 'monthly',
            });
        }
    }, [packageData, mode]);

    useEffect(() => {
        setTitle(mode === 'edit' ? 'Edit Package' : 'Create New Package');
    }, [mode, setTitle]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        const numberFields = [
            'price',
            'employee_numbers',
            'items_number',
            'daily_tasks_number',
            'invoices_number',
        ];

        if (numberFields.includes(name)) {
            const digitsOnly = value.replace(/\D/g, '').slice(0,8);

            setFormData(prev => ({
                ...prev,
                [name]: digitsOnly ? Number(digitsOnly) : 0,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const toggleCategory = (category: BusinessCategory) => {
        setFormData(prev => {
            const exists = prev.business_categories.some(c => c.id === category.id);
            const updatedCategories = exists
                ? prev.business_categories.filter(c => c.id !== category.id)
                : [
                    ...prev.business_categories,
                    {
                        ...category,
                        description: category.description ?? '',
                        created_at: category.created_at ?? '',
                        updated_at: category.updated_at ?? ''
                    }
                ];
            return { ...prev, business_categories: updatedCategories };
        });
    };

    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            formData.price > 0 &&
            formData.employee_numbers >= 0 &&
            formData.items_number >= 0 &&
            formData.daily_tasks_number >= 0 &&
            formData.invoices_number >= 0 &&
            formData.business_categories.length > 0
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSubmit = new FormData();

        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'business_categories') {
                (value as BusinessCategory[]).forEach(category => {
                    formDataToSubmit.append('business_category_ids[]', category.id.toString());
                });
            } else {
                formDataToSubmit.append(key, value.toString());
            }
        });

        try {
            if (mode === 'edit' && packageId) {
                const { business_categories, ...rest } = formData;
                await updatePackage({
                    id: packageId,
                    data: {
                        ...rest,
                        business_category_ids: business_categories.map(c => c.id),
                    } as unknown as PackagePlan // Cast to 'any' or the correct DTO type expected by your API
                }).unwrap();
                router.back(); // Goes one step back

            }
            else {
                await createPackage(formDataToSubmit).unwrap();
                alert('Package created successfully!');
                // Reset form for create mode
                if (mode === 'add') {
                    setFormData({
                        name: '',
                        employee_numbers: 0,
                        items_number: 0,
                        daily_tasks_number: 0,
                        invoices_number: 0,
                        price: 0,
                        business_categories: [],
                        package_type: 'monthly',
                    });
                }
            }
        } catch (error) {
            alert(`Error ${mode === 'edit' ? 'updating' : 'creating'} package`);
            console.error('Error:', error);
        }
    };

    if (mode === 'edit' && isPackageLoading) return <div>Loading package data...</div>;


    return (
        <div className="add-packages-conatiner">
            <div className="header">
                <h1>{mode === 'edit' ? 'Edit Package' : 'Create New Package'}</h1>
                <p>{mode === 'edit'
                    ? 'Modify existing package details'
                    : 'Configure a new subscription package for businesses'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-section">
                    <h2 className="section-title">Basic Information</h2>
                    <div className='form-group-outer'>
                        <div className="form-group">
                            <label className="form-label">
                                Package Name <span className="required">*</span>
                            </label>
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
                            <label className="form-label">
                                {formData.package_type === 'yearly' ? 'Yearly' : 'Monthly'} Price <span className="required">*</span>
                            </label>
                            <div className="input-with-icon">
                                <FaRupeeSign className="input-icon" />
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price ? Math.floor(Number(formData.price)) : ''}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    className="form-input"
                                    min="0"
                                    maxLength={10}
                                    step="1"  // step 1 to restrict decimals
                                    required
                                />

                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Package Type <span className="required">*</span>
                            </label>
                            <select
                                name="package_type"
                                value={formData.package_type}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Package Limits</h2>
                    <div className="grids grid-cols-2 gap-6">
                        {/* Employee Limit */}
                        <div className="form-group">
                            <label className="form-label">
                                <FiUsers className="icon" /> Employees
                            </label>
                            <input
                                type="number"
                                name="employee_numbers"
                                value={formData.employee_numbers || ''}
                                onChange={handleInputChange}
                                className="form-input"
                                min="0"
                                placeholder="Max employees"
                                required
                            />
                        </div>

                        {/* Inventory Items Limit */}
                        <div className="form-group">
                            <label className="form-label">
                                <FiBox className="icon" /> Inventory Items
                            </label>
                            <input
                                type="number"
                                name="items_number"
                                value={formData.items_number || ''}
                                onChange={handleInputChange}
                                className="form-input"
                                min="0"
                                placeholder="Max items allowed"
                                required
                            />
                        </div>

                        {/* Daily Tasks Limit */}
                        <div className="form-group">
                            <label className="form-label">
                                <FiCheckCircle className="icon" /> Daily Tasks
                            </label>
                            <input
                                type="number"
                                name="daily_tasks_number"
                                value={formData.daily_tasks_number || ''}
                                onChange={handleInputChange}
                                className="form-input"
                                min="0"
                                placeholder="Max daily tasks"
                                required
                            />
                        </div>

                        {/* Invoices Limit */}
                        <div className="form-group">
                            <label className="form-label">
                                <FiFileText className="icon" /> Invoices
                            </label>
                            <input
                                type="number"
                                name="invoices_number"
                                value={formData.invoices_number || ''}
                                onChange={handleInputChange}
                                className="form-input"
                                min="0"
                                placeholder="Max invoices/month"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2 className="section-title">Business Categories</h2>
                    <div className="form-group">
                        <label className="form-label"><FiTag /> Applicable Categories</label>
                        <div className="multi-select" ref={dropdownRef}>
                            <div className="selected-items">
                                {formData.business_categories.map(category => (
                                    <span key={category.id} className="selected-item">
                                        {category.name}
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory({
                                                id: category.id,
                                                name: category.name,
                                                description: category.description ?? '',
                                                created_at: category.created_at ?? '',
                                                updated_at: category.updated_at ?? ''
                                            })}
                                            className="remove-item"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>

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
                                                onClick={() => toggleCategory({
                                                    id: category.id,
                                                    name: category.name,
                                                    description: category.description ?? '',
                                                    created_at: category.created_at ?? '',
                                                    updated_at: category.updated_at ?? ''
                                                })}
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
                </div>

                <div className="tooltip-container">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={!isFormValid()}
                    >
                        {mode === 'edit' ? 'Update Package' : 'Create Package'}
                    </button>
                    {!isFormValid() && (
                        <div className="hover-tooltip">
                            Please fill all required fields
                            <div className="tooltip-arrow"></div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Package;