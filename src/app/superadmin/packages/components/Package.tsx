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
import { FaArrowLeft, FaRupeeSign } from 'react-icons/fa';
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
        monthly_price: 0,
        annual_price: 0,
        three_years_price:0,
        business_categories: [],
    });
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const { setTitle } = useBreadcrumb();

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
                annual_price: packageData.annual_price || 0,
                monthly_price: packageData.monthly_price || 0,
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
            'employee_numbers',
            'items_number',
            'daily_tasks_number',
            'invoices_number',
            'monthly_price',
            'annual_price'
        ];

        if (numberFields.includes(name)) {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
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
        const exists: boolean = formData.business_categories.some(c => c.id === category.id);
        setFormData(prev => {
            const updatedCategories = exists
                ? prev.business_categories.filter(c => c.id !== category.id)
                : [
                    ...prev.business_categories,
                    {
                        ...category,
                        description: category.description ?? '',
                    },
                ];
            // Ensure all descriptions are strings
            const normalizedCategories = updatedCategories.map(c => ({
                ...c,
                description: c.description ?? '',
            }));
            return { ...prev, business_categories: normalizedCategories };
        });
    };

    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            formData.monthly_price > 0 &&
            formData.annual_price > 0 &&
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

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'business_categories') {
                (value as BusinessCategory[]).forEach(category => {
                    formDataToSubmit.append('business_category_ids[]', category.id.toString());
                });
            } else if (value !== null && value !== undefined) {
                formDataToSubmit.append(key, value.toString());
            } else {
                formDataToSubmit.append(key, '');
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
                    } as unknown as PackagePlan
                }).unwrap();
                router.back();
            } else {
                await createPackage(formDataToSubmit).unwrap();
                alert('Package created successfully!');
                if (mode === 'add') {
                    setFormData({
                        name: '',
                        employee_numbers: 0,
                        items_number: 0,
                        daily_tasks_number: 0,
                        invoices_number: 0,
                        monthly_price: 0,
                        annual_price: 0,
                        three_years_price:0,
                        business_categories: [],
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
        <div>
            <button className="back-button" onClick={() => router.back()}>
                <FaArrowLeft size={16} color="#fff" />
            </button>
            <div className="add-packages-conatiner">
                <div className="header">
                    <h2>{mode === 'edit' ? 'Edit Package' : 'Add New Plan'}</h2>
                    <p>{mode === 'edit'
                        ? 'Modify existing package details'
                        : 'Configure a new subscription package for businesses'}</p>
                </div>

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
                                <label className="form-label">Monthly Price <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <FaRupeeSign className="input-icon" />
                                    <input
                                        type="number"
                                        name="monthly_price"
                                        value={formData.monthly_price || ''}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="form-input"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Annual Price <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <FaRupeeSign className="input-icon" />
                                    <input
                                        type="number"
                                        name="annual_price"
                                        value={formData.annual_price || ''}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="form-input"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">3 Years Price <span className="required">*</span></label>
                                <div className="input-with-icon">
                                    <FaRupeeSign className="input-icon" />
                                    <input
                                        type="number"
                                        name="three_years_price"
                                        value={formData.three_years_price || ''}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="form-input"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Package Limits</h2>
                        <div className="grids grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label"><FiUsers className="icon" /> Employees</label>
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
                            <div className="form-group">
                                <label className="form-label"><FiBox className="icon" /> Inventory Items</label>
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
                            <div className="form-group">
                                <label className="form-label"><FiCheckCircle className="icon" /> Daily Tasks</label>
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
                            <div className="form-group">
                                <label className="form-label"><FiFileText className="icon" /> Invoices</label>
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
                                                onClick={() => toggleCategory(category)}
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
        </div>
    );
};

export default Package;
