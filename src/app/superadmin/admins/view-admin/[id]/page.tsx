"use client";
import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { useGetAdminByIdQuery } from '@/slices/superadminSlices/adminManagement/adminManageApi';
import { FaArrowLeft } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';


const ViewAdminPage = () => {
  const { setTitle } = useBreadcrumb();
    
      useEffect(() => {
        setTitle('Admin Details'); // Update breadcrumb title
      }, [setTitle]);

  const { id } = useParams();
  const router = useRouter(); // ✅ Correct usage

  const { data, isLoading, error } = useGetAdminByIdQuery(id as string);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading admin.</p>;

  const admin = data;

  if (!admin) return <p>No admin data available.</p>;

  return (
    <div className="vadmin-container">
      <div className='view-admin-back-btn'>
        <button className="buttons" onClick={() => router.back()}>
          <FaArrowLeft /> Back
        </button>
      </div>
    <div className="Vadmin-inner-container">

      <div className="admin-card">
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Number:</strong> {admin.number}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>UID:</strong> {admin.uid}</p>
        {/* <p><strong>Status:</strong> {admin.user_status}</p> */}
        <p>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color: admin.user_status === 'active' ? 'green' : admin.user_status === 'blocked' ? 'red' : 'black',
              textTransform: 'capitalize'
            }}
          >
            {admin.user_status}
          </span>
        </p>

        <p><strong>Created At:</strong> {new Date(admin.created_at).toLocaleString()}</p>
      </div>

      <h2 className="admin-subtitle">Associated Companies</h2>

      <div className="company-cards-wrapper">
        {admin.companies?.length > 0 ? (
          admin.companies.map((company: Company) => (
            <div key={company.id} className="company-card">
              <h3>{company.name}</h3>
              <p><strong>Slug:</strong> {company.slug}</p>
            </div>
          ))
        ) : (
          <p className="no-companies">No associated companies.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default ViewAdminPage;
