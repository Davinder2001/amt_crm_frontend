'use client';
import React from 'react';
import { useFetchProfileQuery } from '@/slices/auth/authApi';
import Link from 'next/link';

const Profile = () => {
  const { data, isLoading, isError } = useFetchProfileQuery();

  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p>Failed to load profile.</p>;

  const user = data?.user;

  return (
    <div className="profile-wrapper">
      <h1 className="profile-title">Profile</h1>
      <p><strong>ID:</strong> {user?.id}</p>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Number:</strong> {user?.number}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>UID:</strong> {user?.uid}</p>
      <p><strong>User Type:</strong> {user?.user_type}</p>

      {user?.meta && Array.isArray(user.meta) && user.meta.length > 0 && (
        <div className="meta-section">
          <h2 className="section-title">Additional Info</h2>
          {Object.entries(user.meta).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace('_', ' ')}:</strong> {String(value)}
            </p>
          ))}
        </div>
      )}

      {(user?.companies ?? []).length > 0 && (
        <div className="companies-section">
          <h2 className="section-title">Associated Companies</h2>
          <div className="company-grid">
            {(user?.companies ?? []).map((company: Company) => (
              <div key={company.id} className="company-card">
                <h3>{company.company_name}</h3>
                <p><strong>Slug:</strong> {company.company_slug}</p>
                <p><strong>Company ID:</strong> {company.company_id}</p>
                <p><strong>Status:</strong> <span>{company.verification_status}</span></p>
                <p><strong>Payment:</strong> <span>{company.payment_status}</span></p>
              </div>
            ))}

            {/* Add Company Button */}
            <div className="company-card add-company-card">
              {/* <button className="add-button" onClick={() => alert('Redirect to create company')}>
                +
              </button> */}
              <Link href="my-account/add-company" className='add-button'>
                +
              </Link>
              <p className="add-text">Add Company</p>
            </div>
          </div>

          <div className="password-change-btn">
            <Link href="my-account/change-password">
              Change Password
            </Link>
          </div>


        </div>
      )}

      <style jsx>{`
        .profile-wrapper {
          padding: 24px;
          font-family: Arial, sans-serif;
        }

        .profile-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .meta-section {
          margin-top: 24px;
        }

        .companies-section {
          margin-top: 36px;
        }

        .company-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .company-card {
          border: 1px solid #ddd;
          padding: 16px;
          border-radius: 8px;
          background-color: #fff;
          transition: box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .company-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .company-card h3 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 6px;
        }

        .company-card p {
          margin: 4px 0;
          font-size: 14px;
        }

        .company-card span {
          text-transform: capitalize;
        }

        .add-company-card {
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
        }

        .add-button {
          width: 48px;
          height: 48px;
          font-size: 28px;
          border-radius: 50%;
          border: 2px solid #333;
          background-color: transparent;
          color: #333;
          margin: 0 auto;
          cursor: pointer;
          line-height: 0;
        }

        .add-text {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #444;
        }
      `}</style>
    </div>
  );
};

export default Profile;
