'use client';
import React, { useState, useEffect, useRef } from 'react';
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
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const { data: categories, isLoading, isError } = useGetBusinessCategoriesQuery();
  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value),
    }));
  };
  const { setTitle } = useBreadcrumb();
  useEffect(() => {
    setTitle('Create New Package Plan');
  }, [setTitle]);
  const toggleCategory = (category: BusinessCategory) => {
    setFormData((prev) => {
      const exists = prev.business_categories.some((c) => c.id === category.id);
      const updated = exists
        ? prev.business_categories.filter((c) => c.id !== category.id)
        : [...prev.business_categories, category];
      return { ...prev, business_categories: updated };
    });
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
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} textColor="primary" indicatorColor="primary"
          style={{ backgroundColor: '#f1f9f9' }}
          sx={{
            '& .MuiTab-root': {
              color: '#009693',
              '&.Mui-disabled': {
                color: '#ccc',
              },
              '&.Mui-selected': {
                color: '#009693',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#009693',
            },
          }}
        >
          <Tab icon={<FiInfo />} iconPosition="start" label="Basic Info" />
          <Tab icon={<FiList />} iconPosition="start" label="Limits" />
          <Tab icon={<FiTag />} iconPosition="start" label="Categories" />
        </Tabs>
      </Box>

      <form onSubmit={handleSubmit} className="form">
        {activeTab === 0 && (
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
          </div>
        )}

        {activeTab === 1 && (
          <div className="form-section">
            <h2 className="section-title">Package Limits</h2>
            <div className="grids grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  <FiUsers className="icon" /> Employees
                </label>
                <input
                  type="number"
                  name="employee_numbers"
                  value={formData.employee_numbers === 0 ? '' : formData.employee_numbers}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  placeholder="Maximum number of employees"
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
                  value={formData.items_number === 0 ? '' : formData.items_number}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  placeholder="Maximum inventory items allowed"
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
                  value={formData.daily_tasks_number === 0 ? '' : formData.daily_tasks_number}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  placeholder="Maximum daily tasks"
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
                  value={formData.invoices_number === 0 ? '' : formData.invoices_number}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  placeholder="Maximum invoices per month"
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
              <label className="form-label"><FiTag /> Applicable Categories</label>
              <div className="multi-select">
                {formData.business_categories.length > 0 && (
                  <div className="selected-items">
                    {formData.business_categories.map((category) => (
                      <span key={category.id} className="selected-item">
                        {category.name}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, business_categories: [] })}
                          className="remove-item"
                        >
                          {formData.business_categories.length === 1 ? (
                            <FiX size={16} />
                          ) : (
                            <span>clear all</span>
                          )}
                        </button>
                      </span>
                    ))}
                  </div>
                )}


                <div className="dropdown-container" ref={dropdownRef}>
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

    </div>
  );
};

export default CreatePackages;
