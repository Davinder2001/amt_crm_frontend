'use client';
import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchUsersQuery, useUpdateUserMutation } from '@/slices/users/userApi';
import { useGetRolesQuery } from '@/slices/roles/rolesApi';
import HrNavigation from '../../components/hrNavigation';

interface Role {
  id: number;
  name: string;
}

const EditUserPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchUsersQuery();
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Initialize role as an empty string.
  const [role, setRole] = useState('');

  // When user data is fetched, populate the fields
  useEffect(() => {
    if (usersData) {
      const user = usersData.users.find((user: any) => user.id.toString() === id);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        // If user has roles, use the first role's name; otherwise, default to an empty string.
        setRole(user.roles && user.roles.length > 0 ? user.roles[0].name : '');
      }
    }
  }, [usersData, id]);

  if (usersLoading) return <p>Loading user data...</p>;
  if (usersError) return <p>Error fetching user data.</p>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        id: parseInt(id, 10),
        name,
        email,
        role, // sending role name from the dropdown
      }).unwrap();
      toast.success('User updated successfully!');
      // Optionally, navigate back or refresh the page
      // router.push('/somepath');
    } catch (err: any) {
      console.error('Failed to update user', err);
      toast.error('Failed to update user. Please try again.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <HrNavigation/>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Select Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          >
            {rolesLoading ? (
              <option>Loading roles...</option>
            ) : rolesError ? (
              <option>Error loading roles</option>
            ) : rolesData && rolesData.length > 0 ? (
              <>
                <option value="">Select a role</option>
                {rolesData.map((roleItem: Role) => (
                  <option key={roleItem.id} value={roleItem.name}>
                    {roleItem.name}
                  </option>
                ))}
              </>
            ) : (
              <option value="">No roles available</option>
            )}
          </select>
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          style={{
            width: '100%',
            padding: '12px',
            background: isUpdating ? '#ccc' : '#0070f3',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default EditUserPage;
