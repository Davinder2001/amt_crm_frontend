'use client';

import { useFetchUsersQuery } from '@/slices/users/userApi';
import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const Page = () => {

  const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchUsersQuery();

  const users: User[] = usersData?.users ?? []; 

  return (
    <div>
      <h1>Users List</h1>
      
      {!usersLoading && !usersError && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        !usersLoading && !usersError && <p>No users found.</p>
      )}
    </div>
  );
};

export default Page;
