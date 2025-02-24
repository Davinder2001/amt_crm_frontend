'use client';

import React, { useState } from 'react';
import { 
  useFetchUsersQuery, 
  useFetchProfileQuery, 
  useCreateUserMutation 
} from '@/slices/users/userApi';

interface User {
  id: number;
  name: string;
  email: string;
  role_id?: string;
}

interface Profile {
  id: number;
  name: string;
  email: string;
}

const roles: { [key: string]: string } = {
  "1": "Admin",
  "2": "User",
  "3": "Employee"
};

const Page = () => {
  const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchUsersQuery();
  const { data: profileData, error: profileError, isLoading: profileLoading } = useFetchProfileQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const users: User[] = usersData?.users ?? []; 

  // State for new user form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role_id, setRole] = useState<string>('1'); // Default role ID as a string

  const handleCreateUser = async () => {
    try {
      const response = await createUser({ 
        name, 
        email, 
        password, 
        role_id 
      }).unwrap();
      
      alert('User Created Successfully!');
      console.log(response);

      // Reset input fields
      setName('');
      setEmail('');
      setPassword('');
      setRole('1'); // Reset role to default
    } catch (err) {
      console.error('Failed to create user:', err);
      alert('User creation failed.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users List</h1>

      {/* Show Users */}
      {!usersLoading && !usersError && users.length > 0 ? (
        <ul className="mb-4">
          {users.map((user) => (
            <li key={user.id} className="border-b py-2">
              {user.name} - {user.email} - 
              <strong> {roles[user.role_id ?? ""] || "Unknown Role"}</strong>
            </li>
          ))}
        </ul>
      ) : (
        !usersLoading && !usersError && <p>No users found.</p>
      )}

      {/* Create New User Form */}
      <div className="mt-6 p-4 border rounded-md shadow-md">
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

        {/* Role Selection */}
        <label className="block text-sm font-medium text-gray-700">Select Role:</label>
        <select
          value={role_id}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md"
        >
          <option value="1">Admin</option>
          <option value="2">User</option>
          <option value="3">Employee</option>
        </select>

        <button
          onClick={handleCreateUser}
          disabled={isCreating}
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
        >
          {isCreating ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </div>
  );
};

export default Page;
