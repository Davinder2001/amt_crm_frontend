'use client'
import React, { useState } from 'react';
import { useAddNewCompanyMutation } from '@/slices/company/companyApi';

const AddCompanyForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [addNewCompany, { isLoading, isSuccess, isError, error }] = useAddNewCompanyMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addNewCompany({ company_name: companyName });

    setCompanyName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="companyName">Company Name:</label>
      <input
        type="text"
        id="companyName"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Company'}
      </button>

      {isSuccess && <p style={{ color: 'green' }}>Company created successfully!</p>}
      {isError && <p style={{ color: 'red' }}>Failed to create company.</p>}
    </form>
  );
};

export default AddCompanyForm;
