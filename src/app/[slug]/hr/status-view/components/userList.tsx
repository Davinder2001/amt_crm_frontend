'use client';

import React from 'react';
import { useFetchUsersQuery, useDeleteUserMutation } from '@/slices/users/userApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Role {
  id: number;
  name: string;
}

interface FetchUser {
  id: number;
  name: string;
  email: string;
  company_id: number;
  company_slug: string;
  roles: Role[];
}

const UserList: React.FC = () => {
  const router = useRouter();
  const { data: usersData, error, isLoading } = useFetchUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const users: FetchUser[] = usersData?.users ?? [];

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users.</p>;
  if (users.length === 0) return <p>No users found.</p>;

  const update = (user: FetchUser) => {
    if (!user.company_slug) {
      toast.error("Company slug not found for user");
      return;
    }
    router.push(`/${user.company_slug}/hr/update/${user.id}`);
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete user", err);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  return (
    <div>
      <h2>Users List</h2>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Email</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Roles</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Under</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid black', padding: '4px' }}>{user.id}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{user.name}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{user.email}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {user.roles?.length ? user.roles.map((role) => capitalize(role.name)).join(', ') : 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{user.company_id}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                <button onClick={() => update(user)}>Edit</button>&nbsp;
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
