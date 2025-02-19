'use client'
import { useFetchUsersQuery } from '@/slices/users/userApi'
import React from 'react'

// Define the type for a User
interface User {
  id: number;
  name: string;
  email: string;
}

function Page() {
  // Fetch users data
  const { data, error, isLoading } = useFetchUsersQuery(undefined);

  console.log()

  // Extract users array safely
  const users: User[] = data?.users || [];

  return (
    <div>
      <h1>Users List</h1>

      {/* Loading State */}
      {isLoading && <p>Loading users...</p>}

      {/* Error Handling with error?.data?.message */}
      {error && (
        <p style={{ color: 'red' }}>
          Error fetching users: {error?.data?.message || 'Something went wrong!'}
        </p>
      )}

      {/* Render Users List */}
      {!isLoading && !error && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && !error && <p>No users found.</p>
      )}
    </div>
  );
}

export default Page;
