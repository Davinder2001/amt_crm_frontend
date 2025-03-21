"use client";
import React, { useEffect } from 'react';
import { useFetchUsersQuery } from '@/slices/users/userApi'; // Import the hook
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Overview'); // Update breadcrumb title
  }, []);
  // Fetch users data from the API
  const { data, error, isLoading } = useFetchUsersQuery();

  // Check if data is fetched and count the number of users
  const userCount = data ? data.users.length : 0;

  return (
    <div>
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
