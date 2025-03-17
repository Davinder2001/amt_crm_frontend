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
  const [number, setNumber] = useState('');
  const [salary, setSalary] = useState('');
  const [role, setRoleId] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfHire, setDateOfHire] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [shiftTimings, setShiftTimings] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee({
        name,
        email,
        number,
        salary,
        role,
        password,
        dateOfHire,
        joiningDate,
        shiftTimings,
      }).unwrap();
      toast.success('Employee created successfully!');
      router.push('/employee');
    } catch {
      toast.error('Failed to create employee. Please try again.');
    }    
  };

  return (
    <div>
      <h2>Create Employee</h2>
      <div className="add-employee-form">

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          />
        <input 
          type="text" 
          placeholder="Phone Number" 
          value={number} 
          onChange={(e) => setNumber(e.target.value)} 
          />
        <input 
          type="number" 
          placeholder="Salary" 
          value={salary} 
          onChange={(e) => setSalary(e.target.value)} 
          />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          />

        {/* New Fields */}
        <input 
          type="date" 
          placeholder="Date of Hire" 
          value={dateOfHire} 
          onChange={(e) => setDateOfHire(e.target.value)} 
          />
        <input 
          type="date" 
          placeholder="Joining Date" 
          value={joiningDate} 
          onChange={(e) => setJoiningDate(e.target.value)} 
          />
        <input 
          type="text" 
          placeholder="Shift Timings" 
          value={shiftTimings} 
          onChange={(e) => setShiftTimings(e.target.value)} 
          />

        {/* Role Dropdown */}
        <select value={role} onChange={(e) => setRoleId(e.target.value)}>
          <option value="">Select Role</option>
          {rolesLoading ? (
            <option disabled>Loading...</option>
          ) : rolesError ? (
            <option disabled>Error loading roles</option>
          ) : (
            rolesData?.roles?.map((role: { id: string; name: string }) => (
              <option key={role.id} value={role.name}>
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
    </div>
  );
};

export default Page;
