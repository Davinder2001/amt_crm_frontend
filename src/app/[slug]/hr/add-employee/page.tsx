'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateUserMutation } from '@/slices/users/userApi';
import { useGetRolesQuery } from '@/slices/roles/rolesApi';

interface Role {
  id: number;
  name: string;
}

const Page: React.FC = () => {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  // State for new user form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('');
  const [number, setNumber] = useState(''); // New state for number field

  // Fetch roles from API
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery(undefined);

  const handleCreateUser = async () => {
    try {
      // Include the new "number" field in the payload
      await createUser({ name, email, password, role, number }).unwrap();
      toast.success('User Created Successfully!');
      // Reset input fields
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
      setNumber('');
    } catch (err: any) {
      console.error('Failed to create user:', err);
      let errorMessage = 'User creation failed.';
      if (err?.data?.errors) {
        errorMessage = Object.values(err.data.errors).flat().join(' ');
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <Link href="/hr">Back</Link>
      <h2 className="text-lg font-semibold mb-2">Create New User</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-3 border rounded-md"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded-md"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded-md"
      />
      
      {/* New Number Field */}
      <input
        type="number"
        placeholder="Enter number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className="w-full p-2 mb-3 border rounded-md"
      />

      {/* Role Selection */}
      <label className="block text-sm font-medium text-gray-700">Select Role:</label>
      {rolesLoading ? (
        <div>Loading roles...</div>
      ) : rolesError ? (
        <div>Error loading roles</div>
      ) : (
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md"
        >
          <option value="">Select a role</option>
          {rolesData && rolesData.length > 0 ? (
            rolesData.map((roleItem: Role) => (
              <option key={roleItem.id} value={roleItem.name}>
                {roleItem.name}
              </option>
            ))
          ) : (
            <option value="">No roles available</option>
          )}
        </select>
      )}

      <button
        onClick={handleCreateUser}
        disabled={isCreating}
        className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
      >
        {isCreating ? 'Creating...' : 'Create User'}
      </button>
    </div>
  );
};

export default Page;
