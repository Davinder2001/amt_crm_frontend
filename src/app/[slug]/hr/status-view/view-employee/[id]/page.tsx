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

  const user = data?.employee;

  useEffect(() => {
    if (usersError) {
      toast.error('Failed to fetch user data');
    }
  }, [usersError]);

  if (usersLoading) return <p>Loading user data...</p>;
  if (!user) return <p>User not found</p>;

  const firstLetter = user?.name?.[0]?.toUpperCase();

  return (
    <div className="container">
      <HrNavigation />

      <div className="profile-card">
      <div className="profile-mage-wrapper">
          {user?.profilePicture ? (
            <Image
              src={user.profilePicture}
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
          <p className="employee-meta">
            Role: {user.roles?.[0]?.name || 'N/A'} | Employee ID: <strong>{user.id}</strong>
          </p>
          <p className="employee-meta">
            Company: {user.company_name || 'N/A'} | Status: {user.user_status}
          </p>
          <p className="bio">This is a detailed employee profile view.</p>
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

      <style jsx>{`
        .container {
          padding: 20px;
          margin: auto;
        }
        .profile-card {
          display: flex;
          background: #f9fbfc;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        .profile-mage-wrapper {
          max-width: 100px;
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 150, 147, 0.06);
          border-radius: 50%;
          margin-right: 20px;
        }
        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-info {
          flex-grow: 1;
        }
        .employee-meta {
          font-size: 14px;
          color: #777;
        }
        .bio {
          font-size: 14px;
          color: #555;
          margin-top: 5px;
        }
        .info-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 20px;
          font-size: 14px;
          color: #333;
          margin-top: 8px;
        }
        .info-row span {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background-color: rgba(0, 150, 147, 0.06);
          padding: 5px;
        }
        .info-sections {
          display: flex;
          gap: 20px;
        }
        .info-card {
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          flex: 1;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .info-card h3 {
          margin-bottom: 10px;
          font-size: 16px;
        }
        .info-card p {
          font-size: 14px;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default ViewUserPage;
