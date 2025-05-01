'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchEmployeByIdQuery } from '@/slices/employe/employe';
import HrNavigation from '../../../components/hrNavigation';
import Image from 'next/image';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const ViewUserPage: React.FC = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Employee Profile');
  }, [setTitle]);

  const { id } = useParams() as { id: string };
  const {
    data,
    error: usersError,
    isLoading: usersLoading,
  } = useFetchEmployeByIdQuery(Number(id));

  const user = data;

  useEffect(() => {
    if (usersError) {
      toast.error('Failed to fetch user data');
    }
  }, [usersError]);

  if (usersLoading) return <p>Loading user data...</p>;
  if (!user) return <p>User not found</p>;

  const firstLetter = user?.name?.[0]?.toUpperCase();

  return (
    
    <div className="container employ-prpofile-container">
      <HrNavigation />

      <div className="profile-card">
      <div className="profile-mage-wrapper">
          {user?.profile_picture ? (
            <Image
              src={user.profile_picture}
              alt={user.name}
              className="profile-image"
              width={100}
              height={100}
            />
          ) : (
            <h1>{firstLetter}</h1>
          )}
        </div>

        <div className="profile-info">
          <h2 style={{ textTransform: 'capitalize' }}>{user.name}</h2>
          <div className='employ-details-wraper'>
          <p className="employee-meta">
            Role: {user.roles?.[0]?.name || 'N/A'} | Employee ID: <strong>{user.id}</strong>
          </p>
          <p className="employee-meta">
            Company: {user.company_name || 'N/A'} | Status: {user.user_status}
          </p>
          <p className="bio">This is a detailed employee profile view.</p>
          </div>
          <div className="info-row">
            <span><strong>Mobile:</strong> {user.number || 'N/A'}</span>
            <span><strong>Email:</strong> {user.email}</span>
            <span><strong>Birth Date:</strong> {user.employee_details?.dob || 'N/A'}</span>
            <span><strong>City:</strong> {user.employee_details?.address || 'N/A'}</span>
            <span><strong>Current Salary:</strong> ₹{user.employee_details?.currentSalary || 'N/A'}</span>
            <span><strong>Salary:</strong> ₹{user.employee_details?.salary || 'N/A'}</span>
            <span><strong>Joining Date:</strong> {user.employee_details?.joiningDate || 'N/A'}</span>
            <span><strong>Department:</strong> {user.employee_details?.department || 'N/A'}</span>
            <span><strong>Work Location:</strong> {user.employee_details?.workLocation || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="info-sections">
        <div className="info-card">
          <h3>Personal Information</h3>
          <p><strong>Nationality:</strong> {user.employee_details?.nationality || 'N/A'}</p>
          <p><strong>Religion:</strong> {user.employee_details?.religion || 'N/A'}</p>
          <p><strong>Marital Status:</strong> {user.employee_details?.maritalStatus || 'N/A'}</p>
          <p><strong>Passport No:</strong> {user.employee_details?.passportNo || 'N/A'}</p>
          <p><strong>Emergency Contact:</strong> {user.employee_details?.emergencyContact || 'N/A'}</p>
          <p><strong>Emergency Relation:</strong> {user.employee_details?.emergencyContactRelation || 'N/A'}</p>
          <p><strong>Medical Info:</strong> {user.employee_details?.medicalInfo || 'N/A'}</p>
          <p><strong>Joining Type:</strong> {user.employee_details?.joiningType || 'N/A'}</p>
          <p><strong>Previous Employer:</strong> {user.employee_details?.previousEmployer || 'N/A'}</p>
        </div>

        <div className="info-card">
          <h3>Bank Information</h3>
          <p><strong>Bank Name:</strong> {user.employee_details?.bankName || 'N/A'}</p>
          <p><strong>Account No:</strong> {user.employee_details?.accountNo || 'N/A'}</p>
          <p><strong>IFSC Code:</strong> {user.employee_details?.ifscCode || 'N/A'}</p>
          <p><strong>Pan No:</strong> {user.employee_details?.panNo || 'N/A'}</p>
          <p><strong>UPI Id:</strong> {user.employee_details?.upiId || 'N/A'}</p>
          <p><strong>Address Proof:</strong> {user.employee_details?.addressProof || 'N/A'}</p>
        </div>
      </div>

      
    </div>
  );
};

export default ViewUserPage;
