'use client';

import React from 'react';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import { useRouter } from 'next/navigation';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

const UserList: React.FC = () => {
  const router = useRouter();
  const { data: usersData, error, isLoading } = useFetchUsersQuery();

  // data is expected to be in the format: { message, users, length }
  const users: User[] = usersData?.users ?? [];

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users.</p>;
  if (users.length === 0) return <p>No users found.</p>;

  const update = (id: number) => {
    router.push(`/hr/update/${id}`);
  };

  // Helper function to capitalize first letter
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

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
                {user.roles && user.roles.length > 0
                  ? user.roles
                      .map((role) => capitalize(role.name))
                      .join(', ')
                  : 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                <button onClick={() => update(user.id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
