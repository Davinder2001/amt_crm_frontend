'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetchCompaniesQuery } from '@/slices/superadminSlices/company/companyApi';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const CompanyComponent = () => {
  const { data, error, isLoading } = useFetchCompaniesQuery();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading companies...</div>;
  }

  if (error) {
    return <div>Error loading companies.</div>;
  }

  // Access the companies array inside the returned object.
  const companies: Company[] = data?.data || [];

  return (
    <div>
      <h1>Companies</h1>
      <table className='company-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Company Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.company_name}</td>
              <td>
                
                <span onClick={() => router.push(`companies/delete/${company.id}`)}>
                <FaTrash color='#222' />
                  
                </span>
                <span onClick={() => router.push(`companies/edit/${company.id}`)}>
                <FaEdit color='#222' />
                  
                </span>
                <span onClick={() => router.push(`companies/view/${company.id}`)}>
                <FaEye color='#222' />
                </span>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyComponent;
