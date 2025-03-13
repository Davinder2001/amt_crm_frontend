'use client';

import React, { useState } from 'react';
import { useCreateEmployeMutation } from '@/slices/employe/employe';
import { useGetRolesQuery } from '@/slices/roles/rolesApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
  const router = useRouter();
  const [createEmployee, { isLoading }] = useCreateEmployeMutation();
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [number, setNumber] = useState('');
  const [salary, setSalary] = useState('');
  const [role_id, setRoleId] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee({ name, email, position, number, salary, role_id, password }).unwrap();
      toast.success('Employee created successfully!');
      router.push('/employee');
    } catch {
      toast.error('Failed to create employee. Please try again.');
    }    
  };

  return (
    <div>
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
        <input type="text" placeholder="Phone Number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {/* Role Dropdown */}
        <select value={role_id} onChange={(e) => setRoleId(e.target.value)}>
          <option value="">Select Role</option>
          {rolesLoading ? (
            <option disabled>Loading...</option>
          ) : rolesError ? (
            <option disabled>Error loading roles</option>
          ) : (
            rolesData?.roles?.map((role: { id: string; name: string }) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))
          )}
        </select>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Employee'}
        </button>
      </form>
    </div>
  );
};

export default Page;
