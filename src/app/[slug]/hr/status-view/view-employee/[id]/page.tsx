'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchEmployesQuery } from '@/slices/employe/employe';
import HrNavigation from '../../../components/hrNavigation';

interface Role {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  number: string;
  company_name: string;
  roles: Role[];
  // Add the meta data as an optional property
  meta?: {
    dateOfHire?: string;
    joiningDate?: string;
    shiftTimings?: string;
  };
}

const ViewUserPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchEmployesQuery();


  
  useEffect(() => {
    if (usersError) {
      toast.error('Failed to fetch user data');
    }
  }, [usersError]);
  
  if (usersLoading) return <p>Loading user data...</p>;
  
  const user = usersData?.employees.find((user: Employee) => user.id.toString() === id);
  
  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <HrNavigation />
      <h1>View Employee</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Field</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Name</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Email</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Phone Number</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.number}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Company Name</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.company_name}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Role</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {user.roles?.[0]?.name || 'No role assigned'}
            </td>
          </tr>
          {user.meta && (
            <>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Date Of Hire</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {user.meta.dateOfHire || 'N/A'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Joining Date</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {user.meta.joiningDate || 'N/A'}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Shift Timings</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {user.meta.shiftTimings || 'N/A'}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUserPage;
