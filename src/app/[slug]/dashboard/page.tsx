"use client";
import React from 'react';
import { useFetchUsersQuery } from '@/slices/users/userApi'; // Import the hook

const Page = () => {
  // Fetch users data from the API
  const { data, error, isLoading } = useFetchUsersQuery();

  // Check if data is fetched and count the number of users
  const userCount = data ? data.users.length : 0;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error fetching users.</p>
      ) : (
        <div>
          <p>Total Users: {userCount}</p>
        </div>
      )}
    </div>
  );
};

export default Page;
