'use client';
import React, { useState } from 'react';
import { useCreatePackageMutation } from '@/slices/superadminSlices/packages/packagesApi'; 

const CreatePackages = () => {
  // State to hold form input values
  const [formData, setFormData] = useState({
    name: '',
    employee_numbers: '',
    items_number: '',
    daily_tasks_number: '',
    invoices_number: '',
  });

  // Destructure the mutation hook for creating a package
  const [createPackage, { isLoading, isSuccess, isError, error }] = useCreatePackageMutation();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the input
    if (!formData.name || !formData.employee_numbers || !formData.items_number || !formData.daily_tasks_number || !formData.invoices_number) {
      alert('Please fill all fields');
      return;
    }

    try {
      // Call the mutation to create the package
      await createPackage(formData).unwrap();
      alert('Package created successfully');
    } catch (err) {
      alert('Error creating package: ' + (error?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <h1>Create Package</h1>
      <form onSubmit={handleSubmit} style={{ width: '400px', margin: 'auto' }}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Employees</label>
          <input
            type="number"
            name="employee_numbers"
            value={formData.employee_numbers}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Items</label>
          <input
            type="number"
            name="items_number"
            value={formData.items_number}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Daily Tasks</label>
          <input
            type="number"
            name="daily_tasks_number"
            value={formData.daily_tasks_number}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Invoices</label>
          <input
            type="number"
            name="invoices_number"
            value={formData.invoices_number}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
          {isLoading ? 'Creating...' : 'Create Package'}
        </button>
      </form>

      {isSuccess && <p>Package created successfully!</p>}
      {isError && <p>Error: {error?.message || 'Something went wrong'}</p>}
    </div>
  );
};

export default CreatePackages;
