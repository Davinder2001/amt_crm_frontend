'use client';
import React, { useState } from 'react';
import {
    Tabs,
    Tab,
    Box
} from '@mui/material';
import {
    FiChevronDown,
    FiCheck,
    FiX,
    FiDollarSign,
    FiUsers,
    FiBox,
    FiCheckCircle,
    FiFileText,
    FiInfo,
    FiList,
    FiTag
} from 'react-icons/fi';
import { useCreatePackageMutation } from '@/slices/superadminSlices/packages/packagesApi';
import { useGetBusinessCategoriesQuery } from '@/slices/superadminSlices/businessCategory/businesscategoryApi';

const CreatePackages = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<createPackagePlan>({
        name: '',
        employee_numbers: 0,
        items_number: 0,
        daily_tasks_number: 0,
        invoices_number: 0,
        price: 0,
        business_categories: [],
    });

    const { data: categories, isLoading, isError } = useGetBusinessCategoriesQuery();
    const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'name' ? value : Number(value),
        }));
    };

    const toggleCategory = (category: BusinessCategory) => {
        setFormData((prev) => {
            const exists = prev.business_categories.some((c) => c.id === category.id);
            const updated = exists
                ? prev.business_categories.filter((c) => c.id !== category.id)
                : [...prev.business_categories, category];
            return { ...prev, business_categories: updated };
        });
    };

    const removeCategory = (id: number) => {
        setFormData((prev) => ({
            ...prev,
            business_categories: prev.business_categories.filter((c) => c.id !== id),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSubmit = new FormData();

            // Append each field individually
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('employee_numbers', formData.employee_numbers.toString());
            formDataToSubmit.append('items_number', formData.items_number.toString());
            formDataToSubmit.append('daily_tasks_number', formData.daily_tasks_number.toString());
            formDataToSubmit.append('invoices_number', formData.invoices_number.toString());
            formDataToSubmit.append('price', formData.price.toString());

            // Append business categories as an array
            formData.business_categories.forEach((category) => {
                formDataToSubmit.append('business_category_ids[]', category.id.toString());
            });

            await createPackage(formDataToSubmit).unwrap();
            alert('Package created successfully!');

            // Reset form
            setFormData({
                name: '',
                employee_numbers: 0,
                items_number: 0,
                daily_tasks_number: 0,
                invoices_number: 0,
                price: 0,
                business_categories: [],
            });
        } catch (error) {
            alert('Error creating package');
            console.error('Error:', error);
        }
    };

    if (isLoading) return <div className="loading">Loading categories...</div>;
    if (isError) return <div className="error">Error loading categories.</div>;

    return (
        <div className="add-packages-conatiner">
            <div className="header">
                <h1>Create New Package</h1>
                <p>Configure a new subscription package for businesses</p>
            </div>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} textColor="primary" indicatorColor="primary">
                    <Tab icon={<FiInfo />} iconPosition="start" label="Basic Info" />
                    <Tab icon={<FiList />} iconPosition="start" label="Limits" />
                    <Tab icon={<FiTag />} iconPosition="start" label="Categories" />
                </Tabs>
            </Box>

            <form onSubmit={handleSubmit} className="form">
                {activeTab === 0 && (
                    <div className="form-section">
                        <h2 className="section-title">Basic Information</h2>
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
                                Monthly Price ($) <span className="required">*</span>
                            </label>
                            <div className="input-with-icon">
                                <FiDollarSign className="input-icon" />
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price || ''}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="form-input"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 1 && (
                    <div className="form-section">
                        <h2 className="section-title">Package Limits</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">
                                    <FiUsers className="icon" /> Employees
                                </label>
                                <input
                                    type="number"
                                    name="employee_numbers"
                                    value={formData.employee_numbers}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FiBox className="icon" /> Inventory Items
                                </label>
                                <input
                                    type="number"
                                    name="items_number"
                                    value={formData.items_number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FiCheckCircle className="icon" /> Daily Tasks
                                </label>
                                <input
                                    type="number"
                                    name="daily_tasks_number"
                                    value={formData.daily_tasks_number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FiFileText className="icon" /> Invoices
                                </label>
                                <input
                                    type="number"
                                    name="invoices_number"
                                    value={formData.invoices_number}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 2 && (
                    <div className="form-section">
                        <h2 className="section-title">Business Categories</h2>
                        <div className="form-group">
                            <label className="form-label">Applicable Categories</label>
                            <div className="multi-select">
                                <div className="selected-items">
                                    {formData.business_categories.map((category) => (
                                        <span key={category.id} className="selected-item">
                                            {category.name}
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(category.id)}
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
                                            {categories?.map((category) => (
                                                <div
                                                    key={category.id}
                                                    className="dropdown-item"
                                                    onClick={() => toggleCategory(category)}
                                                >
                                                    <div className="checkbox-container">
                                                        {formData.business_categories.some((c) => c.id === category.id) ? (
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
                )}

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={isCreating}>
                        {isCreating ? 'Creating Package...' : 'Create Package'}
                    </button>
                </div>
            </form>
            <style jsx>{`
        .add-packages-conatiner {
          margin: 2rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .header h1 {
          font-size: 1.8rem;
          color: #2d3748;
        }

        .header p {
          color: #718096;
          font-size: 1rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 1.2rem;
          color: #2d3748;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #4a5568;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .required {
          color: #e53e3e;
          margin-left: 0.25rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 1px #3182ce;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #718096;
        }

        .input-with-icon .form-input {
          padding-left: 2.5rem;
        }

        .icon {
          color: #4a5568;
        }

        .multi-select {
          position: relative;
        }

        .selected-items {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          min-height: 2.5rem;
        }

        .selected-item {
          background: #edf2f7;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .remove-item {
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .remove-item:hover {
          color: #e53e3e;
        }

        .dropdown-container {
          position: relative;
        }

        .dropdown-toggle {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #fff;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .dropdown-toggle:hover {
          border-color: #a0aec0;
        }

        .dropdown-icon {
          transition: transform 0.2s;
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-height: 300px;
          overflow-y: auto;
          z-index: 10;
          margin-top: 0.25rem;
        }

        .dropdown-item {
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background: #f7fafc;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkbox {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 4px;
          border: 1px solid #cbd5e0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkbox.unchecked {
          background: #fff;
        }

        .checkbox.checked {
          background: #3182ce;
          color: #fff;
          border-color: #3182ce;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
        }

        .submit-button {
          background: #3182ce;
          color: #fff;
          border: none;
          padding: 0.875rem 1.75rem;
          border-radius: 6px;
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: #2c5282;
        }

        .submit-button:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }

        .loading, .error {
          padding: 2rem;
          text-align: center;
          background: #f8fafc;
          border-radius: 8px;
        }

        .error {
          color: #e53e3e;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .form-section {
            padding: 1rem;
          }

          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default CreatePackages;
