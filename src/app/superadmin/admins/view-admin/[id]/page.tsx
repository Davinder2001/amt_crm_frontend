'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetAdminByIdQuery } from '@/slices/superadminSlices/adminManagement/adminManageApi';

const ViewAdminPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetAdminByIdQuery(id as string);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading admin.</p>;

  const admin = data?.admin;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Details</h1>

      <div className="admin-card">
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Number:</strong> {admin.number}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>UID:</strong> {admin.uid}</p>
        <p><strong>Status:</strong> {admin.user_status}</p>
        <p><strong>Created At:</strong> {new Date(admin.created_at).toLocaleString()}</p>
      </div>

      <h2 className="admin-subtitle">Associated Companies</h2>

      <div className="company-cards-wrapper">
        {admin.companies?.length > 0 ? (
          admin.companies.map((company: any) => (
            <div key={company.id} className="company-card">
              <h3>{company.name}</h3>
              <p><strong>Slug:</strong> {company.slug}</p>
            </div>
          ))
        ) : (
          <p className="no-companies">No associated companies.</p>
        )}
      </div>
      <style>
        {`
         .admin-container {
  padding: 24px;
  font-family: Arial, sans-serif;
}

.admin-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.admin-subtitle {
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px;
}

.admin-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.company-cards-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.company-card {
  flex: 1 1 calc(33.333% - 16px);
  min-width: 250px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 6px;
  transition: box-shadow 0.3s ease;
}

.company-card:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.company-card h3 {
  margin-top: 0;
  font-size: 18px;
}

.no-companies {
  color: #888;
  font-style: italic;
}

        `}
      </style>
    </div>
  );
};

export default ViewAdminPage;
