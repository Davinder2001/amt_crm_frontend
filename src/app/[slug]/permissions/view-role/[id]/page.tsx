'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetRoleQuery } from '@/slices/roles/rolesApi';
import { FaArrowLeft } from 'react-icons/fa';
import Loader from '@/components/common/Loader';
import { toast } from 'react-toastify';

const ViewRole: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: roleData, isLoading, error } = useGetRoleQuery(Number(id));

  if (isLoading) return <Loader />;

  if (error || !roleData) {
    toast.error('Error fetching role details.');
    return <div>Error loading role details.</div>;
  }

  return (
    <div className="view-role-page">
      <button onClick={() => router.back()} className="back-button">
        <FaArrowLeft size={20} color="#fff" />
      </button>

      <h2 className="view-role-title">View Role</h2>

      <div className="view-role-details">
        <div className="view-role-field">
          <strong>Role Name:</strong>
          <span>{roleData.name}</span>
        </div>

        <div className="view-role-field">
          <strong>Company ID:</strong>
          <span>{roleData.company_id || 'N/A'}</span>
        </div>

        <div className="view-role-field">
          <strong>Permissions:</strong>
          <span>
            {roleData.permissions && roleData.permissions.length > 0
              ? roleData.permissions.map((perm: { name: any; }) => perm.name).join(', ')
              : 'None'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewRole;
